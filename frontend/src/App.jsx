import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, api } from './api.js'

const navItems = [
  { id: 'explore', label: 'Explore events', icon: 'compass' },
  { id: 'registrations', label: 'My registrations', icon: 'ticket' },
  { id: 'roster', label: 'Attendee roster', icon: 'users' },
]

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></>,
    ticket: <><path d="M4 7.5A1.5 1.5 0 0 0 5.5 6h13A1.5 1.5 0 0 0 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 0-1.5 1.5h-13A1.5 1.5 0 0 0 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" /><path d="M12 8v1m0 3v1m0 3v.01" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9A7 7 0 0 1 18 6.2L20 12M4 12l2 5.8A7 7 0 0 0 18.4 15" /></>,
    external: <><path d="M14 3h7v7M10 14 21 3" /><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" /></>,
  }
  return <svg {...common}>{paths[name] || paths.spark}</svg>
}

function statusTone(status) {
  const value = (status || '').toLowerCase()
  if (['open', 'active', 'published'].includes(value)) return 'green'
  if (['closed', 'at_capacity', 'full', 'sold out'].includes(value)) return 'rose'
  return 'violet'
}

function isOpen(event) {
  return !event.status || ['open', 'active', 'published'].includes(event.status.toLowerCase())
}

function formatDate(value) {
  if (!value) return 'Date not listed'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function initials(value = '') {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CC'
}

export default function App() {
  const [page, setPage] = useState('explore')
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [attendees, setAttendees] = useState([])
  const [userId, setUserId] = useState(() => window.localStorage.getItem('campusconnect.userId') || '')
  const [userDraft, setUserDraft] = useState(() => window.localStorage.getItem('campusconnect.userId') || '')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [apiStatus, setApiStatus] = useState('connecting')
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [loadingAttendees, setLoadingAttendees] = useState(false)
  const [busyEvent, setBusyEvent] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true)
    setError('')
    setApiStatus('connecting')
    try {
      const result = await api('/api/events')
      setEvents(Array.isArray(result?.data) ? result.data : [])
      setApiStatus('online')
    } catch (err) {
      setApiStatus('offline')
      setError(`${err.message}. Check that the API is available and has been redeployed with CORS enabled.`)
    } finally {
      setLoadingEvents(false)
    }
  }, [])

  const loadRegistrations = useCallback(async (id = userId) => {
    if (!id) {
      setRegistrations([])
      return
    }
    setLoadingRegistrations(true)
    try {
      const result = await api(`/api/me/registrations?user_id=${encodeURIComponent(id)}`)
      setRegistrations(Array.isArray(result?.data) ? result.data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingRegistrations(false)
    }
  }, [userId])

  useEffect(() => { loadEvents() }, [loadEvents])
  useEffect(() => {
    if (page === 'registrations' && userId) loadRegistrations(userId)
  }, [page, userId, loadRegistrations])
  useEffect(() => {
    if (!selectedEvent && events.length) setSelectedEvent(events[0].id)
  }, [events, selectedEvent])
  useEffect(() => {
    if (page !== 'roster' || !selectedEvent) return undefined
    const controller = new AbortController()
    setLoadingAttendees(true)
    api(`/api/events/${encodeURIComponent(selectedEvent)}/registrations`, { signal: controller.signal })
      .then((result) => setAttendees(Array.isArray(result?.data) ? result.data : []))
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoadingAttendees(false) })
    return () => controller.abort()
  }, [page, selectedEvent])
  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const filteredEvents = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return events.filter((event) => {
      const matchesSearch = !needle || `${event.title || ''} ${event.id || ''} ${event.organizer_id || ''} ${event.status || ''}`.toLowerCase().includes(needle)
      const matchesFilter = filter === 'all' || (filter === 'open' ? isOpen(event) : !isOpen(event))
      return matchesSearch && matchesFilter
    })
  }, [events, filter, search])

  const openCount = events.filter(isOpen).length
  const capacityCount = events.reduce((sum, event) => sum + (Number(event.capacity) > 0 ? Number(event.capacity) : 0), 0)
  const selectedEventData = events.find((event) => event.id === selectedEvent)
  const currentNav = navItems.find((item) => item.id === page)

  function saveUserId(event) {
    event.preventDefault()
    const nextId = userDraft.trim()
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(nextId)) {
      setToast('Enter a valid UUID from the users table.')
      return
    }
    window.localStorage.setItem('campusconnect.userId', nextId)
    setUserId(nextId)
    setUserDraft(nextId)
    setToast('Student ID saved on this device.')
  }

  async function registerForEvent(event) {
    if (!userId) {
      setToast('Add your student UUID above before registering.')
      document.getElementById('student-id')?.focus()
      return
    }
    setBusyEvent(event.id)
    setError('')
    try {
      await api('/api/registrations', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, event_id: event.id }),
      })
      setToast(`Registered for ${event.title || 'this event'}.`)
      await loadRegistrations(userId)
    } catch (err) {
      setToast(err.message)
    } finally {
      setBusyEvent('')
    }
  }

  async function refreshPage() {
    await loadEvents()
    if (page === 'registrations') await loadRegistrations()
  }

  function exportAttendees() {
    const rows = [['registration_id', 'user_id', 'event_id', 'created_at'], ...attendees.map((attendee) => [attendee.id, attendee.user_id, attendee.event_id, attendee.created_at])]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'campusconnect-attendees.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setPage('explore')} aria-label="CampusConnect home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>Campus<span className="brand-light">Connect</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button className={`nav-link ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => { setPage(item.id); setError('') }}>
              <Icon name={item.icon} size={16} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <span className={`api-indicator ${apiStatus}`}><i /> API {apiStatus === 'online' ? 'connected' : apiStatus === 'offline' ? 'unavailable' : 'connecting'}</span>
          <span className="avatar">{initials(userId ? `Student ${userId.slice(0, 4)}` : 'Student')}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="eyebrow-row">
          <span className="eyebrow"><i /> CAMPUS ECOSYSTEM</span>
          <span className="eyebrow-divider">/</span>
          <span className="eyebrow-muted">{currentNav?.label || 'Explore events'}</span>
          <span className="eyebrow-spacer" />
          <button className="icon-button" aria-label="Refresh data" onClick={refreshPage} title="Refresh data"><Icon name="refresh" /></button>
        </div>

        <section className="page-heading">
          <div>
            <p className="overline">EVENTS · PEOPLE · CAMPUS</p>
            <h1>{page === 'explore' ? <>Find your <em>next thing.</em></> : page === 'registrations' ? <>Your campus <em>passes.</em></> : <>The attendee <em>desk.</em></>}</h1>
            <p className="heading-copy">{page === 'explore' ? 'A good idea starts with showing up. Find talks, workshops, and moments worth being there for.' : page === 'registrations' ? 'Your registrations, gathered in one place. Save your student ID once to see your list.' : 'A live look at the people registered for each campus event.'}</p>
          </div>
          <div className="hero-aside">
            <span className="hero-aside-label"><Icon name="spark" size={15} /> YOUR CAMPUS, IN MOTION</span>
            <div className="hero-stats">
              <div><strong>{events.length}</strong><span>total events</span></div>
              <div><strong className="mint-text">{openCount}</strong><span>open now</span></div>
              <div><strong>{page === 'registrations' ? registrations.length : capacityCount.toLocaleString()}</strong><span>{page === 'registrations' ? 'your passes' : 'total capacity'}</span></div>
            </div>
          </div>
        </section>

        <form className="identity-strip" onSubmit={saveUserId}>
          <div className="identity-icon"><Icon name="ticket" size={19} /></div>
          <div className="identity-copy">
            <strong>Your student ID</strong>
            <span>No account or password. Use the UUID from your public <code>users</code> row.</span>
          </div>
          <label className="sr-only" htmlFor="student-id">Student UUID</label>
          <input id="student-id" value={userDraft} onChange={(event) => setUserDraft(event.target.value)} placeholder="Paste your user UUID" autoComplete="off" spellCheck="false" />
          <button className="button button-soft" type="submit">{userId ? 'Update ID' : 'Save ID'} <Icon name="arrow" size={15} /></button>
          {userId && <span className="saved-chip"><Icon name="check" size={13} /> saved locally</span>}
        </form>

        {error && <div className="error-banner" role="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><Icon name="close" /></button></div>}

        {page === 'explore' && (
          <>
            <section className="search-panel">
              <div className="search-box"><Icon name="search" size={18} /><input aria-label="Search events" placeholder="Search by event title, ID, or organizer…" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>/</kbd></div>
              <div className="filter-group" aria-label="Event filters">
                {[['all', 'All events'], ['open', 'Open'], ['other', 'Closed']].map(([key, label]) => <button key={key} className={`filter-pill ${filter === key ? 'selected' : ''}`} onClick={() => setFilter(key)} type="button">{label}</button>)}
              </div>
              <span className="results-count">{filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}</span>
            </section>

            {loadingEvents ? <LoadingState label="Loading campus events…" /> : filteredEvents.length === 0 ? <EmptyState title={events.length ? 'No events match that search' : 'Your event board is quiet'} detail={events.length ? 'Try another title or change the status filter.' : 'Events from your CampusConnect database will appear here.'} /> : (
              <>
                <section className="feature-card">
                  <div className="feature-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-glow" /><div className="art-tag">CAMPUS<br />CONNECTIONS</div><div className="art-index">01 <span>—</span> DISCOVER</div></div>
                  <div className="feature-content">
                    <div className="feature-topline"><span className="eyebrow"><i /> FEATURED FROM YOUR DATABASE</span><span className={`status-badge ${statusTone(filteredEvents[0].status)}`}><i />{filteredEvents[0].status || 'Status not set'}</span></div>
                    <div className="host-line"><span className="host-icon"><Icon name="spark" size={15} /></span><span>Organized by</span><code>{filteredEvents[0].organizer_id || 'Campus community'}</code></div>
                    <h2>{filteredEvents[0].title || 'Untitled campus event'}</h2>
                    <p className="feature-description">Review the event details available in CampusConnect, then reserve your place with your student ID.</p>
                    <div className="feature-meta">
                      <span><Icon name="users" size={16} /> {filteredEvents[0].capacity ? `${Number(filteredEvents[0].capacity).toLocaleString()} place capacity` : 'Capacity not specified'}</span>
                      <span><Icon name="calendar" size={16} /> Event details from CampusConnect</span>
                    </div>
                    <div className="feature-actions"><button className="button button-primary" onClick={() => registerForEvent(filteredEvents[0])} disabled={!isOpen(filteredEvents[0]) || busyEvent === filteredEvents[0].id}>{busyEvent === filteredEvents[0].id ? 'Registering…' : isOpen(filteredEvents[0]) ? 'Register for this event' : 'Registration closed'} <Icon name="arrow" size={16} /></button><span className="endpoint-note"><code>POST</code> /api/registrations</span></div>
                  </div>
                </section>

                <div className="section-heading"><div><span className="overline">THE FULL LINEUP</span><h2>All campus events <span className="count-chip">{filteredEvents.length}</span></h2></div><span className="schema-note">LIVE FROM <code>events</code></span></div>
                <section className="event-grid">
                  {filteredEvents.map((event, index) => (
                    <article className={`event-card event-card-${index % 4}`} key={event.id}>
                      <div className="event-card-top"><span className={`status-badge ${statusTone(event.status)}`}><i />{event.status || 'Status not set'}</span><span className="event-number">{String(index + 1).padStart(2, '0')}</span></div>
                      <div className="event-card-icon"><Icon name={index % 3 === 0 ? 'spark' : index % 3 === 1 ? 'compass' : 'calendar'} size={20} /></div>
                      <h3>{event.title || 'Untitled campus event'}</h3>
                      <p className="event-organizer">ORGANIZED BY <span>{event.organizer_id || 'Campus community'}</span></p>
                      <div className="event-capacity"><div><span>MAX CAPACITY</span><strong>{event.capacity != null ? Number(event.capacity).toLocaleString() : 'Not set'}</strong></div><span className="capacity-context">DATABASE FIELD</span></div>
                      <div className="event-card-bottom"><code className="id-code">{event.id}</code><button className="register-link" onClick={() => registerForEvent(event)} disabled={!isOpen(event) || busyEvent === event.id}>{busyEvent === event.id ? 'Working…' : isOpen(event) ? <>Register <Icon name="arrow" size={15} /></> : 'Closed'}</button></div>
                    </article>
                  ))}
                </section>
              </>
            )}
          </>
        )}

        {page === 'registrations' && (
          <section className="content-panel registrations-panel">
            <div className="panel-heading"><div><span className="overline">ATTENDEE PASS DESK</span><h2>My registrations <span className="count-chip">{registrations.length}</span></h2><p>Registration history for <code>{userId || 'your student ID'}</code></p></div><span className="panel-endpoint"><code>GET</code> /api/me/registrations</span></div>
            {!userId ? <EmptyState title="Add your student ID first" detail="Paste the UUID from the users table in the field above. No account or password is used." /> : loadingRegistrations ? <LoadingState label="Loading your registrations…" /> : registrations.length === 0 ? <EmptyState title="No registrations yet" detail="When you register for an open event, it will show up here." action={<button className="button button-primary" onClick={() => setPage('explore')}>Explore events <Icon name="arrow" size={15} /></button>} /> : (
              <div className="registration-list">
                {registrations.map((registration) => {
                  const event = Array.isArray(registration.events) ? registration.events[0] : registration.events
                  return <article className="registration-row" key={registration.id}>
                    <div className="registration-ticket"><Icon name="ticket" size={21} /></div>
                    <div className="registration-info"><span className="overline">CAMPUS PASS · {formatDate(registration.created_at)}</span><h3>{event?.title || 'Campus event'}</h3><p>{event?.status ? <span className={`status-badge ${statusTone(event.status)}`}><i />{event.status}</span> : 'Event details'} <code>{registration.event_id}</code></p></div>
                    <div className="registration-event-meta"><span>EVENT CAPACITY</span><strong>{event?.capacity ? Number(event.capacity).toLocaleString() : '—'}</strong></div>
                    <span className="registration-confirmed"><Icon name="check" size={15} /> Registered</span>
                  </article>
                })}
              </div>
            )}
          </section>
        )}

        {page === 'roster' && (
          <section className="content-panel roster-panel">
            <div className="panel-heading roster-heading"><div><span className="overline">ORGANIZER VIEW · PUBLIC DATA</span><h2>Attendee roster <span className="count-chip">{attendees.length}</span></h2><p>Choose an event to see its current registrations. The roster is public because this API has no authorization.</p></div><button className="button button-soft" onClick={exportAttendees} disabled={!attendees.length}>Export CSV <Icon name="arrow" size={15} /></button></div>
            <div className="roster-controls"><label htmlFor="event-select">SELECT EVENT</label><select id="event-select" value={selectedEvent} onChange={(event) => setSelectedEvent(event.target.value)}><option value="">Choose an event</option>{events.map((event) => <option value={event.id} key={event.id}>{event.title || 'Untitled event'} · {event.status || 'status not set'}</option>)}</select><span className="panel-endpoint"><code>GET</code> /api/events/{'{id}'}/registrations</span></div>
            {!events.length && !loadingEvents ? <EmptyState title="No events to show" detail="Events will appear here when the API has data." /> : loadingAttendees ? <LoadingState label="Loading attendee list…" /> : !selectedEventData ? <EmptyState title="Choose an event" detail="Select one of your campus events to view its registrations." /> : attendees.length === 0 ? <EmptyState title="No attendees registered" detail="This event does not have any registrations yet." /> : (
              <div className="table-scroll"><table className="attendee-table"><thead><tr><th>ATTENDEE UUID</th><th>REGISTRATION UUID</th><th>REGISTERED AT</th><th>REGISTRATION</th></tr></thead><tbody>{attendees.map((attendee) => <tr key={attendee.id}><td><span className="person-cell"><span className="mini-avatar">{initials(attendee.user_id)}</span><code>{attendee.user_id}</code></span></td><td><code>{attendee.id}</code></td><td>{formatDate(attendee.created_at)}</td><td><span className="status-badge green"><i />Registered</span></td></tr>)}</tbody></table></div>
            )}
          </section>
        )}

        <footer className="footer"><a className="brand footer-brand" href="#home" onClick={() => setPage('explore')}><span className="brand-mark"><span /><span /><span /></span><span>Campus<span className="brand-light">Connect</span></span></a><span>Made for the moments between classes.</span><span className="footer-api"><i /> API <code>{new URL(API_BASE_URL).host}</code></span></footer>
      </main>
      {toast && <div className="toast" role="status"><span className="toast-dot" /><span>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss"><Icon name="close" size={15} /></button></div>}
    </div>
  )
}

function LoadingState({ label }) {
  return <div className="empty-state"><span className="loader" /><p>{label}</p></div>
}

function EmptyState({ title, detail, action }) {
  return <div className="empty-state"><span className="empty-mark"><Icon name="spark" size={22} /></span><h3>{title}</h3><p>{detail}</p>{action}</div>
}
