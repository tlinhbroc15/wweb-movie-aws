const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    OAUTH_CHECK: `${API_BASE_URL}/auth/oauth-check`,
    SIGNUP: `${API_BASE_URL}/auth/register-user`,
  },

  // Movies
  MOVIES: {
    LIST: `${API_BASE_URL}/movies`,
    DETAIL: (id: number) => `${API_BASE_URL}/movies/${id}`,
    CREATE: `${API_BASE_URL}/movies`,
    DELETE: (id: number) => `${API_BASE_URL}/movies/${id}`,
  },

  // Episodes
  EPISODES: {
    LIST: (movieId: number) => `${API_BASE_URL}/episodes/movie/${movieId}`,
    CREATE: `${API_BASE_URL}/episodes`,
    DELETE: (episodeId: number) => `${API_BASE_URL}/episodes/${episodeId}`,
  },

  // User
  USER: {
    PROFILE: `${API_BASE_URL}/customers/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/customers/profile`,
    FAVORITES: `${API_BASE_URL}/user-favorites`,
    ADD_FAVORITE: `${API_BASE_URL}/user-favorites`,
    REMOVE_FAVORITE: (movieId: number) => `${API_BASE_URL}/user-favorites/movie/${movieId}`,
    WATCH_HISTORY: `${API_BASE_URL}/user-watch-histories`,
    ADD_WATCH_HISTORY: `${API_BASE_URL}/user-watch-histories`,
    CHANGE_PASSWORD: `${API_BASE_URL}/customers/change-password`
  },

  // Comments
  COMMENTS: {
    LIST: (movieId: number) => `${API_BASE_URL}/movie-comments/movie/${movieId}`,
    CREATE: `${API_BASE_URL}/movie-comments`,
  },

  // AWS S3
  AWS: {
    UPLOAD: `${API_BASE_URL}/aws/upload`,
    DELETE_FILE: `${API_BASE_URL}/aws/file`,
  },
}; 