import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BedDouble, CalendarDays, ChevronDown, Hotel, LayoutDashboard,
  LogOut, Menu, Search, ShieldCheck, UserRound, Users, X,
} from 'lucide-react'

const USERS_KEY = 'tarig_users'
const SESSION_KEY = 'tarig_session'
const HOTELS_KEY = 'tarig_hotels'
const BOOKINGS_KEY = 'tarig_bookings'

const seedUsers = [
  { id: 1, name: 'Tarig Admin', email: 'admin@tarig.com', password: 'admin123', role: 'admin', phone: '+249 900 111 222' },
  { id: 2, name: 'Ahmed Hassan', email: 'user@tarig.com', password: 'user123', role: 'user', phone: '+249 900 333 444' },
]

const seedHotels = [
  { id: 1, name: 'The Palm Residence', city: 'Gedaref', rating: 4.9, price: 85000, type: 'Luxury hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85' },
  { id: 2, name: 'Gedaref Grand Hotel', city: 'Gedaref', rating: 4.7, price: 62000, type: 'Business hotel', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85' },
  { id: 3, name: 'Blue Nile Suites', city: 'Gedaref', rating: 4.8, price: 74000, type: 'Boutique stay', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85' },
]

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function useAppData() {
  const [users, setUsers] = useState(() => read(USERS_KEY, seedUsers))
  const [hotels, setHotels] = useState(() => read(HOTELS_KEY, seedHotels))
  const [bookings, setBookings] = useState(() => read(BOOKINGS_KEY, []))
  const [session, setSession] = useState(() => read(SESSION_KEY, null))

  useEffect(() => write(USERS_KEY, users), [users])
  useEffect(() => write(HOTELS_KEY, hotels), [hotels])
  useEffect(() => write(BOOKINGS_KEY, bookings), [bookings])
  useEffect(() => write(SESSION_KEY, session), [session])

  return { users, setUsers, hotels, setHotels, bookings, setBookings, session, setSession }
}

function Brand({ compact = false }) {
  return <Link className="brand" to="/" aria-label="Tarig home"><span className="brand-mark"><BedDouble size={21} /></span>{!compact && <span>TARIG</span>}</Link>
}

function Header({ session, onLogout }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="topbar">
      <Brand />
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Menu /></button>
      <nav className={open ? 'nav open' : 'nav'}>
        <Link to="/" onClick={() => setOpen(false)}>Discover</Link>
        <a href="/#stays" onClick={() => setOpen(false)}>Stays</a>
        {session && <Link to={session.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}>My account</Link>}
      </nav>
      {session ? (
        <div className="header-actions">
          <div className="avatar">{session.name.charAt(0)}</div>
          <button className="icon-button" onClick={onLogout} title="Logout"><LogOut size={18} /></button>
        </div>
      ) : (
        <div className="header-actions"><Link className="text-link" to="/login">Sign in</Link><Link className="button small" to="/signup">Create account</Link></div>
      )}
    </header>
  )
}

function Protected({ session, role, children }) {
  if (!session) return <Navigate to="/login" replace />
  if (role && session.role !== role) return <Navigate to={session.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

function Home({ hotels, session, onBook }) {
  const [destination, setDestination] = useState('Gedaref')
  const [dates, setDates] = useState({ in: '', out: '' })
  const [guests, setGuests] = useState(2)

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">SUDAN, MADE PERSONAL</p>
          <h1>Stay somewhere<br /><em>worth remembering.</em></h1>
          <p className="hero-copy">Thoughtfully selected hotels across Gedaref, with local character and a warm welcome.</p>
          <div className="search-panel">
            <label><span>Destination</span><div><Search size={18} /><input value={destination} onChange={e => setDestination(e.target.value)} /></div></label>
            <label><span>Check in</span><div><CalendarDays size={18} /><input type="date" value={dates.in} onChange={e => setDates({ ...dates, in: e.target.value })} /></div></label>
            <label><span>Check out</span><div><CalendarDays size={18} /><input type="date" value={dates.out} onChange={e => setDates({ ...dates, out: e.target.value })} /></div></label>
            <label><span>Guests</span><div><UserRound size={18} /><select value={guests} onChange={e => setGuests(Number(e.target.value))}>{[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}</select></div></label>
            <button className="search-button" onClick={() => document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Search"><Search /></button>
          </div>
        </div>
      </section>

      <section className="stays" id="stays">
        <div className="section-heading"><div><p className="eyebrow dark">WHERE TO STAY</p><h2>Exceptional stays in Gedaref</h2></div><button className="text-arrow">View all <ArrowRight size={17} /></button></div>
        <div className="hotel-grid">
          {hotels.map(hotel => (
            <article className="hotel-card" key={hotel.id}>
              <div className="hotel-image"><img src={hotel.image} alt={hotel.name} /><span>{hotel.type}</span></div>
              <div className="hotel-body"><div><p>{hotel.city}, Sudan</p><h3>{hotel.name}</h3></div><div className="rating">★ {hotel.rating}</div><div className="hotel-bottom"><strong>{hotel.price.toLocaleString()} SDG <small>/ night</small></strong><button onClick={() => onBook(hotel)}>Reserve <ArrowRight size={15} /></button></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise">
        <div><span>01</span><h3>Local expertise</h3><p>Places selected with care by people who know Gedaref.</p></div>
        <div><span>02</span><h3>Clear booking</h3><p>Transparent prices and simple reservations, without hidden fees.</p></div>
        <div><span>03</span><h3>Personal support</h3><p>A helpful team before, during, and after every stay.</p></div>
      </section>
    </main>
  )
}

function AuthPage({ mode, users, setUsers, setSession }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState({ type: '', text: '' })
  const isSignup = mode === 'signup'

  function handleSubmit(e) {
    e.preventDefault()
    const email = form.email.trim().toLowerCase()
    if (!email || !form.password || (isSignup && !form.name.trim())) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' }); return
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: 'error', text: 'Enter a valid email address.' }); return
    }
    if (form.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must contain at least 6 characters.' }); return
    }
    if (isSignup) {
      if (users.some(user => user.email.toLowerCase() === email)) {
        setMessage({ type: 'error', text: 'An account with this email already exists.' }); return
      }
      const user = { id: Date.now(), name: form.name.trim(), email, password: form.password, role: 'user', phone: '' }
      setUsers([...users, user]); setSession(user)
      setMessage({ type: 'success', text: 'Account created successfully.' })
      setTimeout(() => navigate('/dashboard'), 350)
    } else {
      const user = users.find(item => item.email.toLowerCase() === email && item.password === form.password)
      if (!user) {
        setMessage({ type: 'error', text: 'Email or password is incorrect.' }); return
      }
      setSession(user)
      setMessage({ type: 'success', text: `Welcome back, ${user.name}.` })
      setTimeout(() => navigate(user.role === 'admin' ? '/admin' : '/dashboard'), 350)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-art"><div><p>TARIG</p><h2>A quieter<br />way to travel.</h2></div></div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow dark">{isSignup ? 'JOIN TARIG' : 'WELCOME BACK'}</p>
          <h1>{isSignup ? 'Create your account' : 'Sign in to TARIG'}</h1>
          {isSignup && <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>}
          <label>Email address<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label>
          <label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>
          {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}
          <button className="button full" type="submit">{isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button>
          <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to TARIG?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create account'}</Link></p>
          {!isSignup && <p className="demo-note">Demo: <b>user@tarig.com</b> / <b>user123</b> or <b>admin@tarig.com</b> / <b>admin123</b></p>}
        </form>
      </div>
    </main>
  )
}

function BookingModal({ hotel, session, onClose, onConfirm }) {
  const [form, setForm] = useState({ in: '', out: '', guests: 1 })
  const [error, setError] = useState('')
  if (!hotel) return null
  const nights = form.in && form.out ? Math.ceil((new Date(form.out) - new Date(form.in)) / 86400000) : 0
  const valid = nights > 0
  function confirm() {
    if (!session) { onClose(); return }
    if (!valid) { setError('Please choose valid check-in and check-out dates.'); return }
    onConfirm({ hotel, checkIn: form.in, checkOut: form.out, guests: form.guests, nights, total: hotel.price * nights })
  }
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal"><button className="modal-close" onClick={onClose} aria-label="Close"><X /></button><p className="eyebrow dark">RESERVE YOUR STAY</p><h2>{hotel.name}</h2>
        <div className="modal-row"><label>Check in<input type="date" value={form.in} onChange={e => setForm({ ...form, in: e.target.value })} /></label><label>Check out<input type="date" value={form.out} onChange={e => setForm({ ...form, out: e.target.value })} /></label></div>
        <label>Guests<select value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })}>{[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}</select></label>
        {error && <p className="form-message error">{error}</p>}
        <div className="booking-total"><span>{valid ? `${nights} night${nights === 1 ? '' : 's'}` : 'Total'}</span><strong>{valid ? `${(hotel.price * nights).toLocaleString()} SDG` : 'Select dates'}</strong></div>
        <button className="button full" onClick={confirm}>Confirm reservation</button>
      </div>
    </div>
  )
}

function Dashboard({ session, setSession, users, setUsers, bookings, setBookings }) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({ name: session.name, email: session.email, phone: session.phone || '' })
  const [message, setMessage] = useState('')
  const mine = bookings.filter(booking => booking.userId === session.id)

  function saveProfile(e) {
    e.preventDefault()
    if (!profile.name.trim() || !/^\S+@\S+\.\S+$/.test(profile.email)) { setMessage('Enter a valid name and email.'); return }
    const updated = users.map(user => user.id === session.id ? { ...user, ...profile } : user)
    setUsers(updated)
    const saved = updated.find(user => user.id === session.id)
    setSession(saved)
    setEditing(false); setMessage('Profile updated successfully.')
  }

  return (
    <main className="dashboard-page">
      <aside className="sidebar"><Brand /><nav><Link className="active" to="/dashboard"><LayoutDashboard size={18} /> Overview</Link><button onClick={() => document.getElementById('profile')?.scrollIntoView()}><UserRound size={18} /> Profile</button></nav><button className="sidebar-logout" onClick={() => { setSession(null); navigate('/login') }}><LogOut size={18} /> Logout</button></aside>
      <section className="dashboard"><header><div><p>Personal dashboard</p><h1>Good day, {session.name.split(' ')[0]}</h1></div><div className="avatar large">{session.name.charAt(0)}</div></header>
        <div className="stats"><div><span>Reservations</span><strong>{mine.length}</strong></div><div><span>Upcoming</span><strong>{mine.filter(b => new Date(b.checkIn) >= new Date()).length}</strong></div><div><span>Member since</span><strong>2026</strong></div></div>
        <section className="dashboard-section"><div className="section-heading"><h2>My reservations</h2></div>{mine.length ? <div className="booking-list">{mine.map(booking => <article key={booking.id}><img src={booking.image} alt="" /><div><p>{booking.city}</p><h3>{booking.hotelName}</h3><span>{booking.checkIn} — {booking.checkOut} · {booking.guests} guest(s)</span></div><strong>{booking.total.toLocaleString()} SDG</strong><button onClick={() => setBookings(bookings.filter(b => b.id !== booking.id))}>Cancel</button></article>)}</div> : <div className="empty-state"><CalendarDays /><h3>No reservations yet</h3><p>Your next stay is waiting.</p><Link className="button" to="/">Explore hotels</Link></div>}</section>
        <section className="dashboard-section profile-section" id="profile"><div className="section-heading"><h2>Profile information</h2><button className="outline-button" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit profile'}</button></div>{editing ? <form className="profile-form" onSubmit={saveProfile}><label>Full name<input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></label><label>Email<input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></label><label>Phone<input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></label><button className="button" type="submit">Save changes</button></form> : <div className="profile-grid"><p><span>Name</span>{session.name}</p><p><span>Email</span>{session.email}</p><p><span>Phone</span>{session.phone || 'Not provided'}</p></div>}{message && <p className="form-message success">{message}</p>}</section>
      </section>
    </main>
  )
}

function Admin({ session, setSession, users, setUsers, hotels, setHotels, bookings, setBookings }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('users')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '' })
  const [hotelForm, setHotelForm] = useState({ name: '', city: 'Gedaref', rating: 4.5, price: '', type: 'Hotel', image: '' })
  const [editingHotel, setEditingHotel] = useState(null)
  function openUser(user = null) { setEditing(user); setForm(user ? { ...user } : { name: '', email: '', password: '', role: 'user', phone: '' }) }
  function saveUser(e) { e.preventDefault(); if (!form.name || !/^\S+@\S+\.\S+$/.test(form.email) || (!editing && form.password.length < 6)) return; if (editing) setUsers(users.map(u => u.id === editing.id ? { ...u, ...form } : u)); else setUsers([...users, { ...form, id: Date.now() }]); setEditing(null) }
  function saveHotel(e) { e.preventDefault(); const item = { ...hotelForm, id: editingHotel?.id || Date.now(), rating: Number(hotelForm.rating), price: Number(hotelForm.price), image: hotelForm.image || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85' }; if (editingHotel) setHotels(hotels.map(h => h.id === editingHotel.id ? item : h)); else setHotels([...hotels, item]); setEditingHotel(null); setHotelForm({ name: '', city: 'Gedaref', rating: 4.5, price: '', type: 'Hotel', image: '' }) }
  return (
    <main className="dashboard-page">
      <aside className="sidebar"><Brand /><nav><button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}><Users size={18} /> Users</button><button className={tab === 'hotels' ? 'active' : ''} onClick={() => setTab('hotels')}><Hotel size={18} /> Hotels</button><button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}><CalendarDays size={18} /> Reservations</button></nav><button className="sidebar-logout" onClick={() => { setSession(null); navigate('/login') }}><LogOut size={18} /> Logout</button></aside>
      <section className="dashboard admin"><header><div><p>Administration</p><h1>Control center</h1></div><div className="avatar large"><ShieldCheck /></div></header>
        {tab === 'users' && <><div className="admin-toolbar"><div><p>Registered users</p><h2>{users.length} accounts</h2></div><button className="button" onClick={() => openUser()}>Add user</button></div><div className="data-table"><div className="table-head"><span>User</span><span>Role</span><span>Phone</span><span>Actions</span></div>{users.map(user => <div className="table-row" key={user.id}><span><b>{user.name}</b><small>{user.email}</small></span><span><b className={`role ${user.role}`}>{user.role}</b></span><span>{user.phone || '—'}</span><span><button onClick={() => openUser(user)}>Edit</button><button className="danger" disabled={user.id === session.id} onClick={() => setUsers(users.filter(u => u.id !== user.id))}>Delete</button></span></div>)}</div></>}
        {tab === 'hotels' && <><div className="admin-toolbar"><div><p>Manage inventory</p><h2>{hotels.length} properties</h2></div></div><form className="admin-form" onSubmit={saveHotel}><label>Name<input value={hotelForm.name} onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })} required /></label><label>City<input value={hotelForm.city} onChange={e => setHotelForm({ ...hotelForm, city: e.target.value })} /></label><label>Price<input type="number" value={hotelForm.price} onChange={e => setHotelForm({ ...hotelForm, price: e.target.value })} required /></label><label>Image URL<input value={hotelForm.image} onChange={e => setHotelForm({ ...hotelForm, image: e.target.value })} /></label><button className="button" type="submit">{editingHotel ? 'Save hotel' : 'Add hotel'}</button></form><div className="admin-hotel-grid">{hotels.map(hotel => <article key={hotel.id}><img src={hotel.image} alt="" /><div><h3>{hotel.name}</h3><p>{hotel.price.toLocaleString()} SDG / night</p><button onClick={() => { setEditingHotel(hotel); setHotelForm(hotel) }}>Edit</button><button className="danger" onClick={() => setHotels(hotels.filter(h => h.id !== hotel.id))}>Delete</button></div></article>)}</div></>}
        {tab === 'bookings' && <><div className="admin-toolbar"><div><p>All reservations</p><h2>{bookings.length} bookings</h2></div></div><div className="data-table"><div className="table-head"><span>Hotel</span><span>Guest</span><span>Stay</span><span>Total</span></div>{bookings.map(booking => <div className="table-row" key={booking.id}><span><b>{booking.hotelName}</b></span><span>{users.find(u => u.id === booking.userId)?.name || 'Guest'}</span><span>{booking.checkIn} — {booking.checkOut}</span><span><b>{booking.total.toLocaleString()} SDG</b><button className="danger" onClick={() => setBookings(bookings.filter(b => b.id !== booking.id))}>Cancel</button></span></div>)}</div></>}
      </section>
      {editing && <div className="modal-backdrop"><form className="modal" onSubmit={saveUser}><button type="button" className="modal-close" onClick={() => setEditing(null)}><X /></button><p className="eyebrow dark">USER DETAILS</p><h2>{editing.name ? 'Edit user' : 'Add user'}</h2><label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label><label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>{!editing.id && <label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>}<label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label><label>Role<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="user">User</option><option value="admin">Admin</option></select></label><button className="button full" type="submit">Save user</button></form></div>}
    </main>
  )
}

