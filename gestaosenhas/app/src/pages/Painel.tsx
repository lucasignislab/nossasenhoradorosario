import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PainelControle from "@/components/senhas/PainelControle";
import FormularioSenha from "@/components/senhas/FormularioSenha";
import { Monitor } from "lucide-react";

export default function Painel() {
  return (
    <div className="min-h-screen flex flex-col bg-sacred-dark">
      <Header />
      <div className="h-20" />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sacred-gold">
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-body tracking-[0.2em] uppercase">
                Área Administrativa
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-sacred-cream">
              Painel de Controle
            </h1>
            <p className="text-sacred-cream/50 font-body text-sm max-w-md mx-auto">
              Gerencie as filas de atendimento, chame senhas e acompanhe o fluxo em tempo real.
            </p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda - Controle */}
            <div>
              <PainelControle />
            </div>

            {/* Coluna Direita - Nova Senha */}
            <div>
              <div className="space-y-6">
                <FormularioSenha />
                
                {/* Dicas */}
                <div className="glass-dark rounded-sm p-6 space-y-3">
                  <h3 className="font-heading text-sm text-sacred-gold">Instruções</h3>
                  <ul className="space-y-2 text-sm font-body text-sacred-cream/50">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sacred-gold mt-1.5 shrink-0" />
                      Clique em "Chamar Próxima" para chamar a próxima senha da fila ativa
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sacred-gold mt-1.5 shrink-0" />
                      Use "Finalizar e Chamar" para encerrar o atual e chamar o próximo de uma vez
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sacred-gold mt-1.5 shrink-0" />
                      A fila ativa pode ser trocada a qualquer momento sem perder as senhas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sacred-gold mt-1.5 shrink-0" />
                      O botão "Chamar por Voz" na tela principal faz a chamada sonora
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
