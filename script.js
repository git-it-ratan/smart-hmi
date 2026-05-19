const tradAlarms = [
    { sev: 'CRIT', cls: 'crit', time: '14:32:07', msg: 'P1_MOTOR_TEMP HIGH — 87.3°C' },
    { sev: 'HIGH', cls: 'high', time: '14:32:09', msg: 'FLOW_INLET LOW — 18 L/min' },
    { sev: 'CRIT', cls: 'crit', time: '14:32:11', msg: 'PRESSURE LOW — 0.7 bar' },
    { sev: 'HIGH', cls: 'high', time: '14:32:14', msg: 'TANK_INLET LEVEL LOW — 17%' },
    { sev: 'MED', cls: 'med', time: '14:31:58', msg: 'V1_POSITION DEVIATION' },
    { sev: 'LOW', cls: 'low', time: '14:31:45', msg: 'POWER_LOAD HIGH — 84%' },
];

let currentScenario = null;
let timeouts = [];

function clearAllTimeouts() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
}

function updateTime() {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const el = document.getElementById('tradTime');
    if (el) el.textContent = t;
    const scadaEl = document.getElementById('scada-clock');
    if (scadaEl) scadaEl.textContent = t;
}
setInterval(updateTime, 1000);

let alarmCount = 47;
setInterval(() => {
    if (document.getElementById('panelTrad').classList.contains('active')) {
        alarmCount++;
        document.getElementById('alarmCountBadge').textContent = alarmCount + ' ACTIVE ALARMS';
        const msgs = ['SENSOR_FAULT DETECTED', 'COMM_LINK TIMEOUT', 'TEMP_DEVIATION'];
        const clss = ['crit', 'high', 'low'];
        const idx = Math.floor(Math.random() * 3);
        const d = document.createElement('div');
        d.className = `trad-alarm ${clss[idx]}`;
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        d.innerHTML = `<span style="font-weight:700">${clss[idx].toUpperCase()}</span><span style="color:var(--text3)">${t}</span><span>${msgs[Math.floor(Math.random() * msgs.length)]}</span><span style="color:var(--text3);font-size:0.6rem;cursor:pointer;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:2px">ACK</span>`;
        const tal = document.getElementById('tradAlarmList');
        if (tal) tal.insertBefore(d, tal.firstChild);
    }
}, 3000);

function switchMode(mode) {
    const trad = document.getElementById('panelTrad');
    const smart = document.getElementById('panelSmart');
    const btnT = document.getElementById('btnTrad');
    const btnS = document.getElementById('btnSmart');
    if (mode === 'trad') {
        trad.style.display = 'grid';
        trad.classList.add('active');
        smart.style.display = 'none';
        smart.classList.remove('active');
        btnT.classList.add('active-trad');
        btnT.classList.remove('active-smart');
        btnS.classList.remove('active-smart', 'active-trad');
    } else {
        smart.style.display = 'grid';
        smart.classList.add('active');
        trad.style.display = 'none';
        trad.classList.remove('active');
        btnS.classList.add('active-smart');
        btnS.classList.remove('active-trad');
        btnT.classList.remove('active-trad', 'active-smart');
    }
}

