document.addEventListener("DOMContentLoaded", () => {
  const buttons = [...document.querySelectorAll(".nav-btn[data-page]")];
  const pages = [...document.querySelectorAll(".page[id]")];
  const pageNames = new Set(pages.map((page) => page.id.replace(/-page$/, "")));
  const goalInput = document.querySelector(".goal-input-field");
  const addGoalButton = document.querySelector(".add-goal-btn");
  const goalList = document.querySelector(".goal-list");
  const goalMessage = document.querySelector(".goal-message");
  const currentGoal = document.querySelector(".goal-placeholder");
  const generateButton = document.querySelector(".generate-btn");
  const taskList = document.querySelector(".task-list");
  const taskCount = document.querySelector(".task-count");
  const focusList = document.querySelector(".focus-list");
  const todayCount = document.querySelector(".today-count");
  const progressText = document.querySelector(".progress-value");
  const progressFill = document.querySelector(".progress-fill");

  // This small demo keeps one current goal and its task checklist in this browser.
  let goal = localStorage.getItem("goalflow-goal") || "";
  let tasks = readTasks();

  function readTasks() {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("goalflow-tasks") || "[]");
      return Array.isArray(savedTasks) ? savedTasks : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem("goalflow-tasks", JSON.stringify(tasks));
  }

  function showPage(pageName, updateHistory = false) {
    const nextPage = pageNames.has(pageName) ? pageName : "goal";
    buttons.forEach((button) => {
      const isActive = button.dataset.page === nextPage;
      button.classList.toggle("active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    pages.forEach((page) => {
      const isActive = page.id === `${nextPage}-page`;
      page.hidden = !isActive;
      page.classList.toggle("active", isActive);
    });
    if (updateHistory && window.location.hash !== `#${nextPage}`) {
      window.history.pushState({ page: nextPage }, "", `#${nextPage}`);
    }
  }

  function renderGoal() {
    const oldCard = goalList.querySelector(".saved-goal");
    if (oldCard) oldCard.remove();
    const emptyText = goalList.querySelector(".empty-text");
    if (!goal) {
      emptyText.hidden = false;
      currentGoal.textContent = "No goal selected";
      return;
    }
    emptyText.hidden = true;
    const card = document.createElement("p");
    card.className = "saved-goal";
    card.textContent = goal;
    goalList.append(card);
    currentGoal.textContent = goal;
  }

  // The examples use a few transparent keyword templates, not AI generation.
  function makeExampleTasks(goalText) {
    const lowerGoal = goalText.toLowerCase();
    let steps;
    if (/(exam|cet|ielts|toefl|test|考试|英语)/i.test(lowerGoal)) {
      steps = ["List the topics and skills to practice", "Complete one focused practice session", "Review mistakes and note the next step"];
    } else if (/(read|book|阅读|读完)/i.test(lowerGoal)) {
      steps = ["Choose a small section to read", "Read and write down three key points", "Review your notes and plan the next section"];
    } else if (/(project|build|create|作品|项目|制作)/i.test(lowerGoal)) {
      steps = ["Define the smallest useful first milestone", "Work on one concrete part of the project", "Review what is done and choose the next task"];
    } else {
      steps = ["Write down the first small action for this goal", "Spend 25 minutes working on that action", "Review your progress and choose the next step"];
    }
    return steps.map((title, index) => ({ id: `${Date.now()}-${index}`, title, done: false }));
  }

  function renderTasks() {
    taskList.replaceChildren();
    focusList.replaceChildren();
    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="task-item"><div class="task-content"><p class="task-title">No tasks yet</p><p class="task-description">Generate tasks from your current goal.</p></div></li>';
      focusList.innerHTML = '<li class="empty-text">No tasks for today. Generate tasks in Plan to get started.</li>';
    } else {
      tasks.forEach((task, index) => {
        const item = document.createElement("li");
        item.className = "task-item";
        const number = document.createElement("span");
        number.className = "task-number";
        number.textContent = String(index + 1);
        const content = document.createElement("div");
        content.className = "task-content";
        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.title;
        if (task.done) title.classList.add("task-done");
        const description = document.createElement("p");
        description.className = "task-description";
        description.textContent = task.done ? "Completed" : "A small step toward your goal.";
        content.append(title, description);
        item.append(number, content);
        taskList.append(item);

        const focusItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", `Mark ${task.title} complete`);
        checkbox.addEventListener("change", () => {
          task.done = checkbox.checked;
          saveTasks();
          renderTasks();
        });
        const focusTitle = document.createElement("span");
        focusTitle.textContent = task.title;
        if (task.done) focusTitle.classList.add("task-done");
        focusItem.append(checkbox, focusTitle);
        focusList.append(focusItem);
      });
    }
    const completed = tasks.filter((task) => task.done).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
    todayCount.textContent = `${completed}/${tasks.length} completed`;
    progressText.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    progressFill.parentElement.setAttribute("aria-valuenow", String(percent));
  }

  addGoalButton.addEventListener("click", () => {
    const goalText = goalInput.value.trim();
    if (!goalText) {
      goalMessage.textContent = "Please enter a goal first.";
      goalInput.focus();
      return;
    }
    goal = goalText;
    localStorage.setItem("goalflow-goal", goal);
    tasks = [];
    saveTasks();
    goalInput.value = "";
    goalMessage.textContent = "Goal saved in this browser.";
    renderGoal();
    renderTasks();
  });

  goalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addGoalButton.click();
  });

  generateButton.addEventListener("click", () => {
    if (!goal) {
      goalMessage.textContent = "Add a goal before generating tasks.";
      showPage("goal", true);
      goalInput.focus();
      return;
    }
    tasks = makeExampleTasks(goal);
    saveTasks();
    renderTasks();
  });

  buttons.forEach((button) => button.addEventListener("click", () => showPage(button.dataset.page, true)));
  window.addEventListener("popstate", () => showPage(window.location.hash.slice(1)));
  window.addEventListener("hashchange", () => showPage(window.location.hash.slice(1)));
  renderGoal();
  renderTasks();
  showPage(window.location.hash.slice(1));
});
