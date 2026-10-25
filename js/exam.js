const exam = findExam(localStorage.getItem('selectedExamId'));

if (!exam) {
  window.location.href = 'dashboard.html';
}

let currentIndex = 0;
let answers = {};
let secondsLeft = exam.duration * 60;
let timerId = null;
let snapshotTimerId = null;
let cameraStream = null;
let submitted = false;

document.getElementById('examTitle').textContent = exam.title;

function showQuestion() {
  const question = exam.questions[currentIndex];
  document.getElementById('questionNumber').textContent = `Question ${currentIndex + 1} of ${exam.questions.length}`;
  document.getElementById('questionText').textContent = question.text;

  const optionsBox = document.getElementById('optionsBox');
  optionsBox.innerHTML = '';

  question.options.forEach((opt, i) => {
    const label = document.createElement('label');
    label.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'option';
    radio.value = i;
    if (answers[currentIndex] === i) {
      radio.checked = true;
    }

    radio.onchange = () => {
      answers[currentIndex] = i;
      localStorage.setItem('currentAnswers', JSON.stringify(answers));
    };

    label.appendChild(radio);
    label.appendChild(document.createTextNode(' ' + opt));
    optionsBox.appendChild(label);
  });

  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').disabled = currentIndex === exam.questions.length - 1;
}

document.getElementById('prevBtn').onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
};

document.getElementById('nextBtn').onclick = () => {
  if (currentIndex < exam.questions.length - 1) {
    currentIndex++;
    showQuestion();
  }
};

function updateTimer() {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerBox = document.getElementById('timer');
  timerBox.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (secondsLeft <= 60) {
    timerBox.classList.add('low');
  }
}

function startTimer() {
  updateTimer();
  timerId = setInterval(() => {
    secondsLeft--;
    updateTimer();
    if (secondsLeft <= 0) {
      submitExam(true);
    }
  }, 1000);
}

async function startWebcam() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('webcam').srcObject = cameraStream;
  } catch (err) {
    document.getElementById('statusMessage').textContent = 'Webcam not available.';
  }
}

function stopWebcam() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
  }
}

async function takeSnapshot() {
  if (!cameraStream) return;

  const video = document.getElementById('webcam');
  const canvas = document.getElementById('snapshotCanvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
  const base64 = dataUrl.split(',')[1];
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const api = window.athena || window.electronAPI;
  if (api && api.storeCameraSnapImageOnDisk) {
    await api.storeCameraSnapImageOnDisk(binary);
  }

  const snapshots = getData('snapshots');
  snapshots.push({
    id: Date.now(),
    examId: exam.id,
    captureTime: new Date().toLocaleString()
  });
  saveData('snapshots', snapshots);
}

function submitExam(autoSubmitted) {
  if (submitted) return;
  submitted = true;

  clearInterval(timerId);
  clearInterval(snapshotTimerId);
  stopWebcam();
  window.electronAPI.setFullScreen(false);

  let correctCount = 0;
  exam.questions.forEach((q, i) => {
    if (answers[i] === q.answer) {
      correctCount++;
    }
  });

  const totalMarks = exam.questions.length * exam.marksPerQuestion;
  const score = correctCount * exam.marksPerQuestion;
  const percentage = Math.round((score / totalMarks) * 100);

  const result = {
    id: Date.now(),
    examId: exam.id,
    examTitle: exam.title,
    correctCount,
    totalQuestions: exam.questions.length,
    score,
    totalMarks,
    percentage,
    passed: percentage >= exam.passPercentage,
    autoSubmitted,
    submissionTime: new Date().toLocaleString()
  };

  const results = getData('results');
  results.push(result);
  saveData('results', results);

  const responses = getData('responses');
  exam.questions.forEach((q, i) => {
    responses.push({
      resultId: result.id,
      examId: exam.id,
      questionNumber: i + 1,
      selectedAnswer: answers[i] !== undefined ? answers[i] : null
    });
  });
  saveData('responses', responses);

  localStorage.removeItem('currentAnswers');
  localStorage.setItem('lastResultId', result.id);
  window.location.href = 'result.html';
}

document.getElementById('submitBtn').onclick = () => {
  if (confirm('Are you sure you want to submit the exam?')) {
    submitExam(false);
  }
};

async function initExam() {
  showQuestion();
  window.electronAPI.setFullScreen(true);
  await startWebcam();
  startTimer();
  snapshotTimerId = setInterval(takeSnapshot, 30000);
  setTimeout(takeSnapshot, 3000);
}

initExam();
