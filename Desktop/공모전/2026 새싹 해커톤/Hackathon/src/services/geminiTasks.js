import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const textModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


function buildSparringPrompt({ classicStory, twist, focus }) {
  return [
    '너는 초등학교 3~4학년 대상 AI 스파링 파트너이다.',
    '학생은 고전 동화를 비판적으로 다시 쓰도록 지도받는다.',
    '다음 형식을 반드시 지켜라.',
    '',
    `기준 동화: ${classicStory || '예)토끼와 거북이'}`,
    `AI가 제시할 엉뚱한 반론: ${twist || '예)거북이가 이긴 것은 불공평하다'}`,
    `수업 초점: ${focus || '예)불공정 상황을 발견하고 다시 구성하기'}`,
    '',
    '출력 템플릿:',
    '1. AI 반론: 한 문단으로 학생을 도발하되 안전한 표현을 사용한다.',
    '2. 비판적 사고 질문 2개: 질문은 번호 목록으로 만든다.',
    '3. 재구성 가이드: 학생이 새 결말을 쓰도록 단계별 안내를 bullet 3개로 제시한다.',
    '4. 확장 활동: STEAM 또는 창체 연계 아이디어를 한 줄로 제시한다.',
  ].join('\n');
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
  ].join('\n');
}

function buildArtImagePrompt({ styleLabel, stylePrompt, description }) {
  const styleDescription = stylePrompt || styleLabel || 'Vincent van Gogh inspired painting';
  return [
    'You are an AI art instructor who safely reinterprets elementary school artwork.',
    'Preserve the student drawing composition while restyling colors, brush strokes, and lighting only.',
    'Return exactly one inline image part (PNG). Do not include any commentary text.',
    '',
    `Requested art style: ${styleDescription}`,
    `Student artwork summary: ${description || 'Student imagined landscape'}`,
  ].join('\n');
}

function fileToGenerativePart(imageBase64, mimeType) {
    return {
        inlineData: {
            data: imageBase64,
            mimeType
        },
    };
}


export async function requestSparringScenario(payload) {
    const prompt = buildSparringPrompt(payload);
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export async function requestWritingGuide(payload) {
    const prompt = buildWritingPrompt(payload);
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export async function requestArtStyleRender(payload) {
    const prompt = buildArtImagePrompt(payload);
    const imagePart = fileToGenerativePart(payload.imageBase64, payload.mimeType);
    const result = await imageModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
        if (part.inlineData) {
            return {
                mimeType: part.inlineData.mimeType,
                dataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            };
        }
    }

    throw new Error('Gemini가 이미지 결과를 반환하지 않았습니다.');
}
