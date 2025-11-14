import styles from './GlassButton.module.css'

function GlassButton({ children, className = '', ...props }) {
  return (
    <button className={`${styles.button} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export default GlassButton
