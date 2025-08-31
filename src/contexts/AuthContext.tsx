'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginRequest, LoginResponse } from '@/types'
import { authAPI } from '@/lib/api'
import { STORAGE_KEYS } from '@/lib/constants'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser))
          // Verify token is still valid
          const response = await authAPI.getProfile()
          setUser(response.data)
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data))
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          // Try to refresh token
          const refreshToken = localStorage.getItem('sso_refresh_token')
          if (refreshToken) {
            try {
              await refreshTokenInternal()
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError)
              logout()
            }
          } else {
            logout()
          }
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const refreshTokenInternal = async () => {
    const refreshToken = localStorage.getItem('sso_refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await authAPI.refresh(refreshToken)
    const { access_token, user: userData } = response.data

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authAPI.login(credentials)
      const { access_token, refresh_token, user: userData } = response.data

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
      localStorage.setItem('sso_refresh_token', refresh_token)
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem('sso_refresh_token')
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      setUser(null)
      window.location.href = '/login'
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
  }

  const refreshToken = async () => {
    await refreshTokenInternal()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
