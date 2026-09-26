'use client'

import { useState } from 'react'
import { signOut } from '@/app/actions/auth'

export default function ProviderSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  return (
    <>
      <div className="dashboard-header">
        <div><p className="eyebrow">Preferences</p><h1>Settings</h1><p>Control how Trinity keeps you updated.</p></div>
      </div>
      <section className="dashboard-panel dashboard-panel-wide">
        <div className="settings-row">
          <span><strong>Email notifications</strong><small>Get notified when a new client chooses you.</small></span>
          <button type="button" className={emailAlerts ? 'toggle toggle-on' : 'toggle'} aria-pressed={emailAlerts} onClick={() => setEmailAlerts((value) => !value)} />
        </div>
        <div className="settings-row">
          <span><strong>SMS reminders</strong><small>Get a text for time-sensitive client requests.</small></span>
          <button type="button" className={smsAlerts ? 'toggle toggle-on' : 'toggle'} aria-pressed={smsAlerts} onClick={() => setSmsAlerts((value) => !value)} />
        </div>
        <div className="settings-row">
          <span><strong>Log out</strong><small>End your session on this device.</small></span>
          <button type="button" className="button button-secondary" onClick={async () => { await signOut() }}>Log out</button>
        </div>
      </section>
    </>
  )
}
