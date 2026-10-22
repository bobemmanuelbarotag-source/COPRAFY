(() => {
  'use strict';
  const M = window.CoprafyModel, KEY = 'coprafy.prototype.v1';
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  
  let state;
  try {
    state = JSON.parse(localStorage.getItem(KEY));
    if (!state || state.version !== M.VERSION || !Array.isArray(state.sessions) || !Array.isArray(state.members)) {
      state = M.seed();
    }
  } catch (_) {
    state = M.seed();
  }

  const paths = {
    home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    sessions: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h2m5 0h3m-10 3h2m5 0h3"/>',
    status: '<path d="M3 17h3l3-10 5 13 3-8h4"/>',
    reports: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7m-7 4h7"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    options: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    members: '<circle cx="9" cy="7" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2M17 4a3 3 0 0 1 0 6m2 3a6 6 0 0 1 3 5"/>',
    alerts: '<path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4zM10 20h4M12 2v2"/>',
    head: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',
    pca: '<path d="M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
    back: '<path d="m15 4-8 8 8 8"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    moisture: '<path d="M12 2.69 17.66 8.35a8 8 0 1 1-11.32 0z"/><path d="M9.5 14.5a3.5 3.5 0 0 0 5 0"/>',
    temp: '<path d="M14 14.76V4.5a2 2 0 1 0-4 0v10.26a4.5 4.5 0 1 0 4 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/>',
    humidity: '<path d="M3 13.5c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 9.5c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M6 5.5c2-1.5 4-1.5 6 0s4 1.5 6 0"/>',
    coconut: '<circle cx="12" cy="12" r="8.5"/><path d="M6 12a6 6 0 0 0 12 0"/><circle cx="10" cy="8.5" r="1" fill="currentColor"/><circle cx="14" cy="8.5" r="1" fill="currentColor"/><circle cx="12" cy="10.5" r="1" fill="currentColor"/>',
    cycle: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M21 21v-5h-5"/>',
    calendar: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M16 2v4M8 2v4M3 9h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    box: '<path d="m16.5 9.4 4.5-2.5-9-5-9 5 4.5 2.5"/><path d="M3 7.5v9l9 5 9-5v-9"/><path d="M12 12.5v9"/>'
  };

  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.sessions}</svg>`;

  let role = null, chosenRole = 'head', route = 'roles', selectedId = 'S0231', stack = [];
  let selectedDate = M.date(), calendarMonth = M.date().slice(0, 7);
  let reportRange = '7', reportFrom = M.date(-6), reportTo = M.date(), memberSearch = '', memberFilter = 'all', reportSort = 'newest';
  let draft = null, editingId = null, modalReturn = null, toastTimer;
  let lang = 'en';
  try {
    lang = localStorage.getItem('coprafy.lang') || 'en';
  } catch (_) {
    lang = 'en';
  }

  const I18N = {
    en: {
      headTitle: 'Cooperative Head',
      pcaTitle: 'PCA Personnel',
      navHome: 'Home',
      navSessions: 'Sessions',
      navRecords: 'Records',
      navAlerts: 'Alerts',
      navProfile: 'Profile',
      navMembers: 'Members',
      navReports: 'Reports',
      dashboard: 'Dashboard',
      batchesToday: 'Batches today',
      scheduled: 'Scheduled',
      members: 'Members',
      activeDryerMonitoring: 'Active Dryer Monitoring',
      dryerIdle: 'Dryer is currently idle',
      dryerIdleDesc: 'The drying chamber is ready for the next load.',
      assignedOperator: 'Assigned operator',
      farmerLots: 'Farmer-lots',
      copraMoisture: 'Copra\nmoisture',
      chamberTemp: 'Chamber\ntemp',
      chamberHumidity: 'Chamber\nhumidity',
      updated: 'Updated',
      offlineReadings: 'Offline — last recorded reading',
      readingsAppear: 'Readings appear once drying begins.',
      progress: 'Drying progress',
      scheduleNewLoad: 'Schedule new load',
      viewDetails: 'View details',
      viewFullDetails: 'View full batch details',
      recordSample: 'Record sample',
      recordUnloadCompletion: 'Record unloading completion',
      total: 'Total',
      totalQuantity: 'Total Quantity',
      trays: 'Trays',
      sample: 'Sample',
      notRecordedYet: 'Not recorded yet',
      accepted: 'Accepted',
      needsDryingReview: 'Needs drying / review',
      alert: 'Alert',
      monitorOffline: 'Monitor offline',
      monitorOfflineDesc: 'Showing last recorded readings.',
      cooldownInProgress: 'Cooldown in progress',
      cooldownClearanceRecorded: 'Cooldown clearance recorded; sample check pending.',
      cooldownWait: 'Please wait for cooldown before unloading.',
      readyToUnload: 'Ready to unload',
      readyToUnloadNotice: 'Cooldown and sample checks complete.',
      completed: 'Completed',
      completedNotice: 'This batch has been unloaded.',
      heatingPaused: 'Heating paused',
      heatingPausedDesc: 'Check machine panel to restart heating.',
      dryingInProgress: 'Drying in progress',
      dryingInProgressDesc: 'Dryer is actively running.',
      sharedSessions: 'Shared sessions',
      noSessionsDay: 'No drying sessions scheduled for this date.',
      operator: 'Operator',
      tapToViewDetails: 'Tap to view full details',
      noFarmersAssigned: 'No farmers assigned',
      duration: 'Duration',
      inProgress: 'In progress',
      notStarted: 'Not started',
      history: 'History',
      editLoad: 'Edit load',
      assignOperator: 'Assign operator',
      backToHome: 'Back to Home monitoring',
      noAlerts: 'No alerts',
      allDryersNormal: 'All dryers operating normally.',
      markAsRead: 'Mark as read',
      read: 'Read',
      profile: 'Profile',
      email: 'Email',
      appVersion: 'App version',
      languageSetting: 'Language / Wika',
      languageDesc: 'Choose language for easier navigation.',
      demoScenarios: 'Demo scenarios',
      aboutCoprafy: 'About COPRAFY',
      resetRecords: 'Reset demo records',
      logout: 'Log out',
      langChangedToast: 'Language set to English',
      saveSchedule: 'Save schedule',
      saveChanges: 'Save changes',
      cancel: 'Cancel',
      loadingDate: 'Loading date',
      time: 'Time',
      farmerMember: 'Farmer-member',
      quantityKg: 'Quantity (kg)',
      trayNumbers: 'Tray numbers',
      addFarmerLot: 'Add farmer-lot',
      sampleMoisturePercent: 'Sample moisture (%)',
      notes: 'Notes (optional)',
      saveSampleResult: 'Save sample result',
      unloadingChecklist: 'Unloading checklist',
      completeSessionRecord: 'Complete session record',
      confirmUnloaded: 'I confirm all trays have been unloaded and inspected.',
      navOptions: 'Settings',
      optionsTitle: 'Settings',
      pcaDashboard: 'PCA Oversight Dashboard',
      pcaFacility: 'SPF San Lorenzo Ruiz',
      pcaFacilityDesc: 'Shared Processing Facility · Camarines Norte',
      registeredMembers: 'Registered Members',
      batchesProcessed: 'Batches Processed',
      totalCopraDried: 'Total Copra Dried',
      avgMoisture: 'Avg Moisture',
      quickActions: 'Quick Actions',
      registerMember: 'Register Member',
      viewRecordsReports: 'View Records & Reports',
      recentDryingRuns: 'Recent Drying Operations',
      allRecords: 'View All Records',
      facilitySpecs: 'Facility Specifications',
      facilitySpecsDesc: '4,000 coconut halves capacity · Dual heat source (Solar-PV 10.8 kWp & Biomass furnace) · CFIDP Program',
      dryingRecordsTitle: 'Drying Operations Records',
      filterPeriod: 'Filter Period',
      today: 'Today',
      last7Days: 'Last 7 Days',
      thisMonth: 'This Month',
      allTime: 'All Time',
      customRange: 'Custom Range',
      sortBy: 'Sort by',
      dateNewest: 'Date: Newest first',
      dateOldest: 'Date: Oldest first',
      batchIdAsc: 'Batch ID',
      batchCol: 'Batch ID',
      dateTimeCol: 'Date & Time',
      farmersCol: 'Farmer-Lots',
      qtyCol: 'Total (kg)',
      operatorCol: 'Operator',
      moistureCol: 'Moisture',
      statusCol: 'Status',
      downloadPdfReport: 'Download PDF Report',
      tapToView: 'Click row to view full details',
      qualityStandard: 'White Copra Standard: Target ≤6.0% moisture (BAFS base-price standard)',
      farmerDirectory: 'Farmer-Member Directory',
      searchMembersPlaceholder: 'Search name or ID...',
      allMembers: 'All',
      activeMembers: 'Active',
      inactiveMembers: 'Inactive',
      editMember: 'Edit Member',
      registerFarmerMember: 'Register Farmer-Member',
      saveMember: 'Save Member',
      contactNumber: 'Contact Number',
      fullName: 'Full Name',
      activeStatus: 'Active member',
      batchesCount: 'batches',
      designateOperator: 'Designate as Dryer Operator',
      coprafyOverviewDesc: 'COPRAFY is a smart copra drying and batch management system designed for agricultural cooperatives to streamline post-harvest processing.',
      featureMonitoring: 'Real-Time Monitoring',
      featureMonitoringDesc: 'Tracks chamber temperature, humidity, and drying progress.',
      featureTraceability: 'Batch Traceability',
      featureTraceabilityDesc: 'Records farmer-member lots, tray allocations, and assigned operators.',
      featureQuality: 'Quality Assurance',
      featureQualityDesc: 'Monitors moisture reduction toward optimal white copra standards.'
    },
    fil: {
      headTitle: 'Pinuno ng Kooperatiba',
      pcaTitle: 'Kawani ng PCA',
      navHome: 'Home',
      navSessions: 'Iskedyul',
      navRecords: 'Mga Tala',
      navAlerts: 'Alerto',
      navProfile: 'Opsyon',
      navMembers: 'Miyembro',
      navReports: 'Mga Ulat',
      dashboard: 'Dashboard',
      batchesToday: 'Batches ngayong araw',
      scheduled: 'Naka-iskedyul',
      members: 'Mga miyembro',
      activeDryerMonitoring: 'Pagsubaybay sa Dryer',
      dryerIdle: 'Walang pinatutuyo ngayon',
      dryerIdleDesc: 'Handa ang dryer para sa susunod na karga.',
      assignedOperator: 'Nakatalagang operator',
      farmerLots: 'Mga lot ng magsasaka',
      copraMoisture: 'Moisture ng\nkopra',
      chamberTemp: 'Init ng\ndryer',
      chamberHumidity: 'Alinsangan ng\nchamber',
      updated: 'Na-update',
      offlineReadings: 'Offline — huling naitalang reading',
      readingsAppear: 'Lalabas ang readings kapag nagsimula nang magpatuyo.',
      progress: 'Progreso ng pagpapatuyo',
      scheduleNewLoad: 'Mag-iskedyul ng bagong load',
      viewDetails: 'Tingnan ang detalye',
      viewFullDetails: 'Tingnan ang buong detalye ng batch',
      recordSample: 'Mag-record ng sample',
      recordUnloadCompletion: 'Itala ang pagtatapos ng pagdiskarga',
      total: 'Kabuuan',
      totalQuantity: 'Kabuuang Dami',
      trays: 'Mga Tray',
      sample: 'Sample',
      notRecordedYet: 'Wala pang tala',
      accepted: 'Tanggap (Tuyo na)',
      needsDryingReview: 'Kailangan pang patuyuin',
      alert: 'Alerto',
      monitorOffline: 'Offline ang monitor',
      monitorOfflineDesc: 'Ipinapakita ang huling naitalang readings.',
      cooldownInProgress: 'Kasalukuyang nagpapalamig',
      cooldownClearanceRecorded: 'Tapos na ang pagpapalamig; sinusuri pa ang sample ng kopra.',
      cooldownWait: 'Mangyaring maghintay munang lumamig bago magdiskarga.',
      readyToUnload: 'Handa nang i-diskarga',
      readyToUnloadNotice: 'Tapos na ang pagpapalamig at pasado na ang mga sample.',
      completed: 'Tapos na',
      completedNotice: 'Nai-diskarga na ang batch na ito.',
      heatingPaused: 'Nakahinto ang pagpapainit',
      heatingPausedDesc: 'Suriin ang control panel upang muling painitin.',
      dryingInProgress: 'Kasalukuyang pinatutuyo',
      dryingInProgressDesc: 'Aktibong tumatakbo ang dryer.',
      sharedSessions: 'Mga Iskedyul ng Dryer',
      noSessionsDay: 'Walang naka-iskedyul na batch sa araw na ito.',
      operator: 'Operator',
      tapToViewDetails: 'Pindutin para sa buong detalye',
      noFarmersAssigned: 'Walang nakatalagang magsasaka',
      duration: 'Tagal',
      inProgress: 'Kasalukuyang ginagawa',
      notStarted: 'Hindi pa nagsisimula',
      history: 'Kasaysayan ng Tala',
      editLoad: 'Baguhin ang load',
      assignOperator: 'Magtalaga ng operator',
      backToHome: 'Bumalik sa Home monitoring',
      noAlerts: 'Walang alerto',
      allDryersNormal: 'Maayos ang takbo ng lahat ng dryer.',
      markAsRead: 'Markahan bilang nabasa',
      read: 'Nabasa na',
      profile: 'Opsyon',
      email: 'Email',
      appVersion: 'Bersyon ng app',
      languageSetting: 'Wika / Language',
      languageDesc: 'Piliin ang nais mong wika para sa mas madaling paggamit.',
      demoScenarios: 'Mga senaryo ng demo',
      aboutCoprafy: 'Tungkol sa COPRAFY',
      resetRecords: 'I-reset ang demo records',
      logout: 'Mag-logout',
      langChangedToast: 'Pinalitan ang wika sa Filipino',
      saveSchedule: 'I-save ang iskedyul',
      saveChanges: 'I-save ang mga pagbabago',
      cancel: 'Kanselahin',
      loadingDate: 'Petsa ng pagkarga',
      time: 'Oras',
      farmerMember: 'Magsasakang miyembro',
      quantityKg: 'Timbang (kg)',
      trayNumbers: 'Numero ng mga tray',
      addFarmerLot: 'Magdagdag ng lot ng magsasaka',
      sampleMoisturePercent: 'Moisture ng sample (%)',
      notes: 'Mga tala (opsyonal)',
      saveSampleResult: 'I-save ang resulta ng sample',
      unloadingChecklist: 'Listahan bago magdiskarga',
      completeSessionRecord: 'Tapusin ang tala ng batch',
      confirmUnloaded: 'Kinukumpirma kong naidiskarga at nainspeksyon ang lahat ng tray.',
      navOptions: 'Mga Setting',
      optionsTitle: 'Mga Setting',
      pcaDashboard: 'Dashboard ng PCA',
      pcaFacility: 'SPF San Lorenzo Ruiz',
      pcaFacilityDesc: 'Shared Processing Facility · Camarines Norte',
      registeredMembers: 'Rehistradong Miyembro',
      batchesProcessed: 'Naprosesong Batch',
      totalCopraDried: 'Kabuuang Kopra',
      avgMoisture: 'Karaniwang Moisture',
      quickActions: 'Mabilisang Aksyon',
      registerMember: 'Magrehistro ng Miyembro',
      viewRecordsReports: 'Tingnan ang Tala at Ulat',
      recentDryingRuns: 'Kamakailang Pagpapatuyo',
      allRecords: 'Tingnan Lahat ng Tala',
      facilitySpecs: 'Detalye ng Pasilidad',
      facilitySpecsDesc: 'Kapasidad: 4,000 bao · Dalawang pinagmumulan ng init (Solar-PV 10.8 kWp at Pugon ng Bunot) · CFIDP Program',
      dryingRecordsTitle: 'Mga Tala ng Pagpapatuyo',
      filterPeriod: 'Piliin ang Panahon',
      today: 'Ngayong Araw',
      last7Days: 'Huling 7 Araw',
      thisMonth: 'Ngayong Buwan',
      allTime: 'Lahat ng Tala',
      customRange: 'Pasadyang Petsa',
      sortBy: 'Ayos',
      dateNewest: 'Petsa: Pinakabago',
      dateOldest: 'Petsa: Pinakaluma',
      batchIdAsc: 'Batch ID',
      batchCol: 'Batch ID',
      dateTimeCol: 'Petsa at Oras',
      farmersCol: 'Mga Magsasaka',
      qtyCol: 'Timbang (kg)',
      operatorCol: 'Operator',
      moistureCol: 'Moisture',
      statusCol: 'Katayuan',
      downloadPdfReport: 'I-download ang Ulat sa PDF',
      tapToView: 'Pindutin ang row para sa buong detalye',
      qualityStandard: 'Pamantayan sa White Copra: Target ≤6.0% moisture (BAFS base-price standard)',
      farmerDirectory: 'Direktoryo ng mga Magsasaka',
      searchMembersPlaceholder: 'Maghanap sa pangalan o ID...',
      allMembers: 'Lahat',
      activeMembers: 'Aktibo',
      inactiveMembers: 'Hindi Aktibo',
      editMember: 'Baguhin ang Miyembro',
      registerFarmerMember: 'Magrehistro ng Magsasaka',
      saveMember: 'I-save ang Miyembro',
      contactNumber: 'Numero ng Telepono',
      fullName: 'Buong Pangalan',
      activeStatus: 'Aktibong miyembro',
      batchesCount: 'batches',
      designateOperator: 'Italaga bilang Dryer Operator',
      coprafyOverviewDesc: 'Ang COPRAFY ay isang matalinong sistema ng pagpapatuyo ng kopra at pamamahala ng batch na idinisenyo para sa mga kooperatiba.',
      featureMonitoring: 'Real-Time na Pagmamanman',
      featureMonitoringDesc: 'Sinusubaybayan ang temperatura, halumigmig, at pag-usad ng pagpapatuyo.',
      featureTraceability: 'Traceability ng Bawat Batch',
      featureTraceabilityDesc: 'Nagtatala ng lot ng bawat magsasaka, bilang ng tray, at operator.',
      featureQuality: 'Pagtitiyak ng Kalidad',
      featureQualityDesc: 'Sinusubaybayan ang antas ng moisture para sa mataas na uri ng puting kopra.'
    }
  };

  const t = key => I18N[lang]?.[key] ?? I18N.en[key] ?? key;

  const phaseMap = {
    'Loading': { en: 'Loading', fil: 'Karga' },
    'Drying': { en: 'Drying', fil: 'Tuyo' },
    'Cooldown': { en: 'Cooldown', fil: 'Palamig' },
    'Ready': { en: 'Ready', fil: 'Handa' },
    'Completed': { en: 'Done', fil: 'Tapos' }
  };

  const statusLabels = {
    'Scheduled': { en: 'Scheduled', fil: 'Naka-iskedyul' },
    'Loading': { en: 'Loading', fil: 'Ikinakarga' },
    'Drying': { en: 'Drying', fil: 'Pinatutuyo' },
    'Cooldown': { en: 'Cooldown', fil: 'Nagpapalamig' },
    'Ready to unload': { en: 'Ready', fil: 'Handa na' },
    'Completed': { en: 'Completed', fil: 'Tapos na' }
  };

  const roleName = () => role === 'pca' ? t('pcaTitle') : t('headTitle');
  const shortRole = () => role === 'pca' ? t('pcaTitle') : t('headTitle');
  const member = id => state.members.find(m => m.id === id);
  const session = id => state.sessions.find(s => s.id === id);
  const active = () => state.sessions.find(s => M.ACTIVE.includes(s.status));
  const niceDate = d => new Date(d + 'T12:00:00').toLocaleDateString(lang === 'fil' ? 'fil-PH' : 'en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  const niceTime = d => new Date(d).toLocaleTimeString(lang === 'fil' ? 'fil-PH' : 'en-PH', { hour: '2-digit', minute: '2-digit' });
  const badge = status => {
    const cls = ({ 'Scheduled': 'scheduled', 'Loading': 'loading', 'Drying': 'drying', 'Cooldown': 'cooldown', 'Ready to unload': 'ready', 'Completed': 'completed' })[status] || 'fault';
    const label = statusLabels[status]?.[lang] || status;
    return `<span class="badge ${cls}"><span class="status-dot" aria-hidden="true"></span>${esc(label)}</span>`;
  };
  const btn = (label, action, variant = '', attrs = '') => `<button type="button" class="btn ${variant}" data-action="${action}" ${attrs}>${label}</button>`;
  const heading = (name, action = '') => `<div class="section-heading"><h2>${name}</h2>${action}</div>`;

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (_) {
      toast('Storage unavailable. Changes may not be saved.');
    }
  }

  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
  }

  function go(next, id) {
    closeModal();
    stack.push({ route, selectedId });
    route = next;
    if (id) selectedId = id;
    render();
  }

  function back() {
    if ($('#modal-root').children.length) {
      closeModal();
      return true;
    }
    if (['home', 'roles'].includes(route)) return false;
    const prev = stack.pop();
    route = prev?.route || (role ? 'home' : 'roles');
    selectedId = prev?.selectedId || selectedId;
    render();
    return true;
  }

  window.Coprafy = { back };

  function modal(title, body, actions = '') {
    modalReturn = document.activeElement;
    $('#modal-root').innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="icon-btn" data-action="close-modal" aria-label="Close">${icon('close')}</button><h2 id="modal-title">${title}</h2>${body}${actions}</section></div>`;
    setTimeout(() => $('#modal-root input, #modal-root select, #modal-root button:not(.icon-btn)')?.focus(), 30);
  }

  function closeModal() {
    $('#modal-root').innerHTML = '';
    if (modalReturn?.isConnected) modalReturn.focus();
    modalReturn = null;
  }

  const field = (label, input, hint = '') => `<div class="field">${label}${input}${hint ? `<small class="muted">${hint}</small>` : ''}</div>`;
  const optionMembers = selected => state.members.filter(m => m.active || m.id === selected).map(m => `<option value="${m.id}" ${m.id === selected ? 'selected' : ''}>${esc(m.name)} · ${m.id}${m.active ? '' : ' (inactive)'}</option>`).join('');
  const getOperators = () => [...new Set([...(state.operators || []), ...state.members.filter(m => m.isOperator && m.active).map(m => m.name)])];
  const optionOperators = selected => getOperators().map(o => `<option ${o === selected ? 'selected' : ''}>${esc(o)}</option>`).join('');
  const empty = (title, detail) => `<div class="empty">${icon('sessions')}<h3>${title}</h3><p>${detail}</p></div>`;

  function rolesScreen() {
    return `<div class="screen auth">
      <img class="logo" src="logo.png" alt="COPRAFY">
      <div class="section" style="text-align:center">
        <h1>${lang === 'fil' ? 'Pumili ng Tungkulin' : 'Select Role'}</h1>
        <p class="auth-sub">${lang === 'fil' ? 'Piliin ang iyong account upang magpatuloy' : 'Choose your account to continue'}</p>
      </div>
      <button class="role-card" data-action="choose-role" data-role="head">
        ${icon('head')}
        <strong>${lang === 'fil' ? 'Pinuno ng Kooperatiba' : 'Cooperative Head'}</strong>
        <small>${lang === 'fil' ? 'Mag-iskedyul ng karga, subaybayan ang pagpapatuyo, at magtala ng mga batch' : 'Schedule loads, monitor drying, and record batches'}</small>
      </button>
      <button class="role-card" data-action="choose-role" data-role="pca">
        ${icon('pca')}
        <strong>${lang === 'fil' ? 'Kawani ng PCA' : 'PCA Personnel'}</strong>
        <small>${lang === 'fil' ? 'Pamahalaan ang direktoryo ng miyembro at mag-export ng mga ulat' : 'Manage member directory and export reports'}</small>
      </button>
    </div>`;
  }

  function loginScreen() {
    const email = chosenRole === 'pca' ? 'pca@coprafy.demo' : 'head@coprafy.demo';
    const roleTitle = chosenRole === 'pca' ? (lang === 'fil' ? 'Kawani ng PCA' : 'PCA Personnel') : (lang === 'fil' ? 'Pinuno ng Kooperatiba' : 'Cooperative Head');
    return `<div class="screen auth">
      <img class="logo" src="logo.png" alt="COPRAFY">
      <div class="section" style="text-align:center">
        <h1>${roleTitle}</h1>
        <p class="auth-sub">${lang === 'fil' ? 'Mag-sign in sa iyong account' : 'Sign in to your account'}</p>
      </div>
      <form id="login-form">
        ${field('<label for="email">Email</label>', `<input id="email" name="email" type="email" value="${email}" autocomplete="username" required>`)}
        ${field('<label for="password">Password</label>', '<input id="password" name="password" type="password" value="demo1234" autocomplete="current-password" required>')}
        <p class="form-error" role="alert"></p>
        <button class="btn" type="submit">${lang === 'fil' ? 'Mag-log in' : 'Log in'}</button>
        ${btn(lang === 'fil' ? 'Palitan ang tungkulin' : 'Change role', 'change-role', 'secondary')}
      </form>
      <small class="muted" style="text-align:center;display:block">${lang === 'fil' ? 'Default na password:' : 'Default password:'} <strong>demo1234</strong></small>
    </div>`;
  }

  function shell(title, body, topBack = false, currentTab = route) {
    if (currentTab === 'status') currentTab = 'home';
    const navs = role === 'pca'
      ? [['home', t('navHome'), 'home'], ['members', t('navMembers'), 'members'], ['reports', t('navRecords'), 'reports'], ['profile', t('navOptions'), 'options']]
      : [['home', t('navHome'), 'home'], ['sessions', t('navSessions'), 'sessions'], ['alerts', t('navAlerts'), 'alerts'], ['profile', t('navOptions'), 'options']];

    return `<div class="screen">
      <header class="header">
        ${topBack ? `<button class="icon-btn" data-action="back" aria-label="Go back">${icon('back')}</button>` : ''}
        <div class="title">
          <small>${esc(shortRole())}</small>
          <h1>${title}</h1>
        </div>
        <button class="icon-btn" data-action="nav" data-route="alerts" aria-label="${t('navAlerts')}">
          ${icon('alerts')}${state.alerts.some(a => !a.read) ? '<i class="dot"></i>' : ''}
        </button>
      </header>
      <div class="content">${body}</div>
      <nav class="bottom-nav" aria-label="Main navigation">
        ${navs.map(([r, tLabel, ic]) => `<button class="nav-item ${currentTab === r ? 'active' : ''}" data-action="nav" data-route="${r}" ${currentTab === r ? 'aria-current="page"' : ''}>${icon(ic || r)}<span>${tLabel}</span></button>`).join('')}
      </nav>
    </div>`;
  }

  function sessionCard(s) {
    const totalKg = s.lots.reduce((n, l) => n + l.quantity, 0);

    return `<button class="card click-card session-card" data-action="open-session" data-id="${s.id}">
      <div class="card-top" style="align-items:flex-start">
        <div style="flex:1;min-width:0;padding-right:10px">
          <h3 class="session-farmer-names">${s.id} · ${s.lots.length} ${t('farmerLots')}</h3>
          <p class="card-subtitle" style="margin-top:4px;line-height:1.45">
            ${t('totalQuantity')}: <strong>${totalKg} kg</strong><br>
            ${t('operator')}: <strong>${esc(s.operator)}</strong>${s.fault ? ' · ' + t('alert') : ''}
          </p>
        </div>
        <div style="text-align:right;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:5px">
          <span class="session-time-text">${esc(s.time)}</span>
          ${badge(s.status)}
        </div>
      </div>
      <div class="card-footer-action" style="padding-top:8px;margin-top:0">
        <span>${t('tapToViewDetails')}</span>
        ${icon('right')}
      </div>
    </button>`;
  }

  function pcaHomeScreen() {
    const activeMembers = state.members.filter(m => m.active).length;
    const completedSessions = state.sessions.filter(s => s.status === 'Completed');
    const totalDryingKg = state.sessions.reduce((acc, s) => acc + s.lots.reduce((n, l) => n + l.quantity, 0), 0);
    const avgMoisture = '5.9%';
    const recentSessions = state.sessions.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).slice(0, 3);

    let body = `
      <div class="banner-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <span class="badge completed" style="margin-bottom:6px">${t('pcaFacility')}</span>
            <h3>Philippine Coconut Authority</h3>
            <p>${t('pcaFacilityDesc')}</p>
          </div>
          <div class="banner-badge" aria-hidden="true">${icon('coconut')}</div>
        </div>
        <div style="font-size:12px;color:var(--muted);border-top:1px solid #00000010;padding-top:6px;margin-top:4px">
          Coconut Farmers & Industry Development Plan (CFIDP)
        </div>
      </div>

      <div class="pca-kpi-grid">
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${activeMembers} <span style="font-size:13px;color:var(--muted);font-weight:normal">/ ${state.members.length}</span></strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('users')}</span>
          </div>
          <span>${t('registeredMembers')}</span>
        </div>
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${completedSessions.length}</strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('box')}</span>
          </div>
          <span>${t('batchesProcessed')}</span>
        </div>
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${totalDryingKg.toLocaleString()} <span style="font-size:13px;font-weight:normal">kg</span></strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('coconut')}</span>
          </div>
          <span>${t('totalCopraDried')}</span>
        </div>
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong class="text-green">${avgMoisture}</strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('moisture')}</span>
          </div>
          <span>${t('avgMoisture')} (≤6.0% Target)</span>
        </div>
      </div>

      <div class="card">
        <div class="card-top">
          <h3>${t('quickActions')}</h3>
        </div>
        <div class="button-row">
          ${btn(`${icon('plus')} ${t('registerMember')}`, 'new-member')}
          ${btn(`${icon('reports')} ${t('navRecords')}`, 'nav', 'secondary', 'data-route="reports"')}
        </div>
      </div>

      <section class="section">
        <div class="section-heading">
          <h2>${t('recentDryingRuns')}</h2>
        </div>
        ${recentSessions.map(s => {
          const totalKg = s.lots.reduce((n, l) => n + l.quantity, 0);
          const farmerNames = s.lots.map(l => esc(member(l.memberId)?.name || l.memberId)).join(', ');
          return `<button class="card click-card" data-action="open-session" data-id="${s.id}" style="padding:14px 16px">
            <div class="card-top" style="align-items:flex-start">
              <div style="flex:1;min-width:0">
                <h3 style="font-size:15px;margin:0 0 4px">${farmerNames}</h3>
                <p class="card-subtitle">${s.id} · ${niceDate(s.date)} · ${totalKg} kg · ${t('operator')}: ${esc(s.operator)}</p>
              </div>
              <div style="text-align:right;flex-shrink:0">
                ${badge(s.status)}
              </div>
            </div>
          </button>`;
        }).join('')}
      </section>

      <div class="card">
        <div class="card-top">
          <h3>${t('aboutCoprafy')}</h3>
        </div>
        <p class="card-subtitle" style="font-size:13px;line-height:1.5">${t('coprafyOverviewDesc')}</p>
        <div style="display:grid;gap:6px;margin-top:2px;font-size:12.5px;color:var(--ink);background:var(--cream);padding:10px 12px;border-radius:8px">
          <div><span class="inline-svg">${icon('temp')}</span> <strong>${t('featureMonitoring')}:</strong> ${t('featureMonitoringDesc')}</div>
          <div><span class="inline-svg">${icon('status')}</span> <strong>${t('featureTraceability')}:</strong> ${t('featureTraceabilityDesc')}</div>
          <div><span class="inline-svg">${icon('coconut')}</span> <strong>${t('featureQuality')}:</strong> ${t('featureQualityDesc')}</div>
        </div>
      </div>
    `;

    return shell(t('pcaDashboard'), body, false, 'home');
  }

  function headHomeScreen() {
    const todaySessions = state.sessions.filter(s => s.date === M.date());
    const scheduledSessions = state.sessions.filter(s => s.status === 'Scheduled');
    const dryingBatches = state.sessions.filter(s => M.ACTIVE.includes(s.status));
    const activeMembers = state.members.filter(m => m.active).length;
    const totalCopraDried = state.sessions.reduce((acc, s) => acc + s.lots.reduce((n, l) => n + l.quantity, 0), 0);

    let body = `
      <div class="banner-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <span class="badge completed" style="margin-bottom:6px">${t('pcaFacility')}</span>
            <h3>Philippine Coconut Authority</h3>
            <p>${t('pcaFacilityDesc')}</p>
          </div>
          <div class="banner-badge" aria-hidden="true">${icon('coconut')}</div>
        </div>
        <div style="font-size:12px;color:var(--muted);border-top:1px solid #00000010;padding-top:6px;margin-top:4px">
          Coconut Farmers & Industry Development Plan (CFIDP)
        </div>
      </div>

      <div class="pca-kpi-grid">
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${todaySessions.length}</strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('cycle')}</span>
          </div>
          <span>${t('batchesToday')}</span>
        </div>
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${scheduledSessions.length}</strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('calendar')}</span>
          </div>
          <span>${t('scheduled')}</span>
        </div>
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${activeMembers} <span style="font-size:13px;color:var(--muted);font-weight:normal">/ ${state.members.length}</span></strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('users')}</span>
          </div>
          <span>${t('registeredMembers')}</span>
        </div>
        <div class="pca-kpi-card">
          <div class="pca-kpi-top">
            <strong>${totalCopraDried.toLocaleString()} <span style="font-size:13px;font-weight:normal">kg</span></strong>
            <span class="pca-kpi-badge" aria-hidden="true">${icon('coconut')}</span>
          </div>
          <span>${t('totalCopraDried')}</span>
        </div>
      </div>
    `;

    body += `<section class="section">${heading(t('activeDryerMonitoring'))}`;
    if (dryingBatches.length) {
      body += dryingBatches.map(s => {
        const totalKg = s.lots.reduce((n, l) => n + l.quantity, 0);
        const phases = ['Loading', 'Drying', 'Cooldown', 'Ready', 'Completed'],
              ix = { 'Scheduled': -1, 'Loading': 0, 'Drying': 1, 'Cooldown': 2, 'Ready to unload': 3, 'Completed': 4 }[s.status];

        let notice = '';
        if (state.offline) notice = `<div class="info warning"><strong>${t('monitorOffline')}</strong>${t('monitorOfflineDesc')}</div>`;
        else if (s.fault) notice = `<div class="info fault"><strong>${t('alert')}: ${esc(s.fault)}</strong>Check the dryer controls.</div>`;
        else if (s.status === 'Cooldown') notice = `<div class="info warning"><strong>${t('cooldownInProgress')}</strong>${s.safeCooldown ? t('cooldownClearanceRecorded') : t('cooldownWait')}</div>`;
        else if (s.status === 'Ready to unload') notice = `<div class="info"><strong>${t('readyToUnload')}</strong>${t('readyToUnloadNotice')}</div>`;
        else if (s.status === 'Completed') notice = `<div class="info"><strong>${t('completed')}</strong>${t('completedNotice')}</div>`;
        else if (s.status === 'Drying' && s.heatingPaused) notice = `<div class="info warning"><strong>${t('heatingPaused')}</strong>${t('heatingPausedDesc')}</div>`;
        else if (s.status === 'Drying') notice = `<div class="info"><strong>${t('dryingInProgress')}</strong>${t('dryingInProgressDesc')}</div>`;

        return `<div class="card">
          <div class="card-top">
            <div>
              <h3 style="font-size:17px">Batch ${s.id} · ${niceDate(s.date)}</h3>
              <p class="card-subtitle" style="font-size:13px;margin-top:2px">${t('assignedOperator')}: <strong>${esc(s.operator)}</strong></p>
            </div>
            ${badge(s.status)}
          </div>

          ${readingMarkup(s)}

          <div style="margin-top:4px">
            <div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px">${t('progress')}</div>
            <div class="steps">${phases.map((p, i) => `<div class="step ${i < ix ? 'done' : i === ix ? 'current' : ''}">${phaseMap[p]?.[lang] || p}</div>`).join('')}</div>
          </div>

          ${notice}

          <div class="card-lots-summary compact" style="margin-top:4px">
            <div class="card-lots-header">
              <span>${t('farmerLots')} (${s.lots.length})</span>
              <span>${t('total')}: ${totalKg} kg</span>
            </div>
          </div>

          ${role === 'head' && s.status === 'Ready to unload' ? btn(t('recordUnloadCompletion'), 'complete', '', `data-id="${s.id}"`) : ''}

          <button type="button" class="card-footer-action" data-action="open-session" data-id="${s.id}">
            <span>${t('tapToViewDetails')}</span>
            ${icon('right')}
          </button>
        </div>`;
      }).join('');
    } else {
      body += `<div class="card" style="text-align:center;padding:32px 18px">
        <h3 style="font-size:17px;margin-bottom:6px">${t('dryerIdle')}</h3>
        <p class="card-subtitle" style="max-width:300px;margin:0 auto 16px">${t('dryerIdleDesc')}</p>
        ${btn(`${icon('plus')} ${t('scheduleNewLoad')}`, 'new-session')}
      </div>`;
    }
    body += `</section>`;

    body += btn(`${icon('plus')} ${t('scheduleNewLoad')}`, 'new-session');

    return shell(t('dashboard'), body, false, 'home');
  }

  function homeScreen() {
    if (role === 'pca') return pcaHomeScreen();
    return headHomeScreen();
  }

  function calendar() {
    const [year, month] = calendarMonth.split('-').map(Number);
    const count = new Date(year, month, 0).getDate();
    const first = new Date(year, month - 1, 1).getDay();
    const dayNames = lang === 'fil' ? ['Li', 'Lu', 'Ma', 'Mi', 'Hu', 'Bi', 'Sa'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return `<div class="card">
      <div class="calendar-heading">
        <button class="icon-btn" data-action="month" data-delta="-1" aria-label="Previous month">${icon('back')}</button>
        <strong>${new Date(year, month - 1, 1).toLocaleDateString(lang === 'fil' ? 'fil-PH' : 'en-PH', { month: 'long', year: 'numeric' })}</strong>
        <button class="icon-btn" data-action="month" data-delta="1" aria-label="Next month">${icon('right')}</button>
      </div>
      <div class="calendar">
        ${dayNames.map(tLabel => `<span>${tLabel}</span>`).join('')}
        ${Array.from({ length: first }, () => '<button class="blank" disabled tabindex="-1" aria-hidden="true"></button>').join('')}
        ${Array.from({ length: count }, (_, i) => {
          const d = `${calendarMonth}-${String(i + 1).padStart(2, '0')}`;
          const isSelected = selectedDate === d;
          const hasLoad = state.sessions.some(s => s.date === d);
          return `<button class="${isSelected ? 'selected' : ''} ${hasLoad ? 'has-load' : ''}" data-action="calendar-date" data-date="${d}" aria-label="${niceDate(d)}" ${isSelected ? 'aria-pressed="true"' : ''}>${i + 1}</button>`;
        }).join('')}
      </div>
    </div>`;
  }

  function sessionsScreen() {
    const daySessions = state.sessions
      .filter(s => s.date === selectedDate)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    let body = calendar();
    body += `<section class="section">${heading(niceDate(selectedDate))}`;
    if (daySessions.length) {
      body += daySessions.map(sessionCard).join('');
    } else {
      body += empty(t('noSessionsDay'), t('noSessionsDay'));
    }
    body += '</section>';

    if (role === 'head') {
      body += btn(`${icon('plus')} ${t('scheduleNewLoad')}`, 'new-session');
    }

    return shell(role === 'pca' ? t('navRecords') : t('sharedSessions'), body, false, 'sessions');
  }

  function lotsMarkup(s, sampling = false) {
    return s.lots.map(l => `<div class="lot-card">
      <div class="card-top">
        <h3>${esc(member(l.memberId)?.name || l.memberId)}</h3>
        <small>${l.id}</small>
      </div>
      <p class="card-subtitle">${l.quantity} kg · ${t('trays')} ${esc(l.trays)} · ${l.memberId}</p>
      <p class="card-subtitle">${t('sample')}: ${l.sample ? `${l.sample.moisture}% · <strong class="${l.sample.accepted ? 'text-green' : 'error-text'}">${l.sample.accepted ? t('accepted') : t('needsDryingReview')}</strong>` : t('notRecordedYet')}</p>
      ${sampling && role === 'head' && ['Drying', 'Cooldown'].includes(s.status) ? btn(t('recordSample'), 'sample', 'secondary small', `data-id="${s.id}" data-lot="${l.id}"`) : ''}
    </div>`).join('');
  }

  function detailScreen() {
    const s = session(selectedId);
    if (!s) return shell('Session', empty('Session not found', 'Please return to sessions.'), true, 'sessions');

    let actions = '';
    if (role === 'head' && ['Scheduled', 'Loading'].includes(s.status)) actions += btn(t('editLoad'), 'edit-session', 'secondary', `data-id="${s.id}"`);
    if (['head', 'pca'].includes(role) && s.status !== 'Completed') actions += btn(t('assignOperator'), 'assign-operator', 'secondary', `data-id="${s.id}"`);
    if (role === 'head' && s.status === 'Ready to unload') actions += btn(t('recordUnloadCompletion'), 'complete', '', `data-id="${s.id}"`);

    return shell(s.id, `
      <div class="card session-meta-card">
        <div class="card-top">
          <h2>${niceDate(s.date)} · ${esc(s.time)}</h2>
          ${badge(s.status)}
        </div>
        <dl class="kv">
          <dt>${t('operator')}</dt><dd>${esc(s.operator)}</dd>
          <dt>${t('farmerLots')}</dt><dd>${s.lots.length}</dd>
          <dt>${t('total')} kg</dt><dd>${s.lots.reduce((n, l) => n + l.quantity, 0)} kg</dd>
          <dt>${t('duration')}</dt><dd>${esc(s.duration || (s.startedAt ? t('inProgress') : t('notStarted')))}</dd>
        </dl>
      </div>
      <section class="section">${heading(`${t('farmerLots')} (${s.lots.length})`)}${lotsMarkup(s, true)}</section>
      ${actions ? `<div class="section">${actions}</div>` : ''}
      <section class="section">${heading(t('history'))}<div class="timeline">${[...s.history].reverse().map(h => `<div><p>${esc(h.event)}</p><small>${niceTime(h.time)}</small></div>`).join('')}</div></section>
    `, true, 'sessions');
  }

  function readingMarkup(s) {
    const r = s.reading, unavailable = !r, moistureUnavailable = !r || s.faultType === 'sensor', stale = state.offline && s.status !== 'Completed';
    return `<div class="readings ${stale ? 'stale' : ''}">
      <div class="reading">
        <div class="reading-ill reading-ill-moisture" aria-hidden="true">${icon('moisture')}</div>
        <strong>${moistureUnavailable ? '—' : r.moisture + '%'}</strong>
        <small>${t('copraMoisture').replace('\n', '<br>')}</small>
      </div>
      <div class="reading">
        <div class="reading-ill reading-ill-temp" aria-hidden="true">${icon('temp')}</div>
        <strong>${unavailable ? '—' : r.temperature + '°C'}</strong>
        <small>${t('chamberTemp').replace('\n', '<br>')}</small>
      </div>
      <div class="reading">
        <div class="reading-ill reading-ill-humidity" aria-hidden="true">${icon('humidity')}</div>
        <strong>${unavailable ? '—' : r.humidity + '%'}</strong>
        <small>${t('chamberHumidity').replace('\n', '<br>')}</small>
      </div>
    </div>
    <p class="fine-print">${r ? `${stale ? t('offlineReadings') : `${t('updated')} ${niceTime(r.updatedAt)}`}` : t('readingsAppear')}</p>`;
  }

  function statusScreen() {
    return homeScreen();
  }

  function draftScreen() {
    if (!draft) {
      draft = {
        date: (selectedDate && selectedDate >= M.date()) ? selectedDate : M.date(1),
        time: '08:00',
        operator: state.operators[0],
        lots: [{ memberId: state.members.find(m => m.active)?.id || '', quantity: '', trays: '' }]
      };
    }

    return shell(editingId ? t('editLoad') : t('scheduleNewLoad'), `
      <form id="session-form" class="form">
        <div class="field-row">
          ${field(`<label for="load-date">${t('loadingDate')}</label>`, `<input type="date" name="date" id="load-date" value="${esc(draft.date)}" required>`)}
          ${field(`<label for="load-time">${t('time')}</label>`, `<input type="time" name="time" id="load-time" value="${esc(draft.time)}" required>`)}
        </div>
        ${heading(`${t('farmerLots')} (${draft.lots.length})`)}
        ${draft.lots.map((l, i) => `
          <div class="lot-form">
            <div class="section-heading">
              <small>Lot ${i + 1}</small>
              ${draft.lots.length > 1 ? `<button type="button" class="remove-btn" data-action="remove-lot" data-index="${i}">${t('cancel')}</button>` : ''}
            </div>
            ${field(`<label for="member-${i}">${t('farmerMember')}</label>`, `<select id="member-${i}" name="member-${i}"><option value="">${lang === 'fil' ? 'Pumili ng miyembro' : 'Select member'}</option>${optionMembers(l.memberId)}</select>`)}
            <div class="field-row">
              ${field(`<label for="qty-${i}">${t('quantityKg')}</label>`, `<input id="qty-${i}" name="qty-${i}" type="number" min="0.01" step="0.01" value="${esc(l.quantity)}" required>`)}
              ${field(`<label for="trays-${i}">${t('trayNumbers')}</label>`, `<input id="trays-${i}" name="trays-${i}" value="${esc(l.trays)}" placeholder="e.g. 1-2" required>`)}
            </div>
          </div>
        `).join('')}
        ${btn(`${icon('plus')} ${t('addFarmerLot')}`, 'add-lot', 'secondary')}
        ${field(`<label for="operator">${t('assignedOperator')}</label>`, `<select id="operator" name="operator">${optionOperators(draft.operator)}</select>`)}
        <p class="form-error" role="alert"></p>
        <button class="btn" type="submit">${editingId ? t('saveChanges') : t('saveSchedule')}</button>
        ${btn(t('cancel'), 'back', 'secondary')}
      </form>
    `, true, 'sessions');
  }

  function readDraft() {
    const f = $('#session-form');
    if (!f) return;
    const data = new FormData(f);
    draft = {
      ...draft,
      date: data.get('date'),
      time: data.get('time'),
      operator: data.get('operator'),
      lots: draft.lots.map((l, i) => ({
        ...l,
        memberId: data.get(`member-${i}`),
        quantity: data.get(`qty-${i}`),
        trays: data.get(`trays-${i}`)
      }))
    };
  }

  function bookingsScreen() {
    return shell('Member scheduling', `
      ${btn(`${icon('plus')} Schedule a member`, 'new-booking')}
      <section class="section">
        ${heading('Member bookings')}
        ${state.bookings.length ? state.bookings.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map(b => `
          <div class="card compact">
            <div class="card-top">
              <h3>${esc(member(b.memberId)?.name)}</h3>
              <span class="badge ${b.sessionId ? 'completed' : 'scheduled'}">${b.sessionId ? 'Linked to session' : 'Booked'}</span>
            </div>
            <p>${niceDate(b.date)} · ${esc(b.time)} · ${b.quantity} kg</p>
            <small class="muted">${esc(b.notes) || 'No notes'}</small>
            ${b.sessionId ? btn('View session', 'open-session', 'secondary small', `data-id="${b.sessionId}"`) : btn('Log load', 'booking-load', 'secondary small', `data-date="${b.date}" data-time="${b.time}"`)}
          </div>
        `).join('') : empty('No bookings', 'No farmer-members scheduled yet.')}
      </section>
    `, true, 'home');
  }

  function membersScreen() {
    const total = state.members.length;
    const activeCount = state.members.filter(m => m.active).length;
    const inactiveCount = total - activeCount;

    let rows = state.members.filter(m => {
      const matchSearch = (m.name + ' ' + m.id + ' ' + (m.phone || '')).toLowerCase().includes(memberSearch.toLowerCase());
      if (!matchSearch) return false;
      if (memberFilter === 'active') return m.active;
      if (memberFilter === 'inactive') return !m.active;
      return true;
    });

    const memberKg = mId => state.sessions.reduce((acc, s) => acc + s.lots.filter(l => l.memberId === mId).reduce((n, l) => n + l.quantity, 0), 0);
    const memberBatches = mId => state.sessions.filter(s => s.lots.some(l => l.memberId === mId)).length;

    let body = `
      ${field(`<label for="member-search">${t('searchMembersPlaceholder')}</label>`, `<input id="member-search" type="search" value="${esc(memberSearch)}" placeholder="${t('searchMembersPlaceholder')}">`)}

      <div class="filter-chips">
        <button type="button" class="chip-btn ${memberFilter === 'all' ? 'active' : ''}" data-action="filter-members" data-filter="all">${t('allMembers')} (${total})</button>
        <button type="button" class="chip-btn ${memberFilter === 'active' ? 'active' : ''}" data-action="filter-members" data-filter="active">${t('activeMembers')} (${activeCount})</button>
        <button type="button" class="chip-btn ${memberFilter === 'inactive' ? 'active' : ''}" data-action="filter-members" data-filter="inactive">${t('inactiveMembers')} (${inactiveCount})</button>
      </div>

      ${btn(`${icon('plus')} ${t('registerFarmerMember')}`, 'new-member')}

      <section class="section">
        ${heading(`${t('farmerDirectory')} (${rows.length})`)}
        ${rows.length ? rows.map(m => {
          const kg = memberKg(m.id);
          const batches = memberBatches(m.id);
          return `<div class="card" style="padding:14px 16px;gap:8px">
            <div class="card-top" style="align-items:flex-start">
              <div>
                <h3 style="font-size:16px;margin:0 0 2px">${esc(m.name)}</h3>
                <small class="muted" style="font-size:12.5px">${m.id}</small>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                ${m.isOperator ? `<span class="badge in-progress" style="font-size:11px">⚙️ Operator</span>` : ''}
                <span class="badge ${m.active ? 'completed' : 'offline'}">${m.active ? t('activeMembers') : t('inactiveMembers')}</span>
                <button type="button" class="edit-member-btn" data-action="edit-member" data-id="${m.id}" aria-label="${t('editMember')}">
                  ${icon('edit')}
                </button>
              </div>
            </div>
            ${m.phone ? `<div style="font-size:12.5px;color:var(--muted)">📞 ${esc(m.phone)}</div>` : ''}
            <div style="font-size:12.5px;color:var(--ink);background:var(--cream);padding:8px 10px;border-radius:8px;display:flex;justify-content:space-between">
              <span>${t('totalCopraDried')}: <strong>${kg} kg</strong></span>
              <span><strong>${batches}</strong> ${t('batchesCount')}</span>
            </div>
          </div>`;
        }).join('') : empty('No members found', 'Try another search term or register a new member.')}
      </section>
    `;

    return shell(t('navMembers'), body, false, 'members');
  }

  function rangeDates() {
    if (reportRange === 'today') return [M.date(), M.date()];
    if (reportRange === '7') return [M.date(-6), M.date()];
    if (reportRange === '30') return [M.date(-29), M.date()];
    if (reportRange === 'month') return [M.date().slice(0, 7) + '-01', M.date()];
    if (reportRange === 'all') return ['2020-01-01', M.date(30)];
    return [reportFrom, reportTo];
  }

  function filteredReports() {
    const [from, to] = rangeDates();
    let rows = state.sessions.filter(s => s.date >= from && s.date <= to);
    if (reportSort === 'oldest') {
      rows.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    } else if (reportSort === 'batch') {
      rows.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      rows.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    }
    return rows;
  }

  function reportsScreen() {
    const rows = filteredReports(), [from, to] = rangeDates();
    const totalKg = rows.reduce((acc, s) => acc + s.lots.reduce((n, l) => n + l.quantity, 0), 0);
    const completedCount = rows.filter(s => s.status === 'Completed').length;

    let body = `
      <div class="card" style="padding:14px 16px;gap:10px">
        <div class="section-heading">
          <label style="font-weight:600;font-size:14px">${t('filterPeriod')}</label>
          <div style="font-size:12.5px;color:var(--muted)">${rows.length} ${rows.length === 1 ? 'record' : 'records'}</div>
        </div>

        <div class="filter-chips">
          <button type="button" class="chip-btn ${reportRange === 'today' ? 'active' : ''}" data-action="set-range" data-range="today">${t('today')}</button>
          <button type="button" class="chip-btn ${reportRange === '7' ? 'active' : ''}" data-action="set-range" data-range="7">${t('last7Days')}</button>
          <button type="button" class="chip-btn ${reportRange === 'month' ? 'active' : ''}" data-action="set-range" data-range="month">${t('thisMonth')}</button>
          <button type="button" class="chip-btn ${reportRange === 'all' ? 'active' : ''}" data-action="set-range" data-range="all">${t('allTime')}</button>
          <button type="button" class="chip-btn ${reportRange === 'custom' ? 'active' : ''}" data-action="set-range" data-range="custom">${t('customRange')}</button>
        </div>

        ${reportRange === 'custom' ? `
          <div class="field-row">
            ${field('<label for="report-from">From</label>', `<input type="date" id="report-from" value="${reportFrom}">`)}
            ${field('<label for="report-to">To</label>', `<input type="date" id="report-to" value="${reportTo}">`)}
          </div>
        ` : ''}

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #0000000f;padding-top:10px">
          <label for="report-sort" style="font-size:13px;font-weight:500;color:var(--muted)">${t('sortBy')}:</label>
          <select id="report-sort" style="font-size:13px;padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:white">
            <option value="newest" ${reportSort === 'newest' ? 'selected' : ''}>${t('dateNewest')}</option>
            <option value="oldest" ${reportSort === 'oldest' ? 'selected' : ''}>${t('dateOldest')}</option>
            <option value="batch" ${reportSort === 'batch' ? 'selected' : ''}>${t('batchIdAsc')}</option>
          </select>
        </div>
      </div>

      <div class="pca-kpi-grid">
        <div class="pca-kpi-card" style="padding:12px">
          <strong>${rows.length}</strong>
          <span>${t('batchesProcessed')} (${completedCount} done)</span>
        </div>
        <div class="pca-kpi-card" style="padding:12px">
          <strong>${totalKg.toLocaleString()} kg</strong>
          <span>${t('totalCopraDried')}</span>
        </div>
      </div>

      <div class="card" style="padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h3 style="font-size:15px;margin:0 0 2px">${reportRange === 'all' ? t('allTime') : `${niceDate(from)} – ${niceDate(to)}`}</h3>
            <small class="muted" style="font-size:12px">${t('tapToView')}</small>
          </div>
          ${btn(`${icon('download')} ${t('downloadPdfReport')}`, 'export', 'small', rows.length && from <= to ? '' : 'disabled')}
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>${t('batchCol')}</th>
                <th>${t('dateTimeCol')}</th>
                <th>${t('farmersCol')}</th>
                <th>${t('qtyCol')}</th>
                <th>${t('operatorCol')}</th>
                <th>${t('moistureCol')}</th>
                <th>${t('statusCol')}</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows.map(s => {
                const bKg = s.lots.reduce((n, l) => n + l.quantity, 0);
                const memberNames = s.lots.map(l => member(l.memberId)?.name || l.memberId).join(', ');
                const sampleMoisture = s.lots.find(l => l.sample)?.sample?.moisture;
                const moistureDisplay = sampleMoisture ? `<strong class="text-green">${sampleMoisture}%</strong>` : (s.reading ? `${s.reading.moisture}%` : '—');
                return `<tr class="clickable-row" data-action="open-session" data-id="${s.id}">
                  <td><strong>${s.id}</strong></td>
                  <td>${niceDate(s.date)}<br><small class="muted">${esc(s.time)}</small></td>
                  <td>
                    <span style="font-weight:500">${esc(memberNames)}</span>
                    <br><small class="muted">${s.lots.length} lot${s.lots.length === 1 ? '' : 's'}</small>
                  </td>
                  <td><strong>${bKg} kg</strong></td>
                  <td>${esc(s.operator)}</td>
                  <td>${moistureDisplay}</td>
                  <td>${badge(s.status)}</td>
                </tr>`;
              }).join('') : `<tr><td colspan="7" style="text-align:center;padding:28px 14px;color:var(--muted)">No records found for this period.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return shell(t('dryingRecordsTitle'), body, false, 'reports');
  }

  function alertsScreen() {
    return shell(t('navAlerts'), `
      <section class="section">
        ${state.alerts.length ? state.alerts.map(a => `
          <div class="card alert-row ${a.read ? '' : 'unread'}">
            <div class="card-top">
              <h3>${esc(a.title)}</h3>
              ${a.kind === 'fault' ? `<span class="badge fault">${t('alert')}</span>` : a.kind === 'warning' ? `<span class="badge cooldown">${t('cooldownInProgress')}</span>` : a.kind === 'ready' ? `<span class="badge ready">${t('readyToUnload')}</span>` : ''}
            </div>
            <p>${esc(a.detail)}</p>
            <time>${a.sessionId} · ${new Date(a.time).toLocaleString(lang === 'fil' ? 'fil-PH' : 'en-PH', { dateStyle: 'short', timeStyle: 'short' })}</time>
            <div class="button-row">
              ${btn(t('viewDetails'), 'open-status', 'secondary small', `data-id="${a.sessionId}"`)}
              ${a.read ? `<small class="muted" style="align-self:center">${t('read')}</small>` : btn(t('markAsRead'), 'read-alert', 'secondary small', `data-id="${a.id}"`)}
            </div>
          </div>
        `).join('') : empty(t('noAlerts'), t('allDryersNormal'))}
      </section>
    `, false, role === 'head' ? 'alerts' : 'home');
  }

  function profileScreen() {
    const isPca = role === 'pca';
    return shell(t('optionsTitle'), `
      <div class="card">
        <div class="profile-top">
          <div class="avatar">${isPca ? 'P' : 'A'}</div>
          <div>
            <h2>${isPca ? 'PCA Personnel' : 'Arman Jose'}</h2>
            <small class="muted">${esc(roleName())}</small>
          </div>
        </div>
        <div class="divider"></div>
        <dl class="kv">
          <dt>${t('email')}</dt><dd>${role}@coprafy.demo</dd>
          <dt>Facility</dt><dd>SPF San Lorenzo Ruiz</dd>
          <dt>${t('appVersion')}</dt><dd>1.1</dd>
        </dl>
      </div>

      <div class="card">
        <div class="card-top">
          <div>
            <h3 style="font-size:16px">${t('languageSetting')}</h3>
            <p class="card-subtitle">${t('languageDesc')}</p>
          </div>
        </div>
        <div class="lang-selector">
          <button type="button" class="lang-btn ${lang === 'en' ? 'active' : ''}" data-action="set-lang" data-lang="en">
            <div>
              <strong style="font-size:15px;display:block">English</strong>
              <small class="muted" style="font-size:12px">Default language</small>
            </div>
            ${lang === 'en' ? '<span class="lang-check">✓</span>' : ''}
          </button>
          <button type="button" class="lang-btn ${lang === 'fil' ? 'active' : ''}" data-action="set-lang" data-lang="fil">
            <div>
              <strong style="font-size:15px;display:block">Filipino (Tagalog)</strong>
              <small class="muted" style="font-size:12px">Mas madaling basahin para sa mga magsasaka</small>
            </div>
            ${lang === 'fil' ? '<span class="lang-check">✓</span>' : ''}
          </button>
        </div>
      </div>

      <div class="card">
        ${isPca ? `<button class="list-row" data-action="nav" data-route="simulation"><span>${t('demoScenarios')}</span>${icon('right')}</button>` : ''}
        <button class="list-row" data-action="about"><span>${t('aboutCoprafy')}</span>${icon('right')}</button>
        <button class="list-row" data-action="reset"><span>${t('resetRecords')}</span>${icon('right')}</button>
      </div>

      ${btn(t('logout'), 'logout', 'secondary')}
    `, false, 'profile');
  }

  function simulationScreen() {
    const s = session(selectedId) || active() || state.sessions[0];
    selectedId = s.id;
    return shell('Demo scenarios', `
      ${field('<label for="demo-session">Simulated session</label>', `<select id="demo-session">${state.sessions.map(o => `<option value="${o.id}" ${o.id === s.id ? 'selected' : ''}>${o.id} · ${o.status}</option>`).join('')}</select>`)}
      <div class="card">
        <div class="card-top">
          <h3>${s.id}</h3>
          ${badge(s.status)}
        </div>
        <small class="muted">${s.fault ? esc(s.fault) : 'No active fault'} · ${state.offline ? 'Monitor offline' : 'Connected'}</small>
        <div class="test-actions">
          ${[['load', 'Begin loading'], ['start', 'Dryer startup'], ['cooldown', 'Reach cooldown'], ['cooled', 'Confirm cooldown'], ['door', 'Door opened'], ['sensor', 'Sensor alert'], ['airflow', 'Airflow loss'], ['overheat', 'Overtemp alert'], ['clear-fault', 'Clear alert'], ['resume', 'Resume heating'], ['offline', 'Simulate offline'], ['reconnect', 'Reconnect']].map(([a, l]) => btn(l, 'simulate', 'secondary', `data-event="${a}" data-id="${s.id}"`)).join('')}
        </div>
      </div>
      ${btn('View monitoring', 'open-status', '', `data-id="${s.id}"`)}
    `, true, 'profile');
  }

  function render() {
    const routes = {
      roles: rolesScreen, login: loginScreen, home: homeScreen,
      sessions: sessionsScreen, detail: detailScreen, status: statusScreen,
      draft: draftScreen, bookings: bookingsScreen, members: membersScreen,
      reports: reportsScreen, alerts: alertsScreen, profile: profileScreen,
      simulation: simulationScreen
    };
    if (!role && !['roles', 'login'].includes(route)) route = 'roles';
    if (role === 'head' && ['members', 'reports', 'simulation'].includes(route)) route = 'home';
    if (role === 'pca' && ['draft', 'bookings', 'sessions'].includes(route)) route = 'reports';
    $('#app').innerHTML = (routes[route] || homeScreen)();
    window.scrollTo(0, 0);
  }

  function openMember(id) {
    const m = id ? member(id) : { name: '', phone: '', active: true, isOperator: false };
    modal(id ? t('editMember') : t('registerFarmerMember'), `
      <form id="member-form" class="form" data-id="${id || ''}">
        ${field(`<label for="member-name">${t('fullName')}</label>`, `<input name="name" id="member-name" value="${esc(m.name)}" placeholder="e.g. Juan Dela Cruz" required>`)}
        ${field(`<label for="phone">${t('contactNumber')} (${lang === 'fil' ? 'opsyonal' : 'optional'})</label>`, `<input name="phone" type="tel" id="phone" value="${esc(m.phone)}" placeholder="09xxxxxxxxx">`)}
        <label class="check" style="margin-top:4px"><input name="isOperator" type="checkbox" ${m.isOperator ? 'checked' : ''}> ${t('designateOperator')}</label>
        ${id ? `<label class="check"><input name="active" type="checkbox" ${m.active ? 'checked' : ''}> ${t('activeStatus')}</label>` : ''}
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn">${t('saveMember')}</button>
      </form>
    `);
  }

  function openSample(id, lotId) {
    const s = session(id), l = s.lots.find(l => l.id === lotId);
    modal(t('recordSample'), `
      <p><strong>${esc(member(l.memberId)?.name)}</strong> · Lot ${l.id}</p>
      <form id="sample-form" class="form" data-id="${id}" data-lot="${lotId}">
        ${field(`<label for="sample-value">${t('sampleMoisturePercent')}</label>`, `<input id="sample-value" name="moisture" type="number" min="0.01" max="100" step="0.01" value="${l.sample?.moisture ?? ''}" placeholder="e.g. 5.8" required>`)}
        ${field(`<label for="sample-note">${t('notes')}</label>`, `<textarea id="sample-note" name="note" placeholder="${lang === 'fil' ? 'Puna o obserbasyon' : 'Any observation'}">${esc(l.sample?.note || '')}</textarea>`)}
        <small class="muted">${lang === 'fil' ? 'Target moisture ay ≤6%. Ang lampas sa 6% ay kailangang patuyuin pa.' : 'Target moisture is ≤6%. Batches above 6% require further drying.'}</small>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn">${t('saveSampleResult')}</button>
      </form>
    `);
  }

  function openBooking() {
    modal('Schedule farmer-member', `
      <form id="booking-form" class="form">
        ${field('<label for="booking-member">Farmer-member</label>', `<select id="booking-member" name="memberId">${optionMembers('')}</select>`)}
        <div class="field-row">
          ${field('<label for="booking-date">Date</label>', `<input type="date" id="booking-date" name="date" value="${M.date(1)}" min="${M.date()}" required>`)}
          ${field('<label for="booking-time">Time</label>', '<input type="time" name="time" id="booking-time" value="08:00" required>')}
        </div>
        ${field('<label for="booking-qty">Quantity (kg)</label>', '<input type="number" name="quantity" id="booking-qty" min="0.01" step="0.01" required>')}
        ${field('<label for="booking-notes">Notes (optional)</label>', '<textarea id="booking-notes" name="notes"></textarea>')}
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn">Save booking</button>
      </form>
    `);
  }

  function browserPdf(lines) {
    const ascii = lines.map(t => String(t).normalize('NFKD').replace(/[^\x20-\x7e]/g, '')).flatMap(t => {
      const arr = [];
      while (t.length > 90) {
        let i = t.lastIndexOf(' ', 90);
        if (i < 1) i = 90;
        arr.push(t.slice(0, i));
        t = t.slice(i).trimStart();
      }
      arr.push(t);
      return arr;
    });
    const pages = [];
    for (let i = 0; i < ascii.length; i += 49) pages.push(ascii.slice(i, i + 49));
    const objs = [null, '<< /Type /Catalog /Pages 2 0 R >>', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
    const kids = [];
    pages.forEach(page => {
      const pageNo = objs.length, contentNo = pageNo + 1;
      kids.push(`${pageNo} 0 R`);
      objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentNo} 0 R >>`);
      const s = 'BT /F1 10 Tf 14 TL 40 792 Td\n' + page.map((t, i) => (i ? 'T* ' : '') + '(' + t.replace(/[\\()]/g, '\\$&') + ') Tj').join('\n') + '\nET';
      objs.push(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);
    });
    objs[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${kids.join(' ')}] >>`;
    let pdf = '%PDF-1.4\n', offsets = [0];
    objs.slice(1).forEach((o, i) => {
      offsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objs.length}\n0000000000 65535 f \n` + offsets.slice(1).map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') + `trailer << /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([pdf], { type: 'application/pdf' });
  }

  function exportPdf() {
    const lines = M.reportLines(state, role, filteredReports()), [from, to] = rangeDates(), filename = `COPRAFY-Report-${from}-to-${to}.pdf`;
    if (window.NativeCoprafy) {
      window.NativeCoprafy.exportPdf(JSON.stringify({ filename, lines }));
      toast(lang === 'fil' ? 'Pumili kung saan ise-save ang iyong PDF.' : 'Choose where to save your PDF.');
    } else {
      const url = URL.createObjectURL(browserPdf(lines)), a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast(lang === 'fil' ? 'Nai-download ang PDF report.' : 'PDF report downloaded.');
    }
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const a = el.dataset.action;

    try {
      if (a === 'choose-role') {
        chosenRole = el.dataset.role;
        go('login');
      } else if (a === 'change-role') {
        route = 'roles';
        stack = [];
        render();
      } else if (a === 'nav') {
        if (el.dataset.route === 'status') {
          selectedId = active()?.id || state.sessions[0]?.id;
          go('home');
          return;
        }
        go(el.dataset.route);
      } else if (a === 'home') {
        go('home');
      } else if (a === 'back') {
        back();
      } else if (a === 'close-modal') {
        closeModal();
      } else if (a === 'open-session') {
        go('detail', el.dataset.id);
      } else if (a === 'open-status') {
        if (el.dataset.id) selectedId = el.dataset.id;
        go('home', el.dataset.id);
      } else if (a === 'set-lang') {
        const nextLang = el.dataset.lang;
        if (nextLang && nextLang !== lang) {
          lang = nextLang;
          try { localStorage.setItem('coprafy.lang', lang); } catch (e) {}
          toast(lang === 'fil' ? 'Pinalitan ang wika sa Filipino.' : 'Language set to English.');
          render();
        }
      } else if (a === 'new-session') {
        editingId = null;
        draft = {
          date: (selectedDate && selectedDate >= M.date()) ? selectedDate : M.date(1),
          time: '08:00',
          operator: state.operators[0],
          lots: [{ memberId: state.members.find(m => m.active)?.id || '', quantity: '', trays: '' }]
        };
        go('draft');
      } else if (a === 'edit-session') {
        editingId = el.dataset.id;
        draft = M.copy(session(editingId));
        go('draft', editingId);
      } else if (a === 'add-lot') {
        readDraft();
        draft.lots.push({ memberId: '', quantity: '', trays: '' });
        const y = window.scrollY;
        render();
        window.scrollTo(0, y);
      } else if (a === 'remove-lot') {
        readDraft();
        draft.lots.splice(Number(el.dataset.index), 1);
        render();
      } else if (a === 'calendar-date') {
        selectedDate = el.dataset.date;
        render();
      } else if (a === 'month') {
        const [y, m] = calendarMonth.split('-').map(Number);
        const d = new Date(y, m - 1 + Number(el.dataset.delta), 1);
        calendarMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        render();
      } else if (a === 'filter-members') {
        memberFilter = el.dataset.filter;
        render();
      } else if (a === 'set-range') {
        reportRange = el.dataset.range;
        render();
      } else if (a === 'new-member') {
        openMember();
      } else if (a === 'edit-member') {
        openMember(el.dataset.id);
      } else if (a === 'sample') {
        openSample(el.dataset.id, el.dataset.lot);
      } else if (a === 'new-booking') {
        openBooking();
      } else if (a === 'booking-load') {
        const existing = state.sessions.find(s => s.status !== 'Completed' && s.date === el.dataset.date && s.time === el.dataset.time);
        if (existing) {
          go('detail', existing.id);
        } else {
          editingId = null;
          draft = {
            date: el.dataset.date,
            time: el.dataset.time,
            operator: state.operators[0],
            lots: state.bookings.filter(b => !b.sessionId && b.date === el.dataset.date && b.time === el.dataset.time).map(b => ({ memberId: b.memberId, quantity: b.quantity, trays: '' }))
          };
          go('draft');
        }
      } else if (a === 'read-alert') {
        const alertItem = state.alerts.find(item => item.id === el.dataset.id);
        if (alertItem) alertItem.read = true;
        save();
        render();
        toast(lang === 'fil' ? 'Nai-marka ang alerto bilang nabasa.' : 'Alert marked as read.');
      } else if (a === 'simulate') {
        M.simulate(state, el.dataset.id, el.dataset.event);
        save();
        render();
        toast('Simulated event triggered.');
      } else if (a === 'assign-operator') {
        const s = session(el.dataset.id);
        modal(t('assignOperator'), `
          <form id="operator-form" class="form" data-id="${s.id}">
            ${field(`<label for="new-operator">${t('operator')}</label>`, `<select name="operator" id="new-operator">${optionOperators(s.operator)}</select>`)}
            <p class="form-error" role="alert"></p>
            <button type="submit" class="btn">${t('saveChanges')}</button>
          </form>
        `);
      } else if (a === 'complete') {
        const s = session(el.dataset.id);
        modal(t('unloadingChecklist'), `
          <p>${lang === 'fil' ? `Kumpirmahin na ang batch <strong>${s.id}</strong> ay ganap nang naidiskarga mula sa chamber.` : `Confirm that batch <strong>${s.id}</strong> has been completely unloaded.`}</p>
          <form id="complete-form" class="form" data-id="${s.id}">
            <label class="check"><input type="checkbox" name="confirmed" required> ${t('confirmUnloaded')}</label>
            <p class="form-error" role="alert"></p>
            <button type="submit" class="btn">${t('completeSessionRecord')}</button>
          </form>
        `);
      } else if (a === 'export') {
        exportPdf();
      } else if (a === 'logout') {
        role = null;
        route = 'roles';
        stack = [];
        closeModal();
        render();
      } else if (a === 'about') {
        modal(t('aboutCoprafy'), '<p>COPRAFY is a smart copra drying and batch management system designed for agricultural cooperatives and farmers.</p><p>It tracks shared loads, chamber conditions, tray allocations, and moisture sampling.</p>', btn('Got it', 'close-modal'));
      } else if (a === 'reset') {
        modal(t('resetRecords'), '<p>This will restore original demo records and clear changes.</p>', `<div class="button-row">${btn(t('cancel'), 'close-modal', 'secondary')}${btn('Reset', 'confirm-reset', 'danger')}</div>`);
      } else if (a === 'confirm-reset') {
        state = M.seed();
        selectedId = 'S0231';
        draft = null;
        save();
        closeModal();
        render();
        toast('Demo records reset.');
      }
    } catch (err) {
      toast(err.message);
    }
  });

  document.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, data = new FormData(f);
    try {
      if (f.id === 'login-form') {
        if (data.get('email') !== `${chosenRole}@coprafy.demo` || data.get('password') !== 'demo1234') {
          throw Error('Please use the demo email and password demo1234.');
        }
        role = chosenRole;
        route = 'home';
        stack = [];
        selectedId = active()?.id || 'S0231';
        save();
        render();
      } else if (f.id === 'session-form') {
        readDraft();
        const s = M.saveSession(state, role, draft, editingId);
        save();
        route = 'detail';
        selectedId = s.id;
        draft = null;
        editingId = null;
        render();
        toast(lang === 'fil' ? 'Matagumpay na nai-iskedyul ang karga.' : 'Load scheduled successfully.');
      } else if (f.id === 'member-form') {
        M.saveMember(state, role, { name: data.get('name'), phone: data.get('phone'), active: f.dataset.id ? data.has('active') : true, isOperator: data.has('isOperator') }, f.dataset.id || null);
        save();
        closeModal();
        render();
        toast('Member saved.');
      } else if (f.id === 'booking-form') {
        M.saveBooking(state, role, Object.fromEntries(data));
        save();
        closeModal();
        render();
        toast('Member booked.');
      } else if (f.id === 'sample-form') {
        const result = M.sample(state, role, f.dataset.id, f.dataset.lot, data.get('moisture'), data.get('note'));
        save();
        closeModal();
        render();
        toast(result.accepted ? (lang === 'fil' ? 'Tanggap ang sample ng moisture (tuyo na).' : 'Moisture sample accepted.') : (lang === 'fil' ? 'Mataas pa sa target ang moisture (kailangan pang patuyuin).' : 'Sample above target (needs further drying).'));
      } else if (f.id === 'operator-form') {
        M.assignOperator(state, role, f.dataset.id, data.get('operator'));
        save();
        closeModal();
        render();
        toast(lang === 'fil' ? 'Nai-update ang nakatalagang operator.' : 'Operator updated.');
      } else if (f.id === 'complete-form') {
        M.complete(state, role, f.dataset.id, data.has('confirmed'));
        save();
        closeModal();
        render();
        toast(lang === 'fil' ? 'Nai-tala na ang pagdiskarga ng batch.' : 'Batch marked as completed.');
      }
    } catch (err) {
      const error = f.querySelector('.form-error');
      if (error) {
        error.textContent = err.message;
        error.scrollIntoView({ block: 'nearest' });
      } else {
        toast(err.message);
      }
    }
  });

  document.addEventListener('change', e => {
    const t = e.target;
    if (['monitor-session', 'demo-session'].includes(t.id)) {
      selectedId = t.value;
      render();
    } else if (t.id === 'report-range') {
      reportRange = t.value;
      render();
    } else if (t.id === 'report-from') {
      reportFrom = t.value;
      render();
    } else if (t.id === 'report-to') {
      reportTo = t.value;
      render();
    } else if (t.id === 'report-sort') {
      reportSort = t.value;
      render();
    }
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'member-search') {
      memberSearch = e.target.value;
      const at = e.target.selectionStart;
      render();
      const t = $('#member-search');
      t.focus();
      t.setSelectionRange(at, at);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab' && $('#modal-root').children.length) {
      const items = [...$('#modal-root').querySelectorAll('button,input,select,textarea')].filter(x => !x.disabled);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('coprafy-export', e => {
    toast(e.detail.message);
  });

  render();
})();
