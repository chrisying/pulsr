google.load("visualization", '1', {packages:['corechart']});
google.setOnLoadCallback(init);

var datasrc = 'https://docs.google.com/spreadsheets/d/1Mj9iXWJxSKRC21WFI_uKSvbJLeUNSt2sHJLXNOhYLZY/edit#gid=0';

var options = {
  width: 300,
  height: 300,
  animation: {
    duration: 1000,
    easing: 'out'
  },
  legend: {position: 'none'},
}

var chart;
var data;

function init() {
  chart = new google.visualization.ColumnChart(document.getElementById('visualization'));
  setInterval(loop, 1000);
}

function drawChart(data) {
  chart.draw(data, options);
}

function loop() {
  // var query = new google.visualization.Query(
  //   'https://docs.google.com/spreadsheet/ccc?key=0Atw2BTU52lOCdEZpUlVIdmxGOWZBR2tuLXhYN2dQTWc&usp=drive_web&gid=0#');
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