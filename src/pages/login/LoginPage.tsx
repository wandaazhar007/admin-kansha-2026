// src/pages/login/LoginPage.tsx
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import styles from "./LoginPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Jika sudah login, jangan biarkan di halaman login
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!password.trim()) {
      newErrors.password = "Password wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const isValid = validate();
    if (!isValid) return;

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Login error:", err);
      // Tandai error general (email / password salah)
      setErrors({
        general: "Email atau password salah. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const emailHasError = !!errors.email || !!errors.general;
  const passwordHasError = !!errors.password || !!errors.general;

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <img
            src="/logo-kansha-hibachi-sushi.png"
            alt="Kansha Hibachi & Sushi"
            className={styles.logo}
          />
        </div>

        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>
          Masuk untuk mengelola menu hibachi &amp; sushi di website Kansha.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <div
              className={`${styles.inputWrapper} ${emailHasError ? styles.inputWrapperError : ""
                }`}
            >
              <span className={styles.inputIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="admin@kansha.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className={styles.fieldErrorText}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="password">
              Password
            </label>
            <div
              className={`${styles.inputWrapper} ${passwordHasError ? styles.inputWrapperError : ""
                }`}
            >
              <span className={styles.inputIcon}>
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className={styles.fieldErrorText}>{errors.password}</p>
            )}
            {/* Error general (email/password salah) ditampilkan di bawah password */}
            {!errors.password && errors.general && (
              <p className={styles.fieldErrorText}>{errors.general}</p>
            )}
          </div>

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

        <p className={styles.footerNote}>
          &copy; {new Date().getFullYear()} Kansha Hibachi &amp; Sushi · Admin
          Dashboard
        </p>
      </div>
    </div>
  );
}