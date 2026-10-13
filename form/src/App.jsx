import { useState } from 'react'
import './App.css'

// Replace this value with the recipient's country code and phone number.
const WHATSAPP_RECIPIENT = '91 6378934458'

const initialForm = {
  fullName: '',
  mobileNumber: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  purpose: '',
  message: '',
}

const purposes = [
  'General enquiry',
  'Request a callback',
  'Product or service information',
  'Support',
  'Partnership',
  'Other',
]

function getLocalDateString() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function WhatsAppIcon({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M16.04 3C8.87 3 3.04 8.81 3.04 15.97c0 2.29.61 4.53 1.77 6.51L3 29l6.7-1.75a13.1 13.1 0 0 0 6.34 1.62h.01c7.17 0 13-5.82 13-12.98A12.9 12.9 0 0 0 25.23 6.7 12.9 12.9 0 0 0 16.04 3Zm.01 23.66h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-3.98 1.04 1.06-3.87-.26-.42a10.7 10.7 0 0 1-1.65-5.7c0-5.93 4.84-10.75 10.8-10.75 2.88 0 5.59 1.12 7.62 3.15a10.65 10.65 0 0 1 3.16 7.6c0 5.92-4.84 10.74-10.84 10.74Zm5.93-8.05c-.32-.16-1.9-.93-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.83 1.04-1.02 1.25-.19.22-.38.24-.7.08-.33-.16-1.37-.5-2.61-1.6-.97-.86-1.62-1.92-1.81-2.25-.19-.32-.02-.5.14-.66.14-.14.33-.38.49-.57.16-.19.22-.32.33-.54.1-.22.05-.4-.03-.57-.08-.16-.73-1.74-1-2.38-.26-.62-.53-.53-.73-.54h-.62c-.21 0-.56.08-.86.4-.3.33-1.13 1.1-1.13 2.67 0 1.58 1.16 3.1 1.32 3.31.16.22 2.28 3.46 5.52 4.85.77.33 1.37.53 1.83.68.77.24 1.47.21 2.03.13.62-.1 1.9-.78 2.17-1.53.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.62-.38Z" />
    </svg>
  )
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    setStatus('')
  }

  function validateForm() {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Enter your full name.'
    }

    const mobileDigits = form.mobileNumber.replace(/\D/g, '')
    if (!form.mobileNumber.trim()) {
      nextErrors.mobileNumber = 'Enter your mobile number.'
    } else if (
      !/^[\d+\s().-]+$/.test(form.mobileNumber.trim())
      || mobileDigits.length < 7
      || mobileDigits.length > 15
    ) {
      nextErrors.mobileNumber = 'Enter a valid number with 7 to 15 digits.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!form.dateOfBirth) {
      nextErrors.dateOfBirth = 'Select your date of birth.'
    } else if (form.dateOfBirth > getLocalDateString()) {
      nextErrors.dateOfBirth = 'Date of birth cannot be in the future.'
    }

    if (!form.gender) nextErrors.gender = 'Select a gender.'
    if (!form.address.trim()) nextErrors.address = 'Enter your address.'
    if (!form.city.trim()) nextErrors.city = 'Enter your city.'
    if (!form.state.trim()) nextErrors.state = 'Enter your state.'
    if (!form.purpose) nextErrors.purpose = 'Select a purpose.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStatus('')

    if (!validateForm()) {
      setStatus('Please correct the highlighted fields and try again.')
      return
    }

    const dateOfBirth = form.dateOfBirth.split('-').reverse().join('/')
    const whatsappMessage = [
      'Hello, I have received a new form submission.',
      '',
      `Full Name: ${form.fullName.trim()}`,
      `Mobile Number: ${form.mobileNumber.trim()}`,
      `Email: ${form.email.trim()}`,
      `Date of Birth: ${dateOfBirth}`,
      `Gender: ${form.gender}`,
      `Address: ${form.address.trim()}`,
      `City: ${form.city.trim()}`,
      `State: ${form.state.trim()}`,
      `Purpose: ${form.purpose}`,
      `Additional Information: ${form.message.trim() || 'None'}`,
    ].join('\n')

    const whatsappUrl = `https://wa.me/${WHATSAPP_RECIPIENT}?text=${encodeURIComponent(whatsappMessage)}`
    const whatsappWindow = window.open(whatsappUrl, '_blank')

    if (whatsappWindow) {
      whatsappWindow.opener = null
      setStatus('WhatsApp opened with your message. Review it there and send when ready.')
    } else {
      setStatus('Your browser blocked the WhatsApp window. Allow pop-ups and try again.')
    }
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section className="form-card" aria-labelledby="form-title">
        <header className="form-header">
          <div className="brand-mark">
            <WhatsAppIcon className="brand-icon" />
          </div>
          <p className="eyebrow">LET&apos;S GET TO KNOW YOU</p>
          <h1 id="form-title">Information Collection Form</h1>
          <p className="intro">
            Share a few details and we&apos;ll be in touch with you soon.
          </p>
        </header>

        <form className="information-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field field-wide">
              <label htmlFor="fullName">Full name <span>*</span></label>
              <input
                autoComplete="name"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                placeholder="e.g. Alex Morgan"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && <p className="field-error" id="fullName-error">{errors.fullName}</p>}
            </div>

            <div className="field">
              <label htmlFor="mobileNumber">Mobile number <span>*</span></label>
              <input
                autoComplete="tel"
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={updateField}
                placeholder="+91 6378934458"
                aria-invalid={Boolean(errors.mobileNumber)}
                aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
              />
              {errors.mobileNumber && <p className="field-error" id="mobileNumber-error">{errors.mobileNumber}</p>}
            </div>

            <div className="field">
              <label htmlFor="email">Email address <span>*</span></label>
              <input
                autoComplete="email"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="dateOfBirth">Date of birth <span>*</span></label>
              <input
                autoComplete="bday"
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                max={getLocalDateString()}
                value={form.dateOfBirth}
                onChange={updateField}
                aria-invalid={Boolean(errors.dateOfBirth)}
                aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
              />
              {errors.dateOfBirth && <p className="field-error" id="dateOfBirth-error">{errors.dateOfBirth}</p>}
            </div>

            <fieldset className="field gender-field">
              <legend>Gender <span>*</span></legend>
              <div className="gender-options">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <label className="radio-option" key={gender}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={form.gender === gender}
                      onChange={updateField}
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="field-error">{errors.gender}</p>}
            </fieldset>

            <div className="field field-wide">
              <label htmlFor="address">Address <span>*</span></label>
              <input
                autoComplete="street-address"
                id="address"
                name="address"
                value={form.address}
                onChange={updateField}
                placeholder="Street address, apartment, etc."
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address && <p className="field-error" id="address-error">{errors.address}</p>}
            </div>

            <div className="field">
              <label htmlFor="city">City <span>*</span></label>
              <input
                autoComplete="address-level2"
                id="city"
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="Your city"
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {errors.city && <p className="field-error" id="city-error">{errors.city}</p>}
            </div>

            <div className="field">
              <label htmlFor="state">State <span>*</span></label>
              <input
                autoComplete="address-level1"
                id="state"
                name="state"
                value={form.state}
                onChange={updateField}
                placeholder="Your state"
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? 'state-error' : undefined}
              />
              {errors.state && <p className="field-error" id="state-error">{errors.state}</p>}
            </div>

            <div className="field field-wide">
              <label htmlFor="purpose">Purpose of contact <span>*</span></label>
              <select
                id="purpose"
                name="purpose"
                value={form.purpose}
                onChange={updateField}
                aria-invalid={Boolean(errors.purpose)}
                aria-describedby={errors.purpose ? 'purpose-error' : undefined}
              >
                <option value="" disabled>Select a purpose</option>
                {purposes.map((purpose) => <option key={purpose}>{purpose}</option>)}
              </select>
              {errors.purpose && <p className="field-error" id="purpose-error">{errors.purpose}</p>}
            </div>

            <div className="field field-wide">
              <label htmlFor="message">Message or additional information <span className="optional">(optional)</span></label>
              <textarea
                id="message"
                name="message"
                rows="4"
                maxLength="1000"
                value={form.message}
                onChange={updateField}
                placeholder="Anything else you'd like us to know?"
              />
              <span className="character-count">{form.message.length}/1000</span>
            </div>
          </div>

          {status && (
            <p className={`form-status ${status.startsWith('WhatsApp opened') ? 'status-success' : 'status-error'}`} role="status">
              {status}
            </p>
          )}

          <button className="submit-button" type="submit">
            <WhatsAppIcon className="button-icon" />
            Send to WhatsApp
          </button>
          <p className="privacy-note">
            Your details are only used to prepare a WhatsApp message. You choose whether to send it.
          </p>
        </form>
      </section>
      <footer className="page-footer">A simple, secure way to get in touch.</footer>
    </main>
  )
}

export default App
