import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import styles from "../styles/Main.module.css";

const GetBack = () => {
  const router = useRouter();
  return (
    <div className={styles.iconContainer} onClick={() => router.back()}>
      <FiArrowLeft size={32} color="#0070f3" cursor="pointer" />
      Back to Home
    </div>
  );
};

export default GetBack;
