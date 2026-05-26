import { Header } from "@/components/layout/header/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/footer/footer";
import { ContentSection } from "@/components/sections/content-section/content-section";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Cabeçalho */}
      <Header />

      {/* Hero Section Cinemática Consistente com a Home */}
      <Hero
        title="Nossa História"
        subtitle="Conheça os fundamentos e a jornada do T. U. Senhora do Rosário na disseminação da caridade, amor e evolução espiritual."
        buttonLabel="Conhecer Nossa Jornada"
        buttonHref="#jornada"
        backgroundImage="https://images.unsplash.com/photo-1601314167099-232775b3ee61?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Seção 1: O Início */}
      <ContentSection 
        id="jornada"
        title="Fundação e Propósito"
        image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800"
        text="Fundado em 1998, o T. U. Senhora do Rosário nasceu do desejo de criar um porto seguro para todos os que buscam auxílio espiritual e autoconhecimento. 
        
        Seguimos a Umbanda de base cristã, focada no trabalho dos guias e mentores para a evolução de encarnados e desencarnados. Nossa missão é ser um farol de luz na comunidade."
      />

      {/* Seção 2: Nossos Valores (Invertida) */}
      <ContentSection 
        reverse
        title="Nossos Pilares"
        image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
        text="Respeito, Humildade e Caridade. No T. U. Senhora do Rosário, acreditamos que a espiritualidade se vive no dia a dia, no trato com o próximo e no respeito à natureza.
        
        Nenhum trabalho é cobrado. Acreditamos que o que recebemos de graça, de graça devemos dar, mantendo a tradição purista dos nossos antepassados espirituais."
      />

      {/* Rodapé */}
      <Footer />
    </main>
  );
}