export default function App() {
  const data = useAppData()
  const [selectedHotel, setSelectedHotel] = useState(null)
  const navigate = useNavigate()

  function logout() { data.setSession(null); navigate('/') }

  function confirmBooking(details) {
    if (!data.session) { navigate('/login'); return }
    data.setBookings([...data.bookings, { id: Date.now(), userId: data.session.id, hotelName: details.hotel.name, city: details.hotel.city, image: details.hotel.image, checkIn: details.checkIn, checkOut: details.checkOut, guests: details.guests, nights: details.nights, total: details.total }])
    setSelectedHotel(null); navigate('/dashboard')
  }

  return (
    <>
      <Header session={data.session} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home hotels={data.hotels} session={data.session} onBook={hotel => data.session ? setSelectedHotel(hotel) : navigate('/login')} />} />
        <Route path="/login" element={<AuthPage mode="login" users={data.users} setUsers={data.setUsers} setSession={data.setSession} />} />
        <Route path="/signup" element={<AuthPage mode="signup" users={data.users} setUsers={data.setUsers} setSession={data.setSession} />} />
        <Route path="/dashboard" element={<Protected session={data.session} role="user"><Dashboard session={data.session} setSession={data.setSession} users={data.users} setUsers={data.setUsers} bookings={data.bookings} setBookings={data.setBookings} /></Protected>} />
        <Route path="/admin" element={<Protected session={data.session} role="admin"><Admin session={data.session} setSession={data.setSession} users={data.users} setUsers={data.setUsers} hotels={data.hotels} setHotels={data.setHotels} bookings={data.bookings} setBookings={data.setBookings} /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BookingModal hotel={selectedHotel} session={data.session} onClose={() => setSelectedHotel(null)} onConfirm={confirmBooking} />
    </>
  )
}
