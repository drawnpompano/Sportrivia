const questions = [
    { q: "How many players are on a basketball court per team?", a: "5", options: ["5", "6", "7", "11"], cat: "Basketball" },
    { q: "Which country won the 2022 World Cup?", a: "Argentina", options: ["France", "Brazil", "Argentina", "Germany"], cat: "Soccer" },
    { q: "How many innings are in a standard MLB game?", a: "9", options: ["7", "8", "9", "10"], cat: "Baseball" },
    { q: "Who is known as 'The King' in Basketball?", a: "LeBron James", options: ["Michael Jordan", "LeBron James", "Steph Curry", "Kobe Bryant"], cat: "Basketball" },
    { q: "A 'Hat Trick' in Soccer refers to how many goals?", a: "3", options: ["2", "3", "4", "5"], cat: "Soccer" }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

startBtn.addEventListener('click', () => {
    const category = document.getElementById('category-select').value;
    const count = parseInt(document.getElementById('question-count').value);

    // 1. Filter by category
    currentQuestions = category === 'all' 
        ? [...questions] 
        : questions.filter(item => item.cat === category);

    // 2. Shuffle and slice for the chosen amount
    currentQuestions = currentQuestions.sort(() => Math.random() - 0.5).slice(0, count);

    setupScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
});

function showQuestion() {
    resetState();
    let q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.classList.add('answer-btn');
        btn.onclick = () => selectAnswer(btn, q.a);
        document.getElementById('answer-buttons').appendChild(btn);
    });
}

function selectAnswer(btn, correct) {
    if (btn.innerText === correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
    }
    Array.from(document.getElementsByClassName('answer-btn')).forEach(b => b.disabled = true);
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function resetState() {
    nextBtn.classList.add('hidden');
    document.getElementById('answer-buttons').innerHTML = '';
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    document.getElementById('score-text').innerText = `You scored ${score} out of ${currentQuestions.length}`;
}
