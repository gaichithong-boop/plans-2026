// COUNTDOWN TIMER
const deadline = new Date("November 13, 2026 23:59:59").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = deadline - now;
    const countdown = document.getElementById("countdown");

    if (!countdown) return;

    if (difference <= 0) {
        countdown.textContent = "DONE ♡";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    countdown.textContent = `${days}d ${hours}h ${minutes}m`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// MAIN TIMER
let timerSeconds = 60 * 60;
let timerInterval = null;
let timerRunning = false;

const timerPanel = document.getElementById("timerPanel");
const timerDisplay = document.getElementById("timerDisplay");
const timerTask = document.getElementById("timerTask");
const pauseTimer = document.getElementById("pauseTimer");
const finishTimer = document.getElementById("finishTimer");

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    if (timerDisplay) {
        timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}

function startTimer(taskName) {
    if (timerTask) timerTask.textContent = taskName;
    if (timerPanel) timerPanel.classList.add("active");

    if (timerRunning) return;

    timerRunning = true;

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerRunning = false;
            alert("Time's up! ♡");
        }
    }, 1000);
}

// Connect every Start button
document.querySelectorAll(".start-button").forEach(button => {
    button.addEventListener("click", () => {
        const taskCard = button.closest(".task-card");
        if (taskCard) {
            const taskName = taskCard.querySelector("h3").textContent;
            startTimer(taskName);
        }
    });
});

if (pauseTimer) {
    pauseTimer.addEventListener("click", () => {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
            pauseTimer.textContent = "Resume";
        } else {
            timerRunning = true;
            pauseTimer.textContent = "Pause";

            timerInterval = setInterval(() => {
                if (timerSeconds > 0) {
                    timerSeconds--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    timerRunning = false;
                    alert("Time's up! ♡");
                }
            }, 1000);
        }
    });
}

if (finishTimer) {
    finishTimer.addEventListener("click", () => {
        clearInterval(timerInterval);
        timerRunning = false;
        if (timerPanel) timerPanel.classList.remove("active");

        timerSeconds = 60 * 60;
        updateTimerDisplay();

        if (pauseTimer) pauseTimer.textContent = "Pause";
    });
}

// NAVIGATION
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const target = link.getAttribute("href").replace("#", "");

        navLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        pages.forEach(page => page.classList.remove("active-page"));

        if (target === "study") {
            document.getElementById("study-page")?.classList.add("active-page");
        } else if (target === "fitness") {
            document.getElementById("workout-page")?.classList.add("active-page");

            // Check what day of the week today is and load that workout!
            const currentDay = new Date().getDay();
            let todayWorkout = gymSchedule[currentDay] || "push";

            // If today is set to rest, show 'push' as the view default
            if (todayWorkout === "rest") todayWorkout = "push";

            showWorkout(todayWorkout);
        } else if (target === "nutrition") {
    document.getElementById("nutrition-page")?.classList.add("active-page");
} else if (target === "calendar") {
    document.getElementById("calendar-page")?.classList.add("active-page");
} else {
    document.getElementById("dashboard-page")?.classList.add("active-page");
    history.replaceState(null, "", location.pathname);
}

    });
});
// STUDY TRACKER
let papers = JSON.parse(localStorage.getItem("papers")) || [];

const savePaper = document.getElementById("savePaper");
const paperSubject = document.getElementById("paperSubject");
const paperDate = document.getElementById("paperDate");
const paperScore = document.getElementById("paperScore");
const paperList = document.getElementById("paperList");
const clearPaperHistory = document.getElementById("clearPaperHistory"); // Clear all button

// --- PYP CODE BUILDER ---
const subjectCodes = {
    "Biology": "0610",
    "Chemistry": "0620",
    "Physics": "0625",
    "Mathematics": "0580",
    "Additional Mathematics": "0606",
    "English": "0511"
};

const subjectPapers = {
    "Biology": ["21", "22", "23", "41", "42", "43", "61", "62", "63"],
    "Chemistry": ["21", "22", "23", "41", "42", "43", "61", "62", "63"],
    "Physics": ["21", "22", "23", "41", "42", "43", "61", "62", "63"],
    "Mathematics": ["21", "22", "23", "41", "42", "43"],
    "Additional Mathematics": ["11", "12", "13", "21", "22", "23"],
    "English": ["11", "12", "13"]
};

const paperNo = document.getElementById("paperNo");
const paperSession = document.getElementById("paperSession");
const paperYear = document.getElementById("paperYear");
const generatedCode = document.getElementById("generatedCode");

// Fill paper-number options based on chosen subject
function populatePaperNumbers() {
    if (!paperNo) return;
    const subject = paperSubject.value;
    const nums = subjectPapers[subject] || [];
    paperNo.innerHTML = `<option value="">Choose paper</option>` +
        nums.map(n => `<option value="${n}">${n}</option>`).join("");
}

// Fill year options 2019-2026
if (paperYear) {
    let yearOpts = `<option value="">Choose year</option>`;
    for (let y = 2019; y <= 2026; y++) {
        const short = String(y).slice(2);
        yearOpts += `<option value="${short}">${y}</option>`;
    }
    paperYear.innerHTML = yearOpts;
}

// Build the code live as the user picks options
function updateGeneratedCode() {
    if (!generatedCode) return;
    const subject = paperSubject.value;
    const code = subjectCodes[subject];
    const no = paperNo && paperNo.value;
    const session = paperSession && paperSession.value;
    const year = paperYear && paperYear.value;

    if (code && no && session && year) {
        generatedCode.textContent = `${code}/${no}/${session}/${year}`;
    } else {
        generatedCode.textContent = "—";
    }
}

if (paperSubject) paperSubject.addEventListener("change", () => { populatePaperNumbers(); updateGeneratedCode(); });
if (paperNo) paperNo.addEventListener("change", updateGeneratedCode);
if (paperSession) paperSession.addEventListener("change", updateGeneratedCode);
if (paperYear) paperYear.addEventListener("change", updateGeneratedCode);

function savePapers() {
    localStorage.setItem("papers", JSON.stringify(papers));
}

