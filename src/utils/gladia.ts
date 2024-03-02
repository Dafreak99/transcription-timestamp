async function makeFetchRequest(url: string, options: any) {
  const response = await fetch(url, options)
  return response.json()
}

async function pollForResult(resultUrl: string, headers: any) {
  while (true) {
    console.log('Polling for results...')
    const pollResponse = await makeFetchRequest(resultUrl, { headers })

    if (pollResponse.status === 'done') {
      console.log('- Transcription done: \n ')
      return pollResponse
    } else {
      console.log('Transcription status : ', pollResponse.status)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

export async function startTranscription(audioUrl: string) {
  const gladiaKey = '3191bd1a-8727-4687-83ec-b73c5de6862f	'
  const requestData = {
    audio_url: audioUrl,
  }
  const gladiaUrl = 'https://api.gladia.io/v2/transcription/'
  const headers = {
    'x-gladia-key': gladiaKey,
    'Content-Type': 'application/json',
  }

  console.log('- Sending initial request to Gladia API...')
  const initialResponse = await makeFetchRequest(gladiaUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestData),
  })

  console.log('Initial response with Transcription ID :', initialResponse)

  if (initialResponse.result_url) {
    return await pollForResult(initialResponse.result_url, headers)
  }
}
