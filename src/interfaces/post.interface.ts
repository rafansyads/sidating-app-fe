// Unified Post interface used by the frontend after mapping backend DTOs.
// Backend returns PostResponseDTO with: id, userProfileId, userProfileName, imageUrl, caption,
// createdAt (ISO string), likes (array of names), likeCount, timeAgo.
// We normalize to keep previous "userId" naming for minimal component changes while
// also exposing new backend specific fields (userProfileId, userProfileName, likeCount, timeAgo).
export interface Post {
  id: string;
  // Original local mock field kept for backward compatibility with components/filters
  userId: string; // mirrors userProfileId
  userProfileId: string;
  userProfileName?: string;
  imageUrl: string;
  caption: string;
  createdAt: Date; // always converted to Date object client-side
  likes: string[]; // list of liker names
  likeCount?: number;
  timeAgo?: string; // human friendly age text from backend
}

export interface PostRequest {
  id?: string;
  userId?: string; // accepted from form input, mapped to userProfileId
  userProfileId?: string; // directly pass if already known
  imageUrl?: string;
  caption?: string;
}
// NOTE: Do NOT declare a BaseResponse here. Use CommonResponseInterface<T> from
// 'common.response.interface.ts' for API response typing to keep a single source of truth.
