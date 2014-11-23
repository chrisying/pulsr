var TIMESTEP = 1000;

google.load("visualization", '1', {packages:['corechart', 'gauge']});
google.setOnLoadCallback(init);

var coptions = {
  width: 600,
  height: 300,
  animation: {
    duration: TIMESTEP,
    easing: 'linear',
  },
  legend: {position: 'none'},
  colors: ['red', 'green'],
  hAxis: {
    title: 'Seconds ago',
    direction: -1,
  },
  vAxis: {
    title: 'Sentiment',
    viewWindow: {
      max: 10,
      min: -10,
    },
  },
}

var goptions = {
  width: 330,
  height: 330,
  min: -10,
  max: 10,
  redFrom: -10,
  redTo: -5,
  yellowFrom: -5,
  yellowTo: 5,
  greenFrom: 5,
  greenTo: 10,
  minorTicks: 10,
  animation: {
    duration: TIMESTEP,
    easing: 'linear',
  },
}

var chart, data;
var fire = new Firebase('https://pulsr-data.firebaseio.com/');
var dataRef;

function init() {
  chart = new google.visualization.AreaChart(document.getElementById('chart'));
  gauge = new google.visualization.Gauge(document.getElementById('gauge'));
  var graphID = getParameterByName('id');
  console.log(graphID);
  var idRef = fire.child('map/' + graphID + '/uid');
  idRef.once('value', function(data) {
    var uid = data.val();
    console.log(uid);
    dataRef = fire.child('data/' + uid);
  });
  data = [];
  for (var i = 0; i < 60; i++) { data.push(0); }
  setInterval(loop, TIMESTEP);
}

function drawChart(data) {
  var datatable = new google.visualization.DataTable();
  datatable.addColumn('number', 'time');
  datatable.addColumn('number', 'value');
  datatable.addRows(addIndex(data));
  
  var gaugetable = new google.visualization.DataTable();
  gaugetable.addColumn('string', 'name');
  gaugetable.addColumn('number', 'value');
  gaugetable.addRow(['Sentiment', Math.round(data[0]*100) / 100]);

  chart.draw(datatable, coptions);
  gauge.draw(gaugetable, goptions);
}

function loop() {
  // Polling
  var scoreEl = document.getElementById('score');
  dataRef.child('sum').set(scoreEl.value / 100);
  scoreEl.value *= 0.95;

  // Visualization
  dataRef.once('value', function(snap) {
    var val = snap.val();
    var score = val.sum / (val.num + 1);
    console.log(score);
    data.unshift(score);
    data.pop();
    drawChart(data);
  });
}

function addIndex(array) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray.push([i, array[i]]);
  }
  return newArray;
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
