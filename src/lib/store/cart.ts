import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartResponse } from '@/types/cart';

interface CartStore {
    cart: CartResponse | null;
    isLoading: boolean;
    error: string | null;

    setCart: (cart: CartResponse) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearCart: () => void;
    clearError: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cart: null,
            isLoading: false,
            error: null,

            setCart: (cart) => set({ cart, error: null }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error, isLoading: false }),
            clearCart: () => set({ cart: null, error: null }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'cart',
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);
