import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/platform', label: 'Platform' },
  { to: '/starbooking', label: 'Starbooking' },
  { to: '/hardware', label: 'KLOUD Hardware' },
  { to: '/cwy', label: 'Cwy' },
  { to: '/cwy-nin', label: 'Cwy NIN' },
  { to: '/overview', label: 'Overview' },
  { to: '/services', label: 'Services' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
]

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #111827 100%)', color: '#e5e7eb' }}>
      <header style={{ borderBottom: '1px solid #1f2937', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong style={{ fontSize: '1rem' }}>UltraThinking Dashboard</strong>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Real services only · No fake data</div>
        </div>
        <a href="/services" style={{ textDecoration: 'none', color: '#22d3ee', fontSize: '0.85rem' }}>Service Monitor</a>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 64px)' }}>
        <aside style={{ borderRight: '1px solid #1f2937', padding: '12px', background: 'rgba(15, 23, 42, 0.55)' }}>
          <nav style={{ display: 'grid', gap: '8px' }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  background: isActive ? 'linear-gradient(90deg, #0e7490 0%, #155e75 100%)' : 'transparent',
                  border: isActive ? '1px solid #06b6d4' : '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontWeight: isActive ? 600 : 500,
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main style={{ minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
