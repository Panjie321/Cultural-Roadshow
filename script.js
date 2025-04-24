const questions = [
    {
        question: "检查邮件是否是钓鱼邮件的步骤有哪些?",
        answers: [
            { text: "检查内容（信息标题/发件人信息/正文）", correct: true },
            { text: "鼠标悬停预览所有链接", correct: true },
            { text: "检查网址是否可疑", correct: true },
            { text: "直接点击链接查看", correct: false }
        ]
    },
    {
        question: "如何计算钓鱼防御系数（Phishing Resilience Factor, PRF）？",
        answers: [
            { text: "点击的链接数量除以举报的链接数量", correct: false },
            { text: "举报的链接数量除以点击的链接数量", correct: true },
            { text: "点击的邮件数量除以举报的邮件数量", correct: false },
            { text: "总链接数量除以点击的链接数量", correct: false }
        ]
    },
    {
        question: "工厂钓鱼防御系数（Phishing Resilience Factor, PRF）的目标是多少？",
        answers: [
            { text: "0.8", correct: false },
            { text: "1.5", correct: false },
            { text: "1.8", correct: true },
            { text: "2.5", correct: false }
        ]
    },
    {
        question: "以下哪些是识别钓鱼诈骗的常见特征？（可多选）",
        answers: [
            { text: "要求你立即采取行动或提供个人信息", correct: true },
            { text: "包含个人或职业威胁或情感诉求。", correct: true },
            { text: "信息中有拼写错误或语法不佳。", correct: true },
            { text: "信息听起来不像是来自你认识的人或公司。", correct: true }
        ]
    },
    {
        question: "以下哪个网站更可能是钓鱼网站？并解释原因",
        answers: [
            { img: "images/option1.jpg", correct: true },
            { img: "images/option2.jpg", correct: true },
            { img: "images/option3.png", correct: false },
            { img: "images/option4.png", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let selectedAnswers = [];

const startButton = document.getElementById('start-button');
const backButton = document.getElementById('back-button');
const questionContainer = document.getElementById('question-container');
const answerButtonsElement = document.getElementById('answer-buttons');
const submitButton = document.getElementById('submit-button');
const nextButton = document.getElementById('next-button');
const retryButton = document.getElementById('retry-button');
const resultContainer = document.getElementById('result-container');
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const congratsModal = document.getElementById('congrats-modal');
const span = document.getElementsByClassName('close');

startButton.addEventListener('click', startGame);
backButton.addEventListener('click', showStartScreen);
document.addEventListener('DOMContentLoaded', () => {
    showStartScreen();
});

// 关闭模态框
Array.from(span).forEach(s => {
    s.onclick = function() {
        modal.style.display = "none";
        congratsModal.style.display = "none";
    }
});

// 点击模态框外区域关闭模态框
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == congratsModal) {
        congratsModal.style.display = "none";
    }
}

function showStartScreen() {
    startButton.classList.remove('hide');
    backButton.classList.add('hide');
    questionContainer.classList.add('hide');
    answerButtonsElement.classList.add('hide');
    submitButton.classList.add('hide');
    nextButton.classList.add('hide');
    retryButton.classList.add('hide');
    resultContainer.classList.add('hide');
}

function startGame() {
    startButton.classList.add('hide');
    backButton.classList.remove('hide');
    questionContainer.classList.remove('hide');
    answerButtonsElement.classList.remove('hide');
    resultContainer.classList.remove('hide');
    currentQuestionIndex = 0;
    selectedAnswers = [];
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionContainer.innerHTML = `<p>${question.question}</p>`;
    if (question.img) {
        const img = document.createElement('img');
        img.src = question.img;
        img.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = question.img;
        });
        questionContainer.appendChild(img);
    }
    answerButtonsElement.innerHTML = ''; // 清空答案按钮

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        if (answer.img) {
            const img = document.createElement('img');
            img.src = answer.img;
            button.style.width = "auto";
            button.style.height = "auto";
            img.addEventListener('click', () => {
                modal.style.display = "block";
                modalImg.src = answer.img;
            });
            button.appendChild(img);
        } else {
            button.innerText = answer.text;
        }
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    submitButton.classList.remove('hide');
    submitButton.onclick = submitAnswer;
}

function resetState() {
    nextButton.classList.add('hide');
    retryButton.classList.add('hide');
    submitButton.classList.add('hide');
    questionContainer.innerHTML = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    resultContainer.innerHTML = ''; // 清空答案显示区域
}

function selectAnswer(e) {
    const selectedButton = e.target.tagName === 'IMG' ? e.target.parentElement : e.target;
    if (selectedButton.classList.contains('selected')) {
        selectedButton.classList.remove('selected');
        const index = selectedAnswers.indexOf(selectedButton);
        if (index > -1) {
            selectedAnswers.splice(index, 1);
        }
    } else {
        selectedButton.classList.add('selected');
        selectedAnswers.push(selectedButton);
    }
}

function submitAnswer() {
    const question = questions[currentQuestionIndex];
    const correctAnswers = question.answers.filter(a => a.correct).length;

    if (selectedAnswers.length === correctAnswers) {
        const allCorrect = selectedAnswers.every(button => button.dataset.correct === 'true');
        if (allCorrect) {
            resultContainer.innerHTML = '正确！';
            selectedAnswers.forEach(button => button.classList.add('correct'));
            if (currentQuestionIndex < questions.length - 1) {
                nextButton.classList.remove('hide');
                nextButton.onclick = () => {
                    currentQuestionIndex++;
                    selectedAnswers = [];
                    setNextQuestion();
                };
            } else {
                congratsModal.style.display = "block";
                nextButton.classList.add('hide');
            }
        } else {
            resultContainer.innerHTML = '回答错误，需要重新作答。';
            selectedAnswers.forEach(button => button.classList.add('wrong'));
            retryButton.classList.remove('hide');
            retryButton.onclick = () => {
                selectedAnswers = [];
                setNextQuestion();
            };
        }
    } else {
        resultContainer.innerHTML = '回答错误，需要重新作答。';
        selectedAnswers.forEach(button => button.classList.add('wrong'));
        retryButton.classList.remove('hide');
        retryButton.onclick = () => {
            selectedAnswers = [];
            setNextQuestion();
        };
    }
}
