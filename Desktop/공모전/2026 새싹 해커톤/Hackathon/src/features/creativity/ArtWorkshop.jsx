import { useState, useMemo } from 'react'
import GlassButton from '../../shared/GlassButton'
import { requestStyleTransfer } from '../../services/nanoBananaClient'
import styles from './ArtWorkshop.module.css'

const stylePresets = [
  { label: '고흐', value: 'van-gogh' },
  { label: '모네', value: 'monet' },
  { label: '픽셀 아트', value: 'pixel-art' },
]

function ArtWorkshop() {
  const [selectedStyle, setSelectedStyle] = useState(stylePresets[0].value)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle')
  const [resultInfo, setResultInfo] = useState(null)
  const [error, setError] = useState('')

  const styleLabel = useMemo(
    () => stylePresets.find((preset) => preset.value === selectedStyle)?.label || '선택 스타일',
    [selectedStyle],
  )

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0]
    setFile(nextFile || null)
    setResultInfo(null)
    setError('')
    if (nextFile) {
      const url = URL.createObjectURL(nextFile)
      setPreviewUrl(url)
    } else {
      setPreviewUrl('')
    }
  }

  const handleStyleTransfer = async () => {
    if (!file) {
      setError('먼저 내 그림 파일을 업로드하세요.')
      return
    }
    setStatus('running')
    setProgress(5)
    setError('')
    setResultInfo(null)

    try {
      const payload = await requestStyleTransfer(
        {
          file,
          styleLabel,
          classroomCode: 'AI-CREATIVE-LOWER',
        },
        (value) => setProgress(value),
      )
      setResultInfo(payload)
      setStatus('done')
    } catch (err) {
      setError(err.message || '스타일 변환에 실패했습니다.')
      setStatus('idle')
    }
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <p className={styles.label}>AI 아트 워크숍</p>
        <h3 className={styles.title}>나의 그림을 명작 스타일로 변환</h3>
        <p className={styles.desc}>
          그림을 업로드하면 연결된 작가 스타일로 변환.
        </p>
      </header>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>이미지 업로드</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <label className={styles.field}>
          <span>스타일 선택</span>
          <div className={styles.styleChoices}>
            {stylePresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={
                  preset.value === selectedStyle
                    ? `${styles.styleButton} ${styles.active}`
                    : styles.styleButton
                }
                onClick={() => setSelectedStyle(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <GlassButton onClick={handleStyleTransfer} disabled={status === 'running'}>
        {status === 'running' ? '스타일 적용 중...' : '스타일 변환 실행'}
      </GlassButton>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.previewArea}>
        {previewUrl ? (
          <img src={previewUrl} alt="업로드 미리보기" />
        ) : (
          <p className={styles.placeholder}>학생 그림을 업로드하면 이 영역에서 미리보기가 보입니다.</p>
        )}

        {status === 'running' && (
          <div className={styles.overlay}>
            <div className={styles.overlayBox}>
              <p className={styles.overlayText}>
                내 그림을 {styleLabel} 스타일을 적용시켜 생성중...
              </p>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.progressValue}>{progress}%</p>
            </div>
          </div>
        )}
      </div>

      {status === 'done' && resultInfo && (
        <div className={styles.result}>
          <p className={styles.resultText}>
            변환 완료: {styleLabel} 스타일. 결과 링크 또는 미리보기는 NanoBanana MCP 응답을
            통해 확인하세요.
          </p>
          {resultInfo.message && <p className={styles.resultNote}>{resultInfo.message}</p>}
        </div>
      )}
    </section>
  )
}

export default ArtWorkshop
