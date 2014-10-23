google.load("visualization", '1', {packages:['corechart']});
google.setOnLoadCallback(init);

var datasrc = 'https://docs.google.com/spreadsheets/d/1Mj9iXWJxSKRC21WFI_uKSvbJLeUNSt2sHJLXNOhYLZY/edit#gid=0';

var options = {
  width: 800,
  height: 400,
  animation: {
    duration: 1000,
    easing: 'out',
  },
  legend: {position: 'none'},
  hAxis: {
    direction: -1,
  },
}

var chart;
var data;

function init() {
  chart = new google.visualization.AreaChart(document.getElementById('visualization'));
  setInterval(loop, 1000);
}

function drawChart(data) {
  chart.draw(data, options);
}

function loop() {
  var query = new google.visualization.Query(datasrc);
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();

  drawChart(data);
}