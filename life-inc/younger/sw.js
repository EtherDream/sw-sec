let life = 0;

setInterval(_ => {
  life++;
  fetch('log?life=' + life);
}, 1000);