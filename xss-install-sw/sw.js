let id = registration.scope.match(/\d+$/)[0];

setInterval(_ => {
  console.log('id: ' + id + ' time: ' + Date.now());
}, 1000);

function add1s() {
  registration.active.postMessage(1);
}

self.onmessage = function(e) {
  e.waitUntil(new Promise(y => {
    setTimeout(_ => {
      add1s();
      y();
      update();
    }, 1000);
  }));
};

self.onactivate = function() {
  add1s();
};
