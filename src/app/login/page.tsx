'use client';

import { LoginForm } from '@/components/features/LoginForm';

export default function LoginPage() {
  const handleSubmit = (data: { email: string; password: string }) => {
    console.log('Login attempt:', data);
    // TODO: Integrar com Supabase Auth
    // const { data: authData, error } = await supabase.auth.signInWithPassword({
    //   email: data.email,
    //   password: data.password,
    // });
  };

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    // TODO: Integrar com Supabase OAuth
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    // });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <LoginForm
        mode="login"
        onSubmit={handleSubmit}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
}
