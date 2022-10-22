const url = 'https://golf-courses-api.herokuapp.com/courses'
let courseId = -1
let teeId = -1
const rowTemplate = document.querySelector(['#rowTemplate'])

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
  console.log(data)
  return data.data
}

async function selectCourse(e) {
  courseId = e.target.value;
  var course = await getCourseInfo(courseId);
  showTees(courseId)
}

async function showTees(id) {
  var teeBoxes = (await getCourseInfo(id)).holes[0].teeBoxes
  let teeBoxSelectHtml = document.getElementById('tee-select').innerHTML
  console.log('I ran', teeBoxes)
  teeBoxes.forEach(function (teeBox) {
    teeBoxSelectHtml += `<option value="${teeBox.teeTypeId}">${teeBox.teeType.toUpperCase()}</option>`
  });
    
  document.getElementById('tee-select').innerHTML = teeBoxSelectHtml;
}

async function selectTee(e) {
  teeId = e.target.value
  displayTable()
}

async function displayTable() {
  var element = document.querySelector('#scorecard')
  element.classList.remove('display-none')
  let holes = (await getCourseInfo(courseId)).holes
  displayHoles(holes)
  displayYards(holes)
  // displayPar()
  // displayHandicap()
  // displayPlayers()
}

async function displayHoles(holes) {
  //holes = (await getCourseInfo(courseId)).holes
  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var row1 = table1.insertRow(0);
  var row2 = table2.insertRow(0);
  var index = 0;
  createCell('Hole', 0, row1)
  createCell('Hole', 0, row2)
  holes.slice(0, 9).forEach((h) => {
    createCell(`${index + 1}`, index + 1, row1)
    index++
  })
  index = 0
  holes.slice(9, 19).forEach((h) => {
    createCell(`${index + 10}`, index + 1, row2)
    index++
  })
  createCell('total', 10, row1)
  createCell('total', 10, row2)
}

async function displayYards(holes) {
  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var row1 = table1.insertRow(0);
  var row2 = table2.insertRow(0);

  var index = 0;
  createCell('Yards', 0, row1)
  createCell('Yards', 0, row2)
  holes.slice(0, 9).forEach((h) => {
    let t = h.teeBoxes.filter((t) => {
      return t.teeTypeId === teeId 
    })
    createCell(t.yards, index + 1, row1)
    index++
  })

  index = 0;
  holes.slice(9, 19).forEach((h) => {
    let t = h.teeBoxes.filter((t) => {
      t.teeTypeId === teeId 
    })
    createCell(t.yards, index + 1, row2)
    index++
  })
  createCell('', 10, row1)
  createCell('', 10, row2)
}

function createCell(title, index, row) {
  row.insertCell(index).innerHTML = title;
}


window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tee-select').addEventListener('change', selectTee)
  document.getElementById('course-select').addEventListener('change', selectCourse)
  showCourses()
})