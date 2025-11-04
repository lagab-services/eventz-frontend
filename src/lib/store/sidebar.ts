import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface SidebarState {
    isOpen: boolean
    toggleSidebar: () => void
    setSidebar: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: false,
            toggleSidebar: () =>
                set((state) => ({isOpen: !state.isOpen})),
            setSidebar: (open) => set({isOpen: open}),
        }),
        {
            name: 'sidebar-storage', // localStorage
        }
    )
)