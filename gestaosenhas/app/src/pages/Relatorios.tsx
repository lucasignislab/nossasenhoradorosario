import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Estatisticas from "@/components/senhas/Estatisticas";
import { BarChart3 } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sacred-dark">
      <Header />
      <div className="h-20" />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sacred-gold">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-body tracking-[0.2em] uppercase">Análise</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-sacred-cream">Relatórios</h1>
            <p className="text-sacred-cream/50 font-body text-sm max-w-md mx-auto">
              Acompanhe as métricas de atendimento e o fluxo de pessoas no terreiro.
            </p>
          </div>

          <Estatisticas />
        </div>
      </main>

      <Footer />
    </div>
  );
}
