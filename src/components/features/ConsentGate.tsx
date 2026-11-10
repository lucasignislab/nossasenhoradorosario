'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { acceptTerms } from '@/app/(auth)/dashboard/legal-actions';

/** Bloqueio LGPD: exigido de quem ainda não aceitou a versão vigente dos termos. */
export function ConsentGate() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const accept = () => {
    setError(null);
    startTransition(async () => {
      const result = await acceptTerms();
      if (!result.ok) setError('Não foi possível registrar o aceite. Tente novamente.');
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation">
      <div className="portal-modal consent-gate" role="dialog" aria-modal="true" aria-label="Termos de uso e privacidade">
        <div className="consent-gate__icon"><ShieldCheck size={26} /></div>
        <h2>Termos de uso e privacidade</h2>
        <p>
          Para continuar usando a área dos filhos, confirme que leu e aceita os{' '}
          <Link href="/termos" target="_blank">Termos de Uso</Link> e a{' '}
          <Link href="/privacidade" target="_blank">Política de Privacidade</Link> da casa (LGPD).
          Seus dados são usados somente para a organização e o cuidado da comunidade.
        </p>
        {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
        <button type="button" className="portal-button portal-button--primary" onClick={accept} disabled={isPending}>
          <Check size={15} /> {isPending ? 'Registrando…' : 'Li e aceito'}
        </button>
        <small className="consent-gate__note">O aceite fica registrado com data e versão no seu cadastro.</small>
      </div>
    </div>
  );
}
