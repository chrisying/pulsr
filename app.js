var TIMESTEP = 1000;

google.load("visualization", '1', {packages:['corechart', 'gauge']});
google.setOnLoadCallback(init);

// var datasrc = 'https://docs.google.com/spreadsheets/d/1Mj9iXWJxSKRC21WFI_uKSvbJLeUNSt2sHJLXNOhYLZY/edit#gid=0';

var coptions = {
  width: 600,
  height: 300,
  animation: {
    duration: 1000,
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
  redFrom: -100,
  redTo: -1,
  yellowFrom: -1,
  yellowTo: 1,
  greenFrom: 1,
  greenTo: 100,
  minorTicks: 10,
}

var chart, data;

function init() {
  chart = new google.visualization.AreaChart(document.getElementById('chart'));
  gauge = new google.visualization.Gauge(document.getElementById('gauge'));
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
  data.unshift(Math.random()*6 - 3);
  data.pop();
  drawChart(data);
}

function addIndex(array) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray.push([i, array[i]]);
  }
  return newArray;
}

/**
function loop() {
  var query = new google.visualization.Query(datasrc);
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  data = response.getDataTable();

  drawChart(data);
}
**/
