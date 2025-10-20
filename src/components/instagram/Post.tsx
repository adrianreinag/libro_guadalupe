import { type Component, createSignal } from 'solid-js';

interface PostProps {
  imagenPost: string;
  imagenUsuario: string;
  nombreUsuario: string;
  descripcion: string;
  likes: number;
  urlRedireccion?: string;
}

const Post: Component<PostProps> = (props) => {
  const [isLiked, setIsLiked] = createSignal(false);
  const [likesCount, setLikesCount] = createSignal(props.likes);

  const handleLike = () => {
    setIsLiked(!isLiked());
    setLikesCount(isLiked() ? likesCount() + 1 : likesCount() - 1);
  };

  return (
    <div class="bg-white">
      {/* Header */}
      <div class="flex items-center gap-3 p-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <div class="bg-white p-[2px] rounded-full w-full h-full">
            <div class="w-full h-full rounded-full overflow-hidden">
              <img
                src={props.imagenUsuario}
                alt={props.nombreUsuario}
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <span class="font-semibold text-sm">{props.nombreUsuario}</span>
        <button class="ml-auto">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <a href={props.urlRedireccion || '#'} data-astro-prefetch="hover">
        <img
          src={props.imagenPost}
          alt="Post"
          class="w-full object-cover max-h-[600px] cursor-pointer"
          data-astro-transition-persist={`post-${props.imagenPost}`}
        />
      </a>

      {/* Action buttons */}
      <div class="flex items-center gap-4 p-3">
        <div class="flex items-center gap-2">
          <button onClick={handleLike} class="transition-transform active:scale-110">
            <img
              src={isLiked() ? "/assets/instagram/icons/notifications_active.svg" : "/assets/instagram/icons/notifications.svg"}
              alt="Like"
              class="w-6 h-6"
            />
          </button>
          <span class="font-semibold text-sm">{likesCount().toLocaleString()}</span>
        </div>
        <button>
          <img src="/assets/instagram/icons/comment.svg" alt="Comment" class="w-6 h-6" />
        </button>
        <button>
          <img src="/assets/instagram/icons/direct.svg" alt="Share" class="w-6 h-6" />
        </button>
        <button class="ml-auto">
          <img src="/assets/instagram/icons/save.svg" alt="Save" class="w-6 h-6" />
        </button>
      </div>

      {/* Description */}
      <div class="px-3 pb-3">
        <span class="font-semibold text-sm">{props.nombreUsuario}</span>{' '}
        <span class="text-sm">{props.descripcion}</span>
      </div>
    </div>
  );
};

export default Post;
