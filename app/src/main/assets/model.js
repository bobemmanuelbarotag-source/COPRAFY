(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CoprafyModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 1;
  const ACTIVE = ['Loading', 'Drying', 'Cooldown', 'Ready to unload'];
  const date = (offset = 0) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const now = () => new Date().toISOString();
  const copy = data => JSON.parse(JSON.stringify(data));
  const requireRole = (role, wanted) => { if (role !== wanted) throw Error('This action belongs to the other app role.'); };
  function seed() {
    const previousStart = new Date(date(-1) + 'T08:00:00').toISOString();
    const previousEnd = new Date(date(-1) + 'T13:00:00').toISOString();
    const lots = () => [
      { id: 'L01', memberId: 'M001', quantity: 180, trays: '1-2', sample: null },
      { id: 'L02', memberId: 'M002', quantity: 180, trays: '3-6', sample: null },
      { id: 'L03', memberId: 'M003', quantity: 180, trays: '7-8', sample: null }
    ];
    const oldLots = lots().map(l => ({ ...l, sample: { moisture: 5.8, accepted: true, time: previousEnd, note: 'Demonstration sample result' } }));
    return {
      version: VERSION, sequence: 240, offline: false,
      members: [
        { id: 'M001', name: 'Emilio Lopis', phone: '', active: true, isOperator: false },
        { id: 'M002', name: 'Jose Demen', phone: '', active: true, isOperator: true },
        { id: 'M003', name: 'Benito Barotag', phone: '', active: true, isOperator: false },
        { id: 'M004', name: 'Ramon Ballon', phone: '', active: true, isOperator: false },
        { id: 'M005', name: 'Elena Nuñez', phone: '', active: true, isOperator: false },
        { id: 'M006', name: 'Mel Santos', phone: '09171234567', active: true, isOperator: true },
        { id: 'M007', name: 'Mark Dela Rosa', phone: '09189876543', active: true, isOperator: true },
        { id: 'M008', name: 'Stella Lauren', phone: '09205551234', active: true, isOperator: true }
      ],
      operators: ['Mel Santos', 'Mark Dela Rosa', 'Stella Lauren', 'Jose Demen'],
      bookings: [
        { id: 'BK01', memberId: 'M004', date: date(1), time: '08:00', quantity: 150, notes: '', sessionId: 'S0232' },
        { id: 'BK02', memberId: 'M005', date: date(1), time: '08:00', quantity: 180, notes: '', sessionId: 'S0232' }
      ],
      sessions: [
        { id: 'S0231', date: date(), time: '07:40', operator: 'Mel Santos', status: 'Drying', lots: lots(), startedAt: now(), endedAt: null, fault: null, safeCooldown: false, reading: { moisture: 9.2, temperature: 62, humidity: 45, updatedAt: now() }, history: [{ event: 'Loading recorded', time: now() }, { event: 'Drying started at local controls (simulated)', time: now() }] },
        { id: 'S0230', date: date(-1), time: '08:00', operator: 'Stella Lauren', status: 'Completed', lots: oldLots, startedAt: previousStart, endedAt: previousEnd, duration: '5 hours (demo)', safeCooldown: true, fault: null, reading: { moisture: 6.0, temperature: 35, humidity: 43, updatedAt: previousEnd }, history: [{ event: 'Unloaded under operator supervision', time: previousEnd }] },
        { id: 'S0232', date: date(1), time: '08:00', operator: 'Mark Dela Rosa', status: 'Scheduled', lots: [{ id: 'L04', memberId: 'M004', quantity: 150, trays: '1-2', sample: null }, { id: 'L05', memberId: 'M005', quantity: 180, trays: '3-4', sample: null }], safeCooldown: false, fault: null, startedAt: null, endedAt: null, reading: null, history: [{ event: 'Session scheduled', time: now() }] }
      ],
      alerts: [{ id: 'A001', sessionId: 'S0231', title: 'Drying underway', detail: 'The operator started drying at the local touchscreen. Readings shown here are simulated.', time: now(), read: false, kind: 'info' }]
    };
  }
  function nextId(state, prefix) { state.sequence += 1; return prefix + String(state.sequence).padStart(4, '0'); }
  function trays(text) {
    if (!String(text).trim()) throw Error('Enter tray numbers for every lot.');
    const result = [];
    for (const token of String(text).replace(/\s/g, '').split(',')) {
      if (!/^\d+(?:-\d+)?$/.test(token)) throw Error('Use tray numbers such as 1-2 or 1, 3, 5.');
      const values = token.split('-').map(Number), a = values[0], b = values[1] ?? a;
      if (a < 1 || b < a || b > 999) throw Error('Use positive tray numbers and an increasing range.');
      for (let n = a; n <= b; n++) {
        if (result.includes(n)) throw Error('A tray number is repeated in this lot.');
        result.push(n);
      }
    }
    return result;
  }
  function validateSession(state, draft, editingId) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || !/^\d{2}:\d{2}$/.test(draft.time)) throw Error('Choose a loading date and time.');
    if (!state.operators.includes(draft.operator)) throw Error('Choose an assigned operator.');
    if (!draft.lots.length) throw Error('Add at least one farmer-lot.');
    if (state.sessions.some(s => s.id !== editingId && s.status !== 'Completed' && s.date === draft.date && s.time === draft.time)) throw Error('A session already uses this time slot. Add lots to that shared session or choose another time.');
    const used = new Set(), members = new Set();
    draft.lots.forEach(lot => {
      if (!state.members.some(m => m.id === lot.memberId && m.active)) throw Error('Choose a registered, active member for every lot.');
      if (members.has(lot.memberId)) throw Error('This member is already in the session. Combine their quantity and tray allocation.');
      members.add(lot.memberId);
      const quantity = Number(lot.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) throw Error('Each lot needs a quantity greater than zero.');
      trays(lot.trays).forEach(n => { if (used.has(n)) throw Error('Two lots share a tray number. Give each lot its own trays.'); used.add(n); });
    });
  }
  function saveSession(state, role, draft, id) {
    requireRole(role, 'head');
    const existing = id && state.sessions.find(s => s.id === id);
    if (id && !existing) throw Error('Session not found.');
    if (existing && !['Scheduled', 'Loading'].includes(existing.status)) throw Error('Lot quantities and tray assignments are locked once drying starts.');
    validateSession(state, draft, id);
    const lots = draft.lots.map(l => ({ id: l.id || nextId(state, 'L'), memberId: l.memberId, quantity: Number(l.quantity), trays: String(l.trays).trim(), sample: null }));
    let session;
    if (existing) { Object.assign(existing, { date: draft.date, time: draft.time, operator: draft.operator, lots }); session = existing; }
    else {
      session = { id: nextId(state, 'S'), date: draft.date, time: draft.time, operator: draft.operator, lots, status: 'Scheduled', fault: null, safeCooldown: false, reading: null, startedAt: null, endedAt: null, history: [] };
      state.sessions.push(session);
    }
    session.history.push({ event: existing ? 'Session record edited' : 'Session scheduled', time: now() });
    state.bookings.forEach(b => {
      if (b.sessionId === session.id && (b.date !== session.date || !lots.some(l => l.memberId === b.memberId))) b.sessionId = null;
      if (!b.sessionId && b.date === session.date && b.time === session.time && lots.some(l => l.memberId === b.memberId)) b.sessionId = session.id;
    });
    return session;
  }
  function saveMember(state, role, draft, id) {
    requireRole(role, 'pca');
    const name = String(draft.name || '').trim(), phone = String(draft.phone || '').trim();
    if (name.length < 2) throw Error('Enter the member’s full name.');
    if (phone && !/^\+?[\d\s-]{7,16}$/.test(phone)) throw Error('Check the contact number, or leave it blank.');
    if (state.members.some(m => m.id !== id && m.name.toLowerCase() === name.toLowerCase())) throw Error('This member is already registered.');
    const old = id && state.members.find(m => m.id === id);
    if (id && !old) throw Error('Member not found.');
    const isOperator = Boolean(draft.isOperator);
    const member = { id: id || nextId(state, 'M'), name, phone, active: draft.active !== false, isOperator };
    if (old) Object.assign(old, member); else state.members.push(member);
    if (!state.operators) state.operators = [];
    if (isOperator && !state.operators.includes(name)) state.operators.push(name);
    else if (!isOperator && state.operators.includes(name)) {
      state.operators = state.operators.filter(o => o !== name);
    }
    return member;
  }
  function saveBooking(state, role, draft) {
    requireRole(role, 'head');
    if (!state.members.some(m => m.id === draft.memberId && m.active)) throw Error('Select a registered member.');
    if (draft.date < date() || !draft.time) throw Error('Choose today or a future date and a loading time.');
    if (!Number.isFinite(Number(draft.quantity)) || !(Number(draft.quantity) > 0)) throw Error('Enter a quantity greater than zero.');
    if (state.bookings.some(b => b.memberId === draft.memberId && b.date === draft.date && b.time === draft.time)) throw Error('This member already has a booking for that time.');
    const booking = { ...draft, id: nextId(state, 'BK'), quantity: Number(draft.quantity), sessionId: null };
    state.bookings.push(booking); return booking;
  }
  function event(state, session, title, detail, kind = 'info') {
    const time = now(); session.history.push({ event: title, time });
    state.alerts.unshift({ id: nextId(state, 'A'), sessionId: session.id, title, detail, time, read: false, kind });
  }
  function simulate(state, id, action) {
    const s = state.sessions.find(s => s.id === id); if (!s) throw Error('Select a session first.');
    if (action === 'reconnect') { state.offline = false; if (s.reading) s.reading.updatedAt = now(); return; }
    if (action === 'offline') { state.offline = true; return; }
    if (state.offline) throw Error('Reconnect the simulated monitor first.');
    if (action === 'clear-fault') {
      if (!s.fault) throw Error('There is no active fault.');
      s.fault = null; s.faultType = null; if (s.reading) s.reading.updatedAt = now(); event(state, s, 'Fault cleared locally', 'Simulated inspection and clearance at the local controls. Heating does not restart automatically.'); return;
    }
    if (action === 'resume') {
      if (s.fault || s.status !== 'Drying' || !s.heatingPaused) throw Error('Clear the fault in a paused drying session before requesting a simulated local restart.');
      s.heatingPaused = false; if (s.reading) { s.reading.temperature = 62; s.reading.updatedAt = now(); } event(state, s, 'Heating restart requested locally', 'Simulated local checks permit the operator to restart heating.'); return;
    }
    if (['door', 'sensor', 'airflow', 'overheat'].includes(action)) {
      if (!ACTIVE.includes(s.status)) throw Error('Fault scenarios apply to an active session.');
      s.fault = action === 'door' ? 'Door opened unexpectedly' : action === 'sensor' ? 'Moisture sensor fault' : action === 'overheat' ? 'Overtemperature alarm' : 'Airflow lost';
      s.faultType = action;
      if (action === 'overheat' && s.reading) s.reading.temperature = 85;
      s.heatingPaused = true;
      event(state, s, s.fault, 'Repeating local alarm. Check the touchscreen and follow the operator response. Electric heating is stopped; residual biomass heat needs the specified local response.', 'fault'); return;
    }
    if (s.fault) throw Error('Resolve the simulated fault locally before continuing.');
    if (action === 'load') {
      if (s.status !== 'Scheduled') throw Error('Only scheduled sessions can begin loading.');
      if (state.sessions.some(o => o.id !== id && ACTIVE.includes(o.status))) throw Error('The shared chamber is occupied. Finish the current session first.');
      s.status = 'Loading'; event(state, s, 'Loading started', 'The operator is supervising loading into the shared chamber.');
    } else if (action === 'start') {
      if (s.status !== 'Loading') throw Error('Finish simulated loading before starting drying.');
      s.status = 'Drying'; s.startedAt = now(); s.reading = { moisture: 14.5, temperature: 62, humidity: 45, updatedAt: now() };
      event(state, s, 'Drying started locally', 'The simulated local controls confirmed startup. Tray allocations are now locked.');
    } else if (action === 'cooldown') {
      if (s.status !== 'Drying') throw Error('Only a drying session can enter cooldown.');
      if (s.heatingPaused) throw Error('Heating remains paused after the fault. Simulate local restart first.');
      s.status = 'Cooldown'; s.safeCooldown = false; s.reading = { moisture: 6, temperature: 48, humidity: 43, updatedAt: now() };
      s.dryingEndedAt = now();
      event(state, s, 'Cooldown started', 'Brief local sounder tone. Heating is stopped; do not unload yet.', 'warning');
    } else if (action === 'cooled') {
      if (s.status !== 'Cooldown') throw Error('Begin cooldown first.');
      s.safeCooldown = true; s.reading.temperature = 35; s.reading.updatedAt = now();
      event(state, s, 'Safe cooldown confirmed locally', 'This is a simulated local clearance, not a validated temperature threshold. Recorded sample acceptance is also needed.');
      refreshReadiness(state, s);
    } else if (action === 'unloaded') {
      if (s.status !== 'Ready to unload') throw Error('Wait for local unloading permission and accepted samples.');
      s.status = 'Completed'; s.endedAt = now(); s.duration = elapsedDuration(s);
      event(state, s, 'Unloading confirmed locally', 'The operator confirmed supervised unloading. The session record is complete.');
    } else throw Error('Unknown simulation event.');
  }
  function refreshReadiness(state, session) {
    if (session.status === 'Cooldown' && session.safeCooldown && !session.fault && session.lots.every(l => l.sample && l.sample.accepted)) {
      session.status = 'Ready to unload'; event(state, session, 'Ready to unload', 'Distinct local sounder tone. Safe cooldown and recorded sample acceptance are confirmed. Follow the local touchscreen and operator instructions.', 'ready');
    }
  }
  function sample(state, role, id, lotId, moisture, note) {
    requireRole(role, 'head'); const s = state.sessions.find(s => s.id === id);
    if (!s || !['Drying', 'Cooldown'].includes(s.status)) throw Error('Sample entry is available during drying or cooldown.');
    if (state.offline || s.fault) throw Error('Check stale readings or resolve the active fault before recording acceptance.');
    const value = Number(moisture);
    if (String(moisture).trim() === '' || !Number.isFinite(value) || value <= 0 || value > 100) throw Error('Enter a measured sample moisture between 0 and 100%.');
    const lot = s.lots.find(l => l.id === lotId); if (!lot) throw Error('Lot not found.');
    lot.sample = { moisture: value, accepted: value <= 6, note: String(note || '').trim(), time: now() };
    s.history.push({ event: `Sample recorded for ${lot.id}: ${value}% (${lot.sample.accepted ? 'accepted' : 'needs further drying / review'})`, time: now() });
    refreshReadiness(state, s); return lot.sample;
  }
  function reportLines(state, role, sessions) {
    requireRole(role, 'pca');
    const lines = ['COPRAFY - DRYING RECORD REPORT', 'HCI prototype - simulated records only', 'Single shared chamber | CFIDP facility context (proposed)', `Generated: ${new Date().toLocaleString()}`, ''];
    for (const s of sessions) {
      lines.push(`${s.id} | ${s.date} ${s.time} | ${s.status}`, `Assigned operator: ${s.operator}`, `Chamber estimate: ${s.reading && s.faultType !== 'sensor' ? s.reading.moisture + '%' : 'Not available'} (not a measured lot result)`, `Reading updated: ${s.reading ? s.reading.updatedAt : 'Not available'}${state.offline && s.status !== 'Completed' ? ' - STALE / simulated offline' : ''}`, `Active fault: ${s.fault || 'None'}`, `Heating paused after fault: ${s.heatingPaused && s.status === 'Drying' ? 'Yes - local restart needed' : 'No / not applicable'}`);
      for (const l of s.lots) {
        const m = state.members.find(m => m.id === l.memberId);
        lines.push(`Lot ${l.id} - ${m ? m.name : l.memberId}`, `  Quantity: ${l.quantity} kg | Trays: ${l.trays}`, `  Sample moisture: ${l.sample ? l.sample.moisture + '%' : 'Not recorded'}`, `  Sample decision: ${l.sample ? (l.sample.accepted ? 'Accepted against proposed 6% target' : 'Further drying / review required') : 'Pending'}`);
      }
      lines.push(`Local cooldown clearance: ${s.safeCooldown ? 'Recorded (simulated)' : 'Pending'}`, `Duration: ${s.duration || (s.startedAt ? 'In progress / demo timeline' : 'Not started')}`, '');
    }
    lines.push('App notices do not replace the local sounder or operator supervision.', 'Records do not validate drying performance, sensor accuracy or physical safety.');
    return lines;
  }
  function assignOperator(state, role, id, operator) {
    if (!['head', 'pca'].includes(role)) throw Error('Unauthorized role.');
    const s = state.sessions.find(s => s.id === id);
    if (!s || s.status === 'Completed') throw Error('Completed session assignments are locked.');
    const validOperators = [...new Set([...(state.operators || []), ...state.members.filter(m => m.isOperator).map(m => m.name)])];
    if (!validOperators.includes(operator)) throw Error('Select a registered operator.');
    s.operator = operator;
    if (!state.operators) state.operators = [];
    if (!state.operators.includes(operator)) state.operators.push(operator);
    s.history.push({ event: `Assigned operator changed to ${operator}`, time: now() });
  }
  function complete(state, role, id, confirmed) {
    requireRole(role, 'head'); const s = state.sessions.find(s => s.id === id);
    if (!s || s.status !== 'Ready to unload' || s.fault || state.offline || !s.safeCooldown || !s.lots.every(l => l.sample?.accepted)) throw Error('Local clearance, accepted samples, and current status are required before closing this record.');
    if (!confirmed) throw Error('Confirm the operator reported supervised unloading.');
    s.status = 'Completed'; s.endedAt = now(); s.duration = elapsedDuration(s);
    event(state, s, 'Unloading completion recorded', 'The Head recorded the operator’s confirmation of supervised unloading. This closes the record and does not control the dryer.');
  }
  function elapsedDuration(s) {
    const minutes = Math.max(0, Math.round((new Date(s.dryingEndedAt || s.endedAt) - new Date(s.startedAt)) / 60000));
    return `${Math.floor(minutes / 60)} h ${minutes % 60} min (prototype elapsed)`;
  }
  return { VERSION, ACTIVE, date, now, seed, copy, trays, validateSession, saveSession, saveMember, saveBooking, simulate, sample, reportLines, assignOperator, complete };
});
