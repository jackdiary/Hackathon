import React, { useState } from "react";
import styles from "./PerspectiveSwitcher.module.css";

interface PerspectiveResponse {
  their_view: string;
  their_emotion: string;
  inner_message: string;
  better_expression: string;
}

const initialBearText = "친구의 입장에서 한번 생각해볼까요?";

export const PerspectiveSwitcher: React.FC = () => {
  const [situation, setSituation] = useState("");
  const [myView, setMyView] = useState("");
  const [bearText, setBearText] = useState(initialBearText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PerspectiveResponse | null>(null);

  const handleAnalyze = async () => {
    const trimmedSituation = situation.trim();
    const trimmedMyView = myView.trim();

    if (!trimmedSituation || !trimmedMyView) {
      alert("상황 설명과 나의 생각을 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setBearText("곰곰이가 친구의 입장에서 생각해 보고 있어요...");
    setResult(null);

    try {
      const res = await fetch("/api/perspective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: trimmedSituation,
          my_view: trimmedMyView,
        }),
      });

      if (!res.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = (await res.json()) as {
        ok: boolean;
        their_view?: string;
        their_emotion?: string;
        inner_message?: string;
        better_expression?: string;
        message?: string;
      };

      if (!data.ok) {
        throw new Error(data.message || "입장 바꾸어 생각하기 생성에 실패했습니다.");
      }

      const cleanResult: PerspectiveResponse = {
        their_view: data.their_view || "",
        their_emotion: data.their_emotion || "",
        inner_message: data.inner_message || "",
        better_expression: data.better_expression || "",
      };

      setResult(cleanResult);
      setBearText("친구 입장에서 이런 모습이었을 수 있어요.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
      setBearText("잠시 어려움이 생겼어요. 다시 한 번 시도해 볼까요?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSituation("");
    setMyView("");
    setResult(null);
    setError(null);
    setBearText(initialBearText);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.forestBackground}></div>

      <div className={styles.layout}>
        {/* 왼쪽: 곰곰이 + 말풍선 + 결과 */}
        <section className={styles.leftPanel}>
          <div className={styles.bearArea}>
            <div className={styles.hill}></div>
            <img
              src="/images/smart-discussion/bear_4.png"
              alt="곰곰이"
              className={styles.bearImage}
            />
          </div>

          <div className={styles.bearBubbleWrapper}>
            <div className={styles.bearBubble}>
              <p style={{ color: bearText === initialBearText ? 'black' : 'inherit' }}>
                {bearText}
              </p>
            </div>
          </div>

          <div className={styles.resultSection}>
            <h3 className={styles.sectionTitle}>곰곰이가 바꿔본 친구의 입장</h3>

            {!result && (
              <p className={styles.resultPlaceholder}>
                상황을 입력하고 아래 버튼을 누르면, 친구의 입장에서 다시 생각해 본 내용을
                여기에서 볼 수 있어요.
              </p>
            )}

            {result && (
              <div className={styles.resultGrid}>
                <div className={styles.resultCard}>
                  <h4>친구 입장에서 본 상황</h4>
                  <p>{result.their_view}</p>
                </div>
                <div className={styles.resultCard}>
                  <h4>친구의 감정</h4>
                  <p>{result.their_emotion}</p>
                </div>
                <div className={styles.resultCard}>
                  <h4>친구가 속으로 하고 싶었을 말</h4>
                  <p>{result.inner_message}</p>
                </div>
                <div className={styles.resultCard}>
                  <h4>더 부드럽게 말해 보는 방법</h4>
                  <p>{result.better_expression}</p>
                </div>
              </div>
            )}

            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        </section>

        {/* 오른쪽: 입력 영역 */}
        <section className={styles.rightPanel}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>상대방 입장에서 생각해 보기</h2>
            <p className={styles.panelDescription}>
              내가 겪은 상황과 내 생각을 적으면, 곰곰이가 그 친구의 입장에서
              어떻게 느꼈을지 차분하게 정리해 줄 거예요.
            </p>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="situation">
                1. 어떤 상황이었나요?
              </label>
              <textarea
                id="situation"
                className={styles.textarea}
                placeholder="상황을 구체적으로 적어 주세요."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="myView">
                2. 그때 나는 어떤 마음이었나요? 무엇을 말했나요?
              </label>
              <textarea
                id="myView"
                className={styles.textarea}
                placeholder="내 마음과 말, 행동을 솔직하게 적어 주세요."
                value={myView}
                onChange={(e) => setMyView(e.target.value)}
              />
            </div>

            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "곰곰이가 생각하는 중..." : "입장 바꾸어 생각해 보기"}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleReset}
                disabled={loading}
              >
                초기화
              </button>
            </div>

            <div className={styles.tipBox}>
              <div className={styles.tipTitle}>곰곰이의 생각 연습 방법</div>
              <ul className={styles.tipList}>
                <li>친구도 나와 비슷하게 기분이 상할 수 있다는 점을 떠올려 보기.</li>
                <li>친구가 좋아할 말과 서운해할 말을 나누어 생각해 보기.</li>
                <li>다음에는 어떻게 말하면 좋을지 한 문장으로 정리해 보기.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
