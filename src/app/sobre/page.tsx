import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/footer";
import { ContentSection } from "@/components/sections/content-section/content-section";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Banner de Título Simples */}
      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-slate-900 font-serif">Nossa História</h1>
          <p className="text-xl text-slate-500 mt-4 max-w-2xl">
            Conheça os fundamentos e a jornada do Terreiro Axé na disseminação da caridade e do amor.
          </p>
        </div>
      </section>

      {/* Seção 1: O Início */}
      <ContentSection 
        title="Fundação e Propósito"
        image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800"
        text="Fundado em 1998, o Terreiro Axé nasceu do desejo de criar um porto seguro para todos os que buscam auxílio espiritual e autoconhecimento. 
        
        Seguimos a Umbanda de base cristã, focada no trabalho dos guias e mentores para a evolução de encarnados e desencarnados. Nossa missão é ser um farol de luz na comunidade."
      />

      {/* Seção 2: Nossos Valores (Invertida) */}
      <ContentSection 
        reverse
        title="Nossos Pilares"
        image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
        text="Respeito, Humildade e Caridade. No Terreiro Axé, acreditamos que a espiritualidade se vive no dia a dia, no trato com o próximo e no respeito à natureza.
        
        Nenhum trabalho é cobrado. Acreditamos que o que recebemos de graça, de graça devemos dar, mantendo a tradição purista dos nossos antepassados espirituais."
      />



      <Footer />
    </main>
  );
}