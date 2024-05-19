import styles from "./Button.module.css";
const Button = ({ children, disabled, onClick }) => {
  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
