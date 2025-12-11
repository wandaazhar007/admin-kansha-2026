// src/components/footer/Footer.tsx
import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.textPrimary}>
          © 2025 Kansha Hibachi &amp; Sushi · Admin Panel
        </p>
        <p className={styles.textSecondary}>
          Build with <span className={styles.heart}>❤️</span> by wanda azhar in
          Detroit, MI, USA
        </p>
      </div>
    </footer>
  );
};

export default Footer;