function updateStudyStats() {
    const completed = papers.length;
    const completedElem = document.getElementById("papersCompleted");
    const avgScoreElem = document.getElementById("averageScore");
    const above80Elem = document.getElementById("scoresAbove80");

    if (completedElem) completedElem.textContent = completed;

    if (completed === 0) {
        if (avgScoreElem) avgScoreElem.textContent = "—";
        if (above80Elem) above80Elem.textContent = "0";
        return;
    }

    const total = papers.reduce((sum, paper) => sum + paper.score, 0);
    const average = Math.round(total / completed);
    const above80 = papers.filter(paper => paper.score >= 80).length;

    if (avgScoreElem) avgScoreElem.textContent = `${average}%`;
    if (above80Elem) above80Elem.textContent = above80;
}

function displayPapers() {
    if (!paperList) return;

    if (papers.length === 0) {
        paperList.innerHTML = `<p class="empty-message">No papers recorded yet.</p>`;
        updateStudyStats();
        return;
    }

    paperList.innerHTML = "";

    // Added index parameter to track which item to delete
    papers.forEach((paper, index) => {
        const paperCard = document.createElement("div");
        paperCard.className = "paper-card";
        paperCard.style.display = "flex";
        paperCard.style.justifyContent = "space-between";
        paperCard.style.alignItems = "center";
        
        // Added single item delete button (✕)
        paperCard.innerHTML = `
            <div>
                <strong>${paper.subject}</strong>
                ${paper.code ? `<small>${paper.code}</small>` : ""}
                <small>${paper.date}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <strong>${paper.score}%</strong>
                <button class="delete-paper-btn" data-index="${index}" title="Delete paper" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 16px; padding: 2px 6px;">✕</button>
            </div>
        `;
        paperList.appendChild(paperCard);
    });

    updateStudyStats();
}

// Event listener for adding a new paper
if (savePaper) {
    savePaper.addEventListener("click", () => {
        const subject = paperSubject.value;
        const date = paperDate.value;
        const score = Number(paperScore.value);
        const code = generatedCode && generatedCode.textContent !== "—" ? generatedCode.textContent : "";

        if (!subject) {
            alert("Please choose a subject.");
            return;
        }

        if (!date || paperScore.value === "") {
            alert("Please enter the date and score.");
            return;
        }

        const newPaper = { subject, date, score, code };
        papers.push(newPaper);

        savePapers();
        displayPapers();

        paperDate.value = "";
        paperScore.value = "";
        if (paperNo) paperNo.value = "";
        if (paperSession) paperSession.value = "";
        if (paperYear) paperYear.value = "";
        if (generatedCode) generatedCode.textContent = "—";
    });
}

// Event listener for deleting a SINGLE paper item
if (paperList) {
    paperList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-paper-btn")) {
            const index = e.target.getAttribute("data-index");
            if (index !== null) {
                papers.splice(index, 1);
                savePapers();
                displayPapers();
            }
        }
    });
}

// Event listener for CLEARING ALL paper history
if (clearPaperHistory) {
    clearPaperHistory.addEventListener("click", () => {
        if (papers.length === 0) {
            alert("No papers to clear.");
            return;
        }
        if (confirm("Are you sure you want to delete all paper history?")) {
            papers = [];
            savePapers();
            displayPapers();
        }
    });
}

displayPapers();

// DAILY TASK COMPLETION
const today = new Date().toISOString().split("T")[0];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || {};

if (completedTasks[today]) {
    completedTasks[today].forEach(taskId => {
        const task = document.querySelector(`[data-task="${taskId}"]`);
        if (task) {
            task.classList.add("completed");
        }
    });
}

document.querySelectorAll(".complete-button").forEach(button => {
    button.addEventListener("click", () => {
        const task = button.closest(".task-card");
        const taskId = task.dataset.task;

        task.classList.toggle("completed");

        if (!completedTasks[today]) {
            completedTasks[today] = [];
        }

        if (task.classList.contains("completed")) {
            if (!completedTasks[today].includes(taskId)) {
                completedTasks[today].push(taskId);
            }
        } else {
            completedTasks[today] = completedTasks[today].filter(id => id !== taskId);
        }

        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        updateDailyProgress();
    });
});

// UPDATE DAILY PROGRESS
function updateDailyProgress() {
    const tasks = document.querySelectorAll(".task-card");
    const completed = document.querySelectorAll(".task-card.completed");

    const total = tasks.length;
    const done = completed.length;
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

    const textElem = document.getElementById("dailyProgressText");
    const fillElem = document.getElementById("dailyProgressFill");
    const subtextElem = document.getElementById("dailyProgressSubtext");

    if (textElem) textElem.textContent = `${percentage}%`;
    if (fillElem) fillElem.style.width = `${percentage}%`;
    if (subtextElem) subtextElem.textContent = `${done} of ${total} tasks completed`;
}

updateDailyProgress();

// DYNAMIC GYM SCHEDULE WITH LOCALSTORAGE
const defaultGymSchedule = {
    1: "push", // Mon
    2: "rest", // Tue
    3: "pull", // Wed
    4: "rest", // Thu
    5: "legs", // Fri
    6: "rest", // Sat
    0: "rest"  // Sun
};

const workoutLabels = {
    push: "PUSH — Chest, Shoulders, Triceps",
    pull: "PULL — Back, Biceps",
    legs: "LEGS — Legs, Calves, Abs",
    rest: "REST DAY — Recovery / Light Stretch"
};

let gymSchedule = JSON.parse(localStorage.getItem("customGymSchedule")) || defaultGymSchedule;

function saveGymSchedule() {
    localStorage.setItem("customGymSchedule", JSON.stringify(gymSchedule));
}

function updateGymSchedule() {
    const currentDay = new Date().getDay();
    const todayType = gymSchedule[currentDay] || "rest";

    const gymTask = document.querySelector(".gym-task");
    const gymDescription = document.getElementById("gymDescription");

    if (gymTask && gymDescription) {
        gymTask.style.display = "flex";
        gymDescription.textContent = workoutLabels[todayType];
    }
}

