// ========================================
// Typing Speed Test - JavaScript
// ========================================

// DOM Elements
const typingInput = document.getElementById("typing-input");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const newTestButton = document.getElementById("new-test-btn");

const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const errorsDisplay = document.getElementById("errors");

const resultSection = document.getElementById("result-section");
const finalWpm = document.getElementById("final-wpm");
const finalAccuracy = document.getElementById("final-accuracy");
const finalErrors = document.getElementById("final-errors");

const textDisplay = document.getElementById("text-display");


// ========================================
// Test Settings
// ========================================

const testDuration = 60;

const passages = [
    "The quick brown fox jumps over the lazy dog. Practice makes progress, and consistent typing can help you become faster and more accurate.",

    "Learning to type quickly and accurately is an important computer skill. Regular practice can improve your speed, confidence, and productivity.",

    "Technology has changed the way people communicate, learn, and work. Good typing skills can save time and make everyday computer tasks easier.", 

    "It should open in your browser and look approximately like a modern dark typing-test interface.The buttons won't work yet. That's completely normal because JavaScript hasn't been added."
];


// ========================================
// Variables
// ========================================

let timeLeft = testDuration;
let timer = null;
let testStarted = false;
let currentPassage = "";
let errors = 0;


// ========================================
// Select Random Passage
// ========================================

function selectPassage() {
    const randomIndex = Math.floor(Math.random() * passages.length);

    currentPassage = passages[randomIndex];

    textDisplay.innerHTML = "";

    currentPassage.split("").forEach((character) => {
        const span = document.createElement("span");

        span.textContent = character;

        textDisplay.appendChild(span);
    });
}


// ========================================
// Reset Test
// ========================================

function resetTest() {

    clearInterval(timer);

    timeLeft = testDuration;
    testStarted = false;
    errors = 0;

    timerDisplay.textContent = testDuration;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    errorsDisplay.textContent = "0";

    typingInput.value = "";
    typingInput.disabled = true;

    startButton.disabled = false;
    startButton.textContent = "Start Test";

    resultSection.classList.add("hidden");

    selectPassage();
}


// ========================================
// Start Test
// ========================================

function startTest() {

    if (testStarted) {
        return;
    }

    testStarted = true;

    typingInput.disabled = false;
    typingInput.focus();

    startButton.disabled = true;
    startButton.textContent = "Test Running...";

    startTimer();
}


// ========================================
// Timer
// ========================================

function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        calculateStats();

        if (timeLeft <= 0) {
            finishTest();
        }

    }, 1000);
}


// ========================================
// Calculate Typing Statistics
// ========================================

function calculateStats() {

    const typedText = typingInput.value;

    if (typedText.length === 0) {
        wpmDisplay.textContent = "0";
        accuracyDisplay.textContent = "100%";
        errorsDisplay.textContent = "0";
        return;
    }


    // Calculate errors
    errors = 0;

    for (let i = 0; i < typedText.length; i++) {

        if (typedText[i] !== currentPassage[i]) {
            errors++;
        }

    }


    // Calculate correct characters
    const correctCharacters = typedText.length - errors;


    // Calculate elapsed time in minutes
    const elapsedSeconds = testDuration - timeLeft;
    const elapsedMinutes = elapsedSeconds / 60;


    // Calculate WPM
    let wpm = 0;

    if (elapsedMinutes > 0) {
        wpm = Math.round((correctCharacters / 5) / elapsedMinutes);
    }


    // Calculate accuracy
    const accuracy = Math.round(
        (correctCharacters / typedText.length) * 100
    );


    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    errorsDisplay.textContent = errors;
}


// ========================================
// Finish Test
// ========================================

function finishTest() {

    clearInterval(timer);

    testStarted = false;

    typingInput.disabled = true;

    startButton.disabled = false;
    startButton.textContent = "Start Test";

    calculateStats();

    finalWpm.textContent = wpmDisplay.textContent;
    finalAccuracy.textContent = accuracyDisplay.textContent;
    finalErrors.textContent = errorsDisplay.textContent;

    resultSection.classList.remove("hidden");
}


// ========================================
// Typing Input Event
// ========================================

typingInput.addEventListener("input", () => {

    calculateStats();

    const typedText = typingInput.value;
    const characters = textDisplay.querySelectorAll("span");

    characters.forEach((character, index) => {

        character.classList.remove("correct");
        character.classList.remove("incorrect");

        if (index < typedText.length) {

            if (typedText[index] === currentPassage[index]) {
                character.classList.add("correct");
            } else {
                character.classList.add("incorrect");
            }

        }

    });


    // Automatically finish when the entire passage is typed
    if (typedText.length >= currentPassage.length) {
        finishTest();
    }

});


// ========================================
// Button Events
// ========================================

startButton.addEventListener("click", startTest);

restartButton.addEventListener("click", resetTest);

newTestButton.addEventListener("click", resetTest);


// ========================================
// Initialize Application
// ========================================

resetTest();