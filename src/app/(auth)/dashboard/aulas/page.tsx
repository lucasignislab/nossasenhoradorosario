'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VideoPlayer } from '@/components/features/VideoPlayer';

export default function AulasPage() {
  const user = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Exemplo de aulas (em produção, viriam do Supabase)
  const categories = [
    {
      name: 'Desenvolvimento Mediúnico',
      aulas: [
        {
          id: 1,
          title: 'Fundamentos da Mediunidade',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Aprenda os conceitos básicos de mediunidade e como desenvolver seus dons.',
          downloads: [
            { name: 'Roteiro-Aula-1.pdf', url: '#' },
            { name: 'Exercicios.pdf', url: '#' },
          ],
        },
      ],
    },
    {
      name: 'Ervas Sagradas',
      aulas: [
        {
          id: 2,
          title: 'Ervas na Umbanda',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Conheça as principais ervas usadas nos rituais espirituais.',
          downloads: [
            { name: 'Lista-Ervas.pdf', url: '#' },
            { name: 'Propriedades.pdf', url: '#' },
          ],
        },
      ],
    },
    {
      name: 'Cantigas',
      aulas: [
        {
          id: 3,
          title: 'Cantigas Sagradas',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Aprenda as principais cantigas da Umbanda.',
          downloads: [
            { name: 'Letra-Cantigas.pdf', url: '#' },
          ],
        },
      ],
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '30px', color: '#2c1810' }}>📚 Aulas e Conteúdo</h1>

        {categories.map((category) => (
          <div key={category.name} style={{ marginBottom: '50px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#2c1810',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #d4a574',
              }}
            >
              {category.name}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
                gap: '30px',
              }}
            >
              {category.aulas.map((aula) => (
                <VideoPlayer
                  key={aula.id}
                  videoUrl={aula.videoUrl}
                  title={aula.title}
                  description={aula.description}
                  downloads={aula.downloads}
                  category={category.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
