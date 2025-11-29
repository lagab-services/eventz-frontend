"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {
    ListTodo,
    User,
    Users,
    Mail,
    Phone,
    ChevronDown,
    ChevronUp,
    Edit,
} from "lucide-react";
import {useCheckoutStore} from "@/lib/store/checkout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {cn} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {createOrder} from "../_lib/actions";
import {toast} from "sonner";
import {orderRequestSchema} from "../_lib/validations";
import {AttendeeInfo, OrderRequest} from "@/types/checkout";

const  buildOrderRequest= (): OrderRequest =>{
    const { customerInfo, attendees } = useCheckoutStore.getState();

    return {
        billingName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        billingEmail: customerInfo.email,
        billingPhone: customerInfo.phone || undefined,

        /*billingAddress: customerInfo.address || undefined,
        billingCity: customerInfo.city || undefined,
        billingZipCode: customerInfo.zipCode || undefined,
        billingCountry: customerInfo.country || undefined,*/

        attendees: attendees.map(a => ({
            firstName: a.firstName,
            lastName: a.lastName,
            email: a.email,
            ticketTypeId: a.ticketTypeId,
            customFields: a.customFields ?? {}
        })),

        notes: undefined,

        acceptTerms: customerInfo.acceptTerms,
        subscribeNewsletter: customerInfo.subscribeNewsletter ?? false,

        successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/thanks`,
        cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/cancel`,
    };
}


const  buildValidatedOrderRequest = (): OrderRequest =>{
    const order = buildOrderRequest();

    const parsed = orderRequestSchema.safeParse(order);

    if (!parsed.success) {
        console.error("❌ Order validation error:", parsed.error.flatten());
        throw new Error("Invalid order data");
    }

    return parsed.data;
}


