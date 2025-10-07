import type { Post, PostRequest } from '@/interfaces/post.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import { http } from '@/services/http'
import { v4 as uuidv4 } from 'uuid'

// Backend PostResponseDTO shape (partial - only fields we use)
interface PostResponseDTO {
  id: string
  userProfileId: string
  userProfileName?: string
  imageUrl: string
  caption: string
  createdAt: string
  likes: string[]
  likeCount?: number
  timeAgo?: string
}

// Helper to map backend PostResponseDTO to frontend Post interface
const mapDtoToPost = (dto: PostResponseDTO): Post => {
  return {
    id: dto.id,
    userId: dto.userProfileId, // maintain backward compatibility
    userProfileId: dto.userProfileId,
    userProfileName: dto.userProfileName,
    imageUrl: dto.imageUrl,
    caption: dto.caption,
    createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
    likes: dto.likes || [],
    likeCount: dto.likeCount,
    timeAgo: dto.timeAgo,
  }
}

// =============================
// Live API Service
// =============================
export class PostService {
  private static instance: PostService
  private cache: Post[] = [] // simple in-memory cache to avoid refetch on like/delete optimistic updates

  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService()
    }
    return PostService.instance
  }

  async getAllPosts(params?: { userId?: string; date?: string }): Promise<Post[]> {
    const response = await http.get<CommonResponseInterface<PostResponseDTO[]>>('/posts', { params })
    const posts = (response.data.data || []).map(mapDtoToPost)
    this.cache = posts
    return posts
  }

  async getPost(id: string): Promise<Post | undefined> {
    try {
      const response = await http.get<CommonResponseInterface<PostResponseDTO>>(`/posts/${id}`)
      const post = mapDtoToPost(response.data.data)
      // update cache
      const idx = this.cache.findIndex(p => p.id === id)
      if (idx >= 0) this.cache[idx] = post; else this.cache.push(post)
      return post
    } catch {
      return undefined
    }
  }

  async createPost(request: PostRequest): Promise<Post | null> {
    // Map userId (form field) to userProfileId expected by backend
    const payload = {
      caption: request.caption || '',
      imageUrl: request.imageUrl || '',
      userProfileId: request.userProfileId || request.userId,
    }
    try {
      const response = await http.post<CommonResponseInterface<PostResponseDTO>>('/posts/create', payload)
      const post = mapDtoToPost(response.data.data)
      this.cache.unshift(post)
      return post
    } catch {
      return null
    }
  }

  async updatePost(id: string, updated: Partial<PostRequest & { isActive?: boolean }>): Promise<Post | null> {
    const payload = {
      id,
      caption: updated.caption,
      imageUrl: updated.imageUrl,
      userProfileId: updated.userProfileId || updated.userId, // ensure backend field
      isActive: updated.isActive ?? true,
    }
    try {
      const response = await http.put<CommonResponseInterface<PostResponseDTO>>('/posts/update', payload)
      const post = mapDtoToPost(response.data.data)
      const idx = this.cache.findIndex(p => p.id === id)
      if (idx >= 0) this.cache[idx] = post
      return post
    } catch {
      return null
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      await http.delete<CommonResponseInterface<void>>('/posts/delete', { data: { id } })
      this.cache = this.cache.filter(p => p.id !== id)
      return true
    } catch {
      return false
    }
  }

  async likePost(id: string, userProfileId: string): Promise<boolean> {
    try {
      await http.post<CommonResponseInterface<void>>('/posts/like', { id, userProfileId })
      // Optimistic update
      const post = this.cache.find(p => p.id === id)
      if (post) {
        if (!post.likes.includes(userProfileId)) {
          post.likes.push(userProfileId)
          post.likeCount = (post.likeCount || 0) + 1
        }
      }
      return true
    } catch {
      return false
    }
  }

  // Local helpers replicating prior API for filtering/sorting using current cache
  filter(user: string, sort: string): Post[] {
    const postsByUser = this.cache.filter(p => p.userId === user)
    return sort === 'asc'
      ? postsByUser.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      : postsByUser.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  sortPosts(sort: string): Post[] {
    return sort === 'asc'
      ? this.cache.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      : this.cache.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export const postService = PostService.getInstance()

// =============================
// Original In-Memory Sample (Preserved)
// =============================
// Retained for reference & optional mock usage during development or testing without backend.
// You can switch by importing { postMockService } instead of { postService }.

const mockPostsSample: Post[] = [
  {
    id: uuidv4(),
    userId: 'user1',
    userProfileId: 'user1',
    imageUrl:
      'https://assets.discover-the-world.com/production/app/uploads/2024/10/canada-alberta-hikers-looking-over-lake-louise-tb.jpg',
    caption: 'Great day for a hike! #hiking #sunset #nature',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    likes: ['user2', 'user3', 'user4'],
  },
  {
    id: uuidv4(),
    userId: 'user2',
    userProfileId: 'user2',
    imageUrl: 'https://www.inspiredtaste.net/wp-content/uploads/2025/07/Pancake-Recipe-1.jpg',
    createdAt: new Date('2024-01-16T09:15:00Z'),
    likes: ['user1', 'user5'],
    caption: 'Trying out a new recipe today! 🍝',
  },
  {
    id: uuidv4(),
    userId: 'user3',
    userProfileId: 'user3',
    imageUrl:
      'https://mygoodfoodworld.com/wp-content/uploads/2023/09/pesto-pasta-with-tomatoes.jpg',
    caption:
      'Delicious homemade pasta for dinner tonight! Cooking is such a therapeutic activity. Recipe in my bio!',
    createdAt: new Date('2024-01-17T18:45:00Z'),
    likes: ['user1', 'user2', 'user4', 'user6'],
  },
]

export class PostMockService {
  private static instance: PostMockService
  private posts: Post[] = [...mockPostsSample]

  public static getInstance(): PostMockService {
    if (!PostMockService.instance) {
      PostMockService.instance = new PostMockService()
    }
    return PostMockService.instance
  }

  getAllPosts(): Promise<Post[]> { return Promise.resolve(this.posts) }
  getPost(id: string): Promise<Post | undefined> { return Promise.resolve(this.posts.find(p => p.id === id)) }
  createPost(req: PostRequest): Promise<Post> {
    const p: Post = {
      id: uuidv4(),
      userId: req.userProfileId || req.userId || 'user1',
      userProfileId: req.userProfileId || req.userId || 'user1',
      imageUrl: req.imageUrl || 'https://placehold.co/600x400',
      caption: req.caption || '',
      createdAt: new Date(),
      likes: [],
      likeCount: 0,
      timeAgo: 'just now'
    }
    this.posts.unshift(p)
    return Promise.resolve(p)
  }
  updatePost(id: string, upd: Partial<PostRequest>): Promise<Post | null> {
    const idx = this.posts.findIndex(p => p.id === id)
    if (idx < 0) return Promise.resolve(null)
    const existing = this.posts[idx]
    this.posts[idx] = { ...existing, ...upd, userId: upd.userProfileId || upd.userId || existing.userId, userProfileId: upd.userProfileId || upd.userId || existing.userProfileId }
    return Promise.resolve(this.posts[idx])
  }
  deletePost(id: string): Promise<boolean> {
    const before = this.posts.length
    this.posts = this.posts.filter(p => p.id !== id)
    return Promise.resolve(this.posts.length < before)
  }
  likePost(id: string, user: string): Promise<boolean> {
    const p = this.posts.find(pp => pp.id === id)
    if (!p) return Promise.resolve(false)
    if (!p.likes.includes(user)) { p.likes.push(user); p.likeCount = (p.likeCount || 0) + 1 }
    return Promise.resolve(true)
  }
  filter(user: string, sort: string): Post[] {
    const postsByUser = this.posts.filter(p => p.userId === user)
    return sort === 'asc'
      ? postsByUser.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      : postsByUser.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  sortPosts(sort: string): Post[] {
    return sort === 'asc'
      ? this.posts.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      : this.posts.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export const postMockService = PostMockService.getInstance()

