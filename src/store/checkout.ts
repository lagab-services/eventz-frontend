import {AttendeeInfo, CheckoutStep, CustomerInfo} from "@/types/checkout";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {TicketType} from "@/types/events";
import {CartItemResponse} from "@/types/cart";
import {CustomField} from "@/types/customFields";
import {getCustomFields} from "@/actions/customfield.actions";

interface CheckoutState {
    // Step management
    currentStep: CheckoutStep
    completedSteps: CheckoutStep[]

    // Tickets
    ticketTypes: TicketType[]
    customFields: CustomField[];
    attendees: AttendeeInfo[]

    // Customer info
    customerInfo: CustomerInfo

    // Promo
    promoDiscount: number

    // Loading states
    isLoading: boolean
    _hasHydrated: boolean
    sessionId: string
    checkoutSessionId: string
    orderId: string

    // Actions
    setCurrentStep: (step: CheckoutStep) => void
    completeStep: (step: CheckoutStep) => void
    updateTicketQuantity: (ticketId: number, quantity: number) => void
    initializeAttendeesFromCart: (cartItems:  CartItemResponse[])  => void
    updateAttendee: (index:number , attendee: AttendeeInfo) => void
    setCustomerInfo: (info: CustomerInfo) => void
    setPromoDiscount: (discount: number) => void
    setLoading: (loading: boolean) => void
    nextStep: () => void
    previousStep: () => void
    reset: () => void
    setCustomFields: (fields: CustomField[]) => void
    fetchCustomFields: (eventId: number) => Promise<void>
    setHasHydrated: (_hasHydrated: boolean) => void
    setSessionId: (sessionId: string) => void
    setCheckoutSessionId: (checkoutSessionId: string) => void
    setOrderId: (orderId: string) => void
}

export const stepOrder: CheckoutStep[] = ['tickets', 'info', 'payment', 'confirmation']

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set, get) => ({
            // Initial state
            currentStep: 'tickets',
            completedSteps: [],
            ticketTypes: [],
            customFields: [],
            attendees:[],
            customerInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                acceptTerms: false,
            },
            promoDiscount: 0,
            isLoading: true,
            _hasHydrated: false,
            sessionId: '',
            checkoutSessionId: '',
            orderId: '',

            // Actions
            setSessionId: (sessionId) => set({ sessionId: sessionId }),
            setCurrentStep: (step) => set({ currentStep: step }),

            completeStep: (step) => set((state) => ({
                completedSteps: [...state.completedSteps.filter(s => s !== step), step]
            })),

            updateTicketQuantity: (ticketId, quantity) => set((state) => ({
                ticketTypes: state.ticketTypes.map(ticket =>
                    ticket.id === ticketId ? { ...ticket, quantity } : ticket
                )
            })),

            initializeAttendeesFromCart: (cartItems:  CartItemResponse[]) => {
                const attendees: AttendeeInfo[] = [];

                cartItems.forEach((item) => {
                    // Créer un attendee pour chaque ticket
                    for (let i = 0; i < item.quantity; i++) {
                        attendees.push({
                            firstName: '',
                            lastName: '',
                            email: '',
                            ticketTypeId: item.ticketTypeId,
                            ticketTypeName: item.ticketTypeName,
                            customFields: {},
                        });
                    }
                });

                set({ attendees });
            },

            updateAttendee: (index, attendee: AttendeeInfo) => set((state) => ({
                attendees: state.attendees.map((a, i) =>
                    i === index ? attendee : a
                )
            })),

            setCustomerInfo: (info) => set({ customerInfo: info }),


            setPromoDiscount: (discount) => set({ promoDiscount: discount }),

            setLoading: (loading) => set({ isLoading: loading }),

            nextStep: () => {
                const { currentStep, completedSteps } = get()
                const currentIndex = stepOrder.indexOf(currentStep)

                if (currentIndex < stepOrder.length - 1) {
                    const nextStep = stepOrder[currentIndex + 1]
                    set({
                        completedSteps: [...completedSteps.filter(s => s !== currentStep), currentStep],
                        currentStep: nextStep
                    })
                }
            },

            previousStep: () => {
                const { currentStep } = get()
                const currentIndex = stepOrder.indexOf(currentStep)

                if (currentIndex > 0) {
                    const prevStep = stepOrder[currentIndex - 1]
                    set({ currentStep: prevStep })
                }
            },

            reset: () => set({
                currentStep: 'tickets',
                completedSteps: [],
                ticketTypes: [],
                attendees:[],
                customerInfo: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    acceptTerms: false,
                },
                promoDiscount: 0,
                isLoading: false,
                sessionId: '',
            }),
            setCustomFields: (fields) => set({ customFields: fields }),

            fetchCustomFields: async (eventId: number) => {
                try {
                    set({ isLoading: true });
                    const response = await getCustomFields(eventId);
                    if (!response.success) throw new Error('Failed to fetch custom fields');
                    set({ customFields: response.data });
                } catch (error) {
                    console.error('NotFound fetching custom fields:', error);
                } finally {
                    set({ isLoading: false });
                }
            },
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
            setCheckoutSessionId: (checkoutSessionId: string) => set({ checkoutSessionId: checkoutSessionId }),
            setOrderId: (orderId: string) => set({ orderId: orderId }),
        }),
        {
            name: 'checkout-store',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            }
        }
    )
);