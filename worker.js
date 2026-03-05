addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')

  if (!targetUrl) {
    return new Response('No URL provided. Use ?url=https://example.com', { status: 400 })
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
      }
    })

    const newResponse = new Response(response.body, response)
    newResponse.headers.delete('X-Frame-Options')
    newResponse.headers.delete('Content-Security-Policy')
    newResponse.headers.set('Access-Control-Allow-Origin', '*')

    return newResponse

  } catch (err) {
    return new Response('Proxy error: ' + err.message, { status: 500 })
  }
}
