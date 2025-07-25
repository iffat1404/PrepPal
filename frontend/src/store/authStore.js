import { create } from "zustand"
import { api } from "../utils/api"
import toast from "react-hot-toast"

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    localStorage.setItem("token", token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ user: null, token: null, isAuthenticated: false })
    toast.success("Logged out successfully")
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        set({ isLoading: false })
        return
      }

      const response = await api.get("/auth/me")
      if (response.data.status === "success") {
        set({
          user: response.data.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      }
    } catch (error) {
      localStorage.removeItem("token")
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },
}))
