# OperatorAI — Smart HMI
**ABB Accelerator 2026 · Theme 1: Next-Gen Control System Interface**

*"Not a better dashboard. An operator copilot built on ABB's own vision of high-performance HMI."*

🔗 **Live Demo:** [https://git-it-ratan.github.io/smart-hmi/](https://git-it-ratan.github.io/smart-hmi/)

---

## What Is This?
OperatorAI is a web-based Smart HMI (Human-Machine Interface) simulator for a Water Treatment Plant. It demonstrates the paradigm shift from traditional alarm-flooding HMIs to intelligent, role-aware, AI-narrated control interfaces — aligned with ISA-18.2 and ISA-101 standards.

Built for the **ABB Accelerator 2026** innovation challenge (Theme 1 — Next-Gen Control System Interface), hosted in Bengaluru on June 25, 2026.

## The Problem We Solve
Traditional HMIs dump every alarm on a single scrolling list. One pump failure triggers 4–8 downstream alarms shown as completely unrelated events. Operators see chaos, not cause.

*   **ISA-18.2** targets fewer than 6 alarms per operator hour. Real plants routinely hit 600+.
*   The consequences are documented and catastrophic — the BP Texas City refinery explosion (2005, 15 deaths, $2.1B total cost) was directly caused by disabled critical alarms and operator information overload.

OperatorAI addresses this by:
1.  **Grouping** related alarms into single incidents with a root cause.
2.  **Scoring** each incident by urgency, cascade count, and trend direction.
3.  **Showing role-specific guidance** (Operator / Engineer / Supervisor) for the same incident.
4.  **Narrating** situations in plain English instead of alarm codes.

## Live Demo Features

### 3 Triggerable Failure Scenarios
| Scenario | Root Cause | Cascade |
| :--- | :--- | :--- |
| **S1 — P1 Pump Failure** | Motor overtemperature → trip | Flow drop → Tank drain → Pressure loss |
| **S2 — Valve V1 Stuck** | Actuator / mechanical jam | Flow restriction → Upstream pressure build |
| **S3 — Power Spike** | Overvoltage grid anomaly | All pumps trip → Immediate flow loss |

### Traditional vs Smart Mode Toggle
Switch between raw alarm flood view and the OperatorAI incident intelligence view during any active scenario — demonstrating the contrast in real time.

### Role-Based Views
The same incident surfaces completely different information to each role:
*   **Operator** — what to do right now, step by step
*   **Engineer** — root cause diagnosis, inspection checklist, repair estimate
*   **Supervisor** — production impact, safety status, maintenance coordination

### Live Telemetry Simulation
Pump P1 State · Pump P2 (Backup) · Motor Temperature · Inlet Flow Rate · Inlet Tank Level · System Pressure · Valve V1 State · Main Power Load

---

## Architecture

```text
Simulation Engine  →  Scoring Algorithm  →  Role Engine  →  NLP Narration
(JS timers + JSON)    (ISA-18.2 rules)      (3 role views)   (plain English)
```
*No black boxes. Every score has a visible reason.*

### Alarm Scoring Factors
| Factor | Score |
| :--- | :--- |
| Alarm severity (Critical / High / Med / Low) | +40 / +25 / +10 / +3 |
| Cascade count (per linked component) | +8 each |
| Chattering detection (3+ fires in 10 min) | +15 |
| Trend direction (worsening over 5 readings) | +12 |
| Time unacknowledged (every 2 min) | +5 |

---

## Technology Stack
| Layer | Tool |
| :--- | :--- |
| **UI** | Plain HTML / CSS / JavaScript — zero dependencies |
| **Charts & Telemetry** | SVG and CSS-driven sensor bars with live state |
| **Simulation** | JavaScript timers + dynamic scenario engine |
| **Alarm Logic** | Rule-based JS — explainable, no ML |
| **Deployment** | GitHub Pages — single `index.html` |

*No build step. No framework. No install. Drop the file and it runs.*

---

## Team
**CMR Engineering College, Hyderabad** — B.Tech CSE, 2027 Batch

| Name | Email | Role |
| :--- | :--- | :--- |
| Lahari Mallidi | 238r1a05dg@gmail.com | Team Leader |
| Ayesha Mariyam | 238r1a05d5.ayes@gmail.com | Team Member |
| Ratan Nageshwarrao Donakonda | 238r1a05e7@gmail.com | Team Member |
| Marrikukkala Naga Chaitanya | nagachaitanya2005@gmail.com | Team Member |
| Bhagavatula N V Sai Sri Datta | 238r1a05e1.cmr@gmail.com | Team Member |

---

## Standards Alignment
*   **ISA-18.2** — Alarm management lifecycle (target: <6 alarms/operator/hour)
*   **ISA-101** — HMI design philosophy (4-level display hierarchy, high-performance principles)
*   *OperatorAI extends both standards with an AI interpretation layer that neither standard currently mandates.*

---

## How to Run Locally
```bash
git clone https://github.com/git-it-ratan/smart-hmi.git
cd smart-hmi
# Open index.html in any browser — no server needed
```

---

## ABB Accelerator 2026
*   **Theme:** Next-Gen Control System Interface
*   **Event:** Bengaluru Finale, June 25, 2026
*   **Round 1 Deadline:** May 20, 2026
*   **Organizer:** MyCareernet

> *Built with the conviction that an industrial operator should never have to decode a situation — the system should decode it for them.*
