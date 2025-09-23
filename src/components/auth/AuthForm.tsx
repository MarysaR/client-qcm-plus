import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/AuthContext';
interface FormState {
  username: string;
  password: string;
}

const initial: FormState = { username: '', password: '' };

const AuthForm: React.FC = () => {
  const { login, error } = useAuth();
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast | null>(null);

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Champs requis',
        detail: 'Veuillez remplir tous les champs',
      });
      return;
    }
    setSubmitting(true);
    try {
      await login(form);
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

  return (
    <div className="w-full max-w-sm mx-auto">
      <Toast ref={toast} />
      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-white p-6 rounded shadow border"
      >
        <h1 className="text-xl font-semibold text-center">Connexion</h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium">
            Nom dutilisateur
          </label>
          <InputText
            id="username"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            autoComplete="username"
            className="w-full"
            placeholder="admin"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Password
            id="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            toggleMask
            feedback={false}
            inputClassName="w-full"
            placeholder="REMOVED"
          />
        </div>

        {error && <div className="text-red-600 text-sm -mt-2">{error}</div>}

        <Button
          type="submit"
          label={submitting ? 'Connexion...' : 'Se connecter'}
          loading={submitting}
          className="w-full"
        />

        <p className="text-xs text-gray-500 text-center">
          Utilisateurs mock: admin/REMOVED ou user/REMOVED
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
