import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/authForm.module.css';
interface FormState {
  username: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const { login, error } = useAuth();
  const [form, setForm] = useState<FormState>({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const toast = useRef<Toast | null>(null);
  const userRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => userRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const usernameError =
    showErrors && !form.username.trim() ? "Nom d'utilisateur requis" : null;
  const passwordError =
    showErrors && !form.password.trim() ? 'Mot de passe requis' : null;
  const hasFormError = !!usernameError || !!passwordError;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(true);
    if (hasFormError || !form.username.trim() || !form.password.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Champs requis',
        detail: 'Veuillez remplir les deux champs',
      });
      return;
    }
    setSubmitting(true);
    try {
      await login({ username: form.username.trim(), password: form.password });
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Connexion réussie',
      });
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Identifiants invalides',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const header = (
    <div className={styles.header}>
      <h1 className={styles.title}>Connexion</h1>
      <p className={styles.subtitle}>Accédez à votre espace</p>
    </div>
  );

  return (
    <div className={styles.screen}>
      <Toast ref={toast} />
      <Card header={header} className={styles.card}>
        <form
          onSubmit={onSubmit}
          noValidate
          aria-label="Formulaire de connexion"
          className={styles.form}
        >
          {/* Username */}
          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>
              Nom d&apos;utilisateur
            </label>
            <InputText
              id="username"
              ref={userRef}
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              onBlur={() => setShowErrors((v) => v || !form.username.trim())}
              placeholder="ex: admin"
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? 'username-help' : undefined}
              className={`${styles.input} ${
                usernameError ? styles.inputInvalid : ''
              }`}
              autoComplete="username"
              disabled={submitting}
            />
            {usernameError && (
              <small
                id="username-help"
                className={styles.errorMsg}
                role="alert"
              >
                {usernameError}
              </small>
            )}
          </div>

          {/* Password */}
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Mot de passe
            </label>
            <Password
              id="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              onBlur={() => setShowErrors((v) => v || !form.password.trim())}
              onKeyDown={(e) => {
                if (e.key === 'Enter')
                  onSubmit(e as unknown as React.FormEvent);
              }}
              placeholder="Mot de passe"
              feedback={false}
              toggleMask
              inputClassName={`${styles.input} ${
                passwordError ? styles.inputInvalid : ''
              }`}
              pt={{ panel: { className: styles.passwordPanel } }}
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'password-help' : undefined}
              disabled={submitting}
            />
            {passwordError && (
              <small
                id="password-help"
                className={styles.errorMsg}
                role="alert"
              >
                {passwordError}
              </small>
            )}
          </div>

          {/* Global auth error */}
          {error && !hasFormError && (
            <div role="alert" className={styles.globalError}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            label={submitting ? 'Connexion...' : 'Se connecter'}
            loading={submitting}
            disabled={
              submitting ||
              hasFormError ||
              !form.username.trim() ||
              !form.password.trim()
            }
            className={styles.submitBtn}
          />

          <p className={styles.note}>
            Démonstration mock : identifiants libres (non vides).
          </p>
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;
