import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/layout/TopBar';

export default function Dashboard() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
    fetchSessions();
  }, []);

  async function fetchDeals() {
    try {
      const res = await fetch('/api/deals', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSessions() {
    try {
      const res = await fetch('/api/sessions', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  }

  const activeDeals = deals.filter((d) => d.status === 'active');
  const dealsByZone = {
    red: activeDeals.filter((d) => d.zone === 'red'),
    green: activeDeals.filter((d) => d.zone === 'green'),
    yellow: activeDeals.filter((d) => d.zone === 'yellow'),
  };

  const displayName = user?.email?.split('@')[0] || 'there';

  return (
    <div>
      <TopBar
        title={`Welcome back, ${displayName}`}
        subtitle="Red Zone Selling Coach™"
      />

      {/* Beta FAQ Banner */}
      <div className="mx-4 lg:mx-6 mt-4 flex items-center justify-between gap-3 bg-rzs-charcoal rounded-lg px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-bold tracking-widest uppercase text-rzs-red flex-shrink-0">Beta</span>
          <span className="text-white text-xs font-medium truncate">New to the RZS AI Coach? Read the Beta FAQ.</span>
        </div>
        <a
          href="/faq.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[11px] font-semibold text-rzs-red border border-rzs-red/40 rounded px-3 py-1 hover:bg-rzs-red hover:text-white transition-colors whitespace-nowrap"
        >
          Read FAQ ↗
        </a>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Deals" value={activeDeals.length} color="charcoal" />
          <StatCard label="Red Zone" value={dealsByZone.red.length} color="red" />
          <StatCard label="Green Zone" value={dealsByZone.green.length} color="green" />
          <StatCard label="Yellow Zone" value={dealsByZone.yellow.length} color="yellow" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <QuickAction title="Deal Mode" description="Coach on active deals with zone diagnosis" icon="📊" to="/deals" color="rzs-red" />
          <QuickAction title="Coach Mode" description="Get on-demand selling advice" icon="🎯" to="/coach" color="green-600" />
          <QuickAction title="Mindset Mode" description="Performance coaching for the mental game" icon="🧠" to="/mindset" color="purple-600" />
        </div>

        {/* Recent Deals */}
        {activeDeals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-rzs-charcoal mb-4">Recent Deals</h2>
            <div className="space-y-3">
              {activeDeals.slice(0, 5).map((deal) => (
                <Link
                  key={deal.id}
                  to={`/deals/${deal.id}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-rzs-red transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-rzs-charcoal">{deal.company || deal.name}</p>
                      <p className="text-sm text-gray-500">{deal.name}</p>
                    </div>
                    <ZoneBadge zone={deal.zone} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && activeDeals.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No active deals yet</p>
            <Link to="/deals" className="btn-primary">Create Your First Deal</Link>
          </div>
        )}

        {/* Recent Chats */}
        {sessions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-rzs-charcoal mb-4">Recent Chats</h2>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <Link
                  key={session.id}
                  to={`/mode/${session.mode_slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-rzs-red transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-rzs-charcoal truncate">
                        {session.first_message
                          ? session.first_message.length > 80
                            ? session.first_message.slice(0, 80) + '…'
                            : session.first_message
                          : 'New conversation'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.mode_slug} · {session.message_count || 0} messages
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorClasses = {
    charcoal: 'bg-rzs-charcoal text-white',
    red: 'bg-zone-red text-white',
    green: 'bg-zone-green text-white',
    yellow: 'bg-zone-yellow text-rzs-charcoal',
  };
  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function QuickAction({ title, description, icon, to, color }) {
  return (
    <Link to={to} className={`block p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-${color} transition-colors`}>
      <span className="text-3xl">{icon}</span>
      <h3 className="font-semibold text-rzs-charcoal mt-3">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}

function ZoneBadge({ zone }) {
  const classes = {
    yellow: 'zone-badge zone-badge-yellow',
    green: 'zone-badge zone-badge-green',
    red: 'zone-badge zone-badge-red',
  };
  return <span className={classes[zone] || 'zone-badge'}>{zone?.toUpperCase()} ZONE</span>;
}
