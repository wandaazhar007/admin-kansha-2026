import React from "react";
import styles from "./Navbar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood, faBell } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarInner}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <FontAwesomeIcon icon={faBowlFood} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Kansha Admin</span>
            <span className={styles.brandSubtitle}>
              Premium Taste · Simple Control
            </span>
          </div>
        </div>

        <div className={styles.navbarRight}>
          <div className={styles.dateBadge}>{formattedDate}</div>

          <button className={styles.iconButton} aria-label="Notifications">
            <FontAwesomeIcon icon={faBell} />
          </button>

          <div className={styles.userChip}>
            <div className={styles.userAvatar}>K</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Kansha Admin</span>
              <span className={styles.userRole}>Manager</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;