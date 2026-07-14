const quizData = [
  {
    question: 'Sampah mana yang termasuk sampah B3?',
    options: ['Botol plastik', 'Baterai bekas', 'Daun kering', 'Kardus'],
    correct: 1,
  },
  {
    question: 'Berapa tahun sampah plastik terurai di alam?',
    options: ['10 tahun', '50 tahun', '500 tahun', '1000 tahun'],
    correct: 2,
  },
  {
    question: 'Apa yang bisa dibuat dari sampah organik?',
    options: ['Botol baru', 'Kompos', 'Kertas', 'Logam'],
    correct: 1,
  },
  {
    question: 'Warna tong sampah untuk sampah anorganik adalah?',
    options: ['Hijau', 'Merah', 'Biru', 'Abu-abu'],
    correct: 2,
  },
  {
    question: 'Apa yang dimaksud dengan ecobrick?',
    options: [
      'Batu bata tanah liat',
      'Botol plastik berisi sampah padat',
      'Bata merah biasa',
      'Kerajinan kaca',
    ],
    correct: 1,
  },
];

export function initQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function renderProgress() {
    const progressContainer = container.querySelector('.quiz-progress') || document.createElement('div');
    if (!container.querySelector('.quiz-progress')) {
      progressContainer.className = 'quiz-progress';
      container.prepend(progressContainer);
    }

    progressContainer.innerHTML = quizData
      .map(
        (_, i) =>
          `<div class="quiz-dot ${
            i < currentQuestion
              ? quizData[i].correct === getSelectedAnswer(i) ? 'correct' : 'wrong'
              : i === currentQuestion ? 'active' : ''
          }"></div>`
      )
      .join('');
  }

  function getSelectedAnswer(index) {
    const stored = sessionStorage.getItem(`quiz_answer_${index}`);
    return stored !== null ? parseInt(stored, 10) : -1;
  }

  function saveAnswer(index, value) {
    sessionStorage.setItem(`quiz_answer_${index}`, value.toString());
  }

  function renderQuestion() {
    if (currentQuestion >= quizData.length) {
      renderResult();
      return;
    }

    answered = false;
    const q = quizData[currentQuestion];
    const storedAnswer = getSelectedAnswer(currentQuestion);

    container.innerHTML = `
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options
          .map(
            (opt, i) =>
              `<button class="quiz-option ${
                storedAnswer !== -1 ? (i === q.correct ? 'correct' : i === storedAnswer ? 'wrong' : 'disabled') : ''
              } ${storedAnswer !== -1 ? 'disabled' : ''}" data-index="${i}">
                ${opt}
              </button>`
          )
          .join('')}
      </div>
    `;

    renderProgress();

    if (storedAnswer === -1) {
      container.querySelectorAll('.quiz-option').forEach((btn) => {
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          const selected = parseInt(this.dataset.index, 10);
          const isCorrect = selected === q.correct;

          saveAnswer(currentQuestion, selected);
          if (isCorrect) score++;

          document.querySelectorAll('.quiz-option').forEach((opt) => {
            opt.classList.add('disabled');
            const idx = parseInt(opt.dataset.index, 10);
            if (idx === q.correct) opt.classList.add('correct');
            if (idx === selected && !isCorrect) opt.classList.add('wrong');
          });

          renderProgress();

          setTimeout(() => {
            currentQuestion++;
            renderQuestion();
          }, 1200);
        });
      });
    } else {
      setTimeout(() => {
        if (storedAnswer === q.correct) score++;
        currentQuestion++;
        renderQuestion();
      }, 800);
    }
  }

  function renderResult() {
    const percentage = Math.round((score / quizData.length) * 100);
    let badge = 'Pemula Peduli Sampah';
    let emoji = '🌱';
    if (percentage >= 80) {
      badge = 'Sahabat Lingkungan';
      emoji = '🏆';
    } else if (percentage >= 60) {
      badge = 'Pelajar Hijau';
      emoji = '📗';
    }

    container.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-emoji">${emoji}</div>
        <div class="quiz-result-title">Quiz Selesai!</div>
        <div class="quiz-result-score">${score}/${quizData.length}</div>
        <div class="quiz-result-badge">${badge}</div>
        <p style="color:var(--gray); font-size:15px; margin-bottom:20px;">
          ${percentage >= 80 ? 'Luar biasa! Pengetahuan Anda tentang sampah sangat baik!' : percentage >= 60 ? 'Bagus! Terus belajar tentang pengelolaan sampah!' : 'Ayo belajar lagi tentang jenis dan pengolahan sampah!'}
        </p>
        <button class="btn btn-primary quiz-restart" id="quizRestart">Coba Lagi</button>
      </div>
    `;

    renderProgress();

    document.getElementById('quizRestart')?.addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      for (let i = 0; i < quizData.length; i++) {
        sessionStorage.removeItem(`quiz_answer_${i}`);
      }
      renderQuestion();
    });
  }

  const storedProgress = (() => {
    for (let i = quizData.length - 1; i >= 0; i--) {
      if (sessionStorage.getItem(`quiz_answer_${i}`) !== null) return i + 1;
    }
    return 0;
  })();

  if (storedProgress >= quizData.length) {
    currentQuestion = quizData.length;
    renderResult();
  } else {
    currentQuestion = storedProgress;
    renderQuestion();
  }
}