function populateScheduleDropdowns() {
    Object.keys(gymSchedule).forEach(dayNum => {
        const selectElem = document.getElementById(`day-${dayNum}`);
        if (selectElem) {
            selectElem.value = gymSchedule[dayNum];
        }
    });
}

// Listen for schedule dropdown changes
document.querySelectorAll(".schedule-select").forEach(select => {
    select.addEventListener("change", (e) => {
        const dayNum = e.target.id.replace("day-", "");
        const newWorkoutType = e.target.value;
        gymSchedule[dayNum] = newWorkoutType;
        
        saveGymSchedule();
        updateGymSchedule();

        const currentDay = new Date().getDay();
        if (Number(dayNum) === currentDay) {
            showWorkout(newWorkoutType);
        }
    });
});
populateScheduleDropdowns();
updateGymSchedule();

// WORKOUT PLANS
const workoutPlans = {
    push: [
        { exercise: "Chest Press", sets: 3, reps: 10 },
        { exercise: "Shoulder Press", sets: 3, reps: 10 },
        { exercise: "Lateral Raise", sets: 3, reps: 12 },
        { exercise: "Tricep Pushdown", sets: 3, reps: 12 }
    ],
    pull: [
        { exercise: "Lat Pulldown", sets: 3, reps: 10 },
        { exercise: "Seated Row", sets: 3, reps: 10 },
        { exercise: "Face Pull", sets: 3, reps: 12 },
        { exercise: "Bicep Curl", sets: 3, reps: 12 }
    ],
    legs: [
        { exercise: "Leg Press", sets: 3, reps: 10 },
        { exercise: "Leg Curl", sets: 3, reps: 12 },
        { exercise: "Calf Raise", sets: 3, reps: 15 },
        { exercise: "Abs", sets: 3, reps: 12 }
    ]
};

// WORKOUT DISPLAY FUNCTION
// MOTIVATIONAL QUOTES FOR REST DAYS
const restQuotes = [
    "“Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.”",
    "“Recovery is where the magic happens and your muscles actually grow.”",
    "“Listen to your body. Rest is an essential part of the training process.”",
    "“Taking a rest day is just as important as putting in the work.”",
    "“Work hard, rest hard. Balance is key to long-term success.”"
];

// WORKOUT DISPLAY FUNCTION WITH REST DAY SUPPORT
function showWorkout(type) {
    const workoutList = document.getElementById("workoutList");
    const workoutTitle = document.getElementById("workoutTitle");
    const workoutSubtitle = document.getElementById("workoutSubtitle");

    if (!workoutList) return;

    // Handle REST DAY case
    if (type === "rest") {
        if (workoutTitle) workoutTitle.textContent = "Rest & Recovery Day";
        if (workoutSubtitle) workoutSubtitle.textContent = "Take time to stretch, hydrate, and recover.";

        const quoteIndex = new Date().getDate() % restQuotes.length;
        const randomQuote = restQuotes[quoteIndex];

        workoutList.innerHTML = `
            <div class="rest-day-card">
                <div class="rest-icon">🧘‍♀️</div>
                <h3>Active Recovery</h3>
                <p class="rest-quote">${randomQuote}</p>
                <div class="rest-tips">
                    <span>💧 Hydrate well</span>
                    <span>🥗 Eat good food</span>
                    <span>🧘 Light stretching</span>
                </div>
            </div>
        `;
        return;
    }

    // Handle ACTIVE WORKOUT cases (Push, Pull, Legs)
    const workout = workoutPlans[type];
    if (!workout) return;

    const titles = { push: "Push Workout", pull: "Pull Workout", legs: "Legs Workout" };
    const subtitles = {
        push: "Chest · Shoulders · Triceps",
        pull: "Back · Biceps",
        legs: "Legs · Calves · Abs"
    };

    if (workoutTitle) workoutTitle.textContent = titles[type] || "Workout";
    if (workoutSubtitle) workoutSubtitle.textContent = subtitles[type] || "";

    workoutList.innerHTML = "";

    workout.forEach((item) => {
        const exercise = document.createElement("div");
        exercise.className = "workout-exercise";

        exercise.innerHTML = `
            <div>
                <div class="exercise-name">${item.exercise}</div>
                <small>${item.sets} sets × ${item.reps} reps</small>
            </div>
            <div class="exercise-details">
                <input type="number" value="${item.sets}" min="1">
                <span>×</span>
                <input type="number" value="${item.reps}" min="1">
                <button class="exercise-done">✓</button>
            </div>
        `;

        workoutList.appendChild(exercise);

        const doneButton = exercise.querySelector(".exercise-done");
        doneButton.addEventListener("click", () => {
            doneButton.classList.toggle("completed");
            exercise.classList.toggle("completed");
        });
    });
}
// OPEN WORKOUT FROM DASHBOARD
const gymStartButton = document.querySelector(".gym-task .start-button");

if (gymStartButton) {
    gymStartButton.addEventListener("click", () => {
        const currentDay = new Date().getDay();
        let workoutType = gymSchedule[currentDay];

        if (workoutType === "rest") workoutType = "push";

        navLinks.forEach(item => item.classList.remove("active"));
        document.querySelector('[href="#fitness"]')?.classList.add("active");

        pages.forEach(page => page.classList.remove("active-page"));
        document.getElementById("workout-page")?.classList.add("active-page");

        showWorkout(workoutType);
    });
}

// AEROBIC TRACKER
let aerobicActivity = null;
const aerobicToday = new Date().toISOString().split("T")[0];

const savedAerobic = JSON.parse(localStorage.getItem("aerobicRecord")) || {};

if (savedAerobic.date === aerobicToday) {
    aerobicActivity = savedAerobic.activity;
    const statusElem = document.getElementById("aerobicStatus");
    if (statusElem) {
        statusElem.textContent = `✓ ${savedAerobic.activity} · ${savedAerobic.duration} min completed`;
    }
}

document.querySelectorAll(".aerobic-option").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".aerobic-option").forEach(item => item.classList.remove("selected"));
        button.classList.add("selected");
        aerobicActivity = button.dataset.activity;
    });
});

