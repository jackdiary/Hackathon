import { NavLink, Outlet, useLocation } from 'react-router-dom'
import creativityModules from '../features/creativity/modules'
import styles from './CreativityStudio.module.css'

function CreativityStudio() {
  const location = useLocation()
  const activeModule = creativityModules.find((module) =>
    location.pathname.startsWith(module.path),
  )

  return (
    <div className={styles.wrapper}>
      <section className={styles.header}>
        <div>
          
          <h2 className={styles.title}>AI 상상 스파링 · 글쓰기 · 아트 워크숍</h2>
        </div>
        <p className={styles.summary}>
          {activeModule
            ? `${activeModule.label}만 집중해서 진행할 수 있도록 화면을 나눴습니다.`
            : '모듈 별 고정 프롬프트와 안전 가이드가 포함된 대시보드를 열어 원하는 활동을 선택하세요.'}
        </p>
      </section>

      <div className={styles.moduleNav}>
        {creativityModules.map((module) => (
          <NavLink
            key={module.key}
            to={module.path}
            className={({ isActive }) =>
              isActive ? `${styles.moduleLink} ${styles.moduleActive}` : styles.moduleLink
            }
          >
            <span className={styles.moduleLabel}>{module.label}</span>
            <span className={styles.moduleSummary}>{module.summary}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.moduleArea}>
        <Outlet />
      </div>
    </div>
  )
}

export default CreativityStudio
