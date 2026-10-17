# GoalFlow

GoalFlow is a small, browser-based productivity prototype for turning one personal goal into clear next steps and tracking daily follow-through. It is built with plain HTML, CSS, and JavaScript, so there is no setup or framework required.

## What you can do

- Add one current goal and see it on the Goal and Plan pages.
- Refresh the page and restore the saved goal, tasks, and completion state from this browser's local storage.
- Generate three example tasks from simple keyword templates. This is a deterministic demo rule; it does not use AI or a backend service.
- Check off tasks on Focus and see the completed count and progress bar update immediately.
- Navigate between Goal, Plan, and Focus pages.

## Run it

1. Download or clone this project folder.
2. Open `index.html` in a modern browser. No install command or server is required.
3. Type a goal such as “Pass CET-6” and select **Add Goal**.
4. Open **Plan** and select **Generate Tasks**. The keyword examples cover study/exams, reading, projects, and a general goal template.
5. Open **Focus**, check one or more tasks, and watch the completion count and progress bar change.
6. Refresh the browser tab. The current goal, generated tasks, and checked state should still be there.

To start fresh, add a new goal (which replaces the current goal and resets its task list), or clear this page's local storage in browser developer tools.

## How it works

The app has three static HTML sections. JavaScript switches between them, renders the saved goal and tasks, and stores changes in `localStorage` under `goalflow-goal` and `goalflow-tasks`. Task generation uses a few transparent keyword checks and fixed templates. All data stays in the current browser profile; there is no account, cloud sync, AI service, or server-side storage.

## Project files

- `index.html` — page structure and accessible controls.
- `style.css` — visual design and responsive layout.
- `app.js` — navigation, local storage, task templates, and progress updates.
- `README.md` — project overview and usage instructions.

## Current scope

This is a front-end portfolio prototype that demonstrates a complete small interaction flow. It currently supports one active goal and a short generated checklist. The task templates are examples rather than personalized planning advice. A future version could add multiple goals, editable tasks, due dates, and cloud sync.
