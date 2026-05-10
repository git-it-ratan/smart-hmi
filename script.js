const tradAlarms = [
    { sev: 'CRIT', cls: 'crit', time: '14:32:07', msg: 'P1_MOTOR_TEMP HIGH — 87.3°C' },
    { sev: 'HIGH', cls: 'high', time: '14:32:09', msg: 'FLOW_INLET LOW — 18 L/min' },
    { sev: 'CRIT', cls: 'crit', time: '14:32:11', msg: 'PRESSURE LOW — 0.7 bar' },
    { sev: 'HIGH', cls: 'high', time: '14:32:14', msg: 'TANK_INLET LEVEL LOW — 17%' },
    { sev: 'MED', cls: 'med', time: '14:31:58', msg: 'V1_POSITION DEVIATION' },
    { sev: 'LOW', cls: 'low', time: '14:31:45', msg: 'POWER_LOAD HIGH — 84%' },
    { sev: 'CRIT', cls: 'crit', time: '14:31:30', msg: 'P2_BACKUP FAIL TO START' },
    { sev: 'HIGH', cls: 'high', time: '14:31:22', msg: 'TANK_OUTLET OVERFLOW RISK' },
    { sev: 'MED', cls: 'med', time: '14:30:58', msg: 'CHLORINE_DOSING DEVIATION' },
    { sev: 'LOW', cls: 'low', time: '14:30:44', msg: 'FILTER_BACKWASH OVERDUE' },
    { sev: 'CRIT', cls: 'crit', time: '14:30:31', msg: 'TURBIDITY SENSOR FAULT' },
    { sev: 'HIGH', cls: 'high', time: '14:30:18', msg: 'PH_LEVEL OUT OF RANGE' },
    { sev: 'MED', cls: 'med', time: '14:29:55', msg: 'UV_LAMP INTENSITY LOW' },
    { sev: 'LOW', cls: 'low', time: '14:29:42', msg: 'FLOW_OUTLET IMBALANCE' },
    { sev: 'CRIT', cls: 'crit', time: '14:29:29', msg: 'P1_MOTOR_TEMP HIGH — 84.1°C' },
    { sev: 'HIGH', cls: 'high', time: '14:29:10', msg: 'FLOW_INLET VARIANCE' },
    { sev: 'LOW', cls: 'low', time: '14:28:58', msg: 'TANK_INLET LEVEL WARN — 28%' },
];

const chaosAlarms = [
    { cls: 'crit', msg: 'P1_MOTOR_TEMP HIGH — 87.3°C' },
    { cls: 'high', msg: 'FLOW_INLET LOW — 18 L/min' },
    { cls: 'crit', msg: 'PRESSURE LOW — 0.7 bar' },
    { cls: 'high', msg: 'TANK_INLET LOW — 17%' },
    { cls: 'med', msg: 'V1_POSITION DEVIATION' },
    { cls: 'low', msg: 'POWER_LOAD HIGH' },
];

// Populate chaos list
const cl = document.getElementById('chaosList');
chaosAlarms.forEach((a, i) => {
    const d = document.createElement('div');
    d.className = `alarm-row ${a.cls}`;
    d.style.animationDelay = (i * 0.15) + 's';
    d.innerHTML = `<span class="alarm-msg">${a.msg}</span><span class="alarm-time">14:3${i}:0${i}</span>`;
    cl.appendChild(d);
});

// tradAlarms are now populated by triggerFailure()
// const tal = document.getElementById('tradAlarmList'); ...

// Update time
function updateTime() {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const el = document.getElementById('tradTime');
    if (el) el.textContent = t;
    const scadaEl = document.getElementById('scada-clock');
    if (scadaEl) scadaEl.textContent = t;
}
setInterval(updateTime, 1000);

