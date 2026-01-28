let allQuestions = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const answerInput = document.getElementById('user-answer');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');

// This function reads your spreadsheet-style text file
async function loadSpreadsheet() {
    const response = await fetch('trivia.txt');
    const text = await response.text();
    
    // Split by line, then split each line by the TAB character
    return text.split('\n')
        .filter(line => line.trim() !== '') // Ignore empty lines
        .map(line => {
            const columns = line.split('\t'); // '\t' is the code for a Tab
            return {
                sport: columns[0].trim(),
                q: columns[1].trim(),
                a: columns[2].trim()
            };
        });
}

document.getElementById('start-btn').addEventListener('click', async () => {
    const category = document.getElementById('category-select').value;
    const count = parseInt(document.getElementById('question-count').value);

    try {
        allQuestions = await loadSpreadsheet();

        // Filter based on user selection
        currentQuestions = category === 'all' 
            ? allQuestions 
            : allQuestions.filter(item => item.sport.toLowerCase() === category.toLowerCase());

        // Shuffle and limit count
        currentQuestions = currentQuestions.sort(() => Math.random() - 0.5).slice(0, count);

        if (currentQuestions.length === 0) {
            alert("No questions found for this category!");
            return;
        }

        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        showQuestion();
        
    } catch (error) {
        console.error("Error loading the trivia file:", error);
        alert("Make sure trivia.txt exists in your GitHub repo!");
    }
});

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    
    answerInput.value = '';
    answerInput.disabled = false;
    feedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
    document.getElementById('submit-btn').classList.remove('hidden');
    answerInput.focus();
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

// Allow user to press "Enter" to submit
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !answerInput.disabled) checkAnswer();
});

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestions[currentQuestionIndex].a.toLowerCase();
    
    answerInput.disabled = true;
    document.getElementById('submit-btn').classList.add('hidden');
    feedback.classList.remove('hidden');

    if (userAnswer === correctAnswer) {
        feedback.innerText = "Correct! 🏆";
        feedback.className = "feedback-msg correct-msg";
        score++;
    } else {
        feedback.innerText = `Incorrect. The answer was: ${currentQuestions[currentQuestionIndex].a}`;
        feedback.className = "feedback-msg wrong-msg";
    }
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('result-screen').classList.remove('hidden');
        document.getElementById('score-text').innerText = `You got ${score} out of ${currentQuestions.length} correct!`;
    }
});
