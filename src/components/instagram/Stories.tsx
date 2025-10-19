import { type Component, For, createSignal } from 'solid-js';
import MyStory from './MyStory';
import Story, { type HistoriaItem } from './Story';
import StoryViewer from './StoryViewer';

interface StoryData {
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

  const openStory = (index: number) => {
    setCurrentStoryIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setCurrentStoryIndex(null);
  };

  const nextStory = () => {
    const current = currentStoryIndex();
    if (current !== null && current < props.stories.length - 1) {
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
    return index !== null ? props.stories[index] : null;
  };

  return (
    <>
      <div class="flex gap-6 overflow-x-auto p-4 bg-white border-b border-gray-200 scrollbar-hide">
        <MyStory imagen={props.miImagen} onClick={() => openStory(0)} />
        <For each={props.stories}>
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

      {currentStory() && (
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
