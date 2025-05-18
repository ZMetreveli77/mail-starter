import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext({
  user: null,
  setUser: null,
  initialLoading: true
})

export const AuthContextProvider = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/users/status", {
          credentials: "include"
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setUser(null)
      } finally {
        setInitialLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
