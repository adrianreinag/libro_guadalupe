// Utilidad para gestionar las historias vistas en localStorage

const STORAGE_KEY = 'instagram_viewed_stories';

// Obtener todas las historias vistas
export const getViewedStories = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error reading viewed stories from localStorage:', error);
  }

  return new Set();
};

// Marcar una historia como vista
export const markStoryAsViewed = (storyId: string): void => {
  if (typeof window === 'undefined') return;

  try {
    const viewedStories = getViewedStories();
    viewedStories.add(storyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewedStories]));
  } catch (error) {
    console.error('Error saving viewed story to localStorage:', error);
  }
};

// Verificar si una historia ha sido vista
export const isStoryViewed = (storyId: string): boolean => {
  const viewedStories = getViewedStories();
  return viewedStories.has(storyId);
};

// Marcar todas las historias de un usuario como vistas
export const markUserStoriesAsViewed = (storyIds: string[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const viewedStories = getViewedStories();
    storyIds.forEach(id => viewedStories.add(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewedStories]));
  } catch (error) {
    console.error('Error saving viewed stories to localStorage:', error);
  }
};

// Limpiar historias vistas (útil para testing o reset)
export const clearViewedStories = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing viewed stories from localStorage:', error);
  }
};

// Verificar si todas las historias de un usuario han sido vistas
export const areAllUserStoriesViewed = (storyIds: string[]): boolean => {
  const viewedStories = getViewedStories();
  return storyIds.every(id => viewedStories.has(id));
};
