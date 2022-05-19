import mainStyles from '../styles/Main.module.css';

export const Button = ({ onClick, label, type = "button" }) => {
  return (
    <button
      className={mainStyles.createBtn}
      onClick={onClick}
      type={type}
    >
      {label}
    </button>
  );
};
