let id = registration.scope.match(/\d+$/)[0];

setInterval(_ => {
  console.log('id: ' + id + ' time: ' + Date.now());
}, 1000);