function switchRole(role, btn) {
    document.querySelectorAll('.role-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('rv-' + role).classList.add('active');
    btn.classList.add('active');
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function setHMI(id, val, valClass, cardClass, unit='') {
    const card = document.getElementById(id);
    const valEl = document.getElementById(id+'-val');
    if(card && valEl) {
        card.className = cardClass;
        valEl.className = valClass;
        valEl.innerHTML = `${val}<span class="sc-unit">${unit}</span>`;
    }
}

function setNormalState() {
    clearAllTimeouts();
    currentScenario = null;
    document.getElementById('btnReset').classList.add('active');
    document.getElementById('btnTrigger').classList.remove('active');
    document.getElementById('btnTriggerS2').classList.remove('active');
    document.getElementById('btnTriggerS3').classList.remove('active');
    document.getElementById('btnFix').classList.remove('active');
    document.getElementById('btnFix').textContent = "5. OperatorAI Action";
    document.getElementById('btnFix').disabled = false;
    document.getElementById('btnTrigger').disabled = false;
    document.getElementById('btnTriggerS2').disabled = false;
    document.getElementById('btnTriggerS3').disabled = false;
    
    const simFixBtn = document.getElementById('btnSimulateFix');
    if(simFixBtn) {
        simFixBtn.textContent = "▶ START BACKUP PUMP (P2)";
        simFixBtn.style = ""; 
        simFixBtn.disabled = false;
    }

    const logContent = document.getElementById('shift-log-content');
    if(logContent) logContent.innerHTML = '';
    addShiftLog('Shift started. Plant operating normally. All sensors nominal.', 'system');

    document.getElementById('smart-incident-badge').textContent = '0 INCIDENTS ACTIVE';
    document.getElementById('smart-incident-badge').className = 'pv-badge badge-green';
    document.getElementById('smart-incident-card').style.display = 'none';

    document.getElementById('alarmCountBadge').textContent = '1 ACTIVE ALARM';
    const tal = document.getElementById('tradAlarmList');
    if(tal) tal.innerHTML = '<div class="trad-alarm low"><span style="font-weight:700">LOW</span><span style="color:var(--text3)">14:28:58</span><span>POWER_LOAD NORMAL — 42%</span><span style="color:var(--text3);font-size:0.6rem;cursor:pointer;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:2px">ACK</span></div>';

    setHMI('hmi-power', 'NORMAL', 'sc-val green', 'sensor-card ok');
    setHMI('hmi-valve', 'OPEN', 'sc-val green', 'sensor-card ok');
    setHMI('hmi-p1', 'RUNNING', 'sc-val green', 'sensor-card ok');
    setHMI('hmi-p2', 'STANDBY', 'sc-val green', 'sensor-card ok');
    setHMI('hmi-flow', '100', 'sc-val green', 'sensor-card ok', 'L/min');
    setHMI('hmi-level', '75', 'sc-val green', 'sensor-card ok', '%');
    setHMI('hmi-press', '4.2', 'sc-val green', 'sensor-card ok', 'bar');
    setHMI('hmi-temp', '65', 'sc-val green', 'sensor-card ok', '°C');

    document.getElementById('pump1').className = 'pd-component pump running';
    document.getElementById('p1-status').textContent = 'PUMP P1 (RUNNING)';
    document.getElementById('rotor1').className = 'pump-rotor spinning';
    document.getElementById('sens-temp').className = 'pd-sensor ok';
    document.getElementById('sens-temp').textContent = 'TEMP: 65°C';

    document.getElementById('pump2').className = 'pd-component pump ok';
    document.getElementById('p2-status').textContent = 'PUMP P2 (STANDBY)';
    document.getElementById('rotor2').className = 'pump-rotor stopped';

    document.getElementById('sens-flow').className = 'pd-sensor ok';
    document.getElementById('sens-flow').textContent = 'FLOW: 100 L/min';
    document.querySelectorAll('.pd-water').forEach(w => w.className = 'pd-water fast');

    document.getElementById('tank-water').className = 'tank-water';
    document.getElementById('tank-water').style.height = '75%';
    document.getElementById('sens-level').className = 'pd-sensor ok';
    document.getElementById('sens-level').textContent = 'LEVEL: 75%';

    document.getElementById('sens-press').className = 'pd-sensor ok';
    document.getElementById('sens-press').textContent = 'PRESS: 4.2 bar';
    
    document.getElementById('sens-power').className = 'pd-sensor ok';
    document.getElementById('sens-power').textContent = 'POWER: OK';
    
    document.getElementById('sens-valve').className = 'pd-sensor ok';
    document.getElementById('sens-valve').textContent = 'V1: OPEN';
    document.getElementById('valve1').className = 'pd-component valve ok';

    document.getElementById('scada-flow').className = 'sw-value ok';
    document.getElementById('scada-flow').innerHTML = '100.0<span class="sw-unit">L/m</span>';
    
    document.getElementById('scada-p1-icon').className = 'sp-icon running';
    document.getElementById('scada-p1-temp').className = 'sw-value ok';
    document.getElementById('scada-p1-temp').innerHTML = '65.0<span class="sw-unit">°C</span>';

    document.getElementById('scada-p2-icon').className = 'sp-icon offline';
    document.getElementById('scada-p2-state').className = 'sw-value ok';
    document.getElementById('scada-p2-state').innerHTML = 'OFF';

    document.getElementById('scada-tank-fill').className = 'st-level';
    document.getElementById('scada-tank-fill').style.height = '75%';
    document.getElementById('scada-level').className = 'sw-value ok';
    document.getElementById('scada-level').innerHTML = '75.0<span class="sw-unit">%</span>';

    document.getElementById('scada-press').className = 'sw-value ok';
    document.getElementById('scada-press').innerHTML = '4.20<span class="sw-unit">bar</span>';
    
    document.getElementById('scada-power').className = 'sw-value ok';
    document.getElementById('scada-power').innerHTML = 'NOMINAL';
    document.getElementById('scada-valve').className = 'sw-value ok';
    document.getElementById('scada-valve').innerHTML = 'OPEN';
}

function showIncidentCard(title, score, desc, tags, narration) {
    document.getElementById('smart-incident-badge').textContent = '1 INCIDENT ACTIVE';
    document.getElementById('smart-incident-badge').className = 'pv-badge badge-red';
    
    const card = document.getElementById('smart-incident-card');
    card.style.display = 'block';
    card.style.animation = 'fadeIn 0.5s ease';
    
    card.querySelector('.ic-title').innerHTML = `🔴 ${title}`;
    card.querySelector('.ic-score').innerHTML = `SCORE: ${score}`;
    card.querySelector('.ic-body > div:first-child').innerHTML = desc;
    
    const tagsDiv = card.querySelector('.ic-tags');
    tagsDiv.innerHTML = '';
    tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'ic-tag';
        span.textContent = t;
        tagsDiv.appendChild(span);
    });
    
    card.querySelector('.ic-action').innerHTML = `<strong>// AI NARRATION</strong> "${narration}"`;
}

