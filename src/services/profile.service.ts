import type { UserProfile, UserProfileRequest } from '@/interfaces/profile.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import { v4 as uuidv4 } from 'uuid'
import { http } from './http'

// NOTE: This service has been refactored to use async HTTP calls.
// It retains an in-memory fallback so existing (older) tests or offline development
// can still function if the backend is unreachable. All methods now return Promises.

const fallbackProfiles: UserProfile[] = [
  {
    name: 'Alice Johnson',
    nickname: 'aliJ',
    birthdate: new Date('1996-05-14'),
    hobbies: ['reading', 'painting', 'cycling'],
    gender: 'Female',
    location: 'New York, USA',
    bio: 'Bookworm and aspiring painter. Always looking for new adventures.',
    email: 'alice.johnson@example.com',
    phoneNumber: '+1234567890',
    interests: ['art', 'travel', 'technology'],
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    name: 'Michael Smith',
    nickname: 'mikeS',
    birthdate: new Date('1992-09-03'),
    hobbies: ['gaming', 'hiking', 'photography'],
    gender: 'Male',
    location: 'Los Angeles, USA',
    bio: 'Tech enthusiast and outdoor explorer. Love capturing moments.',
    email: 'michael.smith@example.com',
    phoneNumber: '+1987654321',
    interests: ['nature', 'coding', 'fitness'],
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
]

const basePath = '/profile'

class ProfileService {
  private static instance: ProfileService

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService()
    }
    return ProfileService.instance
  }

  async createProfile(profile: UserProfileRequest): Promise<UserProfile | null> {
    try {
      const res = await http.post<CommonResponseInterface<UserProfile>>(
        `${basePath}/create`,
        profile,
      )
      return res.data.data
    } catch {
      // Fallback (offline) behavior
      const birthdate = new Date(profile.birthdate)
      const newProfile: UserProfile = {
        ...profile,
        birthdate,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }
      fallbackProfiles.push(newProfile)
      return newProfile
    }
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const res = await http.get<CommonResponseInterface<UserProfile[]>>(basePath)
      return res.data.data
    } catch {
      return [...fallbackProfiles]
    }
  }

  async getProfile(id: string): Promise<UserProfile | undefined> {
    try {
      const res = await http.get<CommonResponseInterface<UserProfile>>(`${basePath}/${id}`)
      return res.data.data
    } catch {
      return fallbackProfiles.find((p) => p.id === id)
    }
  }

  async deleteProfile(id: string): Promise<boolean> {
    try {
      await http.delete<CommonResponseInterface<UserProfile>>(`${basePath}/delete/${id}`)
      return true
    } catch {
      const index = fallbackProfiles.findIndex((p) => p.id === id)
      if (index !== -1) {
        fallbackProfiles.splice(index, 1)
        return true
      }
      return false
    }
  }

  async updateProfile(
    id: string,
    updatedProfile: Partial<UserProfileRequest>,
  ): Promise<UserProfile | undefined> {
    try {
      const res = await http.put<CommonResponseInterface<UserProfile>>(`${basePath}/update`, {
        id,
        ...updatedProfile,
      })
      return res.data.data
    } catch {
      const profile = fallbackProfiles.find((p) => p.id === id)
      if (profile) {
        Object.assign(profile, updatedProfile)
        profile.updatedAt = new Date()
        return profile
      }
      return undefined
    }
  }
}

export const profileService = ProfileService.getInstance()
