// 67Labs Browser Worker
// Deploy this on Cloudflare Workers (replaces your existing worker)
// It strips iframe-blocking headers AND injects a postMessage bridge
// so the browser's back/forward/refresh buttons work for in-frame navigation.

const BRIDGE_SCRIPT = [
  '<script>',
  '(function(){',
  '  function send(d){ try{ parent.postMessage(d,"*"); }catch(e){} }',
  '  send({ type:"67labs:load", url: location.href });',
  '  window.addEventListener("popstate", function(){ send({ type:"67labs:url", url: location.href }); });',
  '  window.addEventListener("hashchange", function(){ send({ type:"67labs:url", url: location.href }); });',
  '  window.addEventListener("message", function(e){',
  '    if (e.data === "67labs:back")    { try{ history.back();    }catch(e){} }',
  '    else if (e.data === "67labs:forward") { try{ history.forward(); }catch(e){} }',
  '    else if (e.data === "67labs:refresh") { try{ location.reload(); }catch(e){} }',
  '  });',
  '})();',
  '<\/script>'   // split to avoid early termination inside a JS string
].join('\n');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url    = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return new Response('Missing ?url= parameter', { status: 400 });
  }

  let response;
  try {
    response = await fetch(target, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept':          request.headers.get('Accept') || 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer':         target,
      },
      redirect: 'follow',
    });
  } catch (e) {
    return new Response('Proxy fetch failed: ' + e.message, { status: 502 });
  }

  // Strip iframe-blocking headers
  const newHeaders = new Headers(response.headers);
  newHeaders.delete('x-frame-options');
  newHeaders.delete('content-security-policy');
  newHeaders.delete('content-security-policy-report-only');
  newHeaders.set('access-control-allow-origin', '*');

  const contentType = response.headers.get('content-type') || '';

  // Inject bridge script into HTML pages only
  if (contentType.includes('text/html')) {
    let body = await response.text();

    if (body.includes('</body>')) {
      body = body.replace('</body>', BRIDGE_SCRIPT + '\n</body>');
    } else if (body.includes('</html>')) {
      body = body.replace('</html>', BRIDGE_SCRIPT + '\n</html>');
    } else {
      body += '\n' + BRIDGE_SCRIPT;
    }

    newHeaders.set('content-type', 'text/html; charset=utf-8');
    return new Response(body, { status: response.status, headers: newHeaders });
  }

  return new Response(response.body, { status: response.status, headers: newHeaders });
}