function updateRoleView(opAction, opDetail, engCause, engDetail, supAction, supDetail) {
    const op = document.getElementById('rv-op');
    op.querySelector('.rv-action').textContent = opAction;
    op.querySelector('.rv-detail').textContent = opDetail;
    
    const eng = document.getElementById('rv-eng');
    eng.querySelector('.rv-action').textContent = engCause;
    eng.querySelector('.rv-detail').textContent = engDetail;
    
    const sup = document.getElementById('rv-sup');
    sup.querySelector('.rv-action').textContent = supAction;
    sup.querySelector('.rv-detail').textContent = supDetail;
}

function triggerFailure(scenario) {
    if(!scenario) scenario = 's1';
    currentScenario = scenario;
    
    document.getElementById('btnReset').classList.remove('active');
    document.getElementById('btnTrigger').classList.remove('active');
    document.getElementById('btnTriggerS2').classList.remove('active');
    document.getElementById('btnTriggerS3').classList.remove('active');
    
    if(scenario === 's1') document.getElementById('btnTrigger').classList.add('active');
    if(scenario === 's2') document.getElementById('btnTriggerS2').classList.add('active');
    if(scenario === 's3') document.getElementById('btnTriggerS3').classList.add('active');
    
    document.getElementById('btnTrigger').disabled = true;
    document.getElementById('btnTriggerS2').disabled = true;
    document.getElementById('btnTriggerS3').disabled = true;

    if (scenario === 's1') {
        document.getElementById('btnSimulateFix').textContent = "▶ START BACKUP PUMP (P2)";
        addShiftLog('Pump P1 motor temperature breached 85°C critical threshold.', 'warn');
        setHMI('hmi-temp', '87', 'sc-val red', 'sensor-card alert', '°C');
        document.getElementById('sens-temp').className = 'pd-sensor alert';
        document.getElementById('sens-temp').textContent = 'TEMP: 87°C';
        document.getElementById('scada-p1-temp').className = 'sw-value alert';
        document.getElementById('scada-p1-temp').innerHTML = '87.3<span class="sw-unit">°C</span>';

        timeouts.push(setTimeout(() => {
            addShiftLog('Pump P1 tripped due to overload. OperatorAI grouped 4 alarms.', 'alert');
            setHMI('hmi-p1', 'TRIPPED', 'sc-val red', 'sensor-card alert');
            document.getElementById('pump1').className = 'pd-component pump alert';
            document.getElementById('p1-status').textContent = 'PUMP P1 (TRIPPED)';
            document.getElementById('rotor1').className = 'pump-rotor stopped';
            document.getElementById('scada-p1-icon').className = 'sp-icon tripped';
            
            showIncidentCard(
                "Pump P1 Cascade Failure", 91,
                "Motor overload at 14:32 triggered cascading failures across flow, tank level, and pressure systems. 4 linked alarms grouped into 1 incident.",
                ["P1_MOTOR_TEMP", "FLOW_INLET", "TANK_LEVEL", "PRESSURE"],
                "Critical: Pump P1 failure at 14:32. Cascade across 4 sensors. Backup pump P2 available. ETA to critical tank level: 8 minutes."
            );
            
            updateRoleView(
                "Start backup pump P2 immediately.", "P1 has tripped due to motor overtemp. P2 is in standby and ready.",
                "Root cause: P1 mechanical seal degradation.", "Motor temp trend shows gradual rise over last 6 hrs before trip.",
                "Zone A at risk. No production impact yet.", "P1 failure contained. P2 switchover in progress."
            );
        }, 1000));

        timeouts.push(setTimeout(() => {
            setHMI('hmi-flow', '18', 'sc-val red', 'sensor-card alert', 'L/min');
            document.getElementById('sens-flow').className = 'pd-sensor alert';
            document.getElementById('sens-flow').textContent = 'FLOW: 18 L/min';
            document.querySelectorAll('.pd-water').forEach(w => w.className = 'pd-water slow');
            document.getElementById('scada-flow').className = 'sw-value alert';
            document.getElementById('scada-flow').innerHTML = '18.0<span class="sw-unit">L/m</span>';

            setHMI('hmi-press', '0.7', 'sc-val red', 'sensor-card alert', 'bar');
            document.getElementById('sens-press').className = 'pd-sensor alert';
            document.getElementById('sens-press').textContent = 'PRESS: 0.7 bar';
            document.getElementById('scada-press').className = 'sw-value alert';
            document.getElementById('scada-press').innerHTML = '0.70<span class="sw-unit">bar</span>';
        }, 2000));

        timeouts.push(setTimeout(() => {
            setHMI('hmi-level', '17', 'sc-val amber', 'sensor-card warn', '%');
            document.getElementById('tank-water').className = 'tank-water warn';
            document.getElementById('tank-water').style.height = '17%';
            document.getElementById('sens-level').className = 'pd-sensor warn';
            document.getElementById('sens-level').textContent = 'LEVEL: 17%';
            document.getElementById('scada-tank-fill').className = 'st-level warn';
            document.getElementById('scada-tank-fill').style.height = '17%';
            document.getElementById('scada-level').className = 'sw-value warn';
            document.getElementById('scada-level').innerHTML = '17.0<span class="sw-unit">%</span>';
        }, 3000));

    } else if (scenario === 's2') {
        document.getElementById('btnSimulateFix').textContent = "▶ OPEN BYPASS VALVE";
        addShiftLog('Valve V1 position deviation detected. Commanded OPEN, reads CLOSED.', 'warn');
        
        setHMI('hmi-valve', 'STUCK', 'sc-val red', 'sensor-card alert');
        document.getElementById('sens-valve').className = 'pd-sensor alert';
        document.getElementById('sens-valve').textContent = 'V1: STUCK CLOSED';
        document.getElementById('valve1').className = 'pd-component valve alert';
        document.getElementById('scada-valve').className = 'sw-value alert';
        document.getElementById('scada-valve').innerHTML = 'CLOSED (CMD: OPEN)';

        timeouts.push(setTimeout(() => {
            addShiftLog('Flow blocked by V1. Pump P1 experiencing dead-head pressure spike.', 'alert');
            
            document.querySelectorAll('#water-mid2, #water-out').forEach(w => w.className = 'pd-water slow');
            document.querySelectorAll('#water-in, #water-mid').forEach(w => w.className = 'pd-water');
            
            setHMI('hmi-flow', '0', 'sc-val red', 'sensor-card alert', 'L/min');
            document.getElementById('sens-flow').className = 'pd-sensor alert';
            document.getElementById('sens-flow').textContent = 'FLOW: 0 L/min';
            document.getElementById('scada-flow').className = 'sw-value alert';
            document.getElementById('scada-flow').innerHTML = '0.0<span class="sw-unit">L/m</span>';
            
            showIncidentCard(
                "Valve V1 Stuck Closed", 85,
                "Valve V1 actuator failed while P1 was running, causing zero flow and high upstream pressure.",
                ["V1_POSITION", "FLOW_INLET", "P1_PRESSURE"],
                "Critical: Valve V1 stuck closed. Pump P1 dead-heading. Open bypass valve V2 immediately to relieve pressure."
            );
            
            updateRoleView(
                "Open Bypass Valve V2 manually or via SCADA override.", "Valve V1 is not responding to commands. System is dead-heading.",
                "Root cause: V1 pneumatic actuator failure.", "Command signal sent but position feedback indicates closed. Dispatch tech to V1.",
                "Flow interrupted. Buffer tank absorbing demand.", "Action required to prevent P1 seal damage. No immediate production loss."
            );
        }, 1500));

    } else if (scenario === 's3') {
        document.getElementById('btnSimulateFix').textContent = "▶ RESET MAIN BREAKERS";
        addShiftLog('Grid voltage spike detected: 480V -> 620V.', 'warn');
        
        setHMI('hmi-power', 'SURGE', 'sc-val red', 'sensor-card alert');
        document.getElementById('sens-power').className = 'pd-sensor alert';
        document.getElementById('sens-power').textContent = 'POWER: 620V (SURGE)';
        document.getElementById('scada-power').className = 'sw-value alert';
        document.getElementById('scada-power').innerHTML = '620V SPIKE';

        timeouts.push(setTimeout(() => {
            addShiftLog('All pumps tripped on overvoltage protection.', 'alert');
            
            setHMI('hmi-p1', 'TRIPPED', 'sc-val red', 'sensor-card alert');
            document.getElementById('pump1').className = 'pd-component pump alert';
            document.getElementById('p1-status').textContent = 'PUMP P1 (TRIPPED)';
            document.getElementById('rotor1').className = 'pump-rotor stopped';
            document.getElementById('scada-p1-icon').className = 'sp-icon tripped';
            
            setHMI('hmi-p2', 'TRIPPED', 'sc-val red', 'sensor-card alert');
            document.getElementById('pump2').className = 'pd-component pump alert';
            document.getElementById('p2-status').textContent = 'PUMP P2 (TRIPPED)';
            document.getElementById('rotor2').className = 'pump-rotor stopped';
            document.getElementById('scada-p2-icon').className = 'sp-icon tripped';
            document.getElementById('scada-p2-state').className = 'sw-value alert';
            document.getElementById('scada-p2-state').innerHTML = 'FAULT';
            
            document.querySelectorAll('.pd-water').forEach(w => w.className = 'pd-water slow');
            
            setHMI('hmi-flow', '0', 'sc-val red', 'sensor-card alert', 'L/min');
            document.getElementById('sens-flow').className = 'pd-sensor alert';
            document.getElementById('sens-flow').textContent = 'FLOW: 0 L/min';
            document.getElementById('scada-flow').className = 'sw-value alert';
            document.getElementById('scada-flow').innerHTML = '0.0<span class="sw-unit">L/m</span>';
            
            showIncidentCard(
                "Plant-wide Power Surge", 98,
                "External grid voltage spike triggered main breaker protection. All running and standby pumps tripped.",
                ["MAIN_POWER", "P1_TRIP", "P2_TRIP", "FLOW_INLET"],
                "Critical: Grid surge tripped all pumps. Total flow loss. Reset main breaker and initiate sequential restart."
            );
            
            updateRoleView(
                "Reset main breakers. Sequential pump restart.", "Clear power faults, then start P1. Wait 30s before starting other equipment.",
                "Root cause: External substation voltage anomaly.", "Check VFD event logs for overvoltage transient data. Inspect surge arrestors.",
                "Plant blackout. Immediate production loss.", "Grid anomaly caused plant trip. Restart procedure initiated. Expected downtime: 5m."
            );
        }, 1500));
    }
}

