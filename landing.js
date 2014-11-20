
var fire = new Firebase('https://pulsr-data.firebaseio.com/');

function createNewGraph() {
  // Missing checks for empty/valid/already used name
  var dataR = fire.child('data');
  var newPush = dataR.push({'sum': 0, 'num': 0});
  var uid = newPush.name();
  var mapR = fire.child('map');
  var shortName = document.getElementById('newgraph').value;  
  mapR.child(shortName).set({uid: uid});
}

function navigateToGraph() {
  // Missing check of graph DNE
  window.location = 'graph.html?id=' + document.getElementById('gograph').value;
}
