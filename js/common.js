function getData(key) {
  const text = localStorage.getItem(key);
  return text ? JSON.parse(text) : [];
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function findExam(id) {
  return EXAMS.find(e => e.id === Number(id)) || null;
}
