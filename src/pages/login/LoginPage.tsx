// src/pages/login/LoginPage.tsx
import React, { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import styles from "./LoginPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kalau sudah login dan buka /login, langsung arahkan ke /dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("Email atau password salah. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.leftPanel}>
        <div className={styles.brandBox}>
          <img
            src="/logo-kansha-hibachi-sushi.png"
            alt="Kansha Hibachi & Sushi"
            className={styles.logo}
          />
          <h1 className={styles.brandTitle}>Kansha Hibachi &amp; Sushi</h1>
          <p className={styles.brandTagline}>
            Premium Taste, Simple Price, Fast &amp; Fresh
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Admin Login</h2>
          <p className={styles.formSubtitle}>
            Masuk untuk mengelola menu hibachi &amp; sushi di website utama.
          </p>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  placeholder="admin@kansha.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Password</span>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? "Sedang masuk..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <p className={styles.helperText}>
            Akun admin dibuat melalui Firebase Console. Hubungi owner jika kamu
            belum memiliki akses.
          </p>
        </div>

        <p className={styles.footerNote}>
          &copy; {new Date().getFullYear()} Kansha Hibachi &amp; Sushi. Admin
          Dashboard.
        </p>
      </div>
    </div>
  );
}