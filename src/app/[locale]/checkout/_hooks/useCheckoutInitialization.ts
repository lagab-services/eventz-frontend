import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/lib/store/cart";
import { useCheckoutStore } from "@/lib/store/checkout";

export const useCheckoutInitialization = () => {
    const { cart } = useCartStore();
    const { fetchCart } = useCart();
    const {
        initializeAttendeesFromCart,
        attendees,
        setLoading,
        fetchCustomFields,
    } = useCheckoutStore();

    useEffect(() => {
        const initializeCheckout = async () => {
            setLoading(true);

            // If no cart, fetch it
            if (!cart) {
                await fetchCart();
                return;
            }

            // If the cart exists and has items
            if (cart.items && cart.items.length > 0) {
                const eventId = cart.items[0].eventId;
                await fetchCustomFields(eventId);

                // Initialize attendees only if empty or count doesn't match
                const expectedAttendeesCount = cart.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                if (attendees.length !== expectedAttendeesCount) {
                    initializeAttendeesFromCart(cart.items);
                }
            }

            setLoading(false);
        };

        initializeCheckout();
    }, [cart, fetchCart, initializeAttendeesFromCart, attendees.length]);

    return {
        isInitialized: cart !== null && attendees.length > 0,
        cart,
        attendees,
    };
};
