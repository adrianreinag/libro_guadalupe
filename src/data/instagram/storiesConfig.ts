// Configuración de historias programadas para Instagram
// Cada historia tiene un ID único, fecha de inicio y fin de publicación

export interface HistoriaItemConfig {
  id: string; // ID único de la historia (usado para rastrear si fue vista)
  tipo: 'imagen' | 'video';
  url: string;
  duration: number; // Duración en segundos que se mostrará la historia
  startDate: Date; // Fecha y hora de inicio de publicación
  endDate: Date; // Fecha y hora de fin de publicación
}

export interface StoryUserConfig {
  userId: string; // ID único del usuario
  imagenPerfil: string;
  nombreUsuario: string;
  mejorAmigo?: boolean;
  historias: HistoriaItemConfig[];
}

// Helper para crear fechas fácilmente
// Uso: createDate('2025-10-20', '10:00')
export const createDate = (dateStr: string, timeStr: string = '00:00'): Date => {
  return new Date(`${dateStr}T${timeStr}:00`);
};

// Configuración de todas las historias
export const storiesConfig: StoryUserConfig[] = [
  {
    userId: 'donjesusobispo',
    imagenPerfil: '/assets/instagram/profiles/Don_Jesus_Avatar.jpg',
    nombreUsuario: 'donjesusobispo',
    mejorAmigo: false,
    historias: [
      {
        id: 'donjesus_catedral_1',
        tipo: 'video',
        url: '/assets/instagram/stories/Don_Jesus_Story.mp4',
        duration: 95,
        startDate: createDate('2025-10-23', '17:00'),
        endDate: createDate('2025-10-28', '23:59'),
      }
    ],
  },
  {
    userId: 'sancarloacutis',
    imagenPerfil: '/assets/instagram/profiles/Carlo_Acutis_Avatar.jpg',
    nombreUsuario: 'sancarloacutis',
    mejorAmigo: true,
    historias: [
      {
        id: 'carloacutis_catedral_1',
        tipo: 'imagen',
        url: '/assets/instagram/stories/Carlo_Acutis_Story_Catedral.webp',
        duration: 15,
        startDate: createDate('2025-10-24', '01:23'),
        endDate: createDate('2025-10-25', '05:00'),
      },
      {
        id: 'carloacutis_camino_1',
        tipo: 'imagen',
        url: '/assets/instagram/stories/Carlo_Acutis_Story_Camino.jpeg',
        duration: 15,
        startDate: createDate('2025-10-24', '01:25'),
        endDate: createDate('2025-10-25', '18:00'),
      },
      {
        id: 'carloacutis_adoracion_1',
        tipo: 'imagen',
        url: '/assets/instagram/stories/Carlo_Acutis_Story_Eucaristia.jpeg',
        duration: 15,
        startDate: createDate('2025-10-24', '21:00'),
        endDate: createDate('2025-10-25', '21:00'),
      },
      {
        id: 'carloacutis_virgen_1',
        tipo: 'imagen',
        url: '/assets/instagram/stories/Carlo_Acutis_Story_Maria.jpeg',
        duration: 15,
        startDate: createDate('2025-10-25', '20:00'),
        endDate: createDate('2025-10-26', '20:00'),
      },
    ],
  },
  {
    userId: 'delejuventud',
    imagenPerfil: '/assets/instagram/profiles/La_Dele_Avatar.png',
    nombreUsuario: 'delejuventud',
    mejorAmigo: false,
    historias: [
      {
        id: 'dele_fotografia_1',
        tipo: 'imagen',
        url: '/assets/instagram/stories/La_Dele_Story_Fotos.jpeg',
        duration: 15,
        startDate: createDate('2025-10-24', '12:00'),
        endDate: createDate('2025-10-25', '23:59'),
      },
      {
        id: 'dele_talent_1',
        tipo: 'imagen',
        url: '/assets/instagram/stories/La_Dele_Story_GodTalent.jpeg',
        duration: 15,
        startDate: createDate('2025-10-24', '12:00'),
        endDate: createDate('2025-10-25', '23:59'),
      },
    ],
  },
];

export const getActiveStories = (now: Date = new Date()): StoryUserConfig[] => {
  console.log('\n=== DIAGNÓSTICO DE HISTORIAS PROGRAMADAS ===');
  console.log('Fecha/Hora actual:', now.toLocaleString('es-ES', { timeZone: 'UTC' }));
  console.log('Fecha/Hora actual (ISO):', now.toISOString());
  console.log('\n--- TODAS LAS HISTORIAS CONFIGURADAS ---');

  let totalHistorias = 0;
  let historiasActivas = 0;
  let historiasInactivas = 0;

  storiesConfig.forEach(user => {
    console.log(`\n👤 Usuario: ${user.nombreUsuario} (${user.userId})`);
    console.log(`   Total de historias configuradas: ${user.historias.length}`);

    user.historias.forEach((historia, index) => {
      totalHistorias++;
      const isActive = now >= historia.startDate && now <= historia.endDate;
      const startCheck = now >= historia.startDate;
      const endCheck = now <= historia.endDate;

      console.log(`\n   📖 Historia #${index + 1}: ${historia.id}`);
      console.log(`      Tipo: ${historia.tipo}`);
      console.log(`      URL: ${historia.url}`);
      console.log(`      Inicio: ${historia.startDate.toLocaleString('es-ES', { timeZone: 'UTC' })} (${historia.startDate.toISOString()})`);
      console.log(`      Fin: ${historia.endDate.toLocaleString('es-ES', { timeZone: 'UTC' })} (${historia.endDate.toISOString()})`);
      console.log(`      ✓ Verificación de inicio (now >= startDate): ${startCheck} ${startCheck ? '✅' : '❌'}`);
      console.log(`      ✓ Verificación de fin (now <= endDate): ${endCheck} ${endCheck ? '✅' : '❌'}`);
      console.log(`      ⭐ ACTIVA: ${isActive ? 'SÍ ✅ (SE MOSTRARÁ)' : 'NO ❌ (NO SE MOSTRARÁ)'}`);

      if (isActive) {
        historiasActivas++;
      } else {
        historiasInactivas++;
      }
    });
  });

  console.log('\n--- RESUMEN GENERAL ---');
  console.log(`📊 Total de historias configuradas: ${totalHistorias}`);
  console.log(`✅ Historias activas (se mostrarán): ${historiasActivas}`);
  console.log(`❌ Historias inactivas (NO se mostrarán): ${historiasInactivas}`);

  const result = storiesConfig
    .map(user => ({
      ...user,
      historias: user.historias.filter(historia => {
        const isActive = now >= historia.startDate && now <= historia.endDate;
        return isActive;
      }),
    }))
    .filter(user => user.historias.length > 0); // Solo usuarios con historias activas

  console.log(`\n👥 Usuarios con historias activas: ${result.length}`);
  result.forEach(user => {
    console.log(`   - ${user.nombreUsuario}: ${user.historias.length} historia(s) activa(s)`);
  });
  console.log('=== FIN DEL DIAGNÓSTICO ===\n');

  return result;
};
