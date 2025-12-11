// src/components/navbar/Navbar.tsx
import React, { useState } from "react";
import styles from "./Navbar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../lib/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/user");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarInner}>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>Kansha Admin Panel</span>
          <span className={styles.brandSubtitle}>
            Premium Taste · Simple Price · Fast &amp; Fresh
          </span>
        </div>

        {/* Desktop */}
        <div className={styles.actionsDesktop}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleProfileClick}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile */}
        <div className={styles.actionsMobile}>
          <button
            type="button"
            className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.mobileMenuToggleOpen : ""
              }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle user menu"
          >
            <span className={styles.mobileMenuToggleBar} />
            <span className={styles.mobileMenuToggleBar} />
          </button>

          <div
            className={`${styles.mobileMenuDropdown} ${isMobileMenuOpen ? styles.mobileMenuDropdownOpen : ""
              }`}
          >
            <button
              type="button"
              className={styles.mobileMenuItem}
              onClick={handleProfileClick}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </button>
            <button
              type="button"
              className={styles.mobileMenuItem}
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;