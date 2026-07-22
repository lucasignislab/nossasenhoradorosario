'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, ShieldCheck, UsersRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import '../../styles/login-form.css';

type AuthFormProps = {
  configured: boolean;
  previewEnabled: boolean;
  returnTo: string;
};

type Mode = 'login' | 'signup';

const errorMessages: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
  'User already registered': 'Já existe uma conta com este e-mail.',
  'Password should be at least 6 characters': 'A senha precisa ter pelo menos 8 caracteres.',
};

export function AuthForm({ configured, previewEnabled, returnTo }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      if (mode === 'signup') {
        const confirmPassword = String(form.get('confirmPassword') ?? '');
        if (password !== confirmPassword) {
          setError('As senhas informadas não são iguais.');
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
            data: {
              full_name: String(form.get('fullName') ?? '').trim(),
              phone: String(form.get('phone') ?? '').trim(),
            },
          },
        });

        if (signUpError) throw signUpError;
        setSuccess(
          'Cadastro recebido. Confira seu e-mail e, depois da confirmação, aguarde a aprovação da casa.',
        );
        event.currentTarget.reset();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      router.replace(returnTo);
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : '';
      setError(errorMessages[message] ?? 'Não foi possível continuar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-form">
      <Link href="/" className="login-form__back">
        <ArrowLeft size={18} aria-hidden="true" />
        Voltar ao site
      </Link>

      <section className="login-form__container" aria-labelledby="auth-title">
        <div className="login-form__brand" aria-hidden="true">SR</div>
        <div className="login-form__header">
          <p className="login-form__eyebrow">Área reservada</p>
          <h1 id="auth-title" className="login-form__title">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Faça parte da nossa casa'}
          </h1>
          <p className="login-form__subtitle">
            {mode === 'login'
              ? 'Entre para acessar sua rotina e os comunicados internos.'
              : 'Crie seu acesso. Todo novo cadastro passa pela aprovação da casa.'}
          </p>
        </div>

        {!configured && (
          <div className="login-form__notice" role="status">
            A estrutura está pronta. Para ativar os acessos, configure as credenciais do Supabase no arquivo <code>.env.local</code>.
          </div>
        )}

        {previewEnabled && (
          <section className="login-form__preview" aria-labelledby="preview-title">
            <div className="login-form__preview-heading">
              <p className="login-form__eyebrow">Demonstração local</p>
              <h2 id="preview-title">Explore sem fazer cadastro</h2>
              <p>Entre com dados demonstrativos para acompanhar o visual que está sendo construído.</p>
            </div>
            <div className="login-form__preview-actions">
              <Link href="/portal-preview/dashboard" className="login-form__preview-link">
                <UsersRound size={18} aria-hidden="true" />
                <span><strong>Área dos filhos</strong><small>Agenda, estudos e mensalidades</small></span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/portal-preview/admin" className="login-form__preview-link">
                <ShieldCheck size={18} aria-hidden="true" />
                <span><strong>Administração</strong><small>Gestão, financeiro e frequência</small></span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        <div className="login-form__tabs" aria-label="Escolha uma opção">
          <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => switchMode('login')}>
            Entrar
          </button>
          <button type="button" className={mode === 'signup' ? 'is-active' : ''} onClick={() => switchMode('signup')}>
            Criar acesso
          </button>
        </div>

        {success && <div className="login-form__success" role="status">{success}</div>}
        {error && <div className="login-form__error" role="alert">{error}</div>}

        <form className="login-form__form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="login-form__group">
                <label htmlFor="fullName" className="login-form__label">Nome completo</label>
                <input className="login-form__input" id="fullName" name="fullName" autoComplete="name" required minLength={3} />
              </div>
              <div className="login-form__group">
                <label htmlFor="phone" className="login-form__label">WhatsApp</label>
                <input className="login-form__input" id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" />
              </div>
            </>
          )}

          <div className="login-form__group">
            <label htmlFor="email" className="login-form__label">E-mail</label>
            <input className="login-form__input" id="email" name="email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" required />
          </div>

          <div className="login-form__group">
            <label htmlFor="password" className="login-form__label">Senha</label>
            <div className="login-form__password">
              <input className="login-form__input" id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="login-form__group">
              <label htmlFor="confirmPassword" className="login-form__label">Confirme a senha</label>
              <input className="login-form__input" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
            </div>
          )}

          <button type="submit" className="login-form__submit" disabled={loading || !configured}>
            {loading && <LoaderCircle className="login-form__spinner" size={18} aria-hidden="true" />}
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar na área dos filhos' : 'Enviar meu cadastro'}
          </button>
        </form>

        <p className="login-form__privacy">
          Seus dados são usados somente para a organização e o cuidado da nossa comunidade.
        </p>
      </section>
    </main>
  );
}
