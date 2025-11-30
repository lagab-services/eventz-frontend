import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AddToCartRequest } from '@/types/cart';
import { toast } from 'sonner';
import {
    addToCartAction,
    getCartAction,
    updateCartItemAction,
    removeCartItemAction,
    clearCartAction,
    applyPromoCodeAction,
    removePromoCodeAction,
} from '@/actions/cart.actions';
import { useCartStore } from '@/store/cart';

export const useCart = () => {
    const router = useRouter();
    const t = useTranslations('cart');
    const { cart, isLoading, error, setCart, setLoading, setError, clearCart, clearError } =
        useCartStore();

    const addToCart = useCallback(
        async (request: AddToCartRequest) => {
            try {
                setLoading(true);
                clearError();

                const result = await addToCartAction(request);

                if (!result.success) {
                    throw new Error(result.error);
                }

                const cartResponse = result.data;
                setCart(cartResponse);

                if (cartResponse.warnings.length > 0) {
                    cartResponse.warnings.forEach((warning) => {
                        toast.warning(warning.message);
                    });
                }

                if (cartResponse.errors.length > 0) {
                    cartResponse.errors.forEach((error) => {
                        toast.error(error.message);
                    });
                }

                if (cartResponse.isValid && cartResponse.errors.length === 0) {
                    toast.success(t('add_success'));
                }

                return cartResponse;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : t('error_generic');
                setError(errorMessage);
                toast.error(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setCart, setLoading, setError, clearError, t]
    );

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getCartAction();

            if (!result.success) {
                throw new Error(result.error);
            }

            setCart(result.data);
            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('error_fetch');
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setCart, setLoading, setError, t]);

    const updateQuantity = useCallback(
        async (ticketTypeId: number, quantity: number) => {
            try {
                setLoading(true);
                const result = await updateCartItemAction(ticketTypeId, quantity);

                if (!result.success) {
                    throw new Error(result.error);
                }

                setCart(result.data);
                toast.success(t('update_success'));
                return result.data;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : t('error_update');
                setError(errorMessage);
                toast.error(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setCart, setLoading, setError, t]
    );

    const removeItem = useCallback(
        async (ticketTypeId: number) => {
            try {
                setLoading(true);
                const result = await removeCartItemAction(ticketTypeId);

                if (!result.success) {
                    throw new Error(result.error);
                }

                setCart(result.data);
                toast.success(t('remove_success'));
                return result.data;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : t('error_remove');
                setError(errorMessage);
                toast.error(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setCart, setLoading, setError, t]
    );

    const applyPromoCode = useCallback(
        async (promoCode: string) => {
            try {
                setLoading(true);
                const result = await applyPromoCodeAction(promoCode,'');

                if (!result.success) {
                    throw new Error(result.error);
                }

                setCart(result.data);
                toast.success(t('promo_applied'));
                return result.data;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : t('promo_invalid');
                setError(errorMessage);
                toast.error(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setCart, setLoading, setError, t]
    );

    const removePromoCode = useCallback(async () => {
        try {
            setLoading(true);
            const result = await removePromoCodeAction('');

            if (!result.success) {
                throw new Error(result.error);
            }

            setCart(result.data);
            toast.success(t('promo_removed'));
            return result.data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : t('promo_remove_error');
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setCart, setLoading, setError, t]);

    const clearCartData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await clearCartAction();

            if (!result.success) {
                throw new Error(result.error);
            }

            clearCart();
            toast.success(t('cart_cleared'));
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : t('error_clear');
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [clearCart, setLoading, setError, t]);

    const goToCheckout = useCallback(
        async (request: AddToCartRequest) => {
            try {
                await clearCartAction();

                const cartResponse = await addToCart(request);

                if (cartResponse.isValid && cartResponse.errors.length === 0) {
                    router.push(`/checkout/${cartResponse.session}`);
                } else {
                    toast.error(t('checkout_error'));
                }
            } catch (err) {
                console.error('NotFound going to checkout:', err);
            }
        },
        [addToCart, router, t]
    );

    return {
        cart,
        isLoading,
        error,
        addToCart,
        goToCheckout,
        fetchCart,
        updateQuantity,
        removeItem,
        applyPromoCode,
        removePromoCode,
        clearCart: clearCartData,
        clearError,
    };
};
