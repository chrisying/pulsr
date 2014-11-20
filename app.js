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
  hAxis: {
    direction: -1,
  },
  colors: ['red', 'green'],
}

var goptions = {
  width: 200,
  height: 200,
  min: -3,
  max: 3,
  redFrom: -3,
  redTo: -1,
  yellowFrom: -1,
  yellowTo: 1,
  greenFrom: 1,
  greenTo: 3,
  minorTicks: 10,
  animation: {
    duration: TIMESTEP,
    easing: 'linear',
  }
}

var chart, data;
var fire = new Firebase('https://pulsr-data.firebaseio.com/');
var dataRef;

function init() {
  chart = new google.visualization.AreaChart(document.getElementById('chart'));
  gauge = new google.visualization.Gauge(document.getElementById('gauge'));
  var graphID = getParameterByName('id');
  console.log('graphID');
  console.log(graphID);
  var idRef = fire.child('map/' + graphID + '/uid');
  idRef.once('value', function(data) {
    var uid = data.val();
    console.log(uid);
    dataRef = fire.child('data/' + uid);
  });
  data = [-2,-1,0,1,2];
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