// Add new alarms occasionally to traditional view
let alarmCount = 47;
setInterval(() => {
    if (document.getElementById('panelTrad').classList.contains('active')) {
        alarmCount++;
        document.getElementById('alarmCountBadge').textContent = alarmCount + ' ACTIVE ALARMS';
        const msgs = ['SENSOR_FAULT DETECTED', 'COMM_LINK TIMEOUT', 'VALVE_POS ERROR', 'TEMP_DEVIATION'];
        const clss = ['crit', 'high', 'med', 'low'];
        const idx = Math.floor(Math.random() * 4);
        const d = document.createElement('div');
        d.className = `trad-alarm ${clss[idx]}`;
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        d.innerHTML = `<span style="font-weight:700">${clss[idx].toUpperCase()}</span><span style="color:var(--text3)">${t}</span><span>${msgs[Math.floor(Math.random() * msgs.length)]}</span><span style="color:var(--text3);font-size:0.6rem;cursor:pointer;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:2px">ACK</span>`;
        tal.insertBefore(d, tal.firstChild);
    }
}, 3000);

// ---- MODE SWITCH ----
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

// ---- ROLE SWITCH ----
function switchRole(role, btn) {
    document.querySelectorAll('.role-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('rv-' + role).classList.add('active');
    btn.classList.add('active');
}

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- SIMULATION LOGIC ----
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
    // Buttons
    document.getElementById('btnReset').classList.add('active');
    document.getElementById('btnTrigger').classList.remove('active');
    document.getElementById('btnFix').classList.remove('active');
    document.getElementById('btnFix').textContent = "3. OperatorAI Action";
    document.getElementById('btnFix').disabled = false;
    document.getElementById('btnTrigger').disabled = false;
    
    const simFixBtn = document.getElementById('btnSimulateFix');
    if(simFixBtn) {
        simFixBtn.textContent = "▶ START BACKUP PUMP (P2)";
        simFixBtn.style = ""; 
        simFixBtn.disabled = false;
    }

    // Reset Shift Log
    const logContent = document.getElementById('shift-log-content');
    if(logContent) logContent.innerHTML = '';
    addShiftLog('Shift started. Plant operating normally. All sensors nominal.', 'system');

    // Smart Panel
    document.getElementById('smart-incident-badge').textContent = '0 INCIDENTS ACTIVE';
    document.getElementById('smart-incident-badge').className = 'pv-badge badge-green';
    document.getElementById('smart-incident-card').style.display = 'none';

    // Traditional Panel
    document.getElementById('alarmCountBadge').textContent = '1 ACTIVE ALARM';
    const tal = document.getElementById('tradAlarmList');
    if(tal) tal.innerHTML = '<div class="trad-alarm low"><span style="font-weight:700">LOW</span><span style="color:var(--text3)">14:28:58</span><span>POWER_LOAD NORMAL — 42%</span><span style="color:var(--text3);font-size:0.6rem;cursor:pointer;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:2px">ACK</span></div>';

    // HMI Sensors (Green)
    setHMI('hmi-p1', 'RUNNING', 'sc-val green', 'sensor-card ok');
    setHMI('hmi-p2', 'STANDBY', 'sc-val green', 'sensor-card ok');
    setHMI('hmi-flow', '100', 'sc-val green', 'sensor-card ok', 'L/min');
    setHMI('hmi-level', '75', 'sc-val green', 'sensor-card ok', '%');
    setHMI('hmi-press', '4.2', 'sc-val green', 'sensor-card ok', 'bar');
    setHMI('hmi-temp', '65', 'sc-val green', 'sensor-card ok', '°C');

    // Visual Diagram (Green)
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

    // SCADA
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
}

