import { useState } from 'react';

const RZS_RED    = '#C62828';
const CHARCOAL   = '#212121';
const SLATE      = '#757575';

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

function Field({ label, id, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: 'block', fontFamily: 'Arial, sans-serif', fontSize: 13, fontWeight: 700, color: CHARCOAL, marginBottom: 4 }}>
        {label} <span style={{ color: RZS_RED }}>*</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 12px',
          fontFamily: 'Arial, sans-serif',
          fontSize: 14,
          border: `1px solid ${error ? RZS_RED : '#ccc'}`,
          borderRadius: 0,
          outline: 'none',
          color: CHARCOAL,
        }}
      />
      {error && <p style={{ margin: '4px 0 0', fontFamily: 'Arial, sans-serif', fontSize: 12, color: RZS_RED }}>{error}</p>}
    </div>
  );
}

function validate({ firstName, lastName, company, email, linkedinUrl }) {
  const errors = {};
  if (!firstName.trim())                                        errors.firstName   = 'First name is required.';
  if (!lastName.trim())                                         errors.lastName    = 'Last name is required.';
  if (!company.trim())                                          errors.company     = 'Company is required.';
  if (!email.trim())                                            errors.email       = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))          errors.email       = 'Enter a valid email address.';
  if (!linkedinUrl.trim())                                      errors.linkedinUrl = 'LinkedIn URL is required.';
  else if (!/^(https?:\/\/)?(www\.)?linkedin\.com\//i.test(linkedinUrl))
                                                                errors.linkedinUrl = 'URL must begin with linkedin.com or www.linkedin.com.';
  return errors;
}

export default function Whitepaper() {
  const [form, setForm] = useState({ firstName: '', lastName: '', company: '', email: '', linkedinUrl: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'submitting' | 'success' | 'error'

  function set(field) { return val => setForm(f => ({ ...f, [field]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch(`${BASE_URL}/api/hubspot/whitepaper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error('Server error');
    } catch {
      // Per spec: always trigger download even if HubSpot fails
    }

    // Trigger PDF download regardless of HubSpot outcome
    const a = document.createElement('a');
    a.href = `${BASE_URL}/RZS_Scale_or_Transform.pdf`;
    a.download = 'RZS_Scale_or_Transform.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setStatus('success');
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#fff', padding: '20px 24px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <img src={`${BASE_URL}/logo.png`} alt="Red Zone Selling" style={{ height: 48 }} />
        </div>
        <div style={{ borderTop: `3px solid ${RZS_RED}`, marginTop: 16 }} />
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: CHARCOAL, padding: '56px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#fff', marginTop: 0, marginBottom: 16, lineHeight: 1.25 }}>
            Scale or Transform: Why Your Sales System Has to Come First
          </h1>
          <h2 style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: RZS_RED, marginTop: 0, marginBottom: 20, lineHeight: 1.35 }}>
            How to stop depending on top performers and build a sales org that elevates everyone
          </h2>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 15, color: SLATE, margin: 0 }}>
            A free framework for founders and sales leaders — download your copy below
          </p>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#fff', border: '1px solid #e0e0e0', padding: '36px 32px' }}>
          <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 18, fontWeight: 700, color: CHARCOAL, marginTop: 0, marginBottom: 24 }}>
            Download the Framework
          </h3>

          {status === 'success' && (
            <div style={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 0, padding: '12px 16px', marginBottom: 20, fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#2E7D32', fontWeight: 600 }}>
              Your download is starting. Check your downloads folder.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field label="First Name"   id="firstName"   value={form.firstName}   onChange={set('firstName')}   error={errors.firstName} />
            <Field label="Last Name"    id="lastName"    value={form.lastName}    onChange={set('lastName')}    error={errors.lastName} />
            <Field label="Company"      id="company"     value={form.company}     onChange={set('company')}     error={errors.company} />
            <Field label="Email"        id="email"       type="email" value={form.email} onChange={set('email')} error={errors.email} />
            <Field label="LinkedIn URL" id="linkedinUrl" value={form.linkedinUrl} onChange={set('linkedinUrl')} error={errors.linkedinUrl} placeholder="https://linkedin.com/in/yourname" />

            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 0',
                backgroundColor: status === 'submitting' ? '#B71C1C' : RZS_RED,
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                borderRadius: 0,
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                marginTop: 8,
              }}
              onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.backgroundColor = '#B71C1C'; }}
              onMouseLeave={e => { if (status !== 'submitting') e.currentTarget.style.backgroundColor = RZS_RED; }}
            >
              {status === 'submitting' ? 'Submitting…' : 'Download the Framework'}
            </button>
          </form>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ backgroundColor: '#F5F5F5', padding: '56px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          {[
            {
              quote: 'Vince ran an interactive workshop with our team that provided actionable plays we could use immediately. The team left motivated and more importantly, armed with new tools to close deals.',
              name: 'Joe Twer',
              title: 'Global VP of Sales',
              company: 'BlueSnap',
            },
            {
              quote: 'I\'ve worked with a lot of sales trainers and coaches over the years. Vince is different. He combines real enterprise sales experience with a practical framework that actually sticks.',
              name: 'Chris Schwartz',
              title: 'CRO',
              company: 'Trackforce',
            },
            {
              quote: 'Vince didn\'t just fix our sales motion — he changed how we think about selling.',
              name: 'Keith Pepper',
              title: 'Publisher',
              company: 'Rough Draft Atlanta',
            },
          ].map(({ quote, name, title, company }) => (
            <div key={name} style={{ backgroundColor: '#fff', padding: '28px 24px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 48, fontWeight: 700, color: RZS_RED, lineHeight: 1, marginBottom: 8 }}>&ldquo;</div>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: CHARCOAL, fontStyle: 'italic', lineHeight: 1.65, marginTop: 0, marginBottom: 16 }}>
                {quote}
              </p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: SLATE, margin: 0 }}>
                <strong style={{ color: CHARCOAL }}>{name}</strong> | {title} | {company}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: CHARCOAL, padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>REDZONESELLING.CO</p>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: SLATE, margin: 0 }}>© 2026 Red Zone Selling™</p>
      </footer>

    </div>
  );
}
