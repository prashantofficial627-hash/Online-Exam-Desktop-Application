const lastResultId = localStorage.getItem('lastResultId');
const results = getData('results');
const result = results.find(r => String(r.id) === lastResultId);

if (!result) {
  window.location.href = 'dashboard.html';
} else {
  document.getElementById('examTitle').textContent = result.examTitle;
  document.getElementById('percentage').textContent = result.percentage + '%';
  document.getElementById('scoreText').textContent = `Score: ${result.score} / ${result.totalMarks}`;
  document.getElementById('correctText').textContent = `Correct answers: ${result.correctCount} out of ${result.totalQuestions}`;
  document.getElementById('timeText').textContent = `Submitted on: ${result.submissionTime}`;

  const status = document.getElementById('resultStatus');
  status.textContent = result.passed ? 'PASS' : 'FAIL';
  status.className = result.passed ? 'pass' : 'fail';

  if (result.autoSubmitted) {
    document.getElementById('autoMessage').textContent = 'Time ended, so the exam was submitted automatically.';
  }
}
