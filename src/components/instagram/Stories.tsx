import { type Component, For, createSignal, createEffect } from 'solid-js';
import MyStory from './MyStory';
import Story, { type HistoriaItem } from './Story';
import StoryViewer from './StoryViewer';
import { areAllUserStoriesViewed } from '../../utils/instagram/storiesStorage';

interface StoryData {
  userId: string; // ID único del usuario
  imagenPerfil: string;
  nombreUsuario: string;
  historia: HistoriaItem[];
  visto?: boolean;
  mejorAmigo?: boolean;
}

interface StoriesProps {
  miImagen: string;
  stories: StoryData[];
}

const Stories: Component<StoriesProps> = (props) => {
  const [currentStoryIndex, setCurrentStoryIndex] = createSignal<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = createSignal(false);

  // Función para filtrar historias activas basándose en la fecha/hora actual
  const filterActiveStories = (stories: StoryData[]): StoryData[] => {
    const now = new Date();

    console.log('\n=== DIAGNÓSTICO DE HISTORIAS PROGRAMADAS (Cliente) ===');
    console.log('Fecha/Hora actual:', now.toLocaleString('es-ES'));
    console.log('Fecha/Hora actual (ISO):', now.toISOString());
    console.log('\n--- TODAS LAS HISTORIAS CONFIGURADAS ---');

    let totalHistorias = 0;
    let historiasActivas = 0;
    let historiasInactivas = 0;

    const filteredStories = stories
      .map(user => {
        console.log(`\n👤 Usuario: ${user.nombreUsuario} (${user.userId})`);
        console.log(`   Total de historias configuradas: ${user.historia.length}`);

        const activeHistorias = user.historia.filter((historia, index) => {
          totalHistorias++;

          // Si no hay fechas, la historia está siempre activa (retrocompatibilidad)
          if (!historia.startDate || !historia.endDate) {
            historiasActivas++;
            return true;
          }

          const startDate = new Date(historia.startDate);
          const endDate = new Date(historia.endDate);
          const isActive = now >= startDate && now <= endDate;
          const startCheck = now >= startDate;
          const endCheck = now <= endDate;

          console.log(`\n   📖 Historia #${index + 1}: ${historia.id}`);
          console.log(`      Tipo: ${historia.tipo}`);
          console.log(`      URL: ${historia.url}`);
          console.log(`      Inicio: ${startDate.toLocaleString('es-ES')} (${historia.startDate})`);
          console.log(`      Fin: ${endDate.toLocaleString('es-ES')} (${historia.endDate})`);
          console.log(`      ✓ Verificación de inicio (now >= startDate): ${startCheck} ${startCheck ? '✅' : '❌'}`);
          console.log(`      ✓ Verificación de fin (now <= endDate): ${endCheck} ${endCheck ? '✅' : '❌'}`);
          console.log(`      ⭐ ACTIVA: ${isActive ? 'SÍ ✅ (SE MOSTRARÁ)' : 'NO ❌ (NO SE MOSTRARÁ)'}`);

          if (isActive) {
            historiasActivas++;
          } else {
            historiasInactivas++;
          }

          return isActive;
        });

        return {
          ...user,
          historia: activeHistorias,
        };
      })
      .filter(user => user.historia.length > 0); // Solo usuarios con historias activas

    console.log('\n--- RESUMEN GENERAL ---');
    console.log(`📊 Total de historias configuradas: ${totalHistorias}`);
    console.log(`✅ Historias activas (se mostrarán): ${historiasActivas}`);
    console.log(`❌ Historias inactivas (NO se mostrarán): ${historiasInactivas}`);
    console.log(`\n👥 Usuarios con historias activas: ${filteredStories.length}`);
    filteredStories.forEach(user => {
      console.log(`   - ${user.nombreUsuario}: ${user.historia.length} historia(s) activa(s)`);
    });
    console.log('=== FIN DEL DIAGNÓSTICO ===\n');

    return filteredStories;
  };

  // Inicializar con historias filtradas
  const [storiesWithViewStatus, setStoriesWithViewStatus] = createSignal<StoryData[]>([]);

  // Actualizar el estado de visto de cada historia al cargar o cuando cambien
  createEffect(() => {
    // Primero filtrar las historias activas
    const activeStories = filterActiveStories(props.stories);

    // Luego actualizar el estado de visto
    const updatedStories = activeStories.map(story => {
      const storyIds = story.historia.map(h => h.id).filter(Boolean);
      const allViewed = areAllUserStoriesViewed(storyIds);
      return {
        ...story,
        visto: allViewed,
      };
    });
    setStoriesWithViewStatus(updatedStories);
  });

  const openStory = (index: number) => {
    setCurrentStoryIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setCurrentStoryIndex(null);
    // Refrescar el estado de visto cuando se cierra el visor
    // También re-filtrar las historias activas por si cambió el tiempo
    const activeStories = filterActiveStories(props.stories);
    const updatedStories = activeStories.map(story => {
      const storyIds = story.historia.map(h => h.id).filter(Boolean);
      const allViewed = areAllUserStoriesViewed(storyIds);
      return {
        ...story,
        visto: allViewed,
      };
    });
    setStoriesWithViewStatus(updatedStories);
  };

  const nextStory = () => {
    const current = currentStoryIndex();
    if (current !== null && current < storiesWithViewStatus().length - 1) {
      setCurrentStoryIndex(current + 1);
    } else {
      closeViewer();
    }
  };

  const previousStory = () => {
    const current = currentStoryIndex();
    if (current !== null && current > 0) {
      setCurrentStoryIndex(current - 1);
    }
  };

  const currentStory = () => {
    const index = currentStoryIndex();
    return index !== null ? storiesWithViewStatus()[index] : null;
  };

  const nextStoryData = () => {
    const current = currentStoryIndex();
    if (current !== null && current < storiesWithViewStatus().length - 1) {
      return storiesWithViewStatus()[current + 1];
    }
    return null;
  };

  const previousStoryData = () => {
    const current = currentStoryIndex();
    if (current !== null && current > 0) {
      return storiesWithViewStatus()[current - 1];
    }
    return null;
  };

  return (
    <>
      <div class="flex gap-4 overflow-x-auto p-4 bg-white scrollbar-hide">
        <MyStory imagen={props.miImagen} />
        <For each={storiesWithViewStatus()}>
          {(story, index) => (
            <Story
              imagenPerfil={story.imagenPerfil}
              nombreUsuario={story.nombreUsuario}
              historia={story.historia}
              visto={story.visto}
              mejorAmigo={story.mejorAmigo}
              onClick={() => openStory(index())}
            />
          )}
        </For>
      </div>

      {isViewerOpen() && currentStory() && (
        <StoryViewer
          imagenPerfil={currentStory()!.imagenPerfil}
          nombreUsuario={currentStory()!.nombreUsuario}
          historia={currentStory()!.historia}
          isOpen={isViewerOpen()}
          onClose={closeViewer}
          onNext={nextStory}
          onPrevious={currentStoryIndex() !== null && currentStoryIndex()! > 0 ? previousStory : undefined}
        />
      )}
    </>
  );
};

export default Stories;
