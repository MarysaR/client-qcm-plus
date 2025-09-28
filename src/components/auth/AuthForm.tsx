import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/authForm.module.css';

interface FormState {
  email: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const toast = useRef<Toast | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => emailRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const emailError =
    showErrors && !form.email.trim() ? 'Adresse email requise' : null;
  const passwordError =
    showErrors && !form.password.trim() ? 'Mot de passe requis' : null;
  const hasFormError = !!emailError || !!passwordError;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(true);

    if (hasFormError) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Champs requis',
        detail: 'Veuillez remplir les deux champs',
      });
      return;
    }

    setSubmitting(true);

    const result = await login(form.email.trim(), form.password);

    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Connexion réussie',
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
      });
    }

    setSubmitting(false);
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
          {/* Email */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Adresse email
            </label>
            <InputText
              id="email"
              ref={emailRef}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => setShowErrors((v) => v || !form.email.trim())}
              placeholder="ex: admin@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-help' : undefined}
              className={`${styles.input} ${
                emailError ? styles.inputInvalid : ''
              }`}
              autoComplete="email"
              disabled={submitting}
            />
            {emailError && (
              <small id="email-help" className={styles.errorMsg} role="alert">
                {emailError}
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

          <Button
            type="submit"
            label={submitting ? 'Connexion...' : 'Se connecter'}
            loading={submitting}
            disabled={
              submitting ||
              hasFormError ||
              !form.email.trim() ||
              !form.password.trim()
            }
            className={styles.submitBtn}
          />
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;
