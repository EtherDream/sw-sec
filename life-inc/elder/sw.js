// SW 生命期延长

let life = 0;

function doJob() {
  life++;
  fetch('log?life=' + life);
}

function postMsgToSelf() {
  registration.active.postMessage(1);
}

onmessage = function(e) {
  e.waitUntil(new Promise(resolve => {
    setTimeout(_ => {   // 推迟 1s
      doJob();
      resolve();
      postMsgToSelf();  // 继续
    }, 1000);
  }));
};

onactivate = function() {
  postMsgToSelf();
};