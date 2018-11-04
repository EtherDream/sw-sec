function update() {
  var t = Date.now();
  while (Date.now() - t < 1000);
}

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
