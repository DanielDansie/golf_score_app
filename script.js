const url = 'https://golf-courses-api.herokuapp.com/courses'
let courseId = -1
let teeId = -1
const playerName = document.querySelector('#playerName')
const addPlayer = document.querySelector('#addPlayer')
const scorecard = document.querySelector('#scorecard')

var players = [];

async function getAvailableCourses() {
  const response = await fetch(url)
  let data = await response.json();
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
  return data.data
}

async function selectCourse(e) {
  courseId = e.target.value;
  var course = await getCourseInfo(courseId);
  showTees(courseId)
}

async function showTees(id) {
  var element = document.querySelector('#tee-select')
  element.classList.remove('display-none')
  var teeBoxes = (await getCourseInfo(id)).holes[0].teeBoxes
  let teeBoxSelectHtml = document.getElementById('tee-select').innerHTML
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
    var addPlayerInfo = document.querySelector('.addPlayerInfo');
    scorecard.classList.remove('display-none')
    addPlayerInfo.classList.remove('display-none')
    let holes = (await getCourseInfo(courseId)).holes
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
  row1.setAttribute('class', 'holes')
  row2.setAttribute('class', 'holes')

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
  row1.setAttribute('class', 'yards')
  row2.setAttribute('class', 'yards')

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
  row1.setAttribute('class', 'par')
  row2.setAttribute('class', 'par')

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
  row1.setAttribute('class', 'hcp')
  row2.setAttribute('class', 'hcp')

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
  addPlayerRow();
}

function createNewPlayer() {
  const name = document.querySelector('#playerName').value
  const id = Date.now().toString()
  const scores = new Array(18).fill(0);
  const totalScore = scores.reduce(function (x, y) {
    return x + y;
  }, 0);

  const newPlayer = {
    name, id, scores, totalScore
  }

  players.push(newPlayer)
}

function addPlayerRow() {
  var table1 = document.querySelector('#first');
  var table2 = document.querySelector('#second');

  var outPlayerRow = table1.insertRow(-1)
  var inPlayerRow = table2.insertRow(-1)

  var playerInfo = players[players.length - 1]
  var id = playerInfo.id

  outPlayerRow.setAttribute('data-playerid', `${id}`)
  outPlayerRow.setAttribute('data-row', `outRow`)

  inPlayerRow.setAttribute('data-playerid', `${id}`)
  inPlayerRow.setAttribute('data-row', `inRow`)

  var outNameCell = outPlayerRow.insertCell(0)
  var inNameCell = inPlayerRow.insertCell(0)

  var playerNameInfo1 = document.createTextNode(playerInfo.name)
  var playerNameInfo2 = document.createTextNode(playerInfo.name)

  outNameCell.appendChild(playerNameInfo1)
  inNameCell.appendChild(playerNameInfo2)

  var inputScores = playerInfo.scores

  var outScores = inputScores.slice(0, 9)
  var inScores = inputScores.slice(9, 18)

  outScores.forEach((s, idx) => {
    var playerScoreInput = document.createElement('input')
    playerScoreInput.setAttribute('type', 'number')
    playerScoreInput.value = inputScores[s]
    var inputCells = outPlayerRow.insertCell()
    inputCells.appendChild(playerScoreInput)
    playerScoreInput.addEventListener('change', e => {
      const element = parseInt(e.target.value);
      const player = players.find(p => p.id === id)
      player.scores[idx] = element
      let newScore = player.scores.slice(0, 9).reduce((PV, CV) => PV + CV, 0)
      console.log(players, player)
      console.log(newScore)
      outTotal = document.querySelector([`[data-totalType="outTotal${id}"]`])
      outTotal.innerHTML = newScore
    })
  })

  inScores.forEach((s, idx) => {
    var playerScoreInput = document.createElement('input')
    playerScoreInput.setAttribute('type', 'number')
    playerScoreInput.value = inputScores[s]
    var inputCells = inPlayerRow.insertCell()
    inputCells.appendChild(playerScoreInput)
    playerScoreInput.addEventListener('change', e => {
      const element = parseInt(e.target.value);
      const player = players.find(p => p.id === id)
      player.scores[idx + 9] = element
      let newScore = player.scores.slice(9, 18).reduce((PV, CV) => PV + CV, 0)
      console.log(players, player)
      console.log(newScore)
      inTotal = document.querySelector([`[data-totalType="inTotal${id}"]`])
      inTotal.innerHTML = newScore
    })
  })

  var playerOutTotal = outPlayerRow.insertCell(-1)
  var playerInTotal = inPlayerRow.insertCell(-1)

  var playerOutScoreTotal = document.createTextNode(0)
  var playerInScoreTotal = document.createTextNode(0)

  playerOutTotal.appendChild(playerOutScoreTotal)
  playerInTotal.appendChild(playerInScoreTotal)

  playerOutTotal.setAttribute('data-playerid', `${id}`)
  playerOutTotal.setAttribute('data-totalType', `outTotal${id}`)

  playerInTotal.setAttribute('data-playerid', `${id}`)
  playerInTotal.setAttribute('data-totalType', `inTotal${id}`)
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tee-select').addEventListener('change', selectTee)
  document.getElementById('course-select').addEventListener('change', selectCourse)
  showCourses()
})