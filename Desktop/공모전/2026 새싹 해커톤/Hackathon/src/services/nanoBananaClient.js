const DEFAULT_DELAY = 2400

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestStyleTransfer({ file, styleLabel, classroomCode }, onProgress) {
  if (!file) {
    throw new Error('이미지 파일을 먼저 업로드하세요.')
  }

  const endpoint = import.meta.env.VITE_NANOBANANA_MCP_URL
  const token = import.meta.env.VITE_NANOBANANA_MCP_TOKEN

  if (!endpoint || !token) {
    if (typeof onProgress === 'function') {
      onProgress(25)
      await wait(DEFAULT_DELAY)
      onProgress(60)
      await wait(DEFAULT_DELAY)
      onProgress(100)
    } else {
      await wait(DEFAULT_DELAY * 2)
    }
    return {
      mock: true,
      imageUrl: '',
      style: styleLabel,
      classroomCode,
      message:
        'NanoBanana MCP 엔드포인트가 설정되지 않아 모의 진행만 수행했습니다. .env 파일을 확인하세요.',
    }
  }

  const formData = new FormData()
  formData.append('style', styleLabel)
  formData.append('classroomCode', classroomCode)
  formData.append('image', file)

  if (typeof onProgress === 'function') {
    onProgress(15)
  }

  const response = await fetch(`${endpoint}/style-transfer`, {
    method: 'POST',
    headers: {
      'x-nanobanana-token': token,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('NanoBanana MCP 스타일 변환이 실패했습니다.')
  }

  const payload = await response.json()

  if (typeof onProgress === 'function') {
    onProgress(100)
  }

  return payload
}
