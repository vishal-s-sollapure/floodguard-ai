import React, { createContext, useContext, useState } from 'react';
import { Globe } from 'lucide-react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation & Auth
    home: 'Home',
    dashboard: 'Live Dashboard',
    predictor: 'Risk Predictor',
    report: 'Report Incident',
    officerPortal: 'Officer Portal',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    liveMonitoring: 'LIVE MONITORING',

    // Landing Page
    heroBadge: 'AI-Powered Real-Time Early Flood Warning System',
    heroTagline: 'Predict. Prepare. Protect.',
    heroSubtitle: 'Empowering communities and urban authorities with hyper-local flood risk analytics, real-time weather monitoring, predictive emergency alerts, and crowdsourced community incident reporting.',
    viewDashboardBtn: 'View Live Dashboard',
    reportIncidentBtn: 'Report Incident',
    
    // Feature Cards
    feat1Title: 'Weighted Risk Engine',
    feat1Desc: 'Multi-variable scoring of rainfall, water level, rise rate & drainage capacity into a 0-100 risk score.',
    feat2Title: 'AI Emergency Assistant',
    feat2Desc: 'Powered by Google Gemini AI to provide real-time evacuation guidance and safety advice.',
    feat3Title: 'Interactive Spatial Map',
    feat3Desc: 'Leaflet.js spatial map rendering neighborhood risk zones and active emergency shelters.',
    feat4Title: 'Crowd Incident Reporting',
    feat4Desc: 'Citizens report hazards with browser GPS detection and Gemini AI photo hazard analysis.',

    // Dashboard
    dashHeader: 'Bengaluru Flood Command Dashboard',
    currentScore: 'Current Flood Risk Score',
    rainfall: 'Precipitation / Rainfall',
    waterLevel: 'Water Sensor Level',
    refreshData: 'Refresh Live Data',
    recommendation: 'Status Recommendation',
    condition: 'Condition',
    temp: 'Temperature',
    humidity: 'Humidity',
    riseRate: 'Water Rise Rate',
    drainageCap: 'Drainage Capacity',
    impactEta: 'Est. Impact ETA',
    bengaluruMapTitle: 'Bengaluru Neighborhood Risk Map',

    // Risk Predictor
    predictHeader: 'AI Flood Risk Assessment Predictor',
    predictSubtitle: 'Enter real-time environmental data to simulate flood probability, impact severity, and ETA.',
    simulationParams: 'Simulation Parameters',
    demoTelemetry: 'Pre-filled with Demo Telemetry',
    rainfallIntensityLabel: 'Rainfall Intensity (mm/hr)',
    waterLevelLabel: 'Water Level (m)',
    riseRateLabel: 'Water Rise Rate (m/15m)',
    historicalFloodsLabel: 'Historical Floods (count)',
    drainageRiskLabel: 'Drainage Risk',
    affectedPopLabel: 'Affected Population',
    targetZoneLabel: 'Target Zone / Area',
    analyzeBtn: 'Analyze Flood Risk',
    calculating: 'Calculating Risk Model...',
    locationEvaluated: 'Location Evaluated',
    estimatedEta: 'Estimated Inundation ETA',
    immediateThreat: 'Immediate Threat',
    minutes: 'Minutes',
    engineConfidence: 'Engine Confidence',
    recSafetyAction: 'Recommended Safety Action',
    readyForSim: 'Ready for Risk Simulation',
    readySimSub: 'Adjust parameters on the left and click "Analyze Flood Risk" to run the mathematical risk scoring engine.',

    // Explainable AI Widget (XAI)
    xaiTitle: 'Explainable AI (XAI) Score Breakdown',
    xaiSubtitle: 'Quantitative points contribution per environmental variable',
    whyRisk: 'Why is the risk',
    points: 'Points',
    projected30m: 'Projected Score in 30 Min',

    // Risk Trend Widget
    trendTitle: '60-Minute Risk Trend & 30-Min Predictive Projection',
    pastTrend: 'Past 45 Min',
    now: 'NOW',
    projectedEta: 'Projected (+30m)',
    trendRising: 'RISING RISK',
    trendFalling: 'STABLE / FALLING',

    // Simulation Control Widget
    simTitle: 'Demo Weather Condition Presets',
    simSubtitle: 'Inject live weather conditions into system',
    presetNormal: 'Clear Weather (Low Risk)',
    presetMonsoon: 'Heavy Monsoon (High Risk)',
    presetCloudburst: 'Extreme Cloudburst (CRITICAL)',

    // Report Incident
    reportHeader: 'Community Incident Reporting',
    reportSubtitle: 'Report hazards in your area to alert fellow citizens and prioritize emergency response teams.',
    selectHazard: 'Select Hazard Category',
    floodedRoad: 'Flooded Road',
    floodedRoadDesc: 'Road impassable or waterlogged',
    blockedDrain: 'Blocked Drain',
    blockedDrainDesc: 'Overflowing storm drain or culvert',
    fallenTree: 'Fallen Tree',
    fallenTreeDesc: 'Tree blocking water flow or path',
    electricalDanger: 'Electrical Danger',
    electricalDangerDesc: 'Exposed wire or submerged transformer',
    infrastructureDamage: 'Infrastructure Damage',
    infrastructureDamageDesc: 'Bridge or wall structural risk',
    personNeedsHelp: 'Person Needs Help',
    personNeedsHelpDesc: 'Stranded resident needing assistance',
    severityLabel: 'Severity Level',
    descriptionLabel: 'Incident Description & Landmarks',
    descriptionPlaceholder: 'Describe the flood depth, landmarks (e.g. Near Metro Station)',
    photoUploadLabel: 'Flood Photo & AI Hazard Analysis',
    dragPhoto: 'Click or drag photo here for Gemini AI analysis',
    autoDetectGps: 'Auto-Detect GPS',
    dispatchReportBtn: 'Dispatch Community Report',
    submittingReport: 'Submitting Report...',

    // Admin Officer Portal
    adminHeader: 'Disaster Response Officer Portal',
    officialCommand: 'Official Command',
    adminSubtitle: 'Verify citizen incident reports, dispatch emergency teams, and authorize resolution tags.',
    exportPdf: 'Export Executive PDF Report',
    pendingReview: 'Pending Review',
    verifiedIncidents: 'Verified Incidents',
    resolvedHazards: 'Resolved Hazards',
    queueTitle: 'Incident Review & Dispatch Queue',
    filterAll: 'ALL',
    filterPending: 'PENDING',
    filterVerified: 'VERIFIED',
    filterResolved: 'RESOLVED',
    colCategory: 'Hazard Category',
    colLocation: 'Location / GPS',
    colSeverity: 'Severity',
    colStatus: 'Action / Status',
    actionVerify: 'Verify & Dispatch Team',
    actionResolve: 'Mark Resolved',

    // Login Page
    loginTitle: 'FloodGuard Portal Login',
    loginSubtitle: 'Access emergency command tools or community report portal',
    quickDemo: 'Quick Demo Access',
    hackathonReady: 'Hackathon Ready',
    citizenView: 'Citizen View',
    officerView: 'Officer Portal',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    signInBtn: 'Sign In',
    authenticating: 'Authenticating...',

    // Gemini AI Assistant
    aiTitle: 'Gemini Emergency AI Assistant',
    aiPoweredBy: 'Powered by Gemini',
    aiSubtitle: 'Live safety instructions, evacuation guidance & emergency help',
    aiPrompt1: 'What emergency steps should I take right now?',
    aiPrompt2: 'Where is the nearest open flood shelter?',
    aiPrompt3: 'What to do if water enters electrical outlets?',
    aiPrompt4: 'Is driving safe in Koramangala or Silk Board?',
    askAiPlaceholder: 'Ask Gemini AI emergency assistant...',
    liveAlerts: 'LIVE ALERTS',

    // Evacuation Route Intelligence
    evacTitle: 'Safe Evacuation Route Intelligence & Shelter Navigation',
    evacSubtitle: 'Calculates safe route avoiding submerged underpasses, storm drains, and critical flood zones.',
    findRouteBtn: 'Find Safest Route Now',
    targetShelter: 'Target Relief Shelter',
    distance: 'Distance',
    walkTime: 'Est. Walk Time',
    driveTime: 'Est. Drive Time',
    safetyScore: 'Route Safety Index',
    hazardAvoided: 'Hazard Avoided',
    turnByTurn: 'Turn-by-Turn Safe Navigation Steps',
    liveShelterStatus: 'Live Emergency Relief Shelters',
    shelterFull: 'FULL',
    shelterOpen: 'OPEN',
    shelterNearCap: 'NEAR CAPACITY',

    // SOS Rescue Escalation
    sosBtn: '🚨 SOS RESCUE',
    sosTitle: 'Vulnerable Population SOS Rescue Dispatcher',
    sosSubtitle: 'Priority dispatch for senior citizens, hospitals, disabled, and stranded families.',
    vulnerabilityLabel: 'Vulnerability Category',
    requiredModeLabel: 'Required Rescue Equipment',
    strandedCountLabel: 'Stranded Persons Count',
    medicalUrgencyLabel: 'Urgent Medical Need (Oxygen / Insulin / First Aid)',
    citizenNameLabel: 'Contact Name',
    phoneLabel: 'Emergency Phone Number',
    locationNotesLabel: 'Location & Landmarks (Flat / Building)',
    dispatchSosBtn: 'DISPATCH PRIORITY SOS RESCUE NOW',
    sosSuccessToast: 'SOS Emergency Ticket Dispatched with Priority!',

    // Disaster Impact Analytics
    impactTitle: 'Disaster Impact & Economic Loss Analytics',
    impactSubtitle: 'Real-time estimation of affected households, submerged infrastructure, and economic financial losses.',
    affectedHouseholds: 'Affected Households',
    affectedPop: 'Estimated Population Impact',
    estLossCr: 'Est. Economic Loss (₹ Cr)',
    submergedInfra: 'Critical Infra At-Risk',
    shelterDemand: 'Relief Shelter Capacity Needed',
    resLoss: 'Residential Property Loss',
    commLoss: 'Commercial Business Loss',
    infraLoss: 'Public Infrastructure Repair',
    downloadReport: 'Download Impact Summary Report'
  },
  kn: {
    // Navigation & Auth
    home: 'ಮುಖ್ಯ ಪುಟ',
    dashboard: 'ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    predictor: 'ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    report: 'ಘಟನೆ ವರದಿ ಮಾಡಿ',
    officerPortal: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    signIn: 'ಸೈನ್ ಇನ್',
    signOut: 'ಸೈನ್ ಔಟ್',
    liveMonitoring: 'ಲೈವ್ ಮೇಲ್ವಿಚಾರಣೆ',

    // Landing Page
    heroBadge: 'AI-ಚಾಲಿತ ನೈಜ-ಸಮಯದ ಆರಂಭಿಕ ಪ್ರವಾಹ ಮುನ್ನೆಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ',
    heroTagline: 'ಮುನ್ಸೂಚಿಸಿ. ಸಿದ್ಧರಾಗಿ. ರಕ್ಷಿಸಿ.',
    heroSubtitle: 'ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಮೇಲ್ವಿಚಾರಣೆ, ಮುನ್ಸೂಚಕ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸಮುದಾಯ ವರದಿ ಮಾಡುವಿಕೆ ಮೂಲಕ ನಗರಾಡಳಿತ ಮತ್ತು ನಾಗರಿಕರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು.',
    viewDashboardBtn: 'ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ವೀಕ್ಷಿಸಿ',
    reportIncidentBtn: 'ಘಟನೆ ವರದಿ ಮಾಡಿ',

    // Feature Cards
    feat1Title: 'ಅಪಾಯ ಮುನ್ಸೂಚನೆ ಎಂಜಿನ್',
    feat1Desc: 'ಮಳೆ ಪ್ರಮಾಣ, ನೀರಿನ ಮಟ್ಟ ಮತ್ತು ಚರಂಡಿ ಸಾಮರ್ಥ್ಯದ ಆಧಾರದ ಮೇಲೆ 0-100 ಅಪಾಯದ ಅಂಕ ಲೆಕ್ಕಾಚಾರ.',
    feat2Title: 'AI ತುರ್ತು ಸಹಾಯಕ',
    feat2Desc: 'ಗೂಗಲ್ ಜೆಮಿನಿ AI ಮೂಲಕ ನೈಜ-ಸಮಯದ ತೆರವು ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಸುರಕ್ಷತಾ ಸಲಹೆ.',
    feat3Title: 'ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
    feat3Desc: 'ಬೆಂಗಳೂರು ನೆರೆಹೊರೆಯ ಅಪಾಯದ ವಲಯಗಳು ಮತ್ತು ತುರ್ತು ಆಶ್ರಯ ತಾಣಗಳ ಪ್ರದರ್ಶನ.',
    feat4Title: 'ಸಮುದಾಯ ಘಟನೆ ವರದಿ',
    feat4Desc: 'GPS ಮತ್ತು ಜೆಮಿನಿ AI ಫೋಟೋ ವಿಶ್ಲೇಷಣೆ ಮೂಲಕ ಸಾರ್ವಜನಿಕ ಘಟನೆ ವರದಿ ಮಾಡುವಿಕೆ.',

    // Dashboard
    dashHeader: 'ಬೆಂಗಳೂರು ಪ್ರವಾಹ ಕಮಾಂಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    currentScore: 'ಪ್ರಸ್ತುತ ಪ್ರವಾಹ ಅಪಾಯದ ಅಂಕ',
    rainfall: 'ಮಳೆ ಪ್ರಮಾಣ',
    waterLevel: 'ನೀರಿನ ಮಟ್ಟ',
    refreshData: 'ಡೇಟಾ ನವೀಕರಿಸಿ',
    recommendation: 'ಸ್ಥಿತಿ ಶಿಫಾರಸು',
    condition: 'ಹವಾಮಾನ ಸ್ಥಿತಿ',
    temp: 'ತಾಪಮಾನ',
    humidity: 'ಆರ್ದ್ರತೆ',
    riseRate: 'ಏರಿಕೆಯ ದರ',
    drainageCap: 'ಚರಂಡಿ ಸಾಮರ್ಥ್ಯ',
    impactEta: 'ನಿರೀಕ್ಷಿತ ಪರಿಣಾಮ ಸಮಯ',
    bengaluruMapTitle: 'ಬೆಂಗಳೂರು ನೆರೆಹೊರೆಯ ಅಪಾಯದ ನಕ್ಷೆ',

    // Risk Predictor
    predictHeader: 'AI ಪ್ರವಾಹ ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ',
    predictSubtitle: 'ಪ್ರವಾಹ ಸಂಭವನೀಯತೆ ಮತ್ತು ಸಮಯವನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಲು ಹವಾಮಾನ ಡೇಟಾ ನಮೂದಿಸಿ.',
    simulationParams: 'ಸಿಮ್ಯುಲೇಶನ್ ನಿಯತಾಂಕಗಳು',
    demoTelemetry: 'ಡೆಮೊ ಡೇಟಾದೊಂದಿಗೆ ಭರ್ತಿಯಾಗಿದೆ',
    rainfallIntensityLabel: 'ಮಳೆ ತೀವ್ರತೆ (ಮಿಮೀ/ಗಂಟೆ)',
    waterLevelLabel: 'ನೀರಿನ ಮಟ್ಟ (ಮೀಟರ್)',
    riseRateLabel: 'ನೀರಿನ ಏರಿಕೆ ದರ (ಮೀಟರ್/15ಮಿ)',
    historicalFloodsLabel: 'ಐತಿಹಾಸಿಕ ಪ್ರವಾಹಗಳು (ಸಂಖ್ಯೆ)',
    drainageRiskLabel: 'ಚರಂಡಿ ಅಪಾಯ',
    affectedPopLabel: 'ಬಾಧಿತ ಜನಸಂಖ್ಯೆ',
    targetZoneLabel: 'ಉದ್ದೇಶಿತ ಪ್ರದೇಶ',
    analyzeBtn: 'ಪ್ರವಾಹ ಅಪಾಯ ವಿಶ್ಲೇಷಿಸಿ',
    calculating: 'ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    locationEvaluated: 'ಮೌಲ್ಯಮಾಪನ ಮಾಡಿದ ಸ್ಥಳ',
    estimatedEta: 'ನಿರೀಕ್ಷಿತ ಮುಳುಗಡೆ ಸಮಯ',
    immediateThreat: 'ತಕ್ಷಣದ ಬೆದರಿಕೆ',
    minutes: 'ನಿಮಿಷಗಳು',
    engineConfidence: 'ಎಂಜಿನ್ ನಿಖರತೆ',
    recSafetyAction: 'ಶಿಫಾರಸು ಮಾಡಿದ ಸುರಕ್ಷತಾ ಕ್ರಮ',
    readyForSim: 'ಅಪಾಯದ ಸಿಮ್ಯುಲೇಶನ್‌ಗೆ ಸಿದ್ಧ',
    readySimSub: 'ಎಡಭಾಗದಲ್ಲಿ ನಿಯತಾಂಕಗಳನ್ನು ಬದಲಾಯಿಸಿ ಮತ್ತು ವಿಶ್ಲೇಷಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ.',

    // Explainable AI Widget (XAI)
    xaiTitle: 'XAI ಅಪಾಯದ ವಿವರಣೆ ವಿಶ್ಲೇಷಣೆ',
    xaiSubtitle: 'ಪ್ರತಿಯೊಂದು ಹವಾಮಾನ ನಿಯತಾಂಕದ ಅಂಕದ ಕೊಡುಗೆ',
    whyRisk: 'ಅಪಾಯ ಏಕಿದೆ',
    points: 'ಅಂಕಗಳು',
    projected30m: '30 ನಿಮಿಷಗಳಲ್ಲಿ ನಿರೀಕ್ಷಿತ ಅಂಕ',

    // Risk Trend Widget
    trendTitle: '60-ನಿಮಿಷಗಳ ಅಪಾಯದ ಪ್ರವೃತ್ತಿ ಮತ್ತು ಮುನ್ಸೂಚನೆ',
    pastTrend: 'ಕಳೆದ 45 ನಿಮಿಷ',
    now: 'ಈಗ',
    projectedEta: 'ನಿರೀಕ್ಷಿತ (+30ಮಿ)',
    trendRising: 'ಏರುತ್ತಿರುವ ಅಪಾಯ',
    trendFalling: 'ಸ್ಥಿರ / ಇಳಿಯುತ್ತಿರುವ',

    // Simulation Control Widget
    simTitle: 'ಡೆಮೊ ಹವಾಮಾನ ನಿಯಂತ್ರಣ',
    simSubtitle: 'ವ್ಯವಸ್ಥೆಗೆ ಹವಾಮಾನ ನಿಯತಾಂಕಗಳನ್ನು ಪರಿಚಯಿಸಿ',
    presetNormal: 'ಸಾಮಾನ್ಯ ಹವಾಮಾನ (ಕಡಿಮೆ ಅಪಾಯ)',
    presetMonsoon: 'ಭಾರಿ ಮಳೆ (ಹೆಚ್ಚಿನ ಅಪಾಯ)',
    presetCloudburst: 'ವಿಪರೀತ ಪ್ರವಾಹ (ತೀವ್ರ ಅಪಾಯ)',

    // Report Incident
    reportHeader: 'ಸಮುದಾಯ ಘಟನೆ ವರದಿ',
    reportSubtitle: 'ಸಾರ್ವಜನಿಕರನ್ನು ಎಚ್ಚರಿಸಲು ಮತ್ತು ತುರ್ತು ತಂಡಗಳಿಗೆ ಮಾಹಿತಿ ನೀಡಲು ಘಟನೆಗಳನ್ನು ವರದಿ ಮಾಡಿ.',
    selectHazard: 'ಅಪಾಯ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    floodedRoad: 'ಪ್ರವಾಹದ ರಸ್ತೆ',
    floodedRoadDesc: 'ರಸ್ತೆಯಲ್ಲಿ ನೀರು ನಿಂತಿದೆ',
    blockedDrain: 'ಮುಚ್ಚಿದ ಚರಂಡಿ',
    blockedDrainDesc: 'ರಾಜಕಾಲುವೆ ಉಕ್ಕಿ ಹರಿಯುತ್ತಿದೆ',
    fallenTree: 'ಬಿದ್ದ ಮರ',
    fallenTreeDesc: 'ನೀರು ಅಥವಾ ರಸ್ತೆ ತಡೆದ ಮರ',
    electricalDanger: 'ವಿದ್ಯುತ್ ಅಪಾಯ',
    electricalDangerDesc: 'ನೀರಿನಲ್ಲಿ ಮುಳುಗಿದ ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್',
    infrastructureDamage: 'ಮೂಲಸೌಕರ್ಯ ಹಾನಿ',
    infrastructureDamageDesc: 'ಸೇತುವೆ ಅಥವಾ ಗೋಡೆ ಅಪಾಯ',
    personNeedsHelp: 'ಸಹಾಯ ಬೇಕಾದ ವ್ಯಕ್ತಿ',
    personNeedsHelpDesc: 'ಸಿಲುಕಿಕೊಂಡಿರುವ ನಿವಾಸಿ',
    severityLabel: 'ತೀವ್ರತೆಯ ಮಟ್ಟ',
    descriptionLabel: 'ಘಟನೆಯ ವಿವರಣೆ ಮತ್ತು ಕುರುಹುಗಳು',
    descriptionPlaceholder: 'ಪ್ರವಾಹದ ಆಳ ಮತ್ತು ಹತ್ತಿರದ ಕುರುಹುಗಳನ್ನು ಬರೆಯಿರಿ',
    photoUploadLabel: 'ಪ್ರವಾಹದ ಫೋಟೋ ಮತ್ತು AI ವಿಶ್ಲೇಷಣೆ',
    dragPhoto: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ',
    autoDetectGps: 'GPS ಸ್ವಯಂಚಾಲಿತ ಪತ್ತೆ',
    dispatchReportBtn: 'ಸಮುದಾಯ ವರದಿ ಕಳುಹಿಸಿ',
    submittingReport: 'ವರದಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',

    // Admin Officer Portal
    adminHeader: 'ದುರಂತ ನಿರ್ವಹಣಾ ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    officialCommand: 'ಅಧಿಕೃತ ಕಮಾಂಡ್',
    adminSubtitle: 'ನಾಗರಿಕರ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ತುರ್ತು ತಂಡಗಳನ್ನು ಕಳುಹಿಸಿ ಮತ್ತು ಪರಿಹಾರ ನೀಡಿ.',
    exportPdf: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    pendingReview: 'ಪರಿಶೀಲನೆಗೆ ಕಾಯುತ್ತಿದೆ',
    verifiedIncidents: 'ದೃಢೀಕರಿಸಿದ ಘಟನೆಗಳು',
    resolvedHazards: 'ಪರಿಹರಿಸಲಾದ ಅಪಾಯಗಳು',
    queueTitle: 'ಘಟನೆಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ನಿಯೋಜನೆ ಪಟ್ಟಿ',
    filterAll: 'ಎಲ್ಲ',
    filterPending: 'ಕಾಯುತ್ತಿದೆ',
    filterVerified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    filterResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    colCategory: 'ಅಪಾಯದ ವರ್ಗ',
    colLocation: 'ಸ್ಥಳ / GPS',
    colSeverity: 'ತೀವ್ರತೆ',
    colStatus: 'ಕ್ರಮ / ಸ್ಥಿತಿ',
    actionVerify: 'ಪರಿಶೀಲಿಸಿ & ತಂಡ ಕಳುಹಿಸಿ',
    actionResolve: 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',

    // Login Page
    loginTitle: 'ಫ್ಲಡ್‌ಗಾರ್ಡ್ ಪೋರ್ಟಲ್ ಲಾಗಿನ್',
    loginSubtitle: 'ತುರ್ತು ಕಮಾಂಡ್ ಅಥವಾ ಸಮುದಾಯ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ',
    quickDemo: 'ಕ್ಷಿಪ್ರ ಡೆಮೊ ಪ್ರವೇಶ',
    hackathonReady: 'ಹ್ಯಾಕಥಾನ್ ಸಿದ್ಧ',
    citizenView: 'ನಾಗರಿಕ ನೋಟ',
    officerView: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
    signInBtn: 'ಸೈನ್ ಇನ್',
    authenticating: 'ಪ್ರವೇಶಿಸಲಾಗುತ್ತಿದೆ...',

    // Gemini AI Assistant
    aiTitle: 'ಜೆಮಿನಿ ತುರ್ತು AI ಸಹಾಯಕ',
    aiPoweredBy: 'ಜೆಮಿನಿ AI ಚಾಲಿತ',
    aiSubtitle: 'ನೈಜ-ಸಮಯದ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು ಮತ್ತು ತೆರವು ಮಾರ್ಗದರ್ಶನ',
    aiPrompt1: 'ನಾನು ಈಗ ಕೈಗೊಳ್ಳಬೇಕಾದ ತುರ್ತು ಕ್ರಮಗಳು ಯಾವುವು?',
    aiPrompt2: 'ಹತ್ತಿರದ ಪ್ರವಾಹ ಆಶ್ರಯ ತಾಣ ಎಲ್ಲಿದೆ?',
    aiPrompt3: 'ವಿದ್ಯುತ್ ಸಾಕೆಟ್‌ಗಳಿಗೆ ನೀರು ಹೊಕ್ಕರೆ ಏನು ಮಾಡಬೇಕು?',
    aiPrompt4: 'ಕೋರಮಂಗಲ ಅಥವಾ ಸಿಲ್ಕ್ ಬೋರ್ಡ್‌ನಲ್ಲಿ ವಾಹನ ಚಾಲನೆ ಸುರಕ್ಷಿತವೇ?',
    askAiPlaceholder: 'ಜೆಮಿನಿ AI ಸಹಾಯಕನನ್ನು ಕೇಳಿ...',
    liveAlerts: 'ಲೈವ್ ಎಚ್ಚರಿಕೆಗಳು',

    // Evacuation Route Intelligence
    evacTitle: 'ಸುರಕ್ಷಿತ ತೆರವು ಮಾರ್ಗ ಮತ್ತು ಆಶ್ರಯ ತಾಣ ಮಾರ್ಗದರ್ಶನ',
    evacSubtitle: 'ಜಲಾವೃತ ಪ್ರದೇಶಗಳನ್ನು ಹೊರತುಪಡಿಸಿ ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ.',
    findRouteBtn: 'ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ಹುಡುಕಿ',
    targetShelter: 'ನಿಯೋಜಿತ ಆಶ್ರಯ ತಾಣ',
    distance: 'ದೂರ',
    walkTime: 'ನಡಿಗೆ ಸಮಯ',
    driveTime: 'ವಾಹನ ಸಮಯ',
    safetyScore: 'ಸುರಕ್ಷತಾ ಸೂಚಿ',
    hazardAvoided: 'ತಪ್ಪಿಸಿದ ಅಪಾಯ',
    turnByTurn: 'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶನ',
    liveShelterStatus: 'ಲೈವ್ ತುರ್ತು ಆಶ್ರಯ ತಾಣಗಳು',
    shelterFull: 'ಭರ್ತಿಯಾಗಿದೆ',
    shelterOpen: 'ತೆರೆದಿದೆ',
    shelterNearCap: 'ಭರ್ತಿಯಾಗುತ್ತಿದೆ',

    // SOS Rescue Escalation
    sosBtn: '🚨 SOS ರಕ್ಷಣೆ',
    sosTitle: 'ಆದ್ಯತೆಯ SOS ತುರ್ತು ರಕ್ಷಣೆ',
    sosSubtitle: 'ಹಿರಿಯ ನಾಗರಿಕರು, ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಸಿಲುಕಿಕೊಂಡ ಕುಟುಂಬಗಳಿಗೆ ತಕ್ಷಣದ ರಕ್ಷಣೆ.',
    vulnerabilityLabel: 'ಸಂಕಷ್ಟದ ವರ್ಗ',
    requiredModeLabel: 'ಅಗತ್ಯವಿರುವ ರಕ್ಷಣಾ ಉಪಕರಣ',
    strandedCountLabel: 'ಸಿಲುಕಿರುವ ವ್ಯಕ್ತಿಗಳ ಸಂಖ್ಯೆ',
    medicalUrgencyLabel: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಅಗತ್ಯ (ಆಮ್ಲಜನಕ / ಇನ್ಸುಲಿನ್ / ಗಾಯ)',
    citizenNameLabel: 'ಸಂಪರ್ಕಿತ ವ್ಯಕ್ತಿಯ ಹೆಸರು',
    phoneLabel: 'ತುರ್ತು ಫೋನ್ ಸಂಖ್ಯೆ',
    locationNotesLabel: 'ವಿವರವಾದ ಸ್ಥಳ ಮತ್ತು ಕುರುಹುಗಳು',
    dispatchSosBtn: 'ಆದ್ಯತೆಯ SOS ರಕ್ಷಣೆ ರವಾನಿಸಿ',
    sosSuccessToast: 'SOS ತುರ್ತು ಟಿಕೆಟ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!'
  },
  hi: {
    // Navigation & Auth
    home: 'होम',
    dashboard: 'लाइव डैशबोर्ड',
    predictor: 'जोखिम पूर्वाग्रह',
    report: 'घटना की रिपोर्ट करें',
    officerPortal: 'अधिकारी पोर्टल',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    liveMonitoring: 'लाइव निगरानी',

    // Landing Page
    heroBadge: 'AI-संचालित वास्तविक समय प्रारंभिक बाढ़ चेतावनी प्रणाली',
    heroTagline: 'पूर्वानुमान लगाएं। तैयार रहें। रक्षा करें।',
    heroSubtitle: 'वास्तविक समय मौसम निगरानी, पूर्वानुमानित आपातकालीन अलर्ट और क्राउडसोर्स्ड नागरिक रिपोर्टिंग के माध्यम से शहरी अधिकारियों और समुदायों को सशक्त बनाना।',
    viewDashboardBtn: 'लाइव डैशबोर्ड देखें',
    reportIncidentBtn: 'घटना रिपोर्ट करें',

    // Feature Cards
    feat1Title: 'जोखिम मूल्यांकन इंजन',
    feat1Desc: 'वर्षा, जल स्तर और जल निकासी क्षमता के आधार पर 0-100 जोखिम स्कोर गणना।',
    feat2Title: 'AI आपातकालीन सहायक',
    feat2Desc: 'गूगल जेमिनी AI द्वारा वास्तविक समय निकासी मार्गदर्शन और सुरक्षा सलाह।',
    feat3Title: 'इंटरएक्टिव मानचित्र',
    feat3Desc: 'बेंगलुरु पड़ोस के जोखिम क्षेत्रों और आपातकालीन आश्रयों का प्रदर्शन।',
    feat4Title: 'समुदाय घटना रिपोर्टिंग',
    feat4Desc: 'GPS और जेमिनी AI फोटो विश्लेषण के साथ नागरिक खतरा रिपोर्टिंग।',

    // Dashboard
    dashHeader: 'बेंगलुरु बाढ़ कमान डैशबोर्ड',
    currentScore: 'वर्तमान बाढ़ जोखिम स्कोर',
    rainfall: 'वर्षा / बारिश',
    waterLevel: 'जल स्तर',
    refreshData: 'डेटा रिफ्रेश करें',
    recommendation: 'स्थिति सिफारिश',
    condition: 'मौसम स्थिति',
    temp: 'तापमान',
    humidity: 'आर्द्रता',
    riseRate: 'वृद्धि दर',
    drainageCap: 'जल निकासी क्षमता',
    impactEta: 'अनुमानित प्रभाव समय',
    bengaluruMapTitle: 'बेंगलुरु पड़ोस जोखिम मानचित्र',

    // Risk Predictor
    predictHeader: 'AI बाढ़ जोखिम मूल्यांकन पूर्वाग्रह',
    predictSubtitle: 'बाढ़ संभावना और ETA का अनुकरण करने के लिए पर्यावरण डेटा दर्ज करें।',
    simulationParams: 'सिमुलेशन पैरामीटर',
    demoTelemetry: 'डेमो डेटा से भरा हुआ',
    rainfallIntensityLabel: 'वर्षा तीव्रता (मिमी/घंटा)',
    waterLevelLabel: 'जल स्तर (मीटर)',
    riseRateLabel: 'जल वृद्धि दर (मीटर/15मि)',
    historicalFloodsLabel: 'ऐतिहासिक बाढ़ (संख्या)',
    drainageRiskLabel: 'जल निकासी जोखिम',
    affectedPopLabel: 'प्रभावित जनसंख्या',
    targetZoneLabel: 'लक्ष्य क्षेत्र',
    analyzeBtn: 'बाढ़ जोखिम विश्लेषण करें',
    calculating: 'गणना की जा रही है...',
    locationEvaluated: 'मूल्यांकित स्थान',
    estimatedEta: 'अनुमानित जलभराव समय',
    immediateThreat: 'तत्काल खतरा',
    minutes: 'मिनट',
    engineConfidence: 'इंजन सटीकता',
    recSafetyAction: 'अनुशंसित सुरक्षा कार्रवाई',
    readyForSim: 'जोखिम सिमुलेशन के लिए तैयार',
    readySimSub: 'बाएं पैरामीटर समायोजित करें और बाढ़ जोखिम विश्लेषण पर क्लिक करें।',

    // Explainable AI Widget (XAI)
    xaiTitle: 'XAI जोखिम स्कोर विवरण',
    xaiSubtitle: 'प्रत्येक पर्यावरणीय चर का अंक योगदान',
    whyRisk: 'जोखिम क्यों है',
    points: 'अंक',
    projected30m: '30 मिनट में अनुमानित स्कोर',

    // Risk Trend Widget
    trendTitle: '60-मिनट जोखिम प्रवृत्ति और 30-मिनट पूर्वानुमान',
    pastTrend: 'पिछले 45 मिनट',
    now: 'अभी',
    projectedEta: 'अनुमानित (+30मि)',
    trendRising: 'बढ़ता जोखिम',
    trendFalling: 'स्थिर / घटता हुआ',

    // Simulation Control Widget
    simTitle: 'डेमो मौसम स्थिति प्रीसेट',
    simSubtitle: 'सिस्टम में मौसम की स्थिति डालें',
    presetNormal: 'सामान्य मौसम (कम जोखिम)',
    presetMonsoon: 'भारी मानसून (उच्च जोखिम)',
    presetCloudburst: 'अत्यधिक बादल फटना (गंभीर)',

    // Report Incident
    reportHeader: 'समुदाय घटना रिपोर्टिंग',
    reportSubtitle: 'नागरिकों को सचेत करने और आपातकालीन टीमों को प्राथमिकता देने के लिए खतरों की रिपोर्ट करें।',
    selectHazard: 'खतरा श्रेणी चुनें',
    floodedRoad: 'जलभराव वाली सड़क',
    floodedRoadDesc: 'सड़क अगम्य या जलमग्न',
    blockedDrain: 'बंद नाला',
    blockedDrainDesc: 'उफनता नाला',
    fallenTree: 'गिरा हुआ पेड़',
    fallenTreeDesc: 'पानी के बहाव या रास्ते को रोकता पेड़',
    electricalDanger: 'बिजली का खतरा',
    electricalDangerDesc: 'खुला तार या जलमग्न ट्रांसफार्मर',
    infrastructureDamage: 'बुनियादी ढांचे को नुकसान',
    infrastructureDamageDesc: 'पुल या दीवार का संरचनात्मक जोखिम',
    personNeedsHelp: 'व्यक्ति को मदद चाहिए',
    personNeedsHelpDesc: 'फंसा हुआ निवासी जिसे सहायता चाहिए',
    severityLabel: 'गंभीरता का स्तर',
    descriptionLabel: 'घटना का विवरण और स्थल',
    descriptionPlaceholder: 'बाढ़ की गहराई और लैंडमार्क लिखें',
    photoUploadLabel: 'बाढ़ की फोटो और AI विश्लेषण',
    dragPhoto: 'फोटो चुनें या यहां ड्रैग करें',
    autoDetectGps: 'GPS ऑटो-डिटेक्ट',
    dispatchReportBtn: 'रिपोर्ट भेजें',
    submittingReport: 'रिपोर्ट भेजी जा रही है...',

    // Admin Officer Portal
    adminHeader: 'आपदा प्रतिक्रिया अधिकारी पोर्टल',
    officialCommand: 'आधिकारिक कमान',
    adminSubtitle: 'नागरिक रिपोर्टों को सत्यापित करें, आपातकालीन टीमों को भेजें।',
    exportPdf: 'PDF रिपोर्ट डाउनलोड करें',
    pendingReview: 'समीक्षा लंबित',
    verifiedIncidents: 'सत्यापित घटनाएं',
    resolvedHazards: 'हल किए गए खतरे',
    queueTitle: 'घटना समीक्षा और प्रेषण कतार',
    filterAll: 'सभी',
    filterPending: 'लंबित',
    filterVerified: 'सत्यापित',
    filterResolved: 'हल किया गया',
    colCategory: 'खतरा श्रेणी',
    colLocation: 'स्थान / GPS',
    colSeverity: 'गंभीरता',
    colStatus: 'कार्रवाई / स्थिति',
    actionVerify: 'सत्यापित करें और टीम भेजें',
    actionResolve: 'हल किया गया चिह्नित करें',

    // Login Page
    loginTitle: 'फ्लडगार्ड पोर्टल लॉगिन',
    loginSubtitle: 'आपातकालीन कमान या समुदाय पोर्टल पर पहुंचें',
    quickDemo: 'त्वरित डेमो पहुंच',
    hackathonReady: 'हैकाथॉन तैयार',
    citizenView: 'नागरिक दृश्य',
    officerView: 'अधिकारी पोर्टल',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    signInBtn: 'साइन इन',
    authenticating: 'प्रमाणित किया जा रहा है...',

    // Gemini AI Assistant
    aiTitle: 'जेमिनी आपातकालीन AI सहायक',
    aiPoweredBy: 'जेमिनी AI द्वारा संचालित',
    aiSubtitle: 'लाइव सुरक्षा निर्देश और निकासी मार्गदर्शन',
    aiPrompt1: 'मुझे अभी क्या आपातकालीन कदम उठाने चाहिए?',
    aiPrompt2: 'निकटतम खुला बाढ़ आश्रय स्थल कहाँ है?',
    aiPrompt3: 'बिजली के सॉकेट में पानी घुसने पर क्या करें?',
    aiPrompt4: 'क्या कोरमंगला या सिल्क बोर्ड में गाड़ी चलाना सुरक्षित है?',
    askAiPlaceholder: 'जेमिनी AI सहायक से पूछें...',
    liveAlerts: 'लाइव अलर्ट',

    // Evacuation Route Intelligence
    evacTitle: 'सुरक्षित निकासी मार्ग और आश्रय नेविगेशन',
    evacSubtitle: 'जलमग्न क्षेत्रों से बचते हुए सुरक्षित मार्ग की गणना करें।',
    findRouteBtn: 'सबसे सुरक्षित मार्ग खोजें',
    targetShelter: 'लक्षित आश्रय स्थल',
    distance: 'दूरी',
    walkTime: 'पैदल समय',
    driveTime: 'ड्राइविंग समय',
    safetyScore: 'सुरक्षा सूचकांक',
    hazardAvoided: 'टैला गया खतरा',
    turnByTurn: 'मोड़-दर-मोड़ नेविगेशन',
    liveShelterStatus: 'लाइव आपातकालीन आश्रय स्थल',
    shelterFull: 'पूर्ण',
    shelterOpen: 'खुला',
    shelterNearCap: 'लगभग पूर्ण',

    // SOS Rescue Escalation
    sosBtn: '🚨 SOS बचाव',
    sosTitle: 'प्राथमिकता SOS आपातकालीन बचाव',
    sosSubtitle: 'वरिष्ठ नागरिकों, अस्पतालों और फंसे हुए परिवारों के लिए त्वरित बचाव।',
    vulnerabilityLabel: 'संकट श्रेणी',
    requiredModeLabel: 'आवश्यक बचाव उपकरण',
    strandedCountLabel: 'फंसे हुए लोगों की संख्या',
    medicalUrgencyLabel: 'आपातकालीन चिकित्सा आवश्यकता (ऑक्सीजन / इंसुलिन)',
    citizenNameLabel: 'संपर्क नाम',
    phoneLabel: 'आपातकालीन फोन नंबर',
    locationNotesLabel: 'विशिष्ट स्थान और लैंडमार्क',
    dispatchSosBtn: 'प्राथमिकता SOS बचाव भेजें',
    sosSuccessToast: 'SOS आपातकालीन टिकट सफलतापूर्वक भेजा गया!'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

const LanguageSelector = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-[#0b1222] p-1 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
      <Globe className="w-3.5 h-3.5 text-blue-400 ml-1.5" />
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-lg transition ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLang('kn')}
        className={`px-2 py-1 rounded-lg transition ${lang === 'kn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        🇮🇳 ಕನ್ನಡ
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-2 py-1 rounded-lg transition ${lang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        🇮🇳 हिंदी
      </button>
    </div>
  );
};

export default LanguageSelector;
