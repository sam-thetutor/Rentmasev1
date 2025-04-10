addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Modify this to match your domain
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  const apiUrl = 'https://publicapi.intract.io/api/pv1/proof-of-humanity/check-identity-score' + url.search
  
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': request.headers.get('Authorization'),
      'Content-Type': 'application/json'
    }
  })

  const newResponse = new Response(response.body, response)
  
  // Add CORS headers to response
  Object.keys(corsHeaders).forEach(key => {
    newResponse.headers.set(key, corsHeaders[key])
  })

  return newResponse
} 