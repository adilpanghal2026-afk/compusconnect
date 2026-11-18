"""CampusConnect REST API backed by Supabase/Postgres."""

import os
from uuid import UUID

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from postgrest import APIError
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)

# The API has no cookie-based auth; allow the frontend origin(s) from the
# environment, with a public wildcard default for this unauthenticated API.
configured_origins = os.environ.get("FRONTEND_ORIGINS", "*").strip()
allowed_origins = (
    "*" if configured_origins == "*"
    else [origin.strip() for origin in configured_origins.split(",") if origin.strip()]
)


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if allowed_origins == "*":
        response.headers["Access-Control-Allow-Origin"] = "*"
    elif origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.vary.add("Origin")
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Max-Age"] = "600"
    return response

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
if not supabase_url or not supabase_key:
    raise RuntimeError("Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in backend/.env")

supabase: Client = create_client(supabase_url, supabase_key)


def error(message: str, status: int):
    return jsonify({"error": message}), status


def valid_uuid(value, field):
    if not isinstance(value, str):
        raise ValueError(f"{field} must be a UUID")
    try:
        return str(UUID(value))
    except (ValueError, TypeError, AttributeError):
        raise ValueError(f"{field} must be a UUID") from None


def body_json():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object")
    return payload


@app.get("/")
def index():
    return jsonify({"name": "CampusConnect API", "version": "1.0", "endpoints": [
        "GET /api/events", "GET /api/events/<id>", "POST /api/registrations",
        "GET /api/me/registrations?user_id=<uuid>",
        "GET /api/events/<id>/registrations",
    ]})


@app.get("/healthz")
def health_check():
    """Lightweight process health check for the hosting platform."""
    return jsonify({"status": "ok"}), 200


@app.get("/api/events")
def list_events():
    try:
        query = supabase.table("events").select("*")
        status = request.args.get("status")
        if status:
            query = query.eq("status", status)
        response = query.execute()
        return jsonify({"data": response.data})
    except APIError as exc:
        app.logger.exception("Failed to list events")
        return error("Could not load events", 500)


@app.get("/api/events/<event_id>")
def get_event(event_id):
    try:
        event_id = valid_uuid(event_id, "id")
        response = supabase.table("events").select("*").eq("id", event_id).maybe_single().execute()
        if not response.data:
            return error("Event not found", 404)
        return jsonify({"data": response.data})
    except ValueError as exc:
        return error(str(exc), 400)
    except APIError:
        app.logger.exception("Failed to load event")
        return error("Could not load event", 500)


@app.post("/api/registrations")
def create_registration():
    """Register a user for an event. user_id is supplied because auth is omitted."""
    try:
        payload = body_json()
        user_id = valid_uuid(payload.get("user_id"), "user_id")
        event_id = valid_uuid(payload.get("event_id"), "event_id")

        event_result = supabase.table("events").select("id,capacity,status").eq(
            "id", event_id
        ).maybe_single().execute()
        event = event_result.data
        if not event:
            return error("Event not found", 404)
        if event.get("status") and event["status"].lower() not in {"open", "active", "published"}:
            return error("This event is not accepting registrations", 409)

        existing = supabase.table("registrations").select("id").eq(
            "user_id", user_id
        ).eq("event_id", event_id).limit(1).execute()
        if existing.data:
            return error("User is already registered for this event", 409)

        capacity = event.get("capacity")
        if capacity is not None:
            count_result = supabase.table("registrations").select(
                "id", count="exact", head=True
            ).eq("event_id", event_id).execute()
            if (count_result.count or 0) >= capacity:
                return error("Event is full", 409)

        result = supabase.table("registrations").insert({
            "user_id": user_id,
            "event_id": event_id,
        }).execute()
        created = result.data[0] if result.data else {"user_id": user_id, "event_id": event_id}
        return jsonify({"data": created}), 201
    except ValueError as exc:
        return error(str(exc), 400)
    except APIError as exc:
        # Unique constraints are the final guard against duplicate registrations.
        if getattr(exc, "code", None) == "23505":
            return error("User is already registered for this event", 409)
        app.logger.exception("Failed to create registration")
        return error("Could not create registration", 500)


@app.get("/api/me/registrations")
def user_registrations():
    """List registrations for the supplied user_id (no login/session is used)."""
    try:
        user_id = valid_uuid(request.args.get("user_id"), "user_id")
        result = supabase.table("registrations").select(
            "id,user_id,event_id,created_at,events(id,title,organizer_id,capacity,status)"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        return jsonify({"data": result.data})
    except ValueError as exc:
        return error(str(exc), 400)
    except APIError:
        app.logger.exception("Failed to load user registrations")
        return error("Could not load registrations", 500)


@app.get("/api/events/<event_id>/registrations")
def event_registrations(event_id):
    """List attendees. This endpoint is public because authorization is omitted."""
    try:
        event_id = valid_uuid(event_id, "id")
        event = supabase.table("events").select("id").eq("id", event_id).maybe_single().execute()
        if not event.data:
            return error("Event not found", 404)
        result = supabase.table("registrations").select(
            "id,user_id,event_id,created_at"
        ).eq("event_id", event_id).order("created_at").execute()
        return jsonify({"data": result.data})
    except ValueError as exc:
        return error(str(exc), 400)
    except APIError:
        app.logger.exception("Failed to load event registrations")
        return error("Could not load event registrations", 500)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
