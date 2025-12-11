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
      <div className={styles.sidebar__inner}>
        <div className={styles.sidebar__logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Kansha</span>
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

        <div className={styles.sidebar__footer}>
          <p className={styles.versionText}>v1.0 · 2026</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;