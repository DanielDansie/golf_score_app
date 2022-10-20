const url = 'https://golf-courses-api.herokuapp.com/courses'


class Player {
  constructor(name, id = getNextId(), scores = []) {
    this.name = name;
    this.id = id;
    this.scores = scores;
  }
}

async function getAvailableCourses() {
  const response = await fetch(url)
  let data = await response.json();
  console.log(data)
 
  return data.courses
}

async function showCourses() {
  var courses = await getAvailableCourses();
  let coursesHtml = document.getElementById('course-select').innerHTML;
  courses.forEach((course) => {
    coursesHtml += `<option value=${course.id}>${course.name}</option>`;
  });

  document.getElementById('course-select').innerHTML = coursesHtml;
}

async function getCourseInfo(id) {
  const response = await fetch(`${url}/${id}`)
  let data = await response.json();
  console.log(data.data)
  return data.data
}

async function selectCourse(e) {
  let id = e.target.value;
  var course = await getCourseInfo(id);
}

async function getTeeInfo(id) {
  const response = await fetch(`${url}/${id}`)
  let data = await response.json();
  console.log(data.data.holes[0].teeBoxes)
  return data.data.holes[0].teeBoxes.teeType
}

async function showTees() {
  var teeBoxes = await getTeeInfo()
  let teeBoxSelectHtml = document.getElementById('tee-select').innerHTML
  console.log('I ran', teeBoxes)
  teeBoxes.forEach(function (teeBox, index) {
    teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}</option>`
  });
    
  document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}

async function selectTee(e) {
  let teeBoxes = e.target.value
  let teeBox = await showTees(teeBoxes)
}

// let teeBoxSelectHtml = ''
// teeBoxes.forEach(function (teeBox, index) {
//     teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
//         teeBox.totalYards
//     } yards</option>`
// });

// document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tee-select').addEventListener('change', selectTee)
  document.getElementById('course-select').addEventListener('change', selectCourse)
  showCourses()
})