function triggerFailure() {
    document.getElementById('btnReset').classList.remove('active');
    document.getElementById('btnTrigger').classList.add('active');
    document.getElementById('btnTrigger').disabled = true;

    // Simulate cascade over 3 seconds
    
    addShiftLog('Pump P1 motor temperature breached 85°C critical threshold.', 'warn');

    // Reset trend graph
    const trendVal = document.getElementById('trend-val');
    if (trendVal) {
        trendVal.textContent = '87°C';
        trendVal.style.color = 'var(--red)';
    }
    const trendLine = document.getElementById('trend-line');
    const trendPoly = document.getElementById('trend-poly');
    if (trendLine && trendPoly) {
        trendLine.setAttribute('points', '0,25 20,25 30,24 40,22 50,23 60,18 70,15 80,12 90,8 100,5');
        trendLine.setAttribute('stroke', 'var(--amber)');
        trendPoly.setAttribute('points', '0,25 20,25 30,24 40,22 50,23 60,18 70,15 80,12 90,8 100,5 100,30 0,30');
        const grad = document.getElementById('grad1');
        if(grad) {
            grad.children[0].style.stopColor = 'var(--amber)';
            grad.children[1].style.stopColor = 'var(--amber)';
        }
    }

    // t=0: Temp spikes
    setHMI('hmi-temp', '87', 'sc-val red', 'sensor-card alert', '°C');
    document.getElementById('sens-temp').className = 'pd-sensor alert';
    document.getElementById('sens-temp').textContent = 'TEMP: 87°C';
    document.getElementById('scada-p1-temp').className = 'sw-value alert';
    document.getElementById('scada-p1-temp').innerHTML = '87.3<span class="sw-unit">°C</span>';

    // t=1: P1 trips
    setTimeout(() => {
        addShiftLog('Pump P1 tripped due to overload. OperatorAI intercepted 4 resulting alarms and grouped them into Incident #1.', 'alert');
        setHMI('hmi-p1', 'TRIPPED', 'sc-val red', 'sensor-card alert');
        document.getElementById('pump1').className = 'pd-component pump alert';
        document.getElementById('p1-status').textContent = 'PUMP P1 (TRIPPED)';
        document.getElementById('rotor1').className = 'pump-rotor stopped';
        document.getElementById('scada-p1-icon').className = 'sp-icon tripped';
        
        // Smart Panel Shows Incident
        document.getElementById('smart-incident-badge').textContent = '1 INCIDENT ACTIVE';
        document.getElementById('smart-incident-badge').className = 'pv-badge badge-red';
        document.getElementById('smart-incident-card').style.display = 'block';
        document.getElementById('smart-incident-card').style.animation = 'fadeIn 0.5s ease';
        
        // Populate traditional alarms
        const tal = document.getElementById('tradAlarmList');
        if(tal) tal.innerHTML = '';
        tradAlarms.forEach((a, i) => {
            setTimeout(() => {
                const d = document.createElement('div');
                d.className = `trad-alarm ${a.cls}`;
                d.innerHTML = `<span style="font-weight:700">${a.sev}</span><span style="color:var(--text3)">${a.time}</span><span>${a.msg}</span><span style="color:var(--text3);font-size:0.6rem;cursor:pointer;background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:2px">ACK</span>`;
                if(tal) tal.appendChild(d);
                document.getElementById('alarmCountBadge').textContent = (i + 1) + ' ACTIVE ALARMS';
            }, i * 150);
        });
    }, 1000);

    // t=2: Flow and Pressure drops
    setTimeout(() => {
        addShiftLog('Pressure loss detected in main line. Inlet flow dropped to 18 L/min.', 'alert');
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
    }, 2000);

    // t=3: Tank level drops
    setTimeout(() => {
        setHMI('hmi-level', '17', 'sc-val amber', 'sensor-card warn', '%');
        document.getElementById('tank-water').className = 'tank-water warn';
        document.getElementById('tank-water').style.height = '17%';
        document.getElementById('sens-level').className = 'pd-sensor warn';
        document.getElementById('sens-level').textContent = 'LEVEL: 17%';
        document.getElementById('scada-tank-fill').className = 'st-level warn';
        document.getElementById('scada-tank-fill').style.height = '17%';
        document.getElementById('scada-level').className = 'sw-value warn';
        document.getElementById('scada-level').innerHTML = '17.0<span class="sw-unit">%</span>';
    }, 3000);
}

