import { type Component, createSignal } from 'solid-js';

const HeaderNotifications: Component = () => {
  const [isLiked, setIsLiked] = createSignal(false);

  const handleLike = () => {
    setIsLiked(!isLiked());
  };

  return (
    <button onClick={handleLike} class="transition-transform active:scale-110">
      <img
        src={isLiked() ? "/assets/instagram/icons/notifications_active.svg" : "/assets/instagram/icons/notifications.svg"}
        alt="Notifications"
        class="w-7 h-7"
      />
    </button>
  );
};

export default HeaderNotifications;
