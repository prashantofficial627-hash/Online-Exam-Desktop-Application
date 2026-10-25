# Online Exam Desktop Application

A simple desktop application (built with **Electron**) where students configure their exam environment, take timed multiple-choice exams, and see their results. It includes proctoring features: webcam setup, full-screen permissions, and snapshots saved to a configurable storage folder.

## How to run

1. Install Node.js (needed to run Electron).
2. Open a terminal inside this folder and run:

```bash
npm start
```

## Features

- Setup front page: Camera configuration, full screen permission toggle, and custom snapshot storage folder selection
- Dashboard with the list of available exams
- Instructions screen with a proctoring notice and student consent
- Exam screen with Next / Previous buttons, saved answers and a countdown timer
- Automatic submission when the timer ends
- Result screen (score, percentage, pass/fail)
- History screen with past results
- Webcam feed, full-screen mode, and periodic snapshots

## Project structure

```
Online-Exam-App/
├── app/
│   ├── app.js             Electron backend (start-timer, select-folder, store-camera-snap, show-rules)
│   ├── preload.js         Bridge exposing window.athena
│   └── user-camera-snap/  Storage directory for captured camera snaps
├── data/
│   └── exams.js           Exams and questions
├── pages/                 index (front page), dashboard, instructions, exam, result, history (HTML)
├── css/
│   └── style.css          Styling for all pages
├── js/                    common.js, frontpage.js, dashboard.js, instructions.js, exam.js, result.js, history.js
└── package.json
```

## Where is the data stored?

| Data | Where |
|------|-------|
| Exams and questions | `data/exams.js` |
| Students, responses, results, snapshot records | `localStorage` (inside the Electron app) |
| Snapshot images | `snapshots/` folder |

## Note

The proctoring features support exam monitoring but cannot guarantee that all
misconduct is detected. Students are informed about the webcam and snapshots on the
instructions screen before the exam starts.
