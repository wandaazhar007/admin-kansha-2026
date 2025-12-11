import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBowlFood,
  faLayerGroup,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        <div className={styles.logoRow}>
          <img
            src="/logo-kansha-hibachi-sushi.png"
            alt="Kansha Hibachi & Sushi"
            className={styles.logoImage}
          />
          <div className={styles.logoTextBlock}>
            <span className={styles.logoTitle}>Kansha</span>
            <span className={styles.logoSubtitle}>Admin Panel</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <span className={styles.navLabel}>Main</span>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <FontAwesomeIcon icon={faGauge} className={styles.navIcon} />
            <span>Dashboard</span>
          </NavLink>

          <span className={styles.navLabel}>Management</span>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <FontAwesomeIcon icon={faBowlFood} className={styles.navIcon} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <FontAwesomeIcon icon={faLayerGroup} className={styles.navIcon} />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <FontAwesomeIcon icon={faUserGroup} className={styles.navIcon} />
            <span>Users</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <p className={styles.versionText}>© 2026 · Kansha Admin</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;