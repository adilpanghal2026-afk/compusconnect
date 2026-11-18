# CampusConnect API

Flask API backed by the Supabase tables shown in the project schema: `users`,
`events`, and `registrations`.

## Run locally

1. Create or activate a Python virtual environment in `backend`.
2. Install dependencies with `python -m pip install -r requirements.txt`.
3. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `backend/.env`.
4. Start the server with `python app.py`. It listens on port 5000 by default;
   set `PORT` to change it.

The Supabase project must have the corresponding tables and foreign keys. Use
the publishable key, never a service-role key in this app. The project must also
allow the intended database operations for the `anon` role; this API does not
add Supabase authentication or database authorization policies.

## Deploy to Render

The Render Blueprint configuration is in `backend/render.yaml`. It builds from
`backend`, installs `requirements.txt`, and runs the app with Gunicorn. The
`/healthz` route is configured as the deploy health check. Set
`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the Render environment. The API
returns CORS headers for all origins by default; set `FRONTEND_ORIGINS` in
Render to a comma-separated list of specific frontend origins if you prefer.
Redeploy the backend after changing CORS settings or backend code.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/events` | List events; optionally filter with `?status=open`. |
| GET | `/api/events/{id}` | Return an event or `404`. |
| POST | `/api/registrations` | Register a user for an event; returns `201`, or `409` for duplicate, full, or non-open events. |
| GET | `/api/me/registrations?user_id={uuid}` | List registrations for the supplied user. |
| GET | `/api/events/{id}/registrations` | List attendee registration IDs and user IDs. |

Since there is no login, the client supplies `user_id` in registration requests
and in the `me` query. The attendee list and all other endpoints are public.

Example registration body:

```json
{
  "user_id": "00000000-0000-0000-0000-000000000001",
  "event_id": "00000000-0000-0000-0000-000000000002"
}
```

Responses use `{ "data": ... }` on success and `{ "error": "..." }` on error.
