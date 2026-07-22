/**
 * PÁGINA PÚBLICA DE EXIBIÇÃO DA FILA
 * Copie para: src/app/senhas/page.tsx
 * 
 * Tema escuro (glassmorphism) para exibição pública no terreiro.
 */

import DisplaySenha from "@/components/senhas/DisplaySenha";
import { Clock, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fila de Atendimento | T. U. Senhora do Rosário",
  description: "Acompanhe a fila de atendimento do terreiro em tempo real.",
};

export default function SenhasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0D0B08] px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-inter text-[#FAF5EC]/60 hover:text-[#FAF5EC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
          <div className="flex items-center gap-2 text-[#C9A227]">
            <Users className="w-4 h-4" />
            <span className="text-xs font-inter tracking-wider">AO VIVO</span>
          </div>
        </div>
      </div>

      {/* Display */}
      <DisplaySenha />

      {/* Footer */}
      <div className="mt-12 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#C9A227]">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-inter tracking-[0.2em] uppercase">
            Terreiro de Umbanda Senhora do Rosário
          </span>
        </div>
        <p className="text-xs font-inter text-[#FAF5EC]/30">
          Atualiza automaticamente em tempo real
        </p>
      </div>
    </main>
  );
}
