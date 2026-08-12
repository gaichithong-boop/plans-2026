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
    const textElem = document.getElementById("missedGoalsText");
    if (!titleElem || !textElem) return;

    // Work out yesterday's date string (YYYY-MM-DD)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split("T")[0];

    const yesterdayDone = JSON.parse(localStorage.getItem("completedTasks")) || {};
    const doneList = yesterdayDone[yKey] || [];

    const missed = MAIN_TASKS.filter(t => !doneList.includes(t.key));

    if (missed.length === 0) {
        titleElem.textContent = "You're all clear";
        textElem.textContent = "No goals missed yesterday. Nice work!";
    } else {
        const labels = missed.map(t => t.label).join(", ");
        titleElem.textContent = `⚠️ Missed ${missed.length} yesterday`;
        textElem.textContent = `You didn't complete: ${labels}.`;
    }
}

updateMissedGoals();
