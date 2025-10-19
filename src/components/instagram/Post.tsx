import type { Component } from 'solid-js';

interface PostProps {
  imagenPost: string;
  imagenUsuario: string;
  nombreUsuario: string;
  descripcion: string;
  likes: number;
  urlRedireccion?: string;
}

const Post: Component<PostProps> = (props) => {
  return (
    <div class="bg-white border-b border-gray-200">
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
        <span class="font-semibold text-base">{props.nombreUsuario}</span>
        <button class="ml-auto">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <a href={props.urlRedireccion || '#'}>
        <img
          src={props.imagenPost}
          alt="Post"
          class="w-full object-cover max-h-[600px] cursor-pointer"
        />
      </a>

      {/* Action buttons */}
      <div class="flex items-center gap-4 p-3">
        <button>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <button>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
        <button>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
        <button class="ml-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Likes */}
      <div class="px-3 pb-2">
        <span class="font-semibold text-sm">{props.likes.toLocaleString()} Me gusta</span>
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
