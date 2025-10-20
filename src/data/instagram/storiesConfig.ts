// Configuración de historias programadas para Instagram
// Cada historia tiene un ID único, fecha de inicio y fin de publicación

export interface HistoriaItemConfig {
  id: string; // ID único de la historia (usado para rastrear si fue vista)
  tipo: 'imagen' | 'video';
  url: string;
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
    imagenPerfil: '/assets/instagram/stories/Don_Jesus_Avatar.jpg',
    nombreUsuario: 'donjesusobispo',
    mejorAmigo: false,
    historias: [
      {
        id: 'donjesus_oracion_1',
        tipo: 'imagen',
        url: '/assets/instagram/posts/oracion.jpg',
        startDate: createDate('2025-10-15', '08:00'), // Inicia el 15 de octubre a las 8am
        endDate: createDate('2025-10-25', '23:59'),   // Termina el 25 de octubre
      },
      // Puedes agregar más historias para Don Jesús aquí
      // {
      //   id: 'donjesus_otra_historia',
      //   tipo: 'imagen',
      //   url: '/assets/instagram/posts/otra.jpg',
      //   startDate: createDate('2025-10-20', '12:00'),
      //   endDate: createDate('2025-10-30', '23:59'),
      // },
    ],
  },
  {
    userId: 'sancarloacutis',
    imagenPerfil: '/assets/instagram/stories/Carlo_Acutis_Avatar.jpg',
    nombreUsuario: 'sancarloacutis',
    mejorAmigo: true,
    historias: [
      {
        id: 'carloacutis_devocionario_1',
        tipo: 'imagen',
        url: '/assets/instagram/posts/devocionario.jpg',
        startDate: createDate('2025-10-15', '09:00'),
        endDate: createDate('2025-10-26', '23:59'),
      },
      // Más historias para Carlo Acutis
    ],
  },
  {
    userId: 'delejuventud',
    imagenPerfil: '/assets/instagram/stories/La_Dele_Avatar.png',
    nombreUsuario: 'delejuventud',
    mejorAmigo: false,
    historias: [
      {
        id: 'dele_oracion_1',
        tipo: 'imagen',
        url: '/assets/instagram/posts/oracion.jpg',
        startDate: createDate('2025-10-15', '10:00'),
        endDate: createDate('2025-10-24', '23:59'),
      },
      {
        id: 'dele_devocionario_1',
        tipo: 'imagen',
        url: '/assets/instagram/posts/devocionario.jpg',
        startDate: createDate('2025-10-16', '10:00'),
        endDate: createDate('2025-10-27', '23:59'),
      },
      // Puedes agregar muchas más historias para Dele Juventud
      // {
      //   id: 'dele_historia_3',
      //   tipo: 'imagen',
      //   url: '/assets/instagram/posts/ubicaciones.jpg',
      //   startDate: createDate('2025-10-18', '15:00'),
      //   endDate: createDate('2025-10-28', '23:59'),
      // },
    ],
  },
];

// Función para obtener historias activas (dentro del rango de tiempo)
export const getActiveStories = (now: Date = new Date()): StoryUserConfig[] => {
  return storiesConfig
    .map(user => ({
      ...user,
      historias: user.historias.filter(historia => {
        const isActive = now >= historia.startDate && now <= historia.endDate;
        return isActive;
      }),
    }))
    .filter(user => user.historias.length > 0); // Solo usuarios con historias activas
};
