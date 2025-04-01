import { GlobalContextProvider } from "@/context/global.context"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GlobalContextProvider>{children}</GlobalContextProvider>
  )
}