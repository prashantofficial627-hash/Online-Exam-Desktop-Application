const examList = document.getElementById('examList');

EXAMS.forEach(exam => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${exam.title}</h3>
    <p>Duration: ${exam.duration} minutes | Questions: ${exam.questions.length} | Marks per question: ${exam.marksPerQuestion}</p>
  `;

  const btn = document.createElement('button');
  btn.textContent = 'View Instructions';
  btn.onclick = () => {
    localStorage.setItem('selectedExamId', exam.id);
    window.location.href = 'instructions.html';
  };

  card.appendChild(btn);
  examList.appendChild(card);
});
