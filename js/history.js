const myResults = getData('results');

if (myResults.length === 0) {
  document.getElementById('emptyMessage').textContent = 'You have not taken any exam yet.';
  document.getElementById('historyTable').style.display = 'none';
} else {
  const tableBody = document.getElementById('historyBody');
  let totalPercentage = 0;

  myResults.slice().reverse().forEach(r => {
    totalPercentage += r.percentage;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.examTitle}</td>
      <td>${r.score} / ${r.totalMarks}</td>
      <td>${r.percentage}%</td>
      <td class="${r.passed ? 'pass' : 'fail'}">${r.passed ? 'PASS' : 'FAIL'}</td>
      <td>${r.submissionTime}</td>
    `;
    tableBody.appendChild(row);
  });

  const avg = Math.round(totalPercentage / myResults.length);
  document.getElementById('summaryText').textContent = `Exams taken: ${myResults.length} | Average percentage: ${avg}%`;
}
