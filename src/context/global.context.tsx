"use client"

import { useState, createContext, useContext } from "react"
import { FileObject } from "@supabase/storage-js"

type ValueType = FileObject[] | null | undefined

type GlobalContextType = {
  value: ValueType
  setValue: React.Dispatch<React.SetStateAction<ValueType>>
}

const emptyGlobalState: GlobalContextType = { 
  value: undefined,
  setValue: () => {}
}

const GlobalContext = createContext<GlobalContextType>(emptyGlobalState)

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  return context
}

type GlobalContextProviderProps = {
  children: React.ReactNode
}

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [value, setValue] = useState<ValueType>(undefined)

  return (
    <GlobalContext.Provider value={{ value, setValue }}>{children}</GlobalContext.Provider>
  )
}
