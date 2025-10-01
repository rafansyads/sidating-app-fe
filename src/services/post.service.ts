import type { Post, PostRequest } from "@/interfaces/post.interface";
import { v4 as uuidv4 } from "uuid";

const posts: Post[] = [
  {
    id: uuidv4(),
    userId: "user1",
    imageUrl: "https://assets.discover-the-world.com/production/app/uploads/2024/10/canada-alberta-hikers-looking-over-lake-louise-tb.jpg",
    caption: "Great day for a hike! #hiking #sunset #nature",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    likes: ["user2", "user3", "user4"],
  },
  {
    id: uuidv4(),
    userId: "user2",
    imageUrl: "https://www.inspiredtaste.net/wp-content/uploads/2025/07/Pancake-Recipe-1.jpg",
    createdAt: new Date("2024-01-16T09:15:00Z"),
    likes: ["user1", "user5"],
    caption: "Trying out a new recipe today! 🍝",
  },
  {
    id: uuidv4(),
    userId: "user3",
    imageUrl: "https://mygoodfoodworld.com/wp-content/uploads/2023/09/pesto-pasta-with-tomatoes.jpg",
    caption: "Delicious homemade pasta for dinner tonight! Cooking is such a therapeutic activity. Recipe in my bio!",
    createdAt: new Date("2024-01-17T18:45:00Z"),
    likes: ["user1", "user2", "user4", "user6"],
  },
];

export class PostService {
  private static instance: PostService;

  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  createPost(post: PostRequest): Post {
    const newPost: Post = {
      id: uuidv4(),
      createdAt: new Date(),
      likes: [],
      ...post,
    };
    posts.push(newPost);
    return newPost;
  }

  getAllPosts(): Post[] {
    return posts;
  }

  getPost(id: string): Post | undefined {
    return posts.find(post => post.id === id);
  }

  deletePost(id: string): boolean {
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    }
    return false;
  }

  updatePost(id: string, updatedPost: Partial<PostRequest>): Post | undefined {
    const post = this.getPost(id);
    if (post) {
      Object.assign(post, updatedPost);
      return post;
    }
    return undefined;
  }

  likePost(id: string, userId: string): boolean {
    const post = this.getPost(id)
    if (!post) return false
    // If already liked, do nothing and return false (idempotent like)
    if (post.likes.includes(userId)) {
      return false
    }
    post.likes.push(userId)
    return true
  }

  filter(user: string, sort: string): Post[] {
    const postsByUser = posts.filter(post => post.userId === user);
    return sort === 'asc' ? 
      postsByUser.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) :
      postsByUser.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  sortPosts(sort: string): Post[] {
    return sort === 'asc' ? 
      posts.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) :
      posts.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const postService = PostService.getInstance();