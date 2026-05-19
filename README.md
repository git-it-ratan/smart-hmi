# OperatorAI: The Smart HMI Copilot
**Developed for the ABB Accelerator 2026**
*Theme 1: Next-Gen Control System Interface*

🔗 **Live Project Demo:** [https://git-it-ratan.github.io/smart-hmi/](https://git-it-ratan.github.io/smart-hmi/)

---

## 🚀 Overview
OperatorAI is a fully interactive, web-based Human-Machine Interface (HMI) simulator designed to redefine how operators interact with industrial control systems. Built specifically for a water treatment plant context, our project demonstrates a shift from traditional, cluttered alarm systems to an intelligent, AI-guided interface. 

Our solution directly aligns with high-performance HMI principles (ISA-101) and alarm management standards (ISA-18.2).

## ⚠️ The Problem
In traditional SCADA setups, a single equipment failure can trigger a massive cascade of downstream alarms. This floods the operator's screen with raw, disjointed data, causing "alarm fatigue" and masking the true root cause. 

* **The Reality:** While ISA-18.2 recommends fewer than 6 alarms per hour, real-world operators often face hundreds during an incident.
* **The Impact:** Information overload leads to delayed responses and critical incidents (e.g., the 2005 Texas City refinery explosion).

## 💡 Our Solution
OperatorAI eliminates alarm floods by automatically:
1. **Aggregating** cascading alarms into a single, comprehensive "Incident Card".
2. **Scoring** the incident based on severity, cascade depth, and trend trajectories.
3. **Translating** raw alarm codes into plain-English summaries.
4. **Providing Role-Specific Actions** tailored for Operators, Engineers, and Supervisors.

---

## 🛠️ Key Features

### 1. Dynamic Failure Simulation
We built a custom JavaScript simulation engine that realistically models a plant with live telemetry points. We feature three triggerable scenarios:
* **S1: Pump P1 Trip:** Motor overtemperature cascades into flow drops and pressure loss.
* **S2: Valve V1 Jam:** Mechanical actuator failure causes immediate flow restriction.
* **S3: Power Spike:** A grid anomaly that threatens the main power supply and motor stability.

### 2. Live HMI Comparison Toggle
Judges can instantly toggle between a **Traditional HMI** (a chaotic, time-sorted list of raw alarms) and our **Smart HMI** (grouped, scored, and narrated incidents) while a failure scenario is actively running.

### 3. Role-Aware Intelligence
The system recognizes that different personnel need different data to do their jobs effectively:
* **Operator:** Immediate, step-by-step mitigation actions.
* **Engineer:** Technical root-cause analysis and repair checklists.
* **Supervisor:** High-level production impact and safety metrics.

---

## 💻 Tech Stack & Architecture

We built this project entirely from scratch without relying on heavy frameworks, compilers, or external dependencies. 

| Component | Implementation Details |
| :--- | :--- |
| **Frontend UI** | Semantic `index.html` combined with custom `style.css` for a modern, responsive dark theme. |
| **Simulation Logic** | Driven by a robust `script.js` engine using asynchronous timers to model realistic cascading delays. |
| **Visual Components** | CSS-rendered interactive diagrams, synchronized SVG trend lines, and dynamic telemetry bars. |
| **Scoring Algorithm** | Transparent, rule-based JS logic (evaluating ISA severity, chattering, and time-unacknowledged). |
| **Deployment** | Hosted natively via GitHub Pages. |

---

## 👥 The Team
**CMR Engineering College, Hyderabad** (B.Tech CSE, Class of 2027)

| Name | Role | Email |
| :--- | :--- | :--- |
| **Lahari Mallidi** | Team Leader | 238r1a05dg@gmail.com |
| **Ayesha Mariyam** | Team Member | 238r1a05d5.ayes@gmail.com |
| **Ratan Nageshwarrao Donakonda** | Team Member | 238r1a05e7@gmail.com |
| **Marrikukkala Naga Chaitanya** | Team Member | nagachaitanya2005@gmail.com |
| **Bhagavatula N V Sai Sri Datta** | Team Member | 238r1a05e1.cmr@gmail.com |

---

## ⚙️ How to Run Locally

Since the project uses vanilla web technologies, there are no build steps, package installations, or local servers required.

```bash
# 1. Clone the repository
git clone https://github.com/git-it-ratan/smart-hmi.git

# 2. Navigate into the directory
cd smart-hmi

# 3. Simply open the file in your browser
start index.html  # Windows
open index.html   # Mac / Linux
```
