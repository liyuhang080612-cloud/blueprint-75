/* Independent, classic-script loading guard. No requests, redirects or analytics. */
(function () {
  'use strict';
  var failed = false, settled = false, poll, timer;
  var message = '';
  function ready() {
    var root = document.getElementById('root');
    var styled = window.getComputedStyle(document.documentElement).getPropertyValue('--navy').trim();
    if (!root || root.getAttribute('data-app-ready') !== 'true' || !styled) return false;
    root.hidden = false;
    var screen = document.getElementById('boot-screen');
    if (screen) screen.hidden = true;
    settled = true;
    clearInterval(poll); clearTimeout(timer);
    window.removeEventListener('blueprint:ready', ready);
    window.removeEventListener('load', ready, true);
    window.removeEventListener('error', fail, true);
    window.removeEventListener('unhandledrejection', fail);
    return true;
  }
  function show() {
    if (ready()) return;
    var status = document.getElementById('boot-status');
    if (status && message) status.textContent = message;
  }
  function fail(event) {
    if (settled) return;
    var target = event.target;
    if (event.type === 'unhandledrejection' || target === window || (target && /^(SCRIPT|LINK)$/.test(target.tagName))) {
      failed = true; message = '部分资源没有完整加载。'; show();
    }
  }
  window.addEventListener('blueprint:ready', ready);
  window.addEventListener('load', ready, true);
  window.addEventListener('error', fail, true);
  window.addEventListener('unhandledrejection', fail);
  poll = setInterval(show, 200);
  timer = setTimeout(function () {
    clearInterval(poll);
    if (ready()) return;
    if (!failed) message = '连接比预期慢，蓝图仍在加载。';
    show();
  }, 12000);
  show();
}());