const saveAerobicBtn = document.getElementById("saveAerobic");
if (saveAerobicBtn) {
    saveAerobicBtn.addEventListener("click", () => {
        const manualActivity = document.getElementById("manualActivity").value.trim();
        const duration = Number(document.getElementById("manualDuration").value);
        const activity = manualActivity || aerobicActivity;

        if (!activity || !duration) {
            alert("Choose an activity and enter your minutes.");
            return;
        }

        const aerobicRecord = { date: aerobicToday, activity, duration };

        localStorage.setItem("aerobicRecord", JSON.stringify(aerobicRecord));

        const statusElem = document.getElementById("aerobicStatus");
        if (statusElem) statusElem.textContent = `✓ ${activity} · ${duration} min completed`;

        const aerobicTask = document.querySelector('[data-task="aerobic"]');
        if (aerobicTask) {
            aerobicTask.classList.add("completed");
            const description = aerobicTask.querySelector("#aerobicDescription");

            if (description) {
                description.textContent = `✓ ${activity} · ${duration} min completed`;
            }

            if (!completedTasks[today]) completedTasks[today] = [];
            if (!completedTasks[today].includes("aerobic")) {
                completedTasks[today].push("aerobic");
            }

            localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
            updateDailyProgress();
        }
    });
}

// AEROBIC TIMER
let aerobicTimerSeconds = 25 * 60;
let aerobicTimerInterval = null;
let aerobicTimerRunning = false;

const aerobicTimerDisplay = document.getElementById("aerobicTimerDisplay");
const aerobicDuration = document.getElementById("aerobicDuration");
const startAerobicTimer = document.getElementById("startAerobicTimer");
const pauseAerobicTimer = document.getElementById("pauseAerobicTimer");
const finishAerobicTimer = document.getElementById("finishAerobicTimer");

function updateAerobicTimerDisplay() {
    const minutes = Math.floor(aerobicTimerSeconds / 60);
    const seconds = aerobicTimerSeconds % 60;

    if (aerobicTimerDisplay) {
        aerobicTimerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}

if (aerobicDuration) {
    aerobicDuration.addEventListener("change", () => {
        if (aerobicTimerRunning) return;
        aerobicTimerSeconds = Number(aerobicDuration.value) * 60;
        updateAerobicTimerDisplay();
    });
}

if (startAerobicTimer) {
    startAerobicTimer.addEventListener("click", () => {
        if (aerobicTimerRunning) return;

        if (!aerobicActivity) {
            alert("Choose an aerobic activity first.");
            return;
        }

        aerobicTimerRunning = true;

        aerobicTimerInterval = setInterval(() => {
            if (aerobicTimerSeconds > 0) {
                aerobicTimerSeconds--;
                updateAerobicTimerDisplay();
            } else {
                clearInterval(aerobicTimerInterval);
                aerobicTimerRunning = false;
                alert("Aerobic complete! ♡");
            }
        }, 1000);
    });
}

if (pauseAerobicTimer) {
    pauseAerobicTimer.addEventListener("click", () => {
        if (!aerobicTimerRunning) return;
        clearInterval(aerobicTimerInterval);
        aerobicTimerRunning = false;
    });
}

if (finishAerobicTimer) {
    finishAerobicTimer.addEventListener("click", () => {
        clearInterval(aerobicTimerInterval);
        aerobicTimerRunning = false;

        const duration = Number(aerobicDuration.value);
        if (!aerobicActivity) {
            alert("Choose an aerobic activity first.");
            return;
        }

        const aerobicRecord = { date: aerobicToday, activity: aerobicActivity, duration };
        localStorage.setItem("aerobicRecord", JSON.stringify(aerobicRecord));

        const statusElem = document.getElementById("aerobicStatus");
        if (statusElem) statusElem.textContent = `✓ ${aerobicActivity} · ${duration} min completed`;

        const aerobicTask = document.querySelector('[data-task="aerobic"]');
        if (aerobicTask) {
            aerobicTask.classList.add("completed");
            const description = aerobicTask.querySelector("#aerobicDescription");

            if (description) {
                description.textContent = `✓ ${aerobicActivity} · ${duration} min completed`;
            }

            if (!completedTasks[today]) completedTasks[today] = [];
            if (!completedTasks[today].includes("aerobic")) {
                completedTasks[today].push("aerobic");
            }

            localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
            updateDailyProgress();
        }
    });
}

// AUTO-LOAD TODAY'S WORKOUT ON INITIAL PAGE LOAD
(function initFitnessPage() {
    const currentDay = new Date().getDay();
    let todayWorkout = gymSchedule[currentDay] || "rest";
    showWorkout(todayWorkout);
})();

// AUTOMATIC DASHBOARD PROGRESS CALCULATOR
function updateDashboardProgress() {
    // 1. Calculate Study Progress (Paper 1 & Paper 2)
    const studyTasks = document.querySelectorAll('.task-card[data-task="paper1"], .task-card[data-task="paper2"]');
    const completedStudy = document.querySelectorAll('.task-card[data-task="paper1"].completed, .task-card[data-task="paper2"].completed');
    
    const studyPercent = studyTasks.length > 0 ? Math.round((completedStudy.length / studyTasks.length) * 100) : 0;
    
    const studyText = document.getElementById('studyProgressText');
    const studyFill = document.getElementById('studyProgressFill');
    if (studyText) studyText.textContent = `${studyPercent}%`;
    if (studyFill) studyFill.style.width = `${studyPercent}%`;

    // 2. Calculate Fitness Progress (Gym & Aerobic)
    const fitnessTasks = document.querySelectorAll('.task-card[data-task="gym"], .task-card[data-task="aerobic"]');
    const completedFitness = document.querySelectorAll('.task-card[data-task="gym"].completed, .task-card[data-task="aerobic"].completed');
    
    const fitnessPercent = fitnessTasks.length > 0 ? Math.round((completedFitness.length / fitnessTasks.length) * 100) : 0;
    
    const fitnessText = document.getElementById('fitnessProgressText');
    const fitnessFill = document.getElementById('fitnessProgressFill');
    if (fitnessText) fitnessText.textContent = `${fitnessPercent}%`;
    if (fitnessFill) fitnessFill.style.width = `${fitnessPercent}%`;
}

// Watch for clicks on any complete button (✓)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('complete-button')) {
        setTimeout(updateDashboardProgress, 50);
    }
});

