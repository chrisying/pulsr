var TIMESTEP = 2000;

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
var lastPostId = null;

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

// :: Array of Nums -> ()
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
  var curTime = Date.now();

  // Visualization
  var ref = dataRef;
  if (lastPostId === null){
    ref = ref.child('queue');
  } else {
    //ref = ref.child('queue');
    ref = ref.child('queue').orderByKey().startAt(lastPostId);
  } 
  ref.once('value', function(snap) {
      var q = snap.val();
      // Get mean, number of data
      //console.log(q);
      var u = 0;
      var c = 0;
      var scores = [];
      for (var id in q) {
        var score = parseFloat(q[id]["vote"]);
        scores[scores.length] = score;
        u = (u*c + score) / (c+1);
        c++;
      }
      console.log(scores);
      data.unshift(u);
      data.pop();
      drawChart(data);
      var lastPostRef = dataRef.child('queue').push({"vote": scoreEl.value / 100});
      lastPostId = lastPostRef.key();
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
