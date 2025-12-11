import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <p className={styles.footer__text}>
          © {year} Kansha Hibachi &amp; Sushi · Admin Panel
        </p>
        <p className={styles.footer__subtext}>
          Premium Taste, Simple Price, Fast &amp; Fresh
        </p>
      </div>
    </footer>
  );
};

export default Footer;