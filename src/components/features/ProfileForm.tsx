'use client';

import { useActionState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { updateProfile, type ProfileFormState } from '@/app/(auth)/dashboard/perfil/actions';

type ProfileFormProps = {
  fullName: string;
  phone: string;
  email: string;
  role: 'member' | 'admin' | 'developer';
  joinedAt: string | null;
};

const initialState: ProfileFormState = { status: 'idle', message: '' };
const roleNames = { member: 'Filho da casa', admin: 'Administração', developer: 'Acesso técnico' };

export function ProfileForm({ fullName, phone, email, role, joinedAt }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <p className="dashboard-home__eyebrow">Sua identidade na comunidade</p>
        <h1>Meu perfil</h1>
        <p>Mantenha seus dados de contato atualizados para receber os avisos da casa.</p>
      </header>

      <div className="profile-page__layout profile-page__layout--classic">
        <form action={formAction} className="profile-page__form">
          <div className="profile-page__field">
            <label htmlFor="fullName">Nome</label>
            <input id="fullName" name="fullName" defaultValue={fullName} minLength={3} maxLength={120} required />
          </div>
          <div className="profile-page__field">
            <label htmlFor="phone">WhatsApp</label>
            <input id="phone" name="phone" type="tel" defaultValue={phone} placeholder="(11) 99999-9999" />
          </div>
          <div className="profile-page__field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} disabled />
            <small>O e-mail de acesso será alterado com confirmação em uma próxima etapa.</small>
          </div>
          <div className="profile-page__field">
            <label htmlFor="access">Acesso</label>
            <input id="access" value={roleNames[role]} disabled />
            {joinedAt && <small>Na casa desde {new Intl.DateTimeFormat('pt-BR').format(new Date(`${joinedAt}T12:00:00`))}</small>}
          </div>

          {state.message && (
            <p className={`profile-page__message is-${state.status}`} role={state.status === 'error' ? 'alert' : 'status'}>
              {state.message}
            </p>
          )}

          <button type="submit" disabled={pending}>
            {pending ? <LoaderCircle className="login-form__spinner" size={17} /> : <Save size={17} />}
            {pending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