// Run once when page loads
updateDashboardProgress();

// AUTO-CHECK DASHBOARD TASK WHEN FINISHED
function markTaskCompleted(taskName) {
    const taskCard = document.querySelector(`.task-card[data-task="${taskName}"]`);
    if (taskCard) {
        taskCard.classList.add('completed');

        // Recalculate progress bars automatically
        if (typeof updateDashboardProgress === 'function') {
            updateDashboardProgress();
        }
    }
}

// 1. When clicking "Finish" on the Aerobic timer
document.getElementById('finishAerobicTimer')?.addEventListener('click', () => {
    markTaskCompleted('aerobic');
});

// 2. When clicking "Save aerobic" (Manual entry)
document.getElementById('saveAerobic')?.addEventListener('click', () => {
    markTaskCompleted('aerobic');
});

// 3. When clicking "Finish" on the Main Timer Panel (Papers / Gym)
document.getElementById('finishTimer')?.addEventListener('click', () => {
    const timerTaskTitle = document.getElementById('timerTask')?.textContent.toLowerCase() || '';

    if (timerTaskTitle.includes('paper 1') || timerTaskTitle.includes('paper1')) {
        markTaskCompleted('paper1');
    } else if (timerTaskTitle.includes('paper 2') || timerTaskTitle.includes('paper2')) {
        markTaskCompleted('paper2');
    } else if (timerTaskTitle.includes('gym')) {
        markTaskCompleted('gym');
    } else if (timerTaskTitle.includes('aerobic')) {
        markTaskCompleted('aerobic');
    }
});
// When clicking "Finish Workout" in the Gym section
document.getElementById('finishGymBtn')?.addEventListener('click', () => {
    markTaskCompleted('gym');
});
// --- AUTOMATIC 12 AM DAILY RESET & SAVING SYSTEM ---

// 1. Check the date on startup and reset if it's a new day
function loadAndCheckDailyReset() {
    const todayDate = new Date().toDateString(); // Looks like "Wed Aug 12 2026"
    const savedDate = localStorage.getItem('lockin_last_date');

    // If it's a new day (or first run), wipe yesterday's tasks
    if (savedDate !== todayDate) {
        localStorage.setItem('lockin_last_date', todayDate);
        localStorage.removeItem('completedTasks');
    }

    // Load today's saved tasks
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    
    document.querySelectorAll('.task-card').forEach(card => {
        const taskKey = card.getAttribute('data-task');
        if (completedTasks.includes(taskKey)) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    });

    if (typeof updateDashboardProgress === 'function') {
        updateDashboardProgress();
    }
}

// 2. Helper to save completed tasks for today
function saveTodayProgress() {
    const completedKeys = [];
    document.querySelectorAll('.task-card.completed').forEach(card => {
        const taskKey = card.getAttribute('data-task');
        if (taskKey) completedKeys.push(taskKey);
    });
    localStorage.setItem('completedTasks', JSON.stringify(completedKeys));
}

// 3. Auto-save progress whenever a finish or checkmark button is clicked
document.addEventListener('click', () => {
    setTimeout(() => {
        saveTodayProgress();
    }, 100);
});

// Run automatically every time you open or refresh the site
loadAndCheckDailyReset();

// --- MISSED GOALS: show yesterday's unfinished main tasks ---
const MAIN_TASKS = [
    { key: "gym", label: "Gym" },
    { key: "aerobic", label: "Aerobic" },
    { key: "paper1", label: "Past-Year Paper 1" },
    { key: "paper2", label: "Past-Year Paper 2" }
];

function updateMissedGoals() {
    const titleElem = document.getElementById("missedGoalsTitle");
    const reminderElem = document.getElementById("missedGoalsReminder");
    const listElem = document.getElementById("missedGoalsList");
    if (!titleElem || !reminderElem || !listElem) return;

    // Work out yesterday's date string (YYYY-MM-DD)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split("T")[0];

    const yesterdayDone = JSON.parse(localStorage.getItem("completedTasks")) || {};
    const doneList = yesterdayDone[yKey] || [];

    const missed = MAIN_TASKS.filter(t => !doneList.includes(t.key));

    if (missed.length === 0) {
        titleElem.textContent = "You're all clear";
        reminderElem.textContent = "No goals missed yesterday — nice work.";
        listElem.innerHTML = "";
    } else {
        titleElem.textContent = "Don't sweat it — here's what slipped yesterday";
        reminderElem.textContent = "Tomorrow's a fresh page. Pick these up when you can.";
        listElem.innerHTML = missed
            .map(t => `<li class="missed-item"><span class="missed-check"></span><span>${t.label}</span></li>`)
            .join("");
    }
}

updateMissedGoals();


// =========================================
// NUTRITION MODULE
// =========================================
const NUTRIENT_LIST = [
    { key: "protein", label: "Protein", icon: "🥩" },
    { key: "carbs", label: "Carbs", icon: "🍞" },
    { key: "fat", label: "Fat", icon: "🥑" },
    { key: "fibre", label: "Fibre", icon: "🌾" },
    { key: "vitc", label: "Vitamin C", icon: "🍊" },
    { key: "calcium", label: "Calcium", icon: "🥛" },
    { key: "iron", label: "Iron", icon: "🥬" }
];

const FOOD_HISTORY_KEY = "nutritionHistory";
const WATER_TODAY_KEY = "waterToday";
const NUTRIENTS_TODAY_KEY = "nutrientsToday";
const SNACKS_TODAY_KEY = "snacksToday";
const LAST_NUTRITION_DATE_KEY = "lastNutritionDate";

function nutritionTodayKey() {
    return new Date().toISOString().split("T")[0];
}

