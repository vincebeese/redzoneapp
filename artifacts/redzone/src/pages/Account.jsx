import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatCurrency(val) {
  if (!val) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

function formatRelativeTime(str) {
  if (!str) return '';
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ZONE_STYLES = {
  yellow: 'bg-amber-100 text-amber-800',
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
};

function ZoneBadge({ zone }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${ZONE_STYLES[zone] || 'bg-gray-100 text-gray-600'}`}>
      {zone}
    </span>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 90 ? '#dc2626' : pct >= 70 ? '#f59e0b' : '#C62828';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function Account() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [portalError, setPortalError] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const showSuccess = useCallback((msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setDisplayName(data.display_name || '');
        setUsage(data.usage);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function saveName() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ display_name: displayName }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to save');
      setUser((u) => ({ ...u, display_name: data.display_name }));
      setEditingName(false);
      showSuccess('Saved');
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function savePassword() {
    setError(null);
    if (passwordForm.next !== passwordForm.confirm) {
      return setError('New passwords do not match');
    }
    setSaving(true);
    try {
      const res = await fetch('/api/users/me/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current_password: passwordForm.current, new_password: passwordForm.next }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to change password');
      setShowPasswordForm(false);
      setPasswordForm({ current: '', next: '', confirm: '' });
      showSuccess('Password updated');
    } catch {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        setPortalError(data.error || 'No billing account found');
      } else {
        window.open(data.url, '_blank');
      }
    } catch {
      setPortalError('Could not open billing portal');
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleSignOut() {
    await logout();
    navigate('/login');
  }

  async function handleDeleteAccount() {
    if (deleteInput !== 'DELETE') return;
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ confirm: 'DELETE' }),
      });
      if (res.ok) {
        await logout();
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete account');
      }
    } catch {
      setError('Failed to delete account');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-rzs-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initial = (user?.display_name || user?.email || '?')[0].toUpperCase();
  const activeDeals = usage?.active_deals ?? 0;
  const totalSlots = usage?.total_deal_slots ?? 10;
  const showBillingRow = user?.subscription_status === 'active' || !user?.has_beta_access;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2">
          {success}
        </div>
      )}

      {/* SECTION 1 — Profile */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-rzs-charcoal">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: '#C62828' }}>
            {initial}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex gap-2 flex-wrap">
              {user?.is_admin && (
                <span className="text-xs px-2 py-0.5 bg-rzs-red text-white rounded-full font-medium">Admin</span>
              )}
              {user?.has_beta_access && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">Beta</span>
              )}
            </div>
          </div>
        </div>

        {/* Display name */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rzs-charcoal">Display name</p>
              {!editingName && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {user?.display_name || <span className="italic text-gray-400">Not set</span>}
                </p>
              )}
            </div>
            {!editingName && (
              <button onClick={() => setEditingName(true)} className="text-sm text-rzs-red hover:underline">
                Edit
              </button>
            )}
          </div>
          {editingName && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="input-field w-full text-sm"
                placeholder="Your name"
                autoFocus
              />
              {error && <p className="text-xs" style={{ color: '#C62828' }}>{error}</p>}
              <div className="flex gap-2">
                <button onClick={saveName} disabled={saving} className="btn-primary text-sm py-1.5 px-4">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setEditingName(false); setError(null); setDisplayName(user?.display_name || ''); }}
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rzs-charcoal">Password</p>
              {!showPasswordForm && <p className="text-sm text-gray-400 mt-0.5 tracking-widest">••••••••</p>}
            </div>
            {!showPasswordForm && (
              <button onClick={() => setShowPasswordForm(true)} className="text-sm text-rzs-red hover:underline">
                Change password
              </button>
            )}
          </div>
          {showPasswordForm && (
            <div className="mt-3 space-y-2">
              <input
                type="password"
                placeholder="Current password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                className="input-field w-full text-sm"
              />
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={passwordForm.next}
                onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
                className="input-field w-full text-sm"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                className="input-field w-full text-sm"
              />
              {error && <p className="text-xs" style={{ color: '#C62828' }}>{error}</p>}
              <div className="flex gap-2">
                <button onClick={savePassword} disabled={saving} className="btn-primary text-sm py-1.5 px-4">
                  {saving ? 'Saving...' : 'Update password'}
                </button>
                <button onClick={() => { setShowPasswordForm(false); setError(null); setPasswordForm({ current: '', next: '', confirm: '' }); }}
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2 — Subscription */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-rzs-charcoal">Subscription</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Status</span>
            {user?.has_beta_access ? (
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Beta Access</span>
            ) : user?.subscription_status === 'active' ? (
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
            ) : (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Inactive</span>
            )}
          </div>

          {user?.has_beta_access && user?.beta_expires_at && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Beta expires</span>
              <span className="text-rzs-charcoal font-medium">{formatDate(user.beta_expires_at)}</span>
            </div>
          )}

          {user?.has_beta_access && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Plan after beta</span>
              <span className="text-gray-400">Individual - $39/mo</span>
            </div>
          )}

          {showBillingRow && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-500">Billing</span>
              {portalError ? (
                <span className="text-xs text-gray-400">{portalError}</span>
              ) : (
                <button onClick={openPortal} disabled={portalLoading} className="text-sm text-rzs-red hover:underline">
                  {portalLoading ? 'Loading...' : 'Manage billing'}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 — Usage */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-rzs-charcoal">Usage</h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Active deals', value: activeDeals },
            { label: 'Deal slots', value: totalSlots },
            { label: 'Coaching turns', value: usage?.total_turns ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-rzs-charcoal">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deal slots used</span>
            <span className="font-medium text-rzs-charcoal">{activeDeals} / {totalSlots}</span>
          </div>
          <ProgressBar value={activeDeals} max={totalSlots} />
          <p className="text-xs text-gray-400">
            {activeDeals >= totalSlots
              ? "You've reached your deal limit. Archive a deal to create a new one."
              : 'Archive a deal to free up a slot once you reach 10 active deals.'}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-rzs-charcoal mb-3">My deals</p>
          {!usage?.deals?.length ? (
            <p className="text-sm text-gray-400">No deals yet - create your first deal in Deal Mode.</p>
          ) : (
            <div className="space-y-1">
              {usage.deals.map((deal) => (
                <button
                  key={deal.id}
                  onClick={() => navigate(`/deals/${deal.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <ZoneBadge zone={deal.zone} />
                  <span className="flex-1 text-sm font-medium text-rzs-charcoal truncate">{deal.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatCurrency(deal.deal_value)}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">Turn {deal.turn_count}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(deal.updated_at)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 — Danger Zone */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-rzs-charcoal">Account</h2>

        {/* Sign out */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rzs-charcoal">Sign out</p>
            <p className="text-xs text-gray-400">End your current session</p>
          </div>
          <button onClick={handleSignOut} className="btn-secondary text-sm py-1.5 px-4">
            Sign out
          </button>
        </div>

        {/* Delete account */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: '#C62828' }}>Delete account</p>
              <p className="text-xs text-gray-400 mt-0.5 max-w-xs">
                Permanently deletes your account, all deals, and coaching history. This cannot be undone.
              </p>
            </div>
            {!showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-shrink-0 text-sm border rounded-lg px-4 py-1.5 transition-colors hover:bg-red-50"
                style={{ borderColor: '#C62828', color: '#C62828' }}
              >
                Delete account
              </button>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">Type <strong>DELETE</strong> to confirm</p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="input-field w-full text-sm"
                placeholder="DELETE"
                autoFocus
              />
              {error && <p className="text-xs" style={{ color: '#C62828' }}>{error}</p>}
              <div className="flex gap-3 items-center">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== 'DELETE' || saving}
                  className="text-sm px-4 py-1.5 rounded-lg font-medium text-white transition-colors disabled:opacity-40"
                  style={{ backgroundColor: '#C62828' }}
                >
                  {saving ? 'Deleting...' : 'Confirm delete'}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); setError(null); }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 pb-4">REDZONESELLING.CO</footer>
    </div>
  );
}
