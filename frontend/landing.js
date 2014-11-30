
var fire = new Firebase('https://pulsr-data.firebaseio.com/');

function createNewGraph() {
  // Check that it hasn't been made already
  var shortName = document.getElementById('newgraph').value;  
  var idRef = fire.child('map/' + shortName + '/uid');
  idRef.once('value', function(data) {
    if (data.val() === null) {
      var dataR = fire.child('data');
      var newPush = dataR.push({'num': 0, 'queue': {}});
      var uid = newPush.name();
      var mapR = fire.child('map');
      mapR.child(shortName).set({uid: uid});
    } else {
      console.log('name taken');
    }
  });
}

function navigateToGraph() {
  // Check graph DNE
  var shortName = document.getElementById('newgraph').value;
  var idRef = fire.child('map/' + shortName + '/uid');
  idRef.once('value', function(data) {
    if (data.val() !== null) {
      window.location = 'graph.html?id=' + document.getElementById('newgraph').value;
    } else {
      console.log('graph dne');
    }
  });
}