function simulateFix() {
    if(!currentScenario) return;
    
    document.getElementById('btnFix').classList.add('active');
    document.getElementById('btnTrigger').classList.remove('active');
    document.getElementById('btnTriggerS2').classList.remove('active');
    document.getElementById('btnTriggerS3').classList.remove('active');
    document.getElementById('btnReset').classList.remove('active');

    const btn = document.getElementById('btnSimulateFix');
    if(btn) {
        btn.textContent = "EXECUTING...";
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }

    if(currentScenario === 's1') {
        addShiftLog('Operator executed AI Resolution: Started backup pump P2 and placed P1 in offline maintenance mode.', 'action');
        timeouts.push(setTimeout(() => {
            document.getElementById('pump2').className = 'pd-component pump running';
            document.getElementById('p2-status').textContent = 'PUMP P2 (RUNNING)';
            document.getElementById('rotor2').className = 'pump-rotor spinning';
            document.getElementById('pump1').className = 'pd-component pump ok';
            document.getElementById('pump1').style.opacity = '0.5';
            document.getElementById('p1-status').textContent = 'PUMP P1 (OFFLINE)';
            setHMI('hmi-p1', 'OFFLINE', 'sc-val', 'sensor-card ok');
            setHMI('hmi-p2', 'RUNNING', 'sc-val green', 'sensor-card ok');
            document.getElementById('scada-p1-icon').className = 'sp-icon offline';
            document.getElementById('scada-p2-icon').className = 'sp-icon running';
            document.getElementById('scada-p2-state').className = 'sw-value ok';
            document.getElementById('scada-p2-state').innerHTML = 'RUN';
        }, 800));

        timeouts.push(setTimeout(() => {
            document.getElementById('sens-flow').textContent = 'FLOW: 95 L/min';
            document.getElementById('sens-flow').className = 'pd-sensor ok';
            document.querySelectorAll('.pd-water').forEach(w => w.className = 'pd-water fast');
            setHMI('hmi-flow', '95', 'sc-val green', 'sensor-card ok', 'L/min');
            document.getElementById('scada-flow').className = 'sw-value ok';
            document.getElementById('scada-flow').innerHTML = '95.0<span class="sw-unit">L/m</span>';
        }, 2000));

        timeouts.push(setTimeout(() => {
            document.getElementById('tank-water').style.height = '45%';
            document.getElementById('tank-water').classList.remove('warn');
            document.getElementById('sens-level').textContent = 'LEVEL: 45%';
            document.getElementById('sens-level').className = 'pd-sensor ok';
            setHMI('hmi-level', '45', 'sc-val green', 'sensor-card ok', '%');
            document.getElementById('scada-tank-fill').className = 'st-level';
            document.getElementById('scada-tank-fill').style.height = '45%';
            document.getElementById('scada-level').className = 'sw-value ok';
            document.getElementById('scada-level').innerHTML = '45.0<span class="sw-unit">%</span>';
        }, 3500));

        timeouts.push(setTimeout(() => {
            addShiftLog('Plant stabilized. Backup pump P2 running nominally.', 'system');
            document.getElementById('sens-press').textContent = 'PRESS: 4.2 bar';
            document.getElementById('sens-press').className = 'pd-sensor ok';
            setHMI('hmi-press', '4.2', 'sc-val green', 'sensor-card ok', 'bar');
            document.getElementById('scada-press').className = 'sw-value ok';
            document.getElementById('scada-press').innerHTML = '4.20<span class="sw-unit">bar</span>';
            btn.textContent = "PLANT STABILIZED ✓";
            btn.style.background = 'var(--green)';
            btn.style.color = '#fff';
            btn.style.opacity = '1';
        }, 5000));

    } else if(currentScenario === 's2') {
        addShiftLog('Operator executed AI Resolution: Opened Bypass Valve V2.', 'action');
        timeouts.push(setTimeout(() => {
            setHMI('hmi-valve', 'BYPASS OPEN', 'sc-val green', 'sensor-card ok');
            document.getElementById('sens-valve').className = 'pd-sensor ok';
            document.getElementById('sens-valve').textContent = 'V1: BYPASSED';
            document.getElementById('valve1').className = 'pd-component valve ok';
            document.getElementById('scada-valve').className = 'sw-value ok';
            document.getElementById('scada-valve').innerHTML = 'BYPASS ON';
            document.querySelectorAll('.pd-water').forEach(w => w.className = 'pd-water fast');
        }, 1000));
        
        timeouts.push(setTimeout(() => {
            setHMI('hmi-flow', '98', 'sc-val green', 'sensor-card ok', 'L/min');
            document.getElementById('sens-flow').className = 'pd-sensor ok';
            document.getElementById('sens-flow').textContent = 'FLOW: 98 L/min';
            document.getElementById('scada-flow').className = 'sw-value ok';
            document.getElementById('scada-flow').innerHTML = '98.0<span class="sw-unit">L/m</span>';
            btn.textContent = "FLOW RESTORED ✓";
            btn.style.background = 'var(--green)';
            btn.style.color = '#fff';
            btn.style.opacity = '1';
        }, 2500));

    } else if(currentScenario === 's3') {
        addShiftLog('Operator executed AI Resolution: Breakers reset, starting P1.', 'action');
        timeouts.push(setTimeout(() => {
            setHMI('hmi-power', 'NORMAL', 'sc-val green', 'sensor-card ok');
            document.getElementById('sens-power').className = 'pd-sensor ok';
            document.getElementById('sens-power').textContent = 'POWER: OK';
            document.getElementById('scada-power').className = 'sw-value ok';
            document.getElementById('scada-power').innerHTML = 'NOMINAL';
        }, 1000));
        
        timeouts.push(setTimeout(() => {
            setHMI('hmi-p1', 'RUNNING', 'sc-val green', 'sensor-card ok');
            document.getElementById('pump1').className = 'pd-component pump running';
            document.getElementById('p1-status').textContent = 'PUMP P1 (RUNNING)';
            document.getElementById('rotor1').className = 'pump-rotor spinning';
            document.getElementById('scada-p1-icon').className = 'sp-icon running';
            setHMI('hmi-p2', 'STANDBY', 'sc-val green', 'sensor-card ok');
            document.getElementById('pump2').className = 'pd-component pump ok';
            document.getElementById('p2-status').textContent = 'PUMP P2 (STANDBY)';
            document.getElementById('rotor2').className = 'pump-rotor stopped';
            document.getElementById('scada-p2-icon').className = 'sp-icon offline';
            document.getElementById('scada-p2-state').className = 'sw-value ok';
            document.getElementById('scada-p2-state').innerHTML = 'OFF';
        }, 2500));
        
        timeouts.push(setTimeout(() => {
            setHMI('hmi-flow', '100', 'sc-val green', 'sensor-card ok', 'L/min');
            document.getElementById('sens-flow').className = 'pd-sensor ok';
            document.getElementById('sens-flow').textContent = 'FLOW: 100 L/min';
            document.querySelectorAll('.pd-water').forEach(w => w.className = 'pd-water fast');
            document.getElementById('scada-flow').className = 'sw-value ok';
            document.getElementById('scada-flow').innerHTML = '100.0<span class="sw-unit">L/m</span>';
            btn.textContent = "POWER RESTORED ✓";
            btn.style.background = 'var(--green)';
            btn.style.color = '#fff';
            btn.style.opacity = '1';
        }, 4000));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setNormalState();
    setTimeout(() => triggerFailure('s1'), 1500); 
});

function toggleShiftLog() {
    const sidebar = document.getElementById('shift-sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function toggleDemoControls() {
    const dc = document.getElementById('demo-controls');
    const chev = document.getElementById('dc-chevron');
    if (!dc || !chev) return;
    
    if (dc.classList.contains('collapsed')) {
        dc.classList.remove('collapsed');
        chev.textContent = '▼';
    } else {
        dc.classList.add('collapsed');
        chev.textContent = '▲';
    }
}

function addShiftLog(msg, type) {
    const content = document.getElementById('shift-log-content');
    if (!content) return;
    
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const d = document.createElement('div');
    d.className = `ss-log ${type}`;
    d.innerHTML = `<span class="ss-time">${t}</span>${msg}`;
    
    content.appendChild(d);
    content.scrollTop = content.scrollHeight;
}

// ---- PROJECT-BASED SCADA GRID HOVER EFFECT ----
document.addEventListener('mousemove', (e) => {
    const hg = document.getElementById('hover-grid');
    if (hg) {
        hg.style.setProperty('--mouse-x', `${e.pageX}px`);
        hg.style.setProperty('--mouse-y', `${e.pageY}px`);
    }
});
