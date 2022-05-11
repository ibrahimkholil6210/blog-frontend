import { useRouter } from "next/router";
import mainStyles from '../styles/Main.module.css';

export const Button = ({ href = "", label, type = "button" }) => {
  const router = useRouter();
  return (
    <button
      className={mainStyles.createBtn}
      onClick={() => href !== "" && router.push(href)}
      type={type}
    >
      {label}
    </button>
  );
};
