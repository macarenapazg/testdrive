import { quizData } from './datos.js'; // Importar las preguntas

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

// Función para mezclar el array (selección aleatoria de preguntas)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Función para seleccionar 35 preguntas (3 de ellas de doble puntaje)
function selectQuestions() {
  // Filtrar las preguntas de doble puntaje
  const doublePointsQuestions = quizData.filter(q => q.points === 2);

  // Asegurarnos de seleccionar exactamente 3 preguntas de doble puntaje
  const selectedDoublePoints = doublePointsQuestions.slice(0, 3);

  // Seleccionar 32 preguntas normales
  const normalQuestions = quizData.filter(q => q.points === 1);
  shuffle(normalQuestions); // Mezclar las preguntas normales
  const selectedNormalQuestions = normalQuestions.slice(0, 32);

  // Unir las preguntas seleccionadas y mezclar todo
  const selectedQuestions = [...selectedDoublePoints, ...selectedNormalQuestions];
  shuffle(selectedQuestions);

  return selectedQuestions;
}

// Variables del DOM
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const quizCard = document.getElementById("quiz-card");
const questionEl = document.getElementById("question");
const answersContainer = document.getElementById("answers-container");
const progressBar = document.getElementById("progress-bar");
const questionNumberEl = document.getElementById("question-number");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const resultsCard = document.getElementById("results-card");
const resultsSummary = document.getElementById("results-summary");
const incorrectAnswers = document.getElementById("incorrect-answers");
const restartBtn = document.getElementById("restart-btn");

// Cargar las preguntas seleccionadas
const selectedQuestions = selectQuestions();

// Función para cargar la siguiente pregunta
function loadQuestion() {
  const currentData = selectedQuestions[currentQuestion];
  questionEl.textContent = currentData.question;
  questionNumberEl.textContent = `Pregunta ${currentQuestion + 1} de ${selectedQuestions.length}`;

  answersContainer.innerHTML = "";
  currentData.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("btn", "btn-outline-warning", "answer-btn");
    if (userAnswers[currentQuestion] === index) {
      btn.classList.add("active"); // Marcar la opción seleccionada
    }
    btn.addEventListener("click", () => selectAnswer(index, btn));
    answersContainer.appendChild(btn);
  });

  progressBar.style.width = `${((currentQuestion + 1) / selectedQuestions.length) * 100}%`;

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = userAnswers[currentQuestion] == null;
}

// Función para seleccionar una respuesta
function selectAnswer(index, btn) {
  // Guardar la respuesta seleccionada
  userAnswers[currentQuestion] = index;

  // Limpiar las clases activas de las demás opciones
  const allButtons = answersContainer.querySelectorAll(".answer-btn");
  allButtons.forEach(button => button.classList.remove("active"));

  // Marcar la opción seleccionada
  btn.classList.add("active");

  // Habilitar el botón de "Siguiente"
  nextBtn.disabled = false;
}

// Función para mostrar los resultados
function showResults() {
  quizCard.classList.add("d-none");
  resultsCard.classList.remove("d-none");

  // Calcular el puntaje
  const correctAnswers = userAnswers.filter((answer, i) => answer === selectedQuestions[i].correct).length;
  const totalPoints = selectedQuestions.reduce((total, question, index) => {
    return total + (userAnswers[index] === question.correct ? question.points : 0);
  }, 0);

  resultsSummary.innerHTML = `
    <p>¡Completaste el test!</p>
    <p>Respondiste correctamente ${correctAnswers} de ${selectedQuestions.length} preguntas.</p>
    <p>Tu puntaje total es: ${totalPoints} de 38 puntos.</p>
    <p>${totalPoints >= 33 ? '¡Aprobaste el examen!' : 'No aprobaste, intenta de nuevo.'}</p>
  `;

  incorrectAnswers.innerHTML = selectedQuestions
    .map((q, i) => {
      if (userAnswers[i] !== q.correct) {
        return `
           <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="alert alert-danger">
            <p><strong>Pregunta:</strong> ${q.question}</p>
            <p><strong>Respuesta correcta:</strong> ${q.options[q.correct]}</p>
          </div>
        </div>`;
      }
      return "";
    })
    .join("");
}

// Eventos de los botones
startBtn.addEventListener("click", () => {
  startScreen.classList.add("d-none");
  quizCard.classList.remove("d-none");
  loadQuestion();
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < selectedQuestions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showResults();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  userAnswers = [];
  resultsCard.classList.add("d-none");
  startScreen.classList.remove("d-none");
  // Volver a cargar las preguntas aleatorias
  selectedQuestions.length = 0;
  selectedQuestions.push(...selectQuestions());
  loadQuestion();
});

loadQuestion();