function ensureTodayKey() {
    const todayKeyStr = nutritionTodayKey();
    const lastDate = localStorage.getItem(LAST_NUTRITION_DATE_KEY);

    if (lastDate !== todayKeyStr) {
        if (lastDate) {
            archiveYesterday(lastDate);
        }
        localStorage.setItem(WATER_TODAY_KEY, JSON.stringify([0, 0]));
        localStorage.setItem(NUTRIENTS_TODAY_KEY, JSON.stringify([]));
        localStorage.setItem(SNACKS_TODAY_KEY, JSON.stringify([]));
        localStorage.setItem(LAST_NUTRITION_DATE_KEY, todayKeyStr);
    }
}

function archiveYesterday(dateKey) {
    const history = JSON.parse(localStorage.getItem(FOOD_HISTORY_KEY)) || {};
    if (history[dateKey]) return;

    const water = JSON.parse(localStorage.getItem(WATER_TODAY_KEY)) || [0, 0];
    const nutrients = JSON.parse(localStorage.getItem(NUTRIENTS_TODAY_KEY)) || [];
    const snacks = JSON.parse(localStorage.getItem(SNACKS_TODAY_KEY)) || [];

    history[dateKey] = {
        water: water.reduce((a, b) => a + b, 0),
        nutrients: nutrients,
        snacks: snacks
    };

    const keys = Object.keys(history).sort();
    while (keys.length > 30) {
        delete history[keys.shift()];
    }
    localStorage.setItem(FOOD_HISTORY_KEY, JSON.stringify(history));
}

// ===== WATER =====
function renderWater() {
    const status = document.getElementById("waterStatus");
    if (!status) return;
    const filled = JSON.parse(localStorage.getItem(WATER_TODAY_KEY)) || [0, 0];
    const total = filled.reduce((a, b) => a + b, 0);

    document.querySelectorAll(".bottle").forEach(btn => {
        const idx = Number(btn.getAttribute("data-index"));
        if (filled[idx]) btn.classList.add("filled");
        else btn.classList.remove("filled");
    });

    if (total >= 2000) {
        status.textContent = "✓ 2000ml — drink goal reached ✓";
        status.style.color = "#5a7a5a";
    } else {
        status.textContent = total + " / 2000ml";
        status.style.color = "";
    }
}

document.querySelectorAll(".bottle").forEach(btn => {
    btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-index"));
        const filled = JSON.parse(localStorage.getItem(WATER_TODAY_KEY)) || [0, 0];
        filled[idx] = filled[idx] ? 0 : 1000;
        localStorage.setItem(WATER_TODAY_KEY, JSON.stringify(filled));
        renderWater();
    });
});

// ===== NUTRIENTS =====
function renderNutrients() {
    const list = document.getElementById("nutrientsList");
    const status = document.getElementById("nutrientsStatus");
    if (!list || !status) return;

    const checked = JSON.parse(localStorage.getItem(NUTRIENTS_TODAY_KEY)) || [];
    list.innerHTML = NUTRIENT_LIST.map(n => {
        const isChecked = checked.includes(n.key);
        return `<button type="button" class="nutrient-btn ${isChecked ? "checked" : ""}" data-key="${n.key}">
            <span class="nutrient-icon">${n.icon}</span>
            <span>${n.label}</span>
        </button>`;
    }).join("");

    status.textContent = checked.length + " of " + NUTRIENT_LIST.length + " covered";
    if (checked.length === NUTRIENT_LIST.length) {
        status.textContent += " ✓ All nutrients covered today!";
    }
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".nutrient-btn");
    if (!btn) return;
    const key = btn.getAttribute("data-key");
    const checked = JSON.parse(localStorage.getItem(NUTRIENTS_TODAY_KEY)) || [];
    const idx = checked.indexOf(key);
    if (idx === -1) checked.push(key);
    else checked.splice(idx, 1);
    localStorage.setItem(NUTRIENTS_TODAY_KEY, JSON.stringify(checked));
    renderNutrients();
});

// ===== SNACKS =====
function renderSnacks() {
    const list = document.getElementById("snacksList");
    if (!list) return;
    const snacks = JSON.parse(localStorage.getItem(SNACKS_TODAY_KEY)) || [];
    if (snacks.length === 0) {
        list.innerHTML = `<p class="empty-message">No treats logged today.</p>`;
        return;
    }
    list.innerHTML = snacks.map(s => `<span class="snack-tag">${s}</span>`).join("");
}

const addSnackBtn = document.getElementById("addSnack");
if (addSnackBtn) {
    addSnackBtn.addEventListener("click", () => {
        const input = document.getElementById("snackInput");
        const text = input.value.trim();
        if (!text) return;
        const snacks = JSON.parse(localStorage.getItem(SNACKS_TODAY_KEY)) || [];
        snacks.push(text);
        localStorage.setItem(SNACKS_TODAY_KEY, JSON.stringify(snacks));
        input.value = "";
        renderSnacks();
    });
}

