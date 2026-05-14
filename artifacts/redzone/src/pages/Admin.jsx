import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart } from 'chart.js/auto';

const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'users',      label: 'Users' },
  { id: 'invites',    label: 'Invites' },
  { id: 'analytics',  label: 'Analytics' },
  { id: 'prompts',    label: 'Coaching Engine' },
  { id: 'system',     label: 'System' },
];

function useFlash() {
  const [flash, setFlash] = useState(null);
  const timer = useRef(null);

  function showFlash(type, msg) {
    clearTimeout(timer.current);
    setFlash({ type, msg });
    const delay = type === 'error' ? 5000 : type === 'warning' ? 20000 : 3000;
    timer.current = setTimeout(() => setFlash(null), delay);
  }

  return [flash, showFlash];
}

function Flash({ flash }) {
  if (!flash) return null;
  const styles =
    flash.type === 'error'   ? 'bg-red-50 border border-red-200 text-red-700' :
    flash.type === 'warning' ? 'bg-amber-50 border border-amber-200 text-amber-800' :
                               'bg-green-50 border border-green-200 text-green-800';
  return (
    <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${styles}`}>
      {flash.msg}
    </div>
  );
}

function StatusBadge({ user }) {
  if (user.is_admin) return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 font-medium">Admin</span>;
  if (user.subscription_status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 font-medium">Active</span>;
  if (user.has_beta_access) return <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">Beta</span>;
  return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">Inactive</span>;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loaded, setLoaded] = useState({});

  function switchTab(id) {
    setActiveTab(id);
    setLoaded(prev => ({ ...prev, [id]: true }));
  }

  useEffect(() => { setLoaded({ overview: true }); }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-rzs-charcoal mb-6">Super Admin</h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-rzs-red text-rzs-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {loaded.overview   && <div className={activeTab === 'overview'   ? '' : 'hidden'}><OverviewTab /></div>}
      {loaded.users      && <div className={activeTab === 'users'      ? '' : 'hidden'}><UsersTab onInvite={() => switchTab('invites')} /></div>}
      {loaded.invites    && <div className={activeTab === 'invites'    ? '' : 'hidden'}><InvitesTab /></div>}
      {loaded.analytics  && <div className={activeTab === 'analytics'  ? '' : 'hidden'}><AnalyticsTab /></div>}
      {loaded.prompts    && <div className={activeTab === 'prompts'    ? '' : 'hidden'}><PromptsTab /></div>}
      {loaded.system     && <div className={activeTab === 'system'     ? '' : 'hidden'}><SystemTab /></div>}
    </div>
  );
}

// ─── Analytics Tab ─────────────────────────────────────────────────────────

function AnalyticsTab() {
  const [period, setPeriod] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dauRef = useRef(null);
  const turnsRef = useRef(null);
  const dauChart = useRef(null);
  const turnsChart = useRef(null);

  useEffect(() => { loadData(); }, [period]);

  useEffect(() => {
    if (!data) return;
    if (dauChart.current) { dauChart.current.destroy(); dauChart.current = null; }
    if (turnsChart.current) { turnsChart.current.destroy(); turnsChart.current = null; }
    if (dauRef.current && data.dau_series?.length) {
      dauChart.current = new Chart(dauRef.current, {
        type: 'line',
        data: {
          labels: data.dau_series.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          datasets: [{ data: data.dau_series.map(d => d.count), borderColor: '#C62828', backgroundColor: 'rgba(198,40,40,0.08)', fill: true, tension: 0.4, pointRadius: 2 }],
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A1A1A', titleColor: '#fff', bodyColor: '#fff' } },
          scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', maxTicksLimit: 7 } }, y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' }, beginAtZero: true } },
          responsive: true, maintainAspectRatio: false,
        },
      });
    }
    if (turnsRef.current && data.turns_series?.length) {
      turnsChart.current = new Chart(turnsRef.current, {
        type: 'bar',
        data: {
          labels: data.turns_series.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          datasets: [{ data: data.turns_series.map(d => d.count), backgroundColor: 'rgba(198,40,40,0.7)' }],
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A1A1A', titleColor: '#fff', bodyColor: '#fff' } },
          scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', maxTicksLimit: 7 } }, y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' }, beginAtZero: true } },
          responsive: true, maintainAspectRatio: false,
        },
      });
    }
    return () => {
      dauChart.current?.destroy();
      turnsChart.current?.destroy();
    };
  }, [data]);

  async function loadData() {
    setLoading(true);
    setError(false);
    try {
      const r = await fetch(`/api/admin/analytics?period=${period}`, { credentials: 'include' });
      if (!r.ok) throw new Error();
      setData(await r.json());
    } catch { setError(true); }
    finally { setLoading(false); }
  }

  function exportCSV() {
    if (!data) return;
    const km = data.key_metrics;
    const lines = [
      'Key Metrics', 'Metric,Value',
      `Total Users,${km.total_users}`, `Beta Users,${km.beta_users}`, `Paying Subscribers,${km.paying_subscribers}`,
      `WAU,${km.wau}`, `Avg Sessions/User,${km.avg_sessions_per_user}`, `Total Coaching Turns,${km.total_turns}`,
      '', 'Daily Active Users', 'Date,Count',
      ...data.dau_series.map(d => `${d.date},${d.count}`),
      '', 'Mode Usage', 'Mode,Sessions,Avg Turns,% of Total',
      ...data.mode_usage.map(m => `${m.mode},${m.sessions},${m.avg_turns},${m.pct}%`),
      '', 'Artifact Performance', 'Artifact,Offered,Accepted,Dismissed,Rate',
      ...data.artifact_performance.map(a => `${a.type},${a.offered},${a.accepted},${a.dismissed},${a.rate}%`),
      '', 'Feature Adoption', 'Feature,Users,% of Total',
      ...data.feature_adoption.map(f => `${f.feature},${f.users},${f.pct}%`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RZS_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) return (
    <div className="py-12 text-center">
      <p className="text-red-600 font-medium mb-3">Analytics data unavailable.</p>
      <button onClick={loadData} className="px-4 py-2 bg-rzs-red text-white text-sm rounded-lg hover:bg-red-700">Retry</button>
    </div>
  );

  const km = data?.key_metrics;
  const METRICS = [
    { label: 'Total Users', value: km?.total_users, delta: null },
    { label: 'Beta Users', value: km?.beta_users, delta: null },
    { label: 'Paying Subscribers', value: km?.paying_subscribers, delta: null },
    { label: 'Weekly Active Users', value: km?.wau, delta: km?.wau_delta },
    { label: 'Avg Sessions / User', value: km?.avg_sessions_per_user, delta: null },
    { label: 'Total Coaching Turns', value: km?.total_turns, delta: km ? (km.turns_this_week - km.turns_last_week) : null },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-rzs-charcoal">Analytics</h2>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {[7, 30, 90].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 transition-colors ${period === p ? 'bg-rzs-red text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {p}D
              </button>
            ))}
          </div>
          <button onClick={exportCSV} disabled={!data}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Section 1 — Key Metrics */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Key Metrics</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {METRICS.map(({ label, value, delta }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-7 bg-gray-100 rounded animate-pulse w-16" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-rzs-charcoal">{value ?? '—'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  {delta !== null && delta !== undefined && (
                    <p className={`text-[10px] mt-1 font-medium ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {delta > 0 ? '+' : ''}{delta} vs last week
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 — Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-rzs-charcoal mb-4">Daily Active Users ({period}d)</p>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded animate-pulse flex items-center justify-center">
              <p className="text-xs text-gray-400">Loading…</p>
            </div>
          ) : data?.dau_series?.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-xs text-gray-400 text-center">No data yet — check back after your first beta sessions</p>
            </div>
          ) : (
            <div className="h-48"><canvas ref={dauRef} /></div>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-rzs-charcoal mb-4">Coaching Turns Per Day ({period}d)</p>
          {loading ? (
            <div className="h-48 bg-gray-50 rounded animate-pulse flex items-center justify-center">
              <p className="text-xs text-gray-400">Loading…</p>
            </div>
          ) : data?.turns_series?.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-xs text-gray-400 text-center">No data yet — check back after your first beta sessions</p>
            </div>
          ) : (
            <div className="h-48"><canvas ref={turnsRef} /></div>
          )}
        </div>
      </div>

      {/* Section 3 — Mode & Feature Usage */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Mode & Feature Usage</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-rzs-charcoal mb-3">Mode Usage</p>
            {loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div> : (
              <table className="w-full text-xs">
                <thead><tr className="text-gray-400 border-b border-gray-100"><th className="text-left pb-2">Mode</th><th className="text-right pb-2">Sessions</th><th className="text-right pb-2">%</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {(data?.mode_usage || []).map(m => {
                    const maxSessions = Math.max(...(data?.mode_usage || []).map(x => x.sessions), 0);
                    const isTop = m.sessions > 0 && m.sessions === maxSessions;
                    return (
                      <tr key={m.mode} className={isTop ? 'border-l-2 border-rzs-red' : ''}>
                        <td className="py-1.5 pl-1 capitalize font-medium text-rzs-charcoal">{m.mode}</td>
                        <td className="py-1.5 text-right text-gray-600">{m.sessions}</td>
                        <td className="py-1.5 text-right text-gray-500">{m.pct}%</td>
                      </tr>
                    );
                  })}
                  {(!data?.mode_usage?.some(m => m.sessions > 0)) && <tr><td colSpan={3} className="py-4 text-center text-gray-400 text-xs">No data yet</td></tr>}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-rzs-charcoal mb-3">Artifact Performance</p>
            {loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div> : (
              <table className="w-full text-xs">
                <thead><tr className="text-gray-400 border-b border-gray-100"><th className="text-left pb-2">Type</th><th className="text-right pb-2">Off.</th><th className="text-right pb-2">Acc.</th><th className="text-right pb-2">Rate</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {(data?.artifact_performance || []).map(a => (
                    <tr key={a.type}>
                      <td className="py-1.5 font-medium text-rzs-charcoal truncate max-w-[80px]">{a.type}</td>
                      <td className="py-1.5 text-right text-gray-600">{a.offered}</td>
                      <td className="py-1.5 text-right text-gray-600">{a.accepted}</td>
                      <td className={`py-1.5 text-right font-semibold ${a.rate >= 70 ? 'text-green-600' : a.rate >= 40 ? 'text-amber-500' : 'text-red-500'}`}>{a.rate}%</td>
                    </tr>
                  ))}
                  {(!data?.artifact_performance?.length) && <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-xs">No data yet</td></tr>}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-rzs-charcoal mb-3">Feature Adoption</p>
            {loading ? <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div> : (
              <div className="space-y-3">
                {(data?.feature_adoption || []).map(f => (
                  <div key={f.feature}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{f.feature}</span>
                      <span className="text-gray-500 font-medium">{f.users} users ({f.pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rzs-red rounded-full transition-all" style={{ width: `${Math.max(f.pct, 0)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 4 — Retention & Deal Health */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Retention & Deal Health</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-rzs-charcoal mb-3">Weekly Retention (last 8 weeks)</p>
            {loading ? <div className="h-40 bg-gray-100 rounded animate-pulse" /> : (
              <>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left pb-2">Week of</th>
                      <th className="text-right pb-2">New</th>
                      <th className="text-right pb-2">W2</th>
                      <th className="text-right pb-2">W3</th>
                      <th className="text-right pb-2">W4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(data?.retention_cohorts || []).map((c, i) => (
                      <tr key={i}>
                        <td className="py-1.5 text-gray-600">{new Date(c.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td className="py-1.5 text-right text-gray-600">{c.new_users}</td>
                        {[c.w2, c.w3, c.w4].map((pct, j) => (
                          <td key={j} className={`py-1.5 text-right font-medium ${
                            pct === null ? 'text-gray-300' :
                            pct >= 60 ? 'text-green-700 bg-green-50' :
                            pct >= 40 ? 'text-amber-700 bg-amber-50' : 'text-red-600 bg-red-50'
                          }`}>{pct === null ? '—' : pct + '%'}</td>
                        ))}
                      </tr>
                    ))}
                    {(!data?.retention_cohorts?.length) && <tr><td colSpan={5} className="py-4 text-center text-gray-400 text-xs">No retention data yet</td></tr>}
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-400 mt-3">Retention = at least one session start in the given week</p>
              </>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-rzs-charcoal mb-3">Deal Pipeline Health</p>
            {loading ? <div className="h-40 bg-gray-100 rounded animate-pulse" /> : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Active Deals by Zone</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-600">🟡 Yellow</span><span className="font-semibold">{data?.deal_health?.active_by_zone?.yellow ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">🟢 Green</span><span className="font-semibold">{data?.deal_health?.active_by_zone?.green ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">🔴 Red</span><span className="font-semibold">{data?.deal_health?.active_by_zone?.red ?? 0}</span></div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Outcomes</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-600">Won (all time)</span><span className="font-semibold text-green-700">{data?.deal_health?.won ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Lost (all time)</span><span className="font-semibold text-red-600">{data?.deal_health?.lost ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Win Rate</span><span className="font-bold">{data?.deal_health?.win_rate !== null && data?.deal_health?.win_rate !== undefined ? data.deal_health.win_rate + '%' : '—'}</span></div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Coaching Depth</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-600">Avg turns · won deals</span><span className="font-semibold">{data?.deal_health?.avg_turns_won ?? '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Avg turns · lost deals</span><span className="font-semibold">{data?.deal_health?.avg_turns_lost ?? '—'}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 5 — Claude Spend */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Claude AI Spend ({period}d)</p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-rzs-charcoal">Cost by user</p>
            {!loading && (
              <span className="text-sm font-bold text-rzs-charcoal">
                Total: ${(data?.claude_spend?.total_cost || 0).toFixed(4)}
              </span>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : (data?.claude_spend?.users?.length > 0) ? (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2">User</th>
                  <th className="text-right pb-2">Calls</th>
                  <th className="text-right pb-2">Tokens in</th>
                  <th className="text-right pb-2">Tokens out</th>
                  <th className="text-right pb-2">Est. cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.claude_spend.users.map((u, i) => (
                  <tr key={i}>
                    <td className="py-1.5 text-rzs-charcoal font-medium truncate max-w-[180px]">
                      {u.display_name || u.email}
                      {u.display_name && <span className="text-gray-400 font-normal ml-1 text-[10px]">{u.email}</span>}
                    </td>
                    <td className="py-1.5 text-right text-gray-600">{u.calls}</td>
                    <td className="py-1.5 text-right text-gray-600">{u.tokens_in.toLocaleString()}</td>
                    <td className="py-1.5 text-right text-gray-600">{u.tokens_out.toLocaleString()}</td>
                    <td className={`py-1.5 text-right font-semibold ${u.est_cost > 1 ? 'text-red-600' : u.est_cost > 0.25 ? 'text-amber-600' : 'text-green-700'}`}>
                      ${u.est_cost.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">No spend recorded in this period yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tool Builder ──────────────────────────────────────────────────────────

const ZONE_COLORS = {
  yellow: 'bg-yellow-100 text-yellow-800',
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  any:    'bg-gray-100 text-gray-600',
};

function ZoneBadge({ zone }) {
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${ZONE_COLORS[zone] || ZONE_COLORS.any}`}>
      {zone}
    </span>
  );
}

function ToolBuilderTab() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [flash, showFlash] = useFlash();

  function load() {
    setLoading(true);
    fetch('/api/admin/artifact-templates', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Server error')))
      .then(data => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => showFlash('error', 'Failed to load templates'))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function toggleActive(t) {
    try {
      const r = await fetch(`/api/admin/artifact-templates/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !t.is_active }),
      });
      if (!r.ok) throw new Error();
      const updated = await r.json();
      setTemplates(prev => prev.map(x => x.id === updated.id ? { ...x, is_active: updated.is_active } : x));
      showFlash('success', updated.is_active ? 'Template activated' : 'Template deactivated');
    } catch {
      showFlash('error', 'Failed to update template');
    }
  }

  async function deleteTemplate(id) {
    try {
      const r = await fetch(`/api/admin/artifact-templates/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!r.ok) throw new Error();
      setTemplates(prev => prev.filter(t => t.id !== id));
      setDeleteConfirmId(null);
      showFlash('success', 'Template deleted');
    } catch {
      showFlash('error', 'Failed to delete template');
    }
  }

  async function openPreview(t) {
    setPreviewTarget(t);
    setPreviewData(null);
    setPreviewLoading(true);
    try {
      const r = await fetch(`/api/admin/artifact-templates/${t.id}/preview`, { method: 'POST', credentials: 'include' });
      if (!r.ok) throw new Error((await r.json()).error || 'Preview failed');
      setPreviewData(await r.json());
    } catch (e) {
      showFlash('error', e.message || 'Preview failed');
      setPreviewTarget(null);
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Flash flash={flash} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-rzs-charcoal">Custom Artifact Templates</h2>
          <p className="text-xs text-gray-500 mt-0.5">Upload templates — the AI analyzes them and makes them available in Deal Mode.</p>
        </div>
        <button
          onClick={() => { setDrawerOpen(true); setEditTarget(null); }}
          className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          + Upload Template
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
        <p className="font-medium text-rzs-charcoal mb-1">Upload any of the following template types:</p>
        <ul className="space-y-0.5 mb-2">
          <li>✓ Scoring worksheets (XLSX with score columns)</li>
          <li>✓ Stakeholder maps (table-based templates)</li>
          <li>✓ Call prep guides (checklist format)</li>
          <li>✓ Play worksheets (structured guides)</li>
          <li>✓ Action plan templates (owner + deadline columns)</li>
        </ul>
        <p className="text-gray-400">Works best with templates that have clear section headers, labeled columns, and structured rows.</p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 text-center py-8">Loading templates…</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 font-medium mb-1">No custom templates yet</p>
          <p className="text-xs text-gray-400 mb-4">Upload a DOCX or XLSX template and the AI will analyze its structure and make it available as an artifact in Deal Mode.</p>
          <button
            onClick={() => { setDrawerOpen(true); setEditTarget(null); }}
            className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            + Upload your first template
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-rzs-charcoal text-sm">{t.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{t.slug}</span>
                    <ZoneBadge zone={t.trigger_zone} />
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${t.is_active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-700'}`}>
                      {t.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  {t.trigger_condition && (
                    <p className="text-xs text-gray-500 mb-1">When: {t.trigger_condition.length > 80 ? t.trigger_condition.slice(0, 80) + '…' : t.trigger_condition}</p>
                  )}
                  <p className="text-xs text-gray-400">{t.source_filename} · {t.sections_count || 0} sections</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openPreview(t)}
                    className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => { setEditTarget(t); setDrawerOpen(true); }}
                    className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(t)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                      t.is_active
                        ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {t.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  {deleteConfirmId === t.id ? (
                    <>
                      <button onClick={() => deleteTemplate(t.id)} className="px-2.5 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg">Cancel</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="px-2.5 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {drawerOpen && (
        <UploadDrawer
          editTarget={editTarget}
          onClose={() => { setDrawerOpen(false); setEditTarget(null); }}
          onSaved={(t) => {
            setTemplates(prev => {
              const exists = prev.find(x => x.id === t.id);
              return exists ? prev.map(x => x.id === t.id ? t : x) : [t, ...prev];
            });
            setDrawerOpen(false);
            setEditTarget(null);
            showFlash('success', editTarget ? 'Template saved' : 'Template created');
          }}
        />
      )}

      {previewTarget && (
        <PreviewModal
          template={previewTarget}
          data={previewData}
          loading={previewLoading}
          onClose={() => { setPreviewTarget(null); setPreviewData(null); }}
        />
      )}
    </div>
  );
}

const ZONE_HINTS = {
  any:    'e.g. When the rep asks for help with this specific situation',
  yellow: 'e.g. After the rep describes their ICP or qualification criteria',
  green:  'e.g. When the champion hasn\'t been fully activated or deal is single-threaded',
  red:    'e.g. When the deal is stalling or close date is at risk',
};

const ZONE_SUGGESTIONS = {
  yellow: ['After qualification gaps identified', 'When 4F Filter score is weak', 'When stakeholder map is incomplete'],
  green:  ['When champion hasn\'t been activated', 'When deal is single-threaded', 'After MAP discussion'],
  red:    ['When close date is at risk', 'When champion goes dark', 'Before pushing to close'],
  any:    ['When rep asks for this tool directly', 'When deal health score drops', 'At the start of any coaching session'],
};

function UploadDrawer({ editTarget, onClose, onSaved }) {
  const isEdit = !!editTarget;
  const [step, setStep] = useState(isEdit ? 'edit' : 'form');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [form, setForm] = useState({
    name: editTarget?.name || '',
    description: editTarget?.description || '',
    trigger_zone: editTarget?.trigger_zone || 'any',
    trigger_condition: editTarget?.trigger_condition || '',
    offer_language: editTarget?.offer_language || '',
    resource_center_id: editTarget?.resource_center_id || '',
    resource_center_url: editTarget?.resource_center_url || '',
  });
  const [file, setFile] = useState(null);
  const [specJson, setSpecJson] = useState(editTarget?.builder_spec ? JSON.stringify(editTarget.builder_spec, null, 2) : '');
  const [regenerating, setRegenerating] = useState(false);
  const fileRef = useRef(null);

  function setField(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function analyze() {
    if (!form.name.trim()) { setError('Template name is required'); return; }
    if (!file) { setError('Please select a DOCX or XLSX file'); return; }
    setError('');
    setBusy(true);
    setStep('analyzing');

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('trigger_zone', form.trigger_zone);
    fd.append('trigger_condition', form.trigger_condition);
    fd.append('offer_language', form.offer_language);
    if (form.resource_center_id) fd.append('resource_center_id', form.resource_center_id);
    if (form.resource_center_url) fd.append('resource_center_url', form.resource_center_url);
    fd.append('file', file);

    try {
      const r = await fetch('/api/admin/artifact-templates', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Upload failed'); }
      const t = await r.json();
      setTemplate(t);
      setSpecJson(t.builder_spec ? JSON.stringify(t.builder_spec, null, 2) : '');
      setForm(prev => ({
        ...prev,
        offer_language: prev.offer_language || t.offer_language || '',
        trigger_condition: prev.trigger_condition || t.trigger_condition || '',
        trigger_zone: prev.trigger_zone || t.trigger_zone || 'any',
      }));
      setStep('review');
    } catch (e) {
      setError(e.message);
      setStep('form');
    } finally {
      setBusy(false);
    }
  }

  async function regenerate() {
    if (!template) return;
    setRegenerating(true);
    try {
      const r = await fetch(`/api/admin/artifact-templates/${template.id}/regenerate`, { method: 'POST', credentials: 'include' });
      if (!r.ok) throw new Error((await r.json()).error || 'Regeneration failed');
      const updated = await r.json();
      setTemplate(updated);
      setSpecJson(updated.builder_spec ? JSON.stringify(updated.builder_spec, null, 2) : '');
      setForm(prev => ({
        ...prev,
        offer_language: updated.offer_language || prev.offer_language || '',
        trigger_condition: updated.trigger_condition || prev.trigger_condition || '',
        trigger_zone: updated.trigger_zone || prev.trigger_zone || 'any',
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setRegenerating(false);
    }
  }

  async function saveReview(activate) {
    if (!template) return;
    setBusy(true);
    try {
      let spec = template.builder_spec;
      if (specJson) { try { spec = JSON.parse(specJson); } catch { throw new Error('Invalid JSON in builder spec'); } }
      const body = {
        offer_language: form.offer_language || template.offer_language,
        trigger_condition: form.trigger_condition || template.trigger_condition,
        builder_spec: spec,
        is_active: activate,
      };
      const r = await fetch(`/api/admin/artifact-templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Save failed');
      onSaved(await r.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    setBusy(true);
    setError('');
    try {
      let spec = editTarget?.builder_spec;
      if (specJson) { try { spec = JSON.parse(specJson); } catch { throw new Error('Invalid JSON in builder spec'); } }
      const body = { ...form, builder_spec: spec };
      const r = await fetch(`/api/admin/artifact-templates/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Save failed');
      onSaved(await r.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-rzs-charcoal">
            {isEdit ? 'Edit Template' : step === 'review' ? 'Review Builder Spec' : 'Upload Template'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-4">
          {(step === 'form' || isEdit) && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Template name *</label>
                <input value={form.name} onChange={e => setField('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Shadow Org Chart" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="2-3 sentences about this template" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Which zone?</label>
                <select value={form.trigger_zone} onChange={e => setField('trigger_zone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="any">Any zone</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">{ZONE_HINTS[form.trigger_zone]}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">When should this be offered?</label>
                <input value={form.trigger_condition} onChange={e => setField('trigger_condition', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. After stakeholder gaps are identified in a Green Zone deal" />
                <p className="text-[11px] text-gray-400 mt-1">Describe in plain English when the coach should offer this tool. Be specific about the zone and the moment.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">What should the AI say to offer it?</label>
                <input value={form.offer_language} onChange={e => setField('offer_language', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. Would you like me to map the stakeholder relationships for this deal?" />
                <p className="text-[11px] text-gray-400 mt-1">This is what the coach says to the rep when offering to build this artifact. Keep it one sentence, conversational.</p>
              </div>
              {!isEdit && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">File (DOCX or XLSX) *</label>
                  <input ref={fileRef} type="file" accept=".docx,.xlsx" onChange={e => setFile(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              )}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Resource Center link (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Resource Center ID</label>
                    <input value={form.resource_center_id} onChange={e => setField('resource_center_id', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. G1, Y3" />
                    <p className="text-xs text-gray-400 mt-0.5">If this tool corresponds to an existing RC entry</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Resource Center URL</label>
                    <input value={form.resource_center_url} onChange={e => setField('resource_center_url', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Google Sheet or Doc link" />
                    <p className="text-xs text-gray-400 mt-0.5">AI will reference this link when coaching</p>
                  </div>
                </div>
              </div>
              {isEdit && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Builder Spec (JSON)</label>
                  <textarea value={specJson} onChange={e => setSpecJson(e.target.value)} rows={12}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-xs resize-none" />
                </div>
              )}
            </>
          )}

          {step === 'analyzing' && (
            <div className="py-8 text-center space-y-4">
              <p className="font-medium text-rzs-charcoal">Analyzing your template…</p>
              <p className="text-sm text-gray-500">Claude is reading the structure and figuring out how to populate it from deal context. This takes about 10 seconds.</p>
              <div className="space-y-2 mt-4 text-left max-w-xs mx-auto">
                {['Parsing document structure', 'Analyzing sections and fields', 'Generating builder specification'].map((label, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-5 text-center">{i === 0 ? '✓' : '⟳'}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'review' && template && (
            <>
              {/* Part A — Detected sections */}
              <div>
                <p className="text-[13px] text-gray-500 mb-3">Here's what Claude found in your template:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                  {(template.builder_spec?.sections || []).map(s => (
                    <div key={s.id} className="bg-white border border-gray-100 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-rzs-charcoal">{s.label}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{s.type}</span>
                      </div>
                      {s.populated_from && <p className="text-xs text-gray-400 mt-0.5">Populated from: {s.populated_from}</p>}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 italic mt-2">Not right? Click Regenerate to try again, or activate now and edit later.</p>
                <button onClick={regenerate} disabled={regenerating}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                  <span>{regenerating ? '⟳' : '🔄'}</span>
                  {regenerating ? 'Regenerating…' : 'Regenerate spec'}
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-1">Ask Claude to re-analyze the template from scratch</p>
              </div>

              {/* Part B — Offer language */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">What should the coach say to offer this tool?</label>
                <textarea
                  value={form.offer_language}
                  onChange={e => setField('offer_language', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder={`Would you like me to build your ${form.name || 'template'} for this deal?`}
                />
                <div className="flex justify-between items-start mt-1">
                  <p className="text-[11px] text-gray-400">The rep will see this as a suggestion card in the chat. Keep it one sentence.</p>
                  {form.offer_language.length >= 100 && (
                    <span className={`text-[11px] flex-shrink-0 ml-2 ${form.offer_language.length > 120 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {form.offer_language.length}/120
                    </span>
                  )}
                </div>
              </div>

              {/* Part B — When to offer */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-600">When should the coach offer this tool?</label>
                <div>
                  <p className="text-[11px] text-gray-400 mb-1">Zone</p>
                  <select value={form.trigger_zone} onChange={e => setField('trigger_zone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="any">Any zone</option>
                    <option value="yellow">Yellow Zone</option>
                    <option value="green">Green Zone</option>
                    <option value="red">Red Zone</option>
                  </select>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-1">Moment</p>
                  <input
                    value={form.trigger_condition}
                    onChange={e => setField('trigger_condition', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Describe the coaching moment in plain English"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(ZONE_SUGGESTIONS[form.trigger_zone] || ZONE_SUGGESTIONS.any).map(chip => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setField('trigger_condition', chip)}
                        className="px-2.5 py-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Part C — Advanced (collapsed) */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 text-[12px] text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <span>Advanced — Edit raw specification</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {advancedOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                    <p className="text-[11px] text-amber-600">Only edit this if you know what you're doing. Changes here directly modify how Claude populates the template.</p>
                    <textarea value={specJson} onChange={e => setSpecJson(e.target.value)} rows={10}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono resize-none" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 space-y-3">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          {!error && step === 'review' && (
            <p className="text-center text-[11px] text-gray-400">
              Saving as Draft lets you test before your reps see it. You can activate from the Custom Tools list at any time.
            </p>
          )}
          <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          {step === 'form' && !isEdit && (
            <button onClick={analyze} disabled={busy}
              className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {busy ? 'Uploading…' : 'Analyze Template'}
            </button>
          )}
          {isEdit && (
            <button onClick={saveEdit} disabled={busy}
              className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {busy ? 'Saving…' : 'Save'}
            </button>
          )}
          {step === 'review' && (
            <>
              <button onClick={() => saveReview(false)} disabled={busy}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                {busy ? 'Saving…' : 'Save as Draft'}
              </button>
              <button onClick={() => saveReview(true)} disabled={busy}
                className="px-4 py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {busy ? 'Activating…' : 'Activate Now'}
              </button>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ template, data, loading, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-rzs-charcoal">{template.name} — Preview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Simulated with dummy deal: "Preview Corp", Green zone</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && <div className="text-center py-8 text-gray-400 text-sm">Generating preview…</div>}
          {!loading && data && (
            <div className="space-y-4">
              {(data.data?.populated || []).map(section => (
                <div key={section.id} className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="bg-rzs-red/5 border-b border-gray-100 px-4 py-2">
                    <span className="font-medium text-sm text-rzs-charcoal">{section.label}</span>
                    <span className="ml-2 text-xs text-gray-400">{section.type}</span>
                  </div>
                  <div className="px-4 py-3">
                    {section.type === 'table' && Array.isArray(section.data) && section.data.length > 0 && (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            {Object.keys(section.data[0]).map(col => (
                              <th key={col} className="text-left py-1 px-2 font-medium text-gray-500">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.data.map((row, ri) => (
                            <tr key={ri} className="border-b border-gray-50">
                              {Object.values(row).map((val, vi) => (
                                <td key={vi} className="py-1.5 px-2 text-gray-700">{val || '—'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {section.type === 'list' && (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {(section.data || []).map((item, i) => <li key={i} className="flex gap-2"><span className="text-gray-400">•</span>{item}</li>)}
                      </ul>
                    )}
                    {section.type === 'qa_blocks' && (
                      <div className="space-y-2">
                        {(section.data || []).map((qa, i) => (
                          <div key={i}><p className="font-medium text-sm text-rzs-charcoal">{qa.question}</p><p className="text-sm text-gray-600">{qa.answer}</p></div>
                        ))}
                      </div>
                    )}
                    {section.type === 'action_plan' && (
                      <ol className="space-y-1 text-sm text-gray-700">
                        {(section.data || []).map((a, i) => (
                          <li key={i}>{i + 1}. {a.action} — <span className="text-gray-500">{a.owner}</span> — <span className="text-gray-400">{a.deadline}</span></li>
                        ))}
                      </ol>
                    )}
                    {section.type === 'scored_rows' && (
                      <div className="space-y-1">
                        {(section.data || []).map((r, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="flex-1 text-gray-700">{r.criteria}</span>
                            <span className="font-medium text-rzs-red">{r.score}/10</span>
                            <span className="text-gray-400 text-xs">{r.notes}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.type === 'free_text' && <p className="text-sm text-gray-700">{section.data}</p>}
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-300 uppercase tracking-widest">RED ZONE SELLING™ | REDZONESELLING.CO</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Overview ──────────────────────────────────────────────────────────────

function OverviewTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  function load() {
    setLoading(true);
    setError(false);
    fetch('/api/admin/overview', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setData(d); setLastUpdated(new Date()); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const s = data?.stats || {};
  const TILES = [
    { label: 'Total users',    value: s.total_users },
    { label: 'Beta active',    value: s.beta_users },
    { label: 'Active deals',   value: s.active_deals },
    { label: 'Coaching turns', value: s.total_turns },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {lastUpdated && (
            <p className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-rzs-charcoal border border-gray-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span>Could not load overview data.</span>
          <button onClick={load} className="text-red-700 font-medium hover:underline ml-3">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TILES.map(tile => (
          <div key={tile.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-rzs-charcoal">{loading ? '—' : (tile.value ?? '—')}</p>
            <p className="text-xs text-gray-500 mt-1">{tile.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-rzs-charcoal text-sm">Most active users — last 7 days</h3>
        </div>
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['Email', 'Deals', 'Turns', 'Last active', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data?.top_users || []).map((u, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <p className="text-rzs-charcoal font-medium">{u.email}</p>
                  {u.display_name && <p className="text-xs text-gray-400">{u.display_name}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.deal_count}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.total_turns}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {u.last_active ? new Date(u.last_active).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3"><StatusBadge user={u} /></td>
              </tr>
            ))}
            {!data?.top_users?.length && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">No data yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-rzs-charcoal text-sm">Mode usage breakdown</h3>
        </div>
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {['Mode', 'Sessions', 'Avg turns', 'Active'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data?.mode_usage || []).map(m => (
              <tr key={m.slug} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-rzs-charcoal">{m.display_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.session_count}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.avg_turns}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {m.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Users ─────────────────────────────────────────────────────────────────

function UsersTab({ onInvite }) {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [flash, showFlash] = useFlash();

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const r = await fetch('/api/admin/users', { credentials: 'include' });
      const d = await r.json();
      setUsers(d.users || []);
    } catch { showFlash('error', 'Failed to load users'); }
    finally { setLoading(false); }
  }

  function openEdit(u) {
    setExpanded(u.id);
    setEditForm({
      display_name: u.display_name || '',
      email: u.email || '',
      has_beta_access: u.has_beta_access,
      beta_expires_at: u.beta_expires_at?.split('T')[0] || '',
      is_admin: u.is_admin,
    });
  }

  async function saveEdit(userId) {
    setSaving(userId);
    try {
      const body = {
        display_name: editForm.display_name,
        email: editForm.email,
        has_beta_access: editForm.has_beta_access,
        is_admin: editForm.is_admin,
        beta_expires_at: editForm.has_beta_access ? (editForm.beta_expires_at || null) : null,
      };
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'User updated');
      setExpanded(null);
      await fetchUsers();
    } catch { showFlash('error', 'Save failed'); }
    finally { setSaving(null); }
  }

  async function grantBeta(userId) {
    setSaving(userId);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ has_beta_access: true }),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Beta access approved — 14-day trial started. Approval email sent.');
      await fetchUsers();
    } catch { showFlash('error', 'Failed'); }
    finally { setSaving(null); }
  }

  async function revokeBeta(userId) {
    setSaving(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ has_beta_access: false }),
      });
      showFlash('success', 'Access revoked — user is now blocked');
      await fetchUsers();
    } catch { showFlash('error', 'Failed'); }
    finally { setSaving(null); }
  }

  async function grantFreeAccess(userId) {
    setSaving(userId);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ has_beta_access: true, beta_expires_at: null }),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Free access granted — no expiry date');
      await fetchUsers();
    } catch { showFlash('error', 'Failed'); }
    finally { setSaving(null); }
  }

  async function activateSubscription(userId) {
    setSaving(userId);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription_status: 'active' }),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Subscription activated — user now has full access');
      await fetchUsers();
    } catch { showFlash('error', 'Failed'); }
    finally { setSaving(null); }
  }

  async function resetOnboarding(userId) {
    setSaving(userId);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ onboarding_skipped: false }),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Onboarding reset — user will be asked profile questions again');
      await fetchUsers();
    } catch { showFlash('error', 'Failed'); }
    finally { setSaving(null); }
  }

  async function skipOnboarding(userId) {
    setSaving(userId);
    try {
      const r = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ onboarding_skipped: true }),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Onboarding marked complete — user won\'t be asked profile questions');
      await fetchUsers();
    } catch { showFlash('error', 'Failed'); }
    finally { setSaving(null); }
  }

  async function deleteUser(userId) {
    try {
      const r = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE', credentials: 'include' });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'User deleted');
      setDeleting(null);
      await fetchUsers();
    } catch { showFlash('error', 'Delete failed'); }
  }

  function exportCSV() {
    const header = ['Email', 'Display Name', 'Admin', 'Beta Access', 'Beta Expires', 'Subscription', 'Deals', 'Turns', 'Joined'];
    const rows = filtered.map(u => [
      u.email, u.display_name || '', u.is_admin, u.has_beta_access,
      u.beta_expires_at || '', u.subscription_status,
      u.deal_count, u.total_turns,
      new Date(u.created_at).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rzs-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  function statusRank(u) {
    if (u.is_admin) return 0;
    if (u.subscription_status === 'active') return 1;
    if (u.has_beta_access) return 2;
    return 3;
  }

  function matchesStatusFilter(u) {
    if (statusFilter === 'all')      return true;
    if (statusFilter === 'admin')    return u.is_admin;
    if (statusFilter === 'active')   return u.subscription_status === 'active' && !u.is_admin;
    if (statusFilter === 'beta')     return u.has_beta_access && !u.is_admin;
    if (statusFilter === 'inactive') return !u.is_admin && !u.has_beta_access && u.subscription_status !== 'active';
    return true;
  }

  const counts = {
    all:      users.length,
    admin:    users.filter(u => u.is_admin).length,
    active:   users.filter(u => u.subscription_status === 'active' && !u.is_admin).length,
    beta:     users.filter(u => u.has_beta_access && !u.is_admin).length,
    inactive: users.filter(u => !u.is_admin && !u.has_beta_access && u.subscription_status !== 'active').length,
  };

  const filtered = users
    .filter(u => {
      const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) ||
        (u.display_name || '').toLowerCase().includes(search.toLowerCase());
      return matchSearch && matchesStatusFilter(u);
    })
    .sort((a, b) => statusRank(a) - statusRank(b));

  return (
    <div className="space-y-4">
      <Flash flash={flash} />
      <div className="flex gap-3 items-center">
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="input-field flex-1 max-w-sm"
        />
        <button onClick={onInvite} className="btn-primary text-sm">+ Invite user</button>
        <button onClick={exportCSV} className="btn-secondary text-sm">Export CSV</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',      label: 'All' },
          { key: 'beta',     label: 'Beta' },
          { key: 'active',   label: 'Active' },
          { key: 'inactive', label: 'Inactive' },
          { key: 'admin',    label: 'Admin' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              statusFilter === key
                ? 'bg-rzs-red text-white border-rzs-red'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {label}
            <span className={`ml-1.5 ${statusFilter === key ? 'text-red-200' : 'text-gray-400'}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-500 text-sm">Loading...</p> : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Email', 'Status', 'Beta expires', 'Deals', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <>
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-rzs-charcoal">{u.email}</p>
                      {u.display_name && <p className="text-xs text-gray-400">{u.display_name}</p>}
                      <p className="text-xs text-gray-300 font-mono">{u.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge user={u} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {u.beta_expires_at ? new Date(u.beta_expires_at).toLocaleDateString('en-US', { timeZone: 'UTC' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.deal_count || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => expanded === u.id ? setExpanded(null) : openEdit(u)}
                          className="text-xs text-rzs-red hover:underline">
                          {expanded === u.id ? 'Close' : 'Edit'}
                        </button>
                        {!u.is_admin && u.subscription_status !== 'active' && (
                          <button onClick={() => activateSubscription(u.id)} disabled={saving === u.id}
                            className="text-xs px-2.5 py-1 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors">
                            {saving === u.id ? '…' : 'Activate'}
                          </button>
                        )}
                        {!u.has_beta_access && !u.is_admin && u.subscription_status !== 'active' && (
                          <>
                            <button onClick={() => grantBeta(u.id)} disabled={saving === u.id}
                              className="text-xs px-2.5 py-1 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
                              {saving === u.id ? '…' : 'Approve (14d)'}
                            </button>
                            <button onClick={() => grantFreeAccess(u.id)} disabled={saving === u.id}
                              className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                              {saving === u.id ? '…' : 'Free access'}
                            </button>
                          </>
                        )}
                        {u.has_beta_access && u.subscription_status !== 'active' && (
                          <>
                            {u.beta_expires_at && (
                              <button onClick={() => grantFreeAccess(u.id)} disabled={saving === u.id}
                                className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                {saving === u.id ? '…' : 'Free access'}
                              </button>
                            )}
                            <button onClick={() => revokeBeta(u.id)} disabled={saving === u.id}
                              className="text-xs text-orange-600 hover:underline disabled:opacity-50">
                              Revoke
                            </button>
                          </>
                        )}
                        {!u.onboarding_skipped ? (
                          <button onClick={() => skipOnboarding(u.id)} disabled={saving === u.id}
                            className="text-xs text-gray-400 hover:text-blue-600 disabled:opacity-50">
                            Skip onboarding
                          </button>
                        ) : (
                          <button onClick={() => resetOnboarding(u.id)} disabled={saving === u.id}
                            className="text-xs text-gray-400 hover:text-blue-600 disabled:opacity-50">
                            Reset onboarding
                          </button>
                        )}
                        {u.id !== me?.id && (
                          deleting === u.id ? (
                            <span className="text-xs text-gray-600">
                              Delete {u.email}?{' '}
                              <button onClick={() => deleteUser(u.id)} className="text-red-600 font-medium hover:underline">Confirm</button>
                              {' · '}
                              <button onClick={() => setDeleting(null)} className="hover:underline">Cancel</button>
                            </span>
                          ) : (
                            <button onClick={() => setDeleting(u.id)}
                              className="text-xs text-gray-400 hover:text-red-600">
                              Delete
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === u.id && (
                    <tr key={`${u.id}-edit`} className="bg-blue-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex gap-4 items-end flex-wrap">
                          <label className="text-sm">
                            <span className="block text-gray-600 mb-1">Display name</span>
                            <input type="text" value={editForm.display_name}
                              onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
                              placeholder="Full name" />
                          </label>
                          <label className="text-sm">
                            <span className="block text-gray-600 mb-1">Email</span>
                            <input type="email" value={editForm.email}
                              onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-52"
                              placeholder="email@example.com" />
                          </label>
                          <label className="flex items-center gap-2 text-sm self-end pb-1">
                            <input type="checkbox" checked={editForm.has_beta_access}
                              onChange={e => setEditForm(f => ({ ...f, has_beta_access: e.target.checked }))}
                              className="rounded border-gray-300 text-rzs-red focus:ring-rzs-red" />
                            Beta access
                          </label>
                          {editForm.has_beta_access && (
                            <label className="text-sm">
                              <span className="block text-gray-600 mb-1">Beta expires</span>
                              <input type="date" value={editForm.beta_expires_at}
                                onChange={e => setEditForm(f => ({ ...f, beta_expires_at: e.target.value }))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm" />
                            </label>
                          )}
                          {u.id !== me?.id && (
                            <label className="flex items-center gap-2 text-sm self-end pb-1">
                              <input type="checkbox" checked={editForm.is_admin}
                                onChange={e => setEditForm(f => ({ ...f, is_admin: e.target.checked }))}
                                className="rounded border-gray-300 text-rzs-red focus:ring-rzs-red" />
                              Admin
                            </label>
                          )}
                          <button onClick={() => saveEdit(u.id)} disabled={saving === u.id}
                            className="btn-primary text-sm self-end">
                            {saving === u.id ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={() => setExpanded(null)} className="btn-secondary text-sm self-end">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Invites ───────────────────────────────────────────────────────────────

function InvitesTab() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [inviteEmailSent, setInviteEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flash, showFlash] = useFlash();
  const [revoking, setRevoking] = useState(null);

  useEffect(() => { fetchInvites(); }, []);

  async function fetchInvites() {
    try {
      const r = await fetch('/api/admin/invites', { credentials: 'include' });
      if (r.ok) setInvites(await r.json());
    } catch { showFlash('error', 'Failed to load invites'); }
    finally { setLoading(false); }
  }

  async function sendInvite(e) {
    e.preventDefault();
    setSending(true);
    setInviteUrl('');
    setInviteEmailSent(false);
    try {
      const r = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) { showFlash('error', d.error); return; }
      setInviteUrl(d.invite_url || '');
      setInviteEmailSent(d.email_sent === true);
      setEmail('');
      showFlash(
        d.email_sent ? 'success' : 'warning',
        d.email_sent ? `Invite sent to ${email}` : `Invite created — email could not be sent. Copy the link below and share it manually.`
      );
      await fetchInvites();
      setTimeout(() => { setShowForm(false); setInviteUrl(''); setInviteEmailSent(false); }, 30000);
    } catch { showFlash('error', 'Failed to send invite'); }
    finally { setSending(false); }
  }

  async function revokeInvite(id) {
    setRevoking(id);
    try {
      const r = await fetch(`/api/admin/invites/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Invite revoked');
      await fetchInvites();
    } catch { showFlash('error', 'Failed'); }
    finally { setRevoking(null); }
  }

  async function resendInvite(inv) {
    try {
      await revokeInvite(inv.id);
      setEmail(inv.email);
      setShowForm(true);
    } catch { /* already handled */ }
  }

  function copyUrl() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function statusBadge(inv) {
    if (inv.accepted_at) return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Accepted</span>;
    if (new Date(inv.expires_at) < new Date()) return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">Expired</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>;
  }

  const pending  = invites.filter(i => !i.accepted_at && new Date(i.expires_at) >= new Date()).length;
  const accepted = invites.filter(i => i.accepted_at).length;
  const expired  = invites.filter(i => !i.accepted_at && new Date(i.expires_at) < new Date()).length;

  return (
    <div className="space-y-4">
      <Flash flash={flash} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="text-amber-700 font-medium">{pending} pending</span>
          {' · '}
          <span className="text-green-700 font-medium">{accepted} accepted</span>
          {' · '}
          <span className="text-gray-500">{expired} expired</span>
        </p>
        <button onClick={() => { setShowForm(true); setInviteUrl(''); }} className="btn-primary text-sm">+ New invite</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
          <form onSubmit={sendInvite} className="flex gap-3 items-start">
            <div className="flex-1 space-y-1">
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required placeholder="invitee@example.com"
                className="input-field" />
            </div>
            <button type="submit" disabled={sending} className="btn-primary whitespace-nowrap">
              {sending ? 'Sending…' : 'Send invite'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setInviteUrl(''); }}
              className="btn-secondary whitespace-nowrap">Dismiss</button>
          </form>

          {inviteUrl && (
            <div className="space-y-2">
              <p className={`text-xs font-medium ${inviteEmailSent ? 'text-gray-500' : 'text-amber-700'}`}>
                {inviteEmailSent ? 'Invite link (email sent automatically):' : '⚠ Email not sent — copy this link and share it manually:'}
              </p>
              <div className="flex gap-2">
                <input readOnly value={inviteUrl}
                  className="input-field flex-1 text-xs font-mono bg-gray-50" />
                <button onClick={copyUrl} className="btn-secondary text-xs whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? <p className="text-center text-gray-500 text-sm py-6">Loading...</p> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Email', 'Invited by', 'Status', 'Expires', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invites.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-rzs-charcoal">{inv.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{inv.invited_by_email || '—'}</td>
                  <td className="px-4 py-3">{statusBadge(inv)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(inv.expires_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {!inv.accepted_at && (
                        <button onClick={() => resendInvite(inv)}
                          className="text-xs text-blue-600 hover:underline">Resend</button>
                      )}
                      {!inv.accepted_at && (
                        <button onClick={() => revokeInvite(inv.id)} disabled={revoking === inv.id}
                          className="text-xs text-gray-400 hover:text-red-600 disabled:opacity-50">
                          {revoking === inv.id ? '…' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {invites.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No invites sent yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Prompts ───────────────────────────────────────────────────────────────

const DEFERRED_ARTIFACTS = [
  {
    name: '4F Filter Scorecard',
    trigger: 'After Q7 (Yellow Zone)',
    status: 'Active',
    slug: '4f_scorecard',
    template: `4F Deal Filter Scorecard\n\nScores each deal across four criteria:\n  01 FIT — ICP alignment (5 checkpoints)\n  02 FRICTION — Pain depth and urgency (5 checkpoints)\n  03 FUNDING — Budget and path to approval (5 checkpoints)\n  04 FORECAST — Timeline anchored to real date (5 checkpoints)\n\nEach criterion: Pass/Fail + evidence summary + coaching note.\nFinal verdict: STRONG FIT (3-4 Fs pass) | CAUTION (2 Fs) | DISQUALIFY (0-1 Fs)\nNext play recommendation included.`,
  },
  {
    name: 'Mutual Action Plan',
    trigger: 'Green Zone / Q10',
    status: 'Active',
    slug: 'map',
    template: `Mutual Action Plan (MAP)\n\nShared milestone plan from current stage to close:\n  - Company, project, champion, salesperson header\n  - Target close date anchor\n  - 6-10 milestones with:\n      Action | Owner (buyer vs. seller) | Due Date | Status\n  - Status icons: ✓ Complete | → In Progress | ⚠ At Risk | ○ Not Started\n\nCoach note: review at every client touchpoint.\nAuto-populates from conversation data.`,
  },
  {
    name: 'Own the Close™ Scorecard',
    trigger: 'Red Zone / Q20',
    status: 'Active',
    slug: 'otc_scorecard',
    template: `Own the Close™ Scorecard\n\nThree-section closing diagnostic:\n\nSection 1 — Red Zone Deal Scorecard\n  6 criteria scored 1-5:\n    Stakeholder Alignment, ROI & Business Case, Urgency Level,\n    Competitive Positioning, Procurement Readiness, Decision Confidence\n  Total /30 with risk level: CRITICAL RISK | HIGH RISK | DEVELOPING | COMPETITIVE | STRONG / CLOSE\n\nSection 2 — Risk Diagnosis\n  5 direct questions about deal gaps:\n    Biggest risk, avoided conversation, missing stakeholder,\n    unasked question, "if this slips it will be because..."\n\nSection 3 — 72-Hour Action Plan\n  3 actions within 24 hours + 3 actions within 72 hours\n  Each: Action | Owner | Deadline\n\nFinal Declaration: Close or disqualify within 7 | 14 | 30 days.`,
  },
];

function PromptsTab() {
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showNewMode, setShowNewMode] = useState(false);
  const [newMode, setNewMode] = useState({ display_name: '', slug: '', system_prompt: '', max_tokens: 1200, visibility: 'all', icon: '💬' });
  const [deletingModeId, setDeletingModeId] = useState(null);
  const [flash, showFlash] = useFlash();
  const [viewTemplate, setViewTemplate] = useState(null);

  useEffect(() => { fetchModes(); }, []);

  async function fetchModes() {
    try {
      const r = await fetch('/api/admin/modes', { credentials: 'include' });
      if (r.ok) setModes(await r.json());
    } catch { showFlash('error', 'Failed to load modes'); }
    finally { setLoading(false); }
  }

  function openEdit(mode) {
    setEditing(mode.id);
    setEditForm({ display_name: mode.display_name, system_prompt: mode.system_prompt, max_tokens: mode.max_tokens, visibility: mode.visibility || 'all', icon: mode.icon || '💬' });
  }

  async function saveMode(id) {
    if (editForm.max_tokens < 100 || editForm.max_tokens > 4000) {
      showFlash('error', 'max_tokens must be between 100 and 4000');
      return;
    }
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/modes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      if (r.status === 401) {
        showFlash('error', 'Session expired — your changes were NOT saved. Please log out and log back in, then re-enter your changes.');
        return;
      }
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        showFlash('error', d.error || `Save failed (status ${r.status}) — your changes were NOT saved.`);
        return;
      }
      const updated = await r.json();
      setModes(prev => prev.map(m => m.id === id ? updated : m));
      showFlash('success', `Saved at ${new Date(updated.updated_at).toLocaleTimeString()}`);
      setEditing(null);
    } catch { showFlash('error', 'Network error — your changes were NOT saved. Check your connection and try again.'); }
    finally { setSaving(false); }
  }

  async function toggleActive(mode) {
    if (mode.is_active) {
      if (!confirm(`Deactivating ${mode.display_name} will hide it from all users. Continue?`)) return;
    }
    try {
      await fetch(`/api/admin/modes/${mode.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !mode.is_active }),
      });
      await fetchModes();
    } catch { showFlash('error', 'Failed to toggle mode'); }
  }

  async function createMode(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch('/api/admin/modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMode),
      });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'Mode created');
      setShowNewMode(false);
      setNewMode({ display_name: '', slug: '', system_prompt: '', max_tokens: 1200, visibility: 'all', icon: '💬' });
      await fetchModes();
    } catch { showFlash('error', 'Failed to create mode'); }
    finally { setSaving(false); }
  }

  const PROTECTED_SLUGS = ['deal', 'coach', 'mindset'];

  async function deleteMode(mode) {
    if (deletingModeId === mode.id) {
      try {
        const r = await fetch(`/api/admin/modes/${mode.id}`, { method: 'DELETE', credentials: 'include' });
        if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
        showFlash('success', `"${mode.display_name}" deleted`);
        await fetchModes();
      } catch { showFlash('error', 'Delete failed'); }
      finally { setDeletingModeId(null); }
    } else {
      setDeletingModeId(mode.id);
    }
  }

  function autoSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const estTokens = (text) => Math.round((text || '').length / 4);

  return (
    <div className="space-y-8">
      <Flash flash={flash} />

      {/* ── COACHING MODES ────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Coaching Modes</h2>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-medium text-rzs-charcoal text-sm">Coaching modes</h3>
          <button onClick={() => setShowNewMode(v => !v)} className="btn-primary text-sm">+ Add new mode</button>
        </div>

        {loading ? <p className="text-center text-gray-500 text-sm py-6">Loading...</p> : (
          <div className="divide-y divide-gray-100">
            {modes.map(mode => (
              <div key={mode.id}>
                <div className="px-4 py-4 flex items-start gap-4">
                  <div className="text-xl flex-shrink-0">{mode.icon || '💬'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-rzs-charcoal text-sm">{mode.display_name}</p>
                      {mode.visibility === 'beta' && (
                        <span className="text-[10px] font-semibold bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">BETA</span>
                      )}
                      {mode.visibility === 'admin' && (
                        <span className="text-[10px] font-semibold bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">ADMIN</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      slug: {mode.slug} · ~{estTokens(mode.system_prompt).toLocaleString()} prompt tokens
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Last saved: {mode.updated_at ? new Date(mode.updated_at).toLocaleString() : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActive(mode)}
                      className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                        mode.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {mode.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => editing === mode.id ? setEditing(null) : openEdit(mode)}
                      className="text-sm text-rzs-red hover:underline"
                    >
                      {editing === mode.id ? 'Cancel' : 'Edit prompt'}
                    </button>
                    {!PROTECTED_SLUGS.includes(mode.slug) && (
                      <button
                        onClick={() => deleteMode(mode)}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${
                          deletingModeId === mode.id
                            ? 'bg-red-600 text-white'
                            : 'text-red-400 hover:text-red-600'
                        }`}
                        title={deletingModeId === mode.id ? 'Click again to confirm permanent delete' : 'Delete this mode'}
                      >
                        {deletingModeId === mode.id ? 'Confirm delete?' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>

                {editing === mode.id && (
                  <div className="px-4 pb-4 space-y-3 bg-gray-50">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Display name</label>
                        <input type="text" value={editForm.display_name}
                          onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))}
                          className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon (emoji)</label>
                        <input type="text" value={editForm.icon}
                          onChange={e => setEditForm(f => ({ ...f, icon: e.target.value }))}
                          className="input-field" maxLength={4} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Visibility</label>
                      <select value={editForm.visibility}
                        onChange={e => setEditForm(f => ({ ...f, visibility: e.target.value }))}
                        className="input-field">
                        <option value="all">All users</option>
                        <option value="beta">Beta users only</option>
                        <option value="admin">Admin only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        System prompt
                        <span className="ml-2 text-gray-400 font-normal">
                          ~{estTokens(editForm.system_prompt).toLocaleString()} tokens estimated
                          {estTokens(editForm.system_prompt) > 1500 && (
                            <span className="text-amber-600 ml-1">— Long prompt, watch context window</span>
                          )}
                        </span>
                      </label>
                      <textarea
                        value={editForm.system_prompt}
                        onChange={e => setEditForm(f => ({ ...f, system_prompt: e.target.value }))}
                        rows={14} className="input-field font-mono text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max tokens (100–4000)</label>
                      <input type="number" min={100} max={4000} value={editForm.max_tokens}
                        onChange={e => setEditForm(f => ({ ...f, max_tokens: parseInt(e.target.value) }))}
                        className="input-field w-28" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => saveMode(mode.id)} disabled={saving} className="btn-primary text-sm">
                        {saving ? 'Saving…' : 'Save changes'}
                      </button>
                      <button onClick={() => setEditing(null)} className="btn-secondary text-sm">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showNewMode && (
          <form onSubmit={createMode} className="border-t border-gray-200 px-4 py-4 space-y-3 bg-blue-50">
            <p className="text-sm font-medium text-rzs-charcoal">New mode</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Display name</label>
                <input type="text" required value={newMode.display_name}
                  onChange={e => setNewMode(f => ({ ...f, display_name: e.target.value, slug: autoSlug(e.target.value) }))}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icon (emoji)</label>
                <input type="text" value={newMode.icon}
                  onChange={e => setNewMode(f => ({ ...f, icon: e.target.value }))}
                  className="input-field" maxLength={4} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug (auto-generated, editable)</label>
                <input type="text" required value={newMode.slug}
                  onChange={e => setNewMode(f => ({ ...f, slug: e.target.value }))}
                  pattern="[a-z0-9-]+" title="Lowercase letters, numbers, hyphens only"
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Visibility</label>
                <select value={newMode.visibility}
                  onChange={e => setNewMode(f => ({ ...f, visibility: e.target.value }))}
                  className="input-field">
                  <option value="all">All users</option>
                  <option value="beta">Beta users only</option>
                  <option value="admin">Admin only</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">System prompt</label>
              <textarea required value={newMode.system_prompt}
                onChange={e => setNewMode(f => ({ ...f, system_prompt: e.target.value }))}
                rows={8} className="input-field font-mono text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max tokens</label>
              <input type="number" min={100} max={4000} value={newMode.max_tokens}
                onChange={e => setNewMode(f => ({ ...f, max_tokens: parseInt(e.target.value) }))}
                className="input-field w-28" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Creating…' : 'Create mode'}</button>
              <button type="button" onClick={() => setShowNewMode(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}
      </div>
      </section>

      {/* ── RESOURCE CENTER ───────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Resource Center</h2>
        <ResourceCenterManager />
      </section>

      {/* ── ARTIFACTS ────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Artifacts</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-medium text-rzs-charcoal text-sm">Structured artifacts</h3>
          </div>
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                {['Artifact', 'Trigger', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEFERRED_ARTIFACTS.map(a => (
                <tr key={a.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-rzs-charcoal">{a.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.trigger}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setViewTemplate(a)}
                      className="text-xs text-rzs-red hover:underline">View template</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CUSTOM TOOLS ─────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Custom Tools</h2>
        <ToolBuilderTab />
      </section>

      {viewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-rzs-charcoal">{viewTemplate.name}</h3>
              <button onClick={() => setViewTemplate(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-rzs-charcoal whitespace-pre-wrap leading-relaxed">
              {viewTemplate.template}
            </div>
            <p className="mt-3 text-xs text-gray-500">Generated dynamically by Claude Sonnet using deal context and conversation history.</p>
            <button onClick={() => setViewTemplate(null)}
              className="mt-4 w-full py-2 bg-rzs-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Resource Center Manager ─────────────────────────────────────────────────

const RC_CODE_COLORS = {
  yellow: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  green:  'bg-green-50 text-green-800 border border-green-200',
  red:    'bg-red-50 text-red-800 border border-red-200',
  bonus:  'bg-purple-50 text-purple-800 border border-purple-200',
};

const RC_ZONE_LABELS = {
  yellow: '🟡 Yellow Zone',
  green:  '🟢 Green Zone',
  red:    '🔴 Red Zone',
  bonus:  '🏈 Bonus Plays',
};

function ResourceCenterManager() {
  const [tools, setTools] = useState({ yellow: [], green: [], red: [], bonus: [] });
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({});
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ code: '', name: '', description: '', zone: 'yellow', url: '' });
  const [addError, setAddError] = useState('');
  const [flash, showFlash] = useFlash();

  const totalActive = Object.values(tools).flat().filter(t => t.is_active).length;

  function load() {
    setLoading(true);
    fetch('/api/admin/resource-center', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Server error')))
      .then(data => {
        if (data && typeof data === 'object' && !Array.isArray(data) && !data.error) {
          setTools(data);
        }
      })
      .catch(() => showFlash('error', 'Failed to load Resource Center'))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openEdit(t) {
    setEditId(t.id);
    setEditForm({ name: t.name, description: t.description || '', url: t.url || '', code: t.code, sort_order: t.sort_order });
    setEditError('');
  }

  async function saveEdit(id) {
    setSaving(true);
    setEditError('');
    try {
      const r = await fetch(`/api/admin/resource-center/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      if (!r.ok) { setEditError((await r.json()).error || 'Save failed'); return; }
      setEditId(null);
      showFlash('success', 'Tool saved');
      load();
    } catch { setEditError('Save failed'); }
    finally { setSaving(false); }
  }

  async function toggle(t) {
    try {
      const r = await fetch(`/api/admin/resource-center/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !t.is_active }),
      });
      if (!r.ok) throw new Error();
      load();
    } catch { showFlash('error', 'Toggle failed'); }
  }

  async function addTool() {
    setAddError('');
    if (!addForm.code || !addForm.name || !addForm.zone) { setAddError('Code, name, and zone are required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/admin/resource-center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addForm),
      });
      if (!r.ok) { setAddError((await r.json()).error || 'Add failed'); return; }
      setShowAdd(false);
      setAddForm({ code: '', name: '', description: '', zone: 'yellow', url: '' });
      showFlash('success', 'Tool added');
      load();
    } catch { setAddError('Add failed'); }
    finally { setSaving(false); }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Flash flash={flash} />
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="font-medium text-rzs-charcoal text-sm">
          Resource Center — <span className="text-gray-500">{loading ? '…' : `${totalActive} tools active`}</span>
        </h3>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-3 py-1.5 bg-rzs-red text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          + Add tool
        </button>
      </div>

      {showAdd && (
        <div className="px-4 py-4 border-b border-gray-100 bg-blue-50 space-y-3">
          <p className="text-xs font-medium text-rzs-charcoal">New tool</p>
          {addError && <p className="text-xs text-red-600">{addError}</p>}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Code *</label>
              <input value={addForm.code} onChange={e => setAddForm(f => ({ ...f, code: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Y8" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Zone *</label>
              <select value={addForm.zone} onChange={e => setAddForm(f => ({ ...f, zone: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="bonus">Bonus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name *</label>
              <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Tool name" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Brief description" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">URL</label>
            <input value={addForm.url} onChange={e => setAddForm(f => ({ ...f, url: e.target.value }))}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="https://docs.google.com/..." />
          </div>
          <div className="flex gap-2">
            <button onClick={addTool} disabled={saving}
              className="px-3 py-1.5 bg-rzs-red text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {saving ? 'Adding…' : 'Add tool'}
            </button>
            <button onClick={() => { setShowAdd(false); setAddError(''); }}
              className="px-3 py-1.5 border border-gray-200 text-xs rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="px-4 py-6 text-sm text-gray-400 text-center">Loading…</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {Object.entries(RC_ZONE_LABELS).map(([zone, label]) => {
            const zoneTools = tools[zone] || [];
            const isCollapsed = collapsed[zone];
            return (
              <div key={zone}>
                <button
                  onClick={() => setCollapsed(prev => ({ ...prev, [zone]: !prev[zone] }))}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-rzs-charcoal">
                    {label} <span className="text-gray-400 font-normal">({zoneTools.length})</span>
                  </span>
                  <span className="text-gray-400 text-xs">{isCollapsed ? '▶' : '▼'}</span>
                </button>

                {!isCollapsed && (
                  <div className="divide-y divide-gray-50">
                    {zoneTools.map(t => (
                      <div key={t.id}>
                        {editId === t.id ? (
                          <div className="px-4 py-3 bg-gray-50 space-y-2">
                            {editError && <p className="text-xs text-red-600">{editError}</p>}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Code</label>
                                <input value={editForm.code} onChange={e => setEditForm(f => ({ ...f, code: e.target.value }))}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                                <p className="text-xs text-amber-500 mt-0.5">Changing the code may affect system prompt references</p>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Sort order</label>
                                <input type="number" value={editForm.sort_order} onChange={e => setEditForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Name</label>
                              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Description</label>
                              <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL</label>
                              <input value={editForm.url} onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))}
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="https://docs.google.com/..." />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(t.id)} disabled={saving}
                                className="px-3 py-1.5 bg-rzs-red text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                                {saving ? 'Saving…' : 'Save'}
                              </button>
                              <button onClick={() => setEditId(null)}
                                className="px-3 py-1.5 border border-gray-200 text-xs rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                            <span className={`px-1.5 py-0.5 text-xs font-mono font-medium rounded flex-shrink-0 mt-0.5 ${RC_CODE_COLORS[zone]}`}>
                              {t.code}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold ${t.is_active ? 'text-rzs-charcoal' : 'text-gray-400 line-through'}`}>{t.name}</p>
                              <p className="text-xs text-gray-400 truncate">{t.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {t.url ? (
                                <a href={t.url} target="_blank" rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-rzs-red transition-colors" title="Open link">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-xs text-amber-500 font-medium">No link</span>
                              )}
                              <button onClick={() => openEdit(t)}
                                className="text-xs text-rzs-red hover:underline">Edit</button>
                              <button
                                onClick={() => toggle(t)}
                                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${t.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                                title={t.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                              >
                                <span className={`inline-block h-3 w-3 rounded-full bg-white transform transition-transform ${t.is_active ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── System ────────────────────────────────────────────────────────────────

function SystemTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flash, showFlash] = useFlash();
  const [flushConfirm, setFlushConfirm] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [backupBusy, setBackupBusy] = useState(false);

  useEffect(() => { fetchSystem(); }, []);

  async function fetchSystem() {
    setLoading(true);
    const t0 = performance.now();
    try {
      const r = await fetch('/api/admin/system', { credentials: 'include' });
      const d = await r.json();
      d._api_ms = Math.round(performance.now() - t0);
      setData(d);
    } catch { showFlash('error', 'Failed to load system status'); }
    finally { setLoading(false); }
  }

  async function flushSessions() {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/sessions', { method: 'DELETE', credentials: 'include' });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      showFlash('success', 'All sessions flushed — users will need to re-login');
      setFlushConfirm(false);
    } catch { showFlash('error', 'Failed to flush sessions'); }
    finally { setBusy(false); }
  }

  async function runBackupNow() {
    setBackupBusy(true);
    try {
      const r = await fetch('/api/admin/backup/run', { method: 'POST', credentials: 'include' });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error || 'Backup failed'); return; }
      showFlash('success', 'Backup started — results will be emailed to vince@vincebeese.com in ~30 seconds');
    } catch { showFlash('error', 'Failed to trigger backup'); }
    finally { setBackupBusy(false); }
  }

  async function resetBeta() {
    if (resetInput !== 'RESET BETA') return;
    setBusy(true);
    try {
      const r = await fetch('/api/admin/beta-flags', { method: 'DELETE', credentials: 'include' });
      if (!r.ok) { const d = await r.json(); showFlash('error', d.error); return; }
      const d = await r.json();
      showFlash('success', `Beta flags reset — ${d.updated} users affected`);
      setResetInput('');
    } catch { showFlash('error', 'Failed to reset beta flags'); }
    finally { setBusy(false); }
  }

  function Dot({ status }) {
    const colors = { ok: 'bg-green-500', error: 'bg-red-500', test_mode: 'bg-amber-400', not_configured: 'bg-gray-300' };
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-gray-400'} mr-2`} />;
  }

  function fmtTokens(n) {
    if (!n) return '0';
    return n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(n);
  }

  return (
    <div className="space-y-6">
      <Flash flash={flash} />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-medium text-rzs-charcoal text-sm">Service status</h3>
          <button onClick={fetchSystem} className="text-xs text-rzs-red hover:underline">Refresh</button>
        </div>

        {loading ? <p className="text-center text-gray-500 text-sm py-6">Loading...</p> : (
          <div className="divide-y divide-gray-100">
            {[
              {
                name: 'API server',
                status: 'ok',
                detail: `Responding · ${data?._api_ms}ms`,
              },
              {
                name: 'Neon database',
                status: data?.database?.status,
                detail: data?.database?.status === 'ok'
                  ? `Connected · ${data.database.latency_ms}ms`
                  : 'Connection failed',
              },
              {
                name: 'Anthropic API',
                status: data?.anthropic?.status,
                detail: data?.anthropic?.status === 'ok'
                  ? `Reachable · ${data.anthropic.model}`
                  : data?.anthropic?.status === 'not_configured'
                  ? 'API key not configured'
                  : 'API key invalid or unreachable',
              },
              {
                name: 'Stripe',
                status: data?.stripe?.status,
                detail: data?.stripe?.status === 'ok' ? 'Connected · live mode'
                  : data?.stripe?.status === 'test_mode' ? 'Connected · test mode'
                  : data?.stripe?.status === 'not_configured' ? 'Secret key not configured'
                  : 'Unreachable',
              },
              {
                name: 'SSE streaming',
                status: 'ok',
                detail: `Active · ${data?.active_connections ?? 0} open connection${data?.active_connections === 1 ? '' : 's'}`,
              },
            ].map(svc => (
              <div key={svc.name} className="px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-rzs-charcoal flex items-center">
                  <Dot status={svc.status} />
                  {svc.name}
                </p>
                <p className="text-sm text-gray-500">{svc.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-rzs-charcoal text-sm">API spend — this month</h3>
        </div>
        {loading ? <p className="text-center text-gray-500 text-sm py-6">Loading...</p> : (
          <>
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Model', 'Calls', 'Tokens in', 'Tokens out', 'Est. cost'].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.spend?.rows || []).map(row => (
                  <tr key={row.model} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-rzs-charcoal">{row.model}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.call_count}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtTokens(row.tokens_in)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtTokens(row.tokens_out)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">${parseFloat(row.est_cost || 0).toFixed(4)}</td>
                  </tr>
                ))}
                {data?.spend?.rows?.length > 0 && (
                  <tr className="font-semibold bg-gray-50">
                    <td className="px-4 py-3 text-sm">Total</td>
                    <td colSpan={3} />
                    <td className="px-4 py-3 text-sm">${(data?.spend?.total_cost || 0).toFixed(4)}</td>
                  </tr>
                )}
                {!data?.spend?.rows?.length && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">No spend recorded yet</td></tr>
                )}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
              Estimates based on public Anthropic pricing. Verify against your Anthropic dashboard.
            </p>
          </>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-rzs-charcoal text-sm">Database backup</h3>
        </div>
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rzs-charcoal">Run backup now</p>
            <p className="text-xs text-gray-500 mt-0.5">Exports all 17 tables and emails CSVs to vince@vincebeese.com. Normally runs automatically every Sunday at midnight UTC.</p>
          </div>
          <button onClick={runBackupNow} disabled={backupBusy}
            className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
            {backupBusy ? 'Starting…' : 'Run backup'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-rzs-charcoal text-sm">Danger zone</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rzs-charcoal">Flush all active sessions</p>
              <p className="text-xs text-gray-500 mt-0.5">Forces all users to re-authenticate on their next request</p>
            </div>
            {flushConfirm ? (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-600">Are you sure?</span>
                <button onClick={flushSessions} disabled={busy}
                  className="btn-primary text-sm bg-red-600 hover:bg-red-700">Confirm flush</button>
                <button onClick={() => setFlushConfirm(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setFlushConfirm(true)} className="btn-secondary text-sm">Flush sessions</button>
            )}
          </div>

          <div className="px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-700">Reset all beta flags</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Revokes beta access for all non-admin users. Use before launch to force subscription gate.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <input
                  type="text" value={resetInput}
                  onChange={e => setResetInput(e.target.value)}
                  placeholder='Type "RESET BETA" to confirm'
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56"
                />
                <button
                  onClick={resetBeta}
                  disabled={resetInput !== 'RESET BETA' || busy}
                  className="border border-red-400 text-red-600 hover:bg-red-50 text-sm px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {busy ? 'Resetting…' : 'Reset beta flags'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