// ---- SIMULATE FIX ----
function simulateFix() {
    addShiftLog('Operator executed AI Resolution: Started backup pump P2 and placed P1 in offline maintenance mode.', 'action');
    document.getElementById('btnFix').classList.add('active');
    document.getElementById('btnTrigger').classList.remove('active');
    document.getElementById('btnReset').classList.remove('active');

    const btn = document.getElementById('btnSimulateFix');
    if(btn) {
        btn.textContent = "EXECUTING...";
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }

    // 1. Start P2
    setTimeout(() => {
        // Visual Diagram
        document.getElementById('pump2').classList.remove('ok');
        document.getElementById('pump2').classList.add('running');
        document.getElementById('p2-status').textContent = 'PUMP P2 (RUNNING)';
        document.getElementById('rotor2').classList.add('spinning');
        
        document.getElementById('pump1').classList.remove('alert');
        document.getElementById('pump1').classList.add('ok');
        document.getElementById('pump1').style.opacity = '0.5';
        document.getElementById('p1-status').textContent = 'PUMP P1 (OFFLINE)';
        
        const tempSens = document.getElementById('sens-temp');
        if(tempSens) {
            tempSens.textContent = 'TEMP: 45°C';
            tempSens.className = 'pd-sensor ok';
        }

        // Smart HMI Sync
        const hmiP1 = document.getElementById('hmi-p1');
        const hmiP1Val = document.getElementById('hmi-p1-val');
        if(hmiP1 && hmiP1Val) {
            hmiP1.className = 'sensor-card ok';
            hmiP1Val.className = 'sc-val';
            hmiP1Val.style.color = 'var(--text3)';
            hmiP1Val.innerHTML = 'OFFLINE<span class="sc-unit"></span>';
        }
        
        const hmiP2 = document.getElementById('hmi-p2');
        const hmiP2Val = document.getElementById('hmi-p2-val');
        if(hmiP2 && hmiP2Val) {
            hmiP2.className = 'sensor-card ok';
            hmiP2Val.className = 'sc-val green';
            hmiP2Val.innerHTML = 'RUNNING<span class="sc-unit"></span>';
        }

        const hmiTemp = document.getElementById('hmi-temp');
        const hmiTempVal = document.getElementById('hmi-temp-val');
        if(hmiTemp && hmiTempVal) {
            hmiTemp.className = 'sensor-card ok';
            hmiTempVal.className = 'sc-val green';
            hmiTempVal.innerHTML = '45<span class="sc-unit">°C</span>';
        }

        // SCADA Sync
        const scadaP1Icon = document.getElementById('scada-p1-icon');
        const scadaP1Temp = document.getElementById('scada-p1-temp');
        if(scadaP1Icon && scadaP1Temp) {
            scadaP1Icon.className = 'sp-icon offline';
            scadaP1Temp.className = 'sw-value ok';
            scadaP1Temp.innerHTML = '45.0<span class="sw-unit">°C</span>';
        }

        const scadaP2Icon = document.getElementById('scada-p2-icon');
        const scadaP2State = document.getElementById('scada-p2-state');
        if(scadaP2Icon && scadaP2State) {
            scadaP2Icon.className = 'sp-icon running';
            scadaP2State.className = 'sw-value ok';
            scadaP2State.innerHTML = 'RUN';
        }
        
        // Trend Graph Drop
        const trendVal = document.getElementById('trend-val');
        if (trendVal) {
            trendVal.textContent = '45°C';
            trendVal.style.color = 'var(--green)';
        }
        const trendLine = document.getElementById('trend-line');
        const trendPoly = document.getElementById('trend-poly');
        if (trendLine && trendPoly) {
            // Animating SVG transition via CSS
            trendLine.style.transition = 'all 1s ease';
            trendPoly.style.transition = 'all 1s ease';
            trendLine.setAttribute('points', '0,25 20,25 30,24 40,22 50,23 60,18 70,15 80,12 90,8 100,25');
            trendLine.setAttribute('stroke', 'var(--green)');
            trendPoly.setAttribute('points', '0,25 20,25 30,24 40,22 50,23 60,18 70,15 80,12 90,8 100,25 100,30 0,30');
            const grad = document.getElementById('grad1');
            if(grad) {
                grad.children[0].style.stopColor = 'var(--green)';
                grad.children[1].style.stopColor = 'var(--green)';
            }
        }
    }, 800);

    // 2. Flow increases
    setTimeout(() => {
        // Visual Diagram
        document.getElementById('sens-flow').textContent = 'FLOW: 95 L/min';
        document.getElementById('sens-flow').className = 'pd-sensor ok';
        
        document.querySelectorAll('.pd-water').forEach(w => {
            w.classList.remove('slow');
            w.classList.add('fast');
        });

        // Smart HMI Sync
        const hmiFlow = document.getElementById('hmi-flow');
        const hmiFlowVal = document.getElementById('hmi-flow-val');
        if(hmiFlow && hmiFlowVal) {
            hmiFlow.className = 'sensor-card ok';
            hmiFlowVal.className = 'sc-val green';
            hmiFlowVal.innerHTML = '95<span class="sc-unit">L/min</span>';
        }

        // SCADA Sync
        const scadaFlow = document.getElementById('scada-flow');
        if(scadaFlow) {
            scadaFlow.className = 'sw-value ok';
            scadaFlow.innerHTML = '95.0<span class="sw-unit">L/m</span>';
        }
    }, 2000);

    // 3. Tank level rises
    setTimeout(() => {
        // Visual Diagram
        document.getElementById('tank-water').style.height = '45%';
        document.getElementById('tank-water').classList.remove('warn');
        document.getElementById('sens-level').textContent = 'LEVEL: 45%';
        document.getElementById('sens-level').className = 'pd-sensor ok';

        // Smart HMI Sync
        const hmiLevel = document.getElementById('hmi-level');
        const hmiLevelVal = document.getElementById('hmi-level-val');
        if(hmiLevel && hmiLevelVal) {
            hmiLevel.className = 'sensor-card ok';
            hmiLevelVal.className = 'sc-val green';
            hmiLevelVal.innerHTML = '45<span class="sc-unit">%</span>';
        }

        // SCADA Sync
        const scadaTankFill = document.getElementById('scada-tank-fill');
        const scadaLevel = document.getElementById('scada-level');
        if(scadaTankFill && scadaLevel) {
            scadaTankFill.className = 'st-level';
            scadaTankFill.style.height = '45%';
            scadaLevel.className = 'sw-value ok';
            scadaLevel.innerHTML = '45.0<span class="sw-unit">%</span>';
        }
    }, 3500);

    // 4. Pressure normalizes
    setTimeout(() => {
        addShiftLog('Plant stabilized. Backup pump P2 running nominally. Flow and pressure restored. Zone A risk averted.', 'system');
        // Visual Diagram
        document.getElementById('sens-press').textContent = 'PRESS: 4.2 bar';
        document.getElementById('sens-press').className = 'pd-sensor ok';
        
        btn.textContent = "PLANT STABILIZED ✓";
        btn.style.background = 'var(--green)';
        btn.style.color = '#fff';
        btn.style.opacity = '1';

        // Smart HMI Sync
        const hmiPress = document.getElementById('hmi-press');
        const hmiPressVal = document.getElementById('hmi-press-val');
        if(hmiPress && hmiPressVal) {
            hmiPress.className = 'sensor-card ok';
            hmiPressVal.className = 'sc-val green';
            hmiPressVal.innerHTML = '4.2<span class="sc-unit">bar</span>';
        }

        // SCADA Sync
        const scadaPress = document.getElementById('scada-press');
        if(scadaPress) {
            scadaPress.className = 'sw-value ok';
            scadaPress.innerHTML = '4.20<span class="sw-unit">bar</span>';
        }
    }, 5000);
}

// Initialize normal state on load
window.addEventListener('DOMContentLoaded', () => {
    setNormalState();
});

// ---- SHIFT LOG ----
function toggleShiftLog() {
    const sidebar = document.getElementById('shift-sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

// ---- DEMO CONTROLS ----
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