// ===== HISTORY =====
function renderNutritionHistory() {
    const container = document.getElementById("nutritionHistory");
    if (!container) return;

    const history = JSON.parse(localStorage.getItem(FOOD_HISTORY_KEY)) || {};
    const keys = Object.keys(history).sort().reverse();

    if (keys.length === 0) {
        container.innerHTML = `<p class="empty-message">No history yet — start drinking water and ticking nutrients!</p>`;
        return;
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    container.innerHTML = keys.map(dateKey => {
        const entry = history[dateKey];
        const parts = dateKey.split("-");
        const dateObj = new Date(dateKey);
        const dayName = dayNames[dateObj.getDay()];
        const dateLabel = parts[2] + "/" + parts[1] + "/" + parts[0].substring(2);

        const waterDone = entry.water >= 2000;
        const nutrientCount = NUTRIENT_LIST.length;
        const nutrientsDone = entry.nutrients.length >= nutrientCount;
        const snacks = entry.snacks || [];

        const snackLine = snacks.length > 0
            ? ' <span class="snack-list">· Snacks (' + snacks.length + ') — ' + snacks.join(", ") + '</span>'
            : "";

        return '<div class="nutri-history-row">' +
            '<span class="date">' + dateLabel + ' (' + dayName + ')</span>' +
            ' · ' + entry.water + 'ml water ' + (waterDone ? "✓" : "✗") +
            ' · ' + entry.nutrients.length + '/' + nutrientCount + ' nutrients ' + (nutrientsDone ? "✓" : "✗") +
            snackLine +
            '</div>';
    }).join("");
}

// ===== INIT =====
ensureTodayKey();
renderWater();
renderNutrients();
renderSnacks();
renderNutritionHistory();

// =========================================
// CALENDAR MODULE — month widget view
// =========================================
const EVENTS_KEY = "calendarEvents";
let editingEventId = null;
let calendarViewDate = new Date(); // month currently displayed in the widget
let selectedDate = null; // YYYY-MM-DD, day currently shown in detail panel

function loadEvents() {
    return JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
}

function saveEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function getTodayDateStr() {
    return new Date().toISOString().split("T")[0];
}

function parseDateStr(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function formatDateStr(yyyyMmDd) {
    const d = parseDateStr(yyyyMmDd);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Compute the next occurrence (today or later) for an event
function nextOccurrence(event) {
    const todayStr = getTodayDateStr();
    const futureLimit = new Date();
    futureLimit.setDate(futureLimit.getDate() + 365);
    const futureLimitStr = futureLimit.toISOString().split("T")[0];
    const occs = eventOccurrencesInRange(event, todayStr, futureLimitStr);
    return occs.length > 0 ? occs[0] : null;
}

// Generate all dates an event occurs on, within [fromDateStr, toDateStr]
function eventOccurrencesInRange(event, fromDateStr, toDateStr) {
    const occurrences = [];
    if (event.repeat === "none") {
        if (event.date >= fromDateStr && event.date <= toDateStr) {
            occurrences.push(event.date);
        }
        return occurrences;
    }

    let cursor = parseDateStr(event.date);
    const from = parseDateStr(fromDateStr);
    const to = parseDateStr(toDateStr);

    while (cursor <= to) {
        const cursorStr = cursor.toISOString().split("T")[0];
        if (cursorStr >= fromDateStr) {
            occurrences.push(cursorStr);
        }
        if (event.repeat === "daily") cursor.setDate(cursor.getDate() + 1);
        else if (event.repeat === "weekly") cursor.setDate(cursor.getDate() + 7);
        else if (event.repeat === "monthly") cursor.setMonth(cursor.getMonth() + 1);
        else break;
        // safety: stop if cursor goes unreasonably far past `from`
        if (cursor > to && occurrences.length > 0) break;
    }
    return occurrences;
}

// ===== MONTH WIDGET =====
function renderCalendarGrid() {
    const grid = document.getElementById("calendarGrid");
    const label = document.getElementById("calendarMonthLabel");
    if (!grid || !label) return;

    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    label.textContent = `${months[month]} ${year}`;

    // First day of month, last day of month
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const startWeekday = firstOfMonth.getDay(); // 0..6
    const daysInMonth = lastOfMonth.getDate();

    const events = loadEvents();
    const todayStr = getTodayDateStr();

    // Map: dateStr -> events[]
    const eventsByDate = {};
    events.forEach(ev => {
        // Look at occurrences inside this displayed month (with a bit of buffer)
        const bufferStart = new Date(year, month, 1 - startWeekday);
        const bufferEnd = new Date(year, month, daysInMonth + (6 - lastOfMonth.getDay()));
        const occs = eventOccurrencesInRange(
            ev,
            bufferStart.toISOString().split("T")[0],
            bufferEnd.toISOString().split("T")[0]
        );
        occs.forEach(d => {
            if (!eventsByDate[d]) eventsByDate[d] = [];
            eventsByDate[d].push(ev);
        });
    });

    let html = "";
    // Leading empty cells
    for (let i = 0; i < startWeekday; i++) {
        html += `<div class="cal-cell cal-cell-empty"></div>`;
    }
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEvents = eventsByDate[dateStr] || [];
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === selectedDate;
        const dotCount = Math.min(dayEvents.length, 3);
        let dots = "";
        for (let i = 0; i < dotCount; i++) dots += `<span class="cal-dot"></span>`;

        let classes = "cal-cell";
        if (isToday) classes += " cal-today";
        if (isSelected) classes += " cal-selected";

        html += `<div class="${classes}" data-date="${dateStr}">
            <span class="cal-day-num">${day}</span>
            <div class="cal-dots">${dots}</div>
        </div>`;
    }
    grid.innerHTML = html;
}

// ===== EVENT LIST FOR SELECTED DAY =====
function renderEventList() {
    const list = document.getElementById("eventList");
    const heading = document.getElementById("selectedDayHeading");
    if (!list || !heading) return;

    if (!selectedDate) {
        heading.textContent = "Pick a day";
        list.innerHTML = `<p class="empty-message">Click any day in the calendar to see what's on it.</p>`;
        return;
    }

    heading.textContent = formatDateStr(selectedDate);

    const events = loadEvents();
    const dayEvents = [];
    events.forEach(ev => {
        const occs = eventOccurrencesInRange(ev, selectedDate, selectedDate);
        if (occs.length > 0) dayEvents.push({ event: ev, date: selectedDate });
    });

    if (dayEvents.length === 0) {
        list.innerHTML = `<p class="empty-message">Nothing on this day.</p>`;
        return;
    }

    list.innerHTML = dayEvents.map(({ event }) => {
        const repeatTag = event.repeat !== "none"
            ? `<span class="event-repeat">🔁 ${event.repeat}</span>`
            : "";
        const notesLine = event.notes
            ? `<div class="event-notes">📝 ${event.notes}</div>`
            : "";
        const completedClass = event.completed ? " event-completed" : "";

        return `
            <div class="event-row${completedClass}" data-event-id="${event.id}">
                <div class="event-main">
                    <div class="event-line1">
                        <strong>${event.title}</strong>
                        ${repeatTag}
                    </div>
                    ${notesLine}
                </div>
                <div class="event-actions">
                    <button class="event-check" data-id="${event.id}" title="Toggle complete">${event.completed ? "✓" : "○"}</button>
                    <button class="event-edit" data-id="${event.id}" title="Edit">✎</button>
                    <button class="event-delete" data-id="${event.id}" title="Delete">✕</button>
                </div>
            </div>
        `;
    }).join("");
}

// ===== UPCOMING (Dashboard mini list) =====
function renderUpcoming() {
    const list = document.getElementById("upcomingList");
    if (!list) return;

    const events = loadEvents();
    const todayStr = getTodayDateStr();

    const upcoming = [];
    events.forEach(event => {
        if (event.completed) return;
        const next = nextOccurrence(event);
        if (next) upcoming.push({ event, nextDate: next });
    });

    upcoming.sort((a, b) => a.nextDate.localeCompare(b.nextDate));
    const top = upcoming.slice(0, 3);

    if (top.length === 0) {
        list.innerHTML = `<li class="upcoming-empty">Nothing scheduled. Add your first event →</li>`;
        return;
    }

    list.innerHTML = top.map(({ event, nextDate }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = parseDateStr(nextDate);
        const days = Math.round((target - today) / (1000 * 60 * 60 * 24));
        let countdownText;
        if (days === 0) countdownText = "today";
        else if (days === 1) countdownText = "tomorrow";
        else countdownText = `in ${days} days`;

        return `
            <li class="upcoming-item">
                <span class="upcoming-title">${event.title}</span>
                <span class="upcoming-when">${countdownText}</span>
            </li>
        `;
    }).join("");
}

// ===== FORM HANDLERS =====
function openEventForm(eventToEdit) {
    const form = document.getElementById("eventForm");
    const titleInput = document.getElementById("eventTitleInput");
    const dateInput = document.getElementById("eventDateInput");
    const repeatInput = document.getElementById("eventRepeatInput");
    const notesInput = document.getElementById("eventNotesInput");
    const formTitle = document.getElementById("eventFormTitle");
    if (!form) return;

    if (eventToEdit) {
        editingEventId = eventToEdit.id;
        formTitle.textContent = "Edit event";
        titleInput.value = eventToEdit.title;
        dateInput.value = eventToEdit.date;
        repeatInput.value = eventToEdit.repeat || "none";
        notesInput.value = eventToEdit.notes || "";
    } else {
        editingEventId = null;
        formTitle.textContent = "New event";
        titleInput.value = "";
        dateInput.value = selectedDate || getTodayDateStr();
        repeatInput.value = "none";
        notesInput.value = "";
    }
    form.style.display = "block";
    titleInput.focus();
}

function closeEventForm() {
    const form = document.getElementById("eventForm");
    if (form) form.style.display = "none";
    editingEventId = null;
}

const showAddEventBtn = document.getElementById("showAddEvent");
if (showAddEventBtn) {
    showAddEventBtn.addEventListener("click", () => openEventForm(null));
}

const cancelEventBtn = document.getElementById("cancelEvent");
if (cancelEventBtn) {
    cancelEventBtn.addEventListener("click", closeEventForm);
}

const saveEventBtn = document.getElementById("saveEvent");
if (saveEventBtn) {
    saveEventBtn.addEventListener("click", () => {
        const title = document.getElementById("eventTitleInput").value.trim();
        const date = document.getElementById("eventDateInput").value;
        const repeat = document.getElementById("eventRepeatInput").value;
        const notes = document.getElementById("eventNotesInput").value.trim();

        if (!title) { alert("Please enter a title."); return; }
        if (!date) { alert("Please pick a date."); return; }

        const events = loadEvents();
        if (editingEventId !== null) {
            const idx = events.findIndex(e => e.id === editingEventId);
            if (idx !== -1) {
                events[idx].title = title;
                events[idx].date = date;
                events[idx].repeat = repeat;
                events[idx].notes = notes;
            }
        } else {
            events.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                title, date, repeat, notes,
                completed: false
            });
        }
        saveEvents(events);
        closeEventForm();
        renderCalendarGrid();
        renderEventList();
        renderUpcoming();
    });
}

