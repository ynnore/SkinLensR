'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MyContextValue {
  user?: { name: string }
  backendUrl: string
}

const MyContext = createContext<MyContextValue | undefined>(undefined)

export function MyProvider({
  backendUrl,
  children
}: {
  backendUrl: string
  children: ReactNode
}) {
  const [user, setUser] = useState<{ name: string } | undefined>(undefined)

  return (
    <MyContext.Provider value={{ user, backendUrl }}>
      {children}
    </MyContext.Provider>
  )
}

export function useMyContext() {
  const ctx = useContext(MyContext)
  if (!ctx) throw new Error('useMyContext must be used within MyProvider')
  return ctx
}
