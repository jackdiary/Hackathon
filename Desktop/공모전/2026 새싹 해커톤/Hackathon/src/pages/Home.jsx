import styles from './Home.module.css'
import { Link } from 'react-router-dom'
import creativityModules from '../features/creativity/modules'

const tileData = [
  { title: '창의력', color: '#ff6f91' },
  { title: '몰입형체험', color: '#f6b24c' },
  { title: '논리/협업', color: '#d9fa4a' },
  { title: 'AI리터러시', color: '#51dc5c' },
  { title: '나의활동 기록', color: '#7b8fe9' },
  { title: '건의사항 or 학급게시판', color: '#cf77d5' },
]

function Home() {
  return (
    <section className={`${styles.board} ${styles['transparent-app']}`}>
      <div className={styles.tileGrid}>
        {tileData.map((tile) =>
          tile.title === '창의력' ? (
            <div
              key={tile.title}
              className={`${styles.tile} ${styles.creativityTile}`}
              style={{ backgroundColor: tile.color }}
            >
              <Link to="/creativity" className={styles.creativityMain}>
                <span>창의력</span>
                <span className={styles.creativityHint}>바로 가기</span>
              </Link>
              <div className={styles.creativityMenu}>
                {creativityModules.map((module) => (
                  <Link key={module.key} to={module.path} className={styles.creativityMenuLink}>
                    <span className={styles.creativityMenuLabel}>{module.menuLabel}</span>
                    <span className={styles.creativityMenuSummary}>{module.summary}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div
              key={tile.title}
              className={styles.tile}
              style={{ backgroundColor: tile.color }}
            >
              {tile.title}
            </div>
          ),
        )}
      </div>
    </section>
  )
}

export default Home
