import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = 'gemini-1.5-flash'
let cachedModel = null

function getModel() {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY 값을 .env 파일에 설정해야 합니다.')
  }
  if (cachedModel) {
    return cachedModel
  }
  const client = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
  cachedModel = client.getGenerativeModel({ model: MODEL_NAME })
  return cachedModel
}

async function generateWithGemini(prompt) {
  const model = getModel()
  const response = await model.generateContent(prompt)
  return response.response.text()
}

function buildSparringPrompt({ classicStory, twist, focus }) {
  return [
    '너는 초등학교 3~4학년 대상 AI 스파링 파트너이다.',
    '학생은 고전 동화를 비판적으로 다시 쓰도록 지도받는다.',
    '다음 형식을 반드시 지켜라.',
    '',
    `기준 동화: ${classicStory || '토끼와 거북이'}`,
    `AI가 제시할 엉뚱한 반론: ${twist || '거북이가 이긴 것은 불공평하다'}`,
    `수업 초점: ${focus || '불공정 상황을 발견하고 다시 구성하기'}`,
    '',
    '출력 템플릿:',
    '1. AI 반론: 한 문단으로 학생을 도발하되 안전한 표현을 사용한다.',
    '2. 비판적 사고 질문 2개: 질문은 번호 목록으로 만든다.',
    '3. 재구성 가이드: 학생이 새 결말을 쓰도록 단계별 안내를 bullet 3개로 제시한다.',
    '4. 확장 활동: STEAM 또는 창체 연계 아이디어를 한 줄로 제시한다.',
  ].join('\n')
}

function buildWritingPrompt({ theme, genre, grade }) {
  return [
    '너는 초등 국어/창체 수업용 AI 글쓰기 코치이다.',
    '학생 입력을 바탕으로 활동지를 대신 작성한다.',
    `학년: ${grade || '3학년'}`,
    `주제: ${theme || '거북이의 시점으로 쓰는 우정 이야기'}`,
    `장르: ${genre || '동화'}`,
    '',
    '출력 템플릿:',
    '1. 글쓰기 미션 제목',
    '2. 아이스브레이킹 질문 2개 (번호 목록)',
    '3. 글 구조 제안 (도입, 전개, 결말 형태)',
    '4. 표현 꿀팁 2개',
    '5. 확장 활동 아이디어 1개',
  ].join('\n')
}

export async function requestSparringScenario(payload) {
  return generateWithGemini(buildSparringPrompt(payload))
}

export async function requestWritingGuide(payload) {
  return generateWithGemini(buildWritingPrompt(payload))
}
