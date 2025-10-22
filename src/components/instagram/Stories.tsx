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

  // Inicializar con props.stories para evitar el bug del primer click
  const [storiesWithViewStatus, setStoriesWithViewStatus] = createSignal<StoryData[]>(props.stories);

  // Actualizar el estado de visto de cada historia al cargar o cuando cambien
  createEffect(() => {
    const updatedStories = props.stories.map(story => {
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
    const updatedStories = storiesWithViewStatus().map(story => {
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
        <MyStory imagen={props.miImagen} onClick={() => openStory(0)} />
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
