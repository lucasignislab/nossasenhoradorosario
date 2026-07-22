import { Link } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DisplaySenha from "@/components/senhas/DisplaySenha";
import { Monitor, BarChart3, History, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-sacred-dark">
      <Header />
      
      {/* Espaço para header fixed */}
      <div className="h-20" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 gradient-sacred" />
          <div className="relative max-w-4xl mx-auto text-center space-y-4">
            <p className="text-sm font-body tracking-[0.3em] uppercase text-sacred-gold">
              Sistema de Gestão de Senhas
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl text-sacred-cream">
              Terreiro de Umbanda
              <span className="block text-sacred-gold">Senhora do Rosário</span>
            </h1>
            <p className="text-sacred-cream/60 font-body max-w-lg mx-auto">
              Organização e harmonia no acolhimento dos filhos e consulentes.
              Tecnologia a serviço da espiritualidade.
            </p>
          </div>
        </section>

        {/* Display de Senha Público */}
        <section className="px-4 pb-8">
          <div className="max-w-2xl mx-auto">
            <DisplaySenha />
          </div>
        </section>

        {/* Links Rápidos */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/painel"
                className="group glass-sacred rounded-sm p-6 space-y-3 hover:border-sacred-gold/40 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-sacred-gold/10 flex items-center justify-center
                              group-hover:bg-sacred-gold/20 transition-all">
                  <Monitor className="w-6 h-6 text-sacred-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-sacred-cream group-hover:text-sacred-gold transition-colors">
                    Painel de Controle
                  </h3>
                  <p className="text-sm font-body text-sacred-cream/50">
                    Gerencie filas, chame senhas e controle atendimentos
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sacred-gold text-sm font-body">
                  Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/historico"
                className="group glass-sacred rounded-sm p-6 space-y-3 hover:border-sacred-gold/40 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-sacred-gold/10 flex items-center justify-center
                              group-hover:bg-sacred-gold/20 transition-all">
                  <History className="w-6 h-6 text-sacred-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-sacred-cream group-hover:text-sacred-gold transition-colors">
                    Histórico
                  </h3>
                  <p className="text-sm font-body text-sacred-cream/50">
                    Consulte todos os atendimentos realizados
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sacred-gold text-sm font-body">
                  Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/relatorios"
                className="group glass-sacred rounded-sm p-6 space-y-3 hover:border-sacred-gold/40 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-sacred-gold/10 flex items-center justify-center
                              group-hover:bg-sacred-gold/20 transition-all">
                  <BarChart3 className="w-6 h-6 text-sacred-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-sacred-cream group-hover:text-sacred-gold transition-colors">
                    Relatórios
                  </h3>
                  <p className="text-sm font-body text-sacred-cream/50">
                    Estatísticas e análise de fluxo de atendimentos
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sacred-gold text-sm font-body">
                  Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