const RecapForm = () => {
    const t = useTranslations("checkout.recap");

    const {customerInfo, attendees, customFields, previousStep, nextStep} =
        useCheckoutStore();

    const [expandedAttendees, setExpandedAttendees] = React.useState<number[]>([]);

    const toggleAttendee = (index: number) => {
        setExpandedAttendees((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    // Group attendees by ticket type
    const attendeesByTicketType = attendees.reduce((acc, attendee, index) => {
        const key = attendee.ticketTypeId;
        if (!acc[key]) {
            acc[key] = {
                ticketTypeName: attendee?.ticketTypeName as string,
                attendees: [],
            };
        }
        acc[key].attendees.push({...attendee, originalIndex: index});
        return acc;
    }, {} as Record<number, { ticketTypeName: string; attendees: (AttendeeInfo & { originalIndex: number })[] }>);

    // Get label of a custom field
    const getCustomFieldLabel = (fieldName: string, ticketTypeId: number) => {
        const field = customFields.find(
            (f) =>
                f.fieldName === fieldName &&
                (f.ticketTypeId === null || f.ticketTypeId === ticketTypeId)
        );
        return field?.fieldLabel || fieldName;
    };

    // Format custom field value
    const formatCustomFieldValue = (
        value: unknown,
        fieldName: string,
        ticketTypeId: number
    ) => {
        const field = customFields.find(
            (f) =>
                f.fieldName === fieldName &&
                (f.ticketTypeId === null || f.ticketTypeId === ticketTypeId)
        );

        if (!field) return String(value);

        switch (field.fieldType) {
            case "CHECKBOX":
                return value ? t("yes") : t("no");
            case "NUMBER":
                return String(value);
            default:
                return String(value);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ListTodo className="w-8 h-8 text-primary"/>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">
                    {t("title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
            </div>

            <div className="space-y-6">
                {/* Attendees information */}
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary"/>
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    {t("attendees.title", {count: attendees.length})}
                                </CardTitle>
                                <CardDescription>{t("attendees.description")}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(attendeesByTicketType).map(
                            ([ticketTypeId, group]) => (
                                <div key={ticketTypeId} className="space-y-3">
                                    {/* Ticket type header */}
                                    <div className="flex items-center gap-2 pb-2">
                                        <Badge variant="outline" className="font-semibold">
                                            {group.ticketTypeName}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                      ({group.attendees.length}{" "}
                                            {t("attendees.participant", {
                                                count: group.attendees.length,
                                            })})
                    </span>
                                    </div>

                                    {/* Attendee list */}
                                    {group.attendees.map((attendee) => {
                                        const index = attendee.originalIndex;
                                        const isExpanded = expandedAttendees.includes(index);
                                        const hasCustomFields =
                                            attendee.customFields &&
                                            Object.keys(attendee.customFields).length > 0;

                                        return (
                                            <Collapsible
                                                key={index}
                                                open={isExpanded}
                                                onOpenChange={() => toggleAttendee(index)}
                                            >
                                                <div
                                                    className={cn(
                                                        "border rounded-lg overflow-hidden transition-colors",
                                                        isExpanded && ""
                                                    )}
                                                >
                                                    <CollapsibleTrigger className="w-full">
                                                        <div
                                                            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-neutral-950 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="font-medium text-gray-900 dark:text-gray-300">
                                                                        {attendee.firstName} {attendee.lastName}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {attendee.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {hasCustomFields && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        {Object.keys(attendee.customFields!).length}{" "}
                                                                        {t("attendees.info", {
                                                                            count: Object.keys(attendee.customFields!)
                                                                                .length,
                                                                        })}
                                                                    </Badge>
                                                                )}
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-5 h-5 text-gray-400"/>
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-gray-400"/>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent>
                                                        <div className="px-4 pb-4 pt-2">
                                                            <div className="space-y-3">
                                                                {/* Basic info */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs font-medium text-gray-500">
                                                                            {t("fields.firstName")}
                                                                        </p>
                                                                        <p className="text-sm text-gray-900 dark:text-gray-300">
                                                                            {attendee.firstName}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-300">
                                                                            {t("fields.lastName")}
                                                                        </p>
                                                                        <p className="text-sm text-gray-900 dark:text-gray-300">
                                                                            {attendee.lastName}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1 md:col-span-2">
                                                                        <p className="text-xs font-medium text-gray-500">
                                                                            {t("fields.email")}
                                                                        </p>
                                                                        <p className="text-sm text-gray-900 dark:text-gray-300">
                                                                            {attendee.email}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Custom fields */}
                                                                {hasCustomFields && (
                                                                    <>
                                                                        <Separator className="my-3"/>
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-gray-700 mb-3">
                                                                                {t("fields.additionalInfo")}
                                                                            </p>
                                                                            <div
                                                                                className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                {Object.entries(
                                                                                    attendee.customFields!
                                                                                ).map(([fieldName, value]) => (
                                                                                    <div
                                                                                        key={fieldName}
                                                                                        className="space-y-1"
                                                                                    >
                                                                                        <p className="text-xs font-medium text-gray-500">
                                                                                            {getCustomFieldLabel(
                                                                                                fieldName,
                                                                                                attendee.ticketTypeId
                                                                                            )}
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-900">
                                                                                            {formatCustomFieldValue(
                                                                                                value,
                                                                                                fieldName,
                                                                                                attendee.ticketTypeId
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </div>
                                            </Collapsible>
                                        );
                                    })}
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>

                {/* Customer info */}
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary"/>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">
                                        {t("customer.title")}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("customer.description")}
                                    </CardDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={previousStep}>
                                <Edit className="w-4 h-4 mr-2"/>
                                {t("customer.edit")}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">
                                    {t("customer.fullName")}
                                </p>
                                <p className="text-base text-gray-900 dark:text-gray-300">
                                    {customerInfo.firstName} {customerInfo.lastName}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">
                                    {t("customer.email")}
                                </p>
                                <p className="text-base text-gray-900 dark:text-gray-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400"/>
                                    {customerInfo.email}
                                </p>
                            </div>
                            {customerInfo.phone && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        {t("customer.phone")}
                                    </p>
                                    <p className="text-base text-gray-900 dark:text-gray-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400"/>
                                        {customerInfo.phone}
                                    </p>
                                </div>
                            )}
                        </div>

                        {customerInfo.subscribeNewsletter && (
                            <div className="mt-4 pt-4 border-t">
                                <Badge variant="secondary" className="gap-1">
                                    ✓ {t("customer.newsletter")}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1" onClick={previousStep}>
                    {t("buttons.back")}
                </Button>
                <Button onClick={async ()=>{
                    const loadingToast = toast.loading(t('order_loading'));

                    nextStep();
                    const order = buildValidatedOrderRequest();
                    const {data, error} = await createOrder(order);
                    if(error) {
                        toast.error(t('order_error'), {id: loadingToast});
                    } else {
                        toast.success(t('order_success'), {id: loadingToast});
                        globalThis.location.href = data?.checkoutUrl || '/';
                    }
                }} className="flex-1">
                    {t("buttons.continueToPayment")}
                </Button>
            </div>
        </div>
    );
};

export default RecapForm;