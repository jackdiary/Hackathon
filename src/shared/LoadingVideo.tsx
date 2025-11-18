import styles from './LoadingVideo.module.css';

type LoadingVideoProps = {
  active: boolean;
};

function LoadingVideo({ active }: LoadingVideoProps) {
  if (!active) {
    return null;
  }

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <video className={styles.video} autoPlay loop muted playsInline>
        <source src="/media/loading.mp4" type="video/mp4" />
        로딩 중
      </video>
    </div>
  );
}

export default LoadingVideo;

