const exam = findExam(localStorage.getItem('selectedExamId'));
if (!exam) {
  window.location.href = 'dashboard.html';
}

document.getElementById('examTitle').textContent = exam.title;
document.getElementById('examInfo').textContent =
  `Duration: ${exam.duration} minutes | Questions: ${exam.questions.length} | Total marks: ${exam.questions.length * exam.marksPerQuestion} | Pass: ${exam.passPercentage}%`;

const agreeBox = document.getElementById('agreeBox');
const startBtn = document.getElementById('startBtn');

agreeBox.onchange = () => {
  startBtn.disabled = !agreeBox.checked;
};

startBtn.onclick = () => {
  localStorage.removeItem('currentAnswers');
  window.location.href = 'exam.html';
};
