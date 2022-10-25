const url = 'https://golf-courses-api.herokuapp.com/courses'
let courseId = -1
let teeId = -1
const playerName = document.querySelector('#playerName')
const addPlayer = document.querySelector('#addPlayer')


// class Player {
//   constructor(name, id = getNextId(), scores = []) {
//     this.name = name;
//     this.id = id;
//     this.scores = scores;
//   }
// }

var players = [];

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
  teeId = parseInt(e.target.value)
  displayTable()
}

async function displayTable() {
  var element = document.querySelector('#scorecard')
  element.classList.remove('display-none')
  var player = document.querySelector('.playerInfo');
  player.classList.remove('display-none')
  let holes = (await getCourseInfo(courseId)).holes
  // displayPlayers()
  displayHandicap(holes)
  displayPar(holes)
  displayYards(holes)
  displayHoles(holes)
}

function createCell(title, index, row) {
  row.insertCell(index).innerHTML = title;
}

function displayHoles(holes) {
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
  createCell('Total', 10, row1)
  createCell('Total', 10, row2)
}

function displayYards(holes) {
  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var row1 = table1.insertRow(0);
  var row2 = table2.insertRow(0);

  let table1Total = 0;
  let table2Total = 0;

  var index = 0;
  createCell('Yards', 0, row1)
  createCell('Yards', 0, row2)
  holes.slice(0, 9).forEach((h) => {
    let t = h.teeBoxes.find(tee => tee.teeTypeId === teeId)
    table1Total += t.yards
    createCell(t.yards, index + 1, row1)
    index++
  })

  index = 0;
  holes.slice(9, 19).forEach((h) => {
    let t = h.teeBoxes.find(tee => tee.teeTypeId === teeId)
    createCell(t.yards, index + 1, row2)
    table2Total += t.yards
    index++
  })
  createCell(table1Total, 10, row1)
  createCell(table2Total, 10, row2)
}

function displayPar(holes) {
  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var row1 = table1.insertRow(0);
  var row2 = table2.insertRow(0);

  let table1Total = 0;
  let table2Total = 0;

  var index = 0;
  createCell('Par', 0, row1)
  createCell('Par', 0, row2)
  holes.slice(0, 9).forEach((h) => {
    let t = h.teeBoxes.find(tee => tee.teeTypeId === teeId)
    table1Total += t.par
    createCell(t.par, index + 1, row1)
    index++
  })

  index = 0;
  holes.slice(9, 19).forEach((h) => {
    let t = h.teeBoxes.find(tee => tee.teeTypeId === teeId)
    createCell(t.par, index + 1, row2)
    table2Total += t.par
    index++
  })
  createCell(table1Total, 10, row1)
  createCell(table2Total, 10, row2)
}

function displayHandicap(holes) {
  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var row1 = table1.insertRow(0);
  var row2 = table2.insertRow(0);

  var index = 0;
  createCell('Handicap', 0, row1)
  createCell('Handicap', 0, row2)
  holes.slice(0, 9).forEach((h) => {
    let t = h.teeBoxes.find(tee => tee.teeTypeId === teeId)
    createCell(t.hcp, index + 1, row1)
    index++
  })

  index = 0;
  holes.slice(9, 19).forEach((h) => {
    let t = h.teeBoxes.find(tee => tee.teeTypeId === teeId)
    createCell(t.hcp, index + 1, row2)
    index++
  })
  createCell('', 10, row1)
  createCell('', 10, row2)
}

addPlayer.addEventListener('click', addPlayerClick)

function addPlayerClick() {
  createNewPlayer();
  // displayPlayers()
  addPlayerRow();
}

function createNewPlayer() {
  const name = document.querySelector('#playerName').value
  const id = Date.now().toString()
  const scores = new Array(18).fill(0);

  const newPlayer = {
    name, id, scores
  }

  players.push(newPlayer)
  console.log(players)
}


function addPlayerRow() {
  const rowTemplate = document.querySelector('#playerRow')

  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var playerRow1 = document.importNode(rowTemplate.content, true) 
  var playerRow2 = document.importNode(rowTemplate.content, true)

  table1.appendChild(playerRow1)
  table2.appendChild(playerRow2)
}

function displayPlayers() {
  // display players 
  players.forEach(playerItem => {
    renderPlayerRow(playerItem.id, true);
    renderPlayerRow(playerItem.id, false);
  })
}

// function renderPlayerRow(playerId, isFirstHalf) {
//   const newPlayerRow = getNewPlayerRowElement(playerId, isFirstHalf);
//   const table = getTableElement(isFirstHalf);

//   table.appendChild(newPlayerRow);
// }

// function getPlayerData(playerId) {
//   return players.find(playerItem => playerItem.id === playerId);
// }

// function getPlayerName(playerId) {
//   return getPlayerData(playerId).name;
// }

// function getScoresToDisplay(playerId, isFirstHalf) {
//   var playerData = getPlayerData(playerId);
//   var scores = playerData.scores;
//   return isFirstHalf ? scores.slice(0, 9) : scores.slice(9, 19);
// }

// function getTableElement(isFirstHalf) {
//   const tableSelector = isFirstHalf ? "#first" : "#second";
//   return document.querySelector(tableSelector);
// }

// function getNewPlayerRowElement(playerId, isFirstHalf) {
//   const rowTemplate = document.querySelector('#playerRow tr')
//   const element = document.cloneNode(rowTemplate);
//   const playerCell = element.querySelector('.player input');
//   const scoreElements = element.querySelectorAll('.hole input');
//   const scores = getScoresToDisplay(playerId, isFirstHalf)

//   // element.setAttribute('data-playerId', playerId);
//   // element.setAttribute('data-isFirstHalf', isFirstHalf);

//   playerCell.value = getPlayerName(playerId);
//   scoreElements.forEach((element, index) => {
//     element.value = scores[index] || -1;
//   });

//   return element;
// }

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tee-select').addEventListener('change', selectTee)
  document.getElementById('course-select').addEventListener('change', selectCourse)
  showCourses()
})