// Delegated handlers: calendar cell click + event actions
const calendarGridElem = document.getElementById("calendarGrid");
if (calendarGridElem) {
    calendarGridElem.addEventListener("click", (e) => {
        const cell = e.target.closest(".cal-cell");
        if (!cell || cell.classList.contains("cal-cell-empty")) return;
        selectedDate = cell.getAttribute("data-date");
        renderCalendarGrid();
        renderEventList();
    });
}

const prevMonthBtn = document.getElementById("prevMonth");
if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
        renderCalendarGrid();
    });
}
const nextMonthBtn = document.getElementById("nextMonth");
if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
        renderCalendarGrid();
    });
}

const eventListElem = document.getElementById("eventList");
if (eventListElem) {
    eventListElem.addEventListener("click", (e) => {
        const idStr = e.target.getAttribute("data-id");
        if (!idStr) return;
        const events = loadEvents();
        const id = Number(idStr);

        if (e.target.classList.contains("event-delete")) {
            const ev = events.find(e => e.id === id);
            if (!ev) return;
            if (confirm(`Delete "${ev.title}"?`)) {
                saveEvents(events.filter(e => e.id !== id));
                renderCalendarGrid();
                renderEventList();
                renderUpcoming();
            }
        }
        if (e.target.classList.contains("event-edit")) {
            const ev = events.find(e => e.id === id);
            if (ev) openEventForm(ev);
        }
        if (e.target.classList.contains("event-check")) {
            const ev = events.find(e => e.id === id);
            if (ev) {
                ev.completed = !ev.completed;
                saveEvents(events);
                renderCalendarGrid();
                renderEventList();
                renderUpcoming();
            }
        }
    });
}

// Open Calendar from Dashboard
const openCalendarLink = document.getElementById("openCalendarLink");
if (openCalendarLink) {
    openCalendarLink.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
        document.querySelector('[href="#calendar"]')?.classList.add("active");
        document.querySelectorAll(".page").forEach(page => page.classList.remove("active-page"));
        document.getElementById("calendar-page")?.classList.add("active-page");
        history.replaceState(null, "", "#calendar");
        renderCalendarGrid();
        renderEventList();
    });
}

// Init
renderCalendarGrid();
renderEventList();
renderUpcoming();
