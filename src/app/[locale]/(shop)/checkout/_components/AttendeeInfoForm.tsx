"use client";

import {useEffect, useState} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Mail, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCheckoutStore } from "@/lib/store/checkout";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { z } from 'zod';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from 'next-intl';
import {CustomFieldRenderer} from "./CustomFieldRenderer";
import {AttendeeInfo} from "@/types/checkout";


// Validation schema for an attendee
const createAttendeeSchema = (customFields: any[]) => {
    const customFieldsSchema: Record<string, any> = {};

    customFields.forEach(field => {
        if (field.isRequired) {
            switch (field.fieldType) {
                case 'TEXT':
                case 'TEXTAREA':
                    customFieldsSchema[field.fieldName] = z.string().min(1, `${field.fieldLabel} est requis`);
                    break;
                case 'NUMBER':
                    customFieldsSchema[field.fieldName] = z.number().min(0, `${field.fieldLabel} est requis`);
                    break;
                case 'SELECT':
                    customFieldsSchema[field.fieldName] = z.string().min(1, `${field.fieldLabel} est requis`);
                    break;
                case 'CHECKBOX':
                    customFieldsSchema[field.fieldName] = z.boolean().refine(val => val === true, {
                        message: `${field.fieldLabel} est requis`
                    });
                    break;
            }
        } else {
            customFieldsSchema[field.fieldName] = z.any().optional();
        }
    });

    return z.object({
        firstName: z.string().min(2, 'First name must contain at least 2 characters'),
        lastName: z.string().min(2, 'Last name must contain at least 2 characters'),
        email: z.email('Invalid email'),
        ticketTypeId: z.number(),
        ticketTypeName: z.string(),
        customFields: z.object(customFieldsSchema).optional(),
    });
};

type AttendeeInfoSchema = z.infer<typeof createAttendeeSchema>;

interface AttendeeInfoFormProps {
    eventId: number;
}

const AttendeeInfoForm = ({ eventId }: AttendeeInfoFormProps) => {
    const t = useTranslations('checkout');

    const { attendees, customerInfo, updateAttendee, setCustomerInfo, nextStep, previousStep, customFields } = useCheckoutStore();

    const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
    const [completedAttendees, setCompletedAttendees] = useState<number[]>([]);
    const [expandedItems, setExpandedItems] = useState<string[]>(['attendee-0']);

    const currentAttendee = attendees[currentAttendeeIndex];

    const getCustomFieldsForTicket = (ticketTypeId: number) => {
        return customFields
            .filter(field =>
                field.ticketTypeId === null || field.ticketTypeId === ticketTypeId
            )
            .sort((a, b) => a.displayOrder - b.displayOrder);
    };

    const relevantCustomFields = currentAttendee
        ? getCustomFieldsForTicket(currentAttendee.ticketTypeId)
        : [];

    const attendeeSchema = createAttendeeSchema(relevantCustomFields);

    const form = useForm<AttendeeInfoSchema>({
        resolver: zodResolver(attendeeSchema),
        defaultValues: currentAttendee || {
            firstName: '',
            lastName: '',
            email: '',
            ticketTypeId: 0,
            ticketTypeName: '',
            customFields: {},
        },
    });

    useEffect(() => {
        if (currentAttendee) {
            if (currentAttendeeIndex === 0 && customerInfo.email) {
                form.reset({
                    ...currentAttendee,
                    firstName: customerInfo.firstName || currentAttendee.firstName,
                    lastName: customerInfo.lastName || currentAttendee.lastName,
                    email: customerInfo.email || currentAttendee.email,
                });
            } else {
                form.reset(currentAttendee);
            }
        }
    }, [currentAttendeeIndex, currentAttendee, form, customerInfo]);

    const onSubmit = (data: AttendeeInfo) => {
        updateAttendee(currentAttendeeIndex, data);

        if (currentAttendeeIndex === 0) {
            setCustomerInfo({
                ...customerInfo,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
            });
        }

        if (!completedAttendees.includes(currentAttendeeIndex)) {
            setCompletedAttendees([...completedAttendees, currentAttendeeIndex]);
        }

        if (currentAttendeeIndex < attendees.length - 1) {
            setCurrentAttendeeIndex(currentAttendeeIndex + 1);
            setExpandedItems([`attendee-${currentAttendeeIndex + 1}`]);
        } else {
            nextStep();
        }
    };

    const goToAttendee = (index: number) => {
        const currentData = form.getValues();
        updateAttendee(currentAttendeeIndex, currentData);
        setCurrentAttendeeIndex(index);
        setExpandedItems([`attendee-${index}`]);
    };

    const handlePrevious = () => {
        if (currentAttendeeIndex > 0) {
            const currentData = form.getValues();
            updateAttendee(currentAttendeeIndex, currentData);
            setCurrentAttendeeIndex(currentAttendeeIndex - 1);
            setExpandedItems([`attendee-${currentAttendeeIndex - 1}`]);
        } else {
            previousStep();
        }
    };

    const isAttendeeComplete = (index: number) => {
        const attendee = attendees[index];
        return attendee.firstName && attendee.lastName && attendee.email;
    };

    const allAttendeesComplete = attendees.every((_, index) => isAttendeeComplete(index));

    useEffect(() => {
        if (allAttendeesComplete) {
            setExpandedItems([]);
        }
    }, [allAttendeesComplete]);

    const attendeesByTicketType = attendees.reduce((acc, attendee, index) => {
        const key = attendee.ticketTypeId;
        if (!acc[key]) {
            acc[key] = {
                ticketTypeName: attendee.ticketTypeName,
                attendees: [],
            };
        }
        acc[key].attendees.push({ ...attendee, originalIndex: index });
        return acc;
    }, {} as Record<number, { ticketTypeName: string; attendees: (AttendeeInfo & { originalIndex: number })[] }>);

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{t('attendee.title')}</CardTitle>
                    <CardDescription>
                        {t('attendee.description', {
                            completed: completedAttendees.length,
                            total: attendees.length,
                        })}
                    </CardDescription>
                </CardHeader>

                <CardContent className=" px-0 md:px-6">
                    <div className="mb-6">
                        <Accordion
                            type="multiple"
                            value={expandedItems}
                            onValueChange={setExpandedItems}
                            className="space-y-4"
                        >
                            {Object.entries(attendeesByTicketType).map(([ticketTypeId, group]) => (
                                <div key={ticketTypeId} className="space-y-2">
                                    <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400 px-4">
                                        {group.ticketTypeName}
                                    </h3>
                                    {group.attendees.map((attendee, groupIndex) => {
                                        const index = attendee.originalIndex;
                                        const isComplete = isAttendeeComplete(index);
                                        const isCurrent = index === currentAttendeeIndex;

                                        return (
                                            <AccordionItem
                                                key={index}
                                                value={`attendee-${index}`}
                                                className={cn(
                                                    "border rounded-lg last:border-b-1",
                                                    isCurrent && "border-primary",
                                                    isComplete && "bg-green-50 dark:bg-green-950/15 border-green-200 dark:border-green-950",
                                                )}
                                            >
                                                <AccordionTrigger
                                                    className="px-4 hover:no-underline"
                                                    onClick={() => goToAttendee(index)}
                                                >
                                                    <div className="flex md:items-center justify-between w-full md:pr-4 flex-col md:flex-row gap-2 md:gap-0">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                                                isComplete ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                                                            )}>
                                                                {isComplete ? <Check className="w-4 h-4" /> : index + 1}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-medium dark:text-gray-100">
                                                                    {t('attendee.label', { index: index + 1 })}
                                                                </p>
                                                                {attendee.firstName && attendee.lastName && (
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {attendee.firstName} {attendee.lastName}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge variant={isComplete ? "default" : "outline"} className="dark:bg-gray-700 dark:text-white">
                                                            {group.ticketTypeName}
                                                        </Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    {isCurrent && (
                                                        <Form {...form}>
                                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="firstName"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>{t('fields.firstName')}</FormLabel>
                                                                                <FormControl>
                                                                                    <Input className="bg-background" placeholder={t('placeholders.firstName')} {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />

                                                                    <FormField
                                                                        control={form.control}
                                                                        name="lastName"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>{t('fields.lastName')}</FormLabel>
                                                                                <FormControl>
                                                                                    <Input className="bg-background" placeholder={t('placeholders.lastName')} {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>

                                                                <FormField
                                                                    control={form.control}
                                                                    name="email"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>{t('fields.email')}</FormLabel>
                                                                            <FormControl>
                                                                                <div className="relative">
                                                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                                                    <Input className="pl-12 bg-background" placeholder={t('placeholders.email')} {...field} />
                                                                                </div>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                {/* Custom Fields Section */}
                                                                {relevantCustomFields.length > 0 && (
                                                                    <div className="space-y-4 pt-4 border-t">
                                                                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-400">
                                                                            {t('fields.additionalInfo')}
                                                                        </h4>
                                                                        <div className="grid grid-cols-1 gap-4">
                                                                            {relevantCustomFields.map((customField) => (
                                                                                <CustomFieldRenderer
                                                                                    key={customField.id}
                                                                                    field={customField}
                                                                                    form={form}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-3 pt-4 justify-between">
                                                                    {currentAttendeeIndex === 0 ? (
                                                                        <span></span>
                                                                    ) : (
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={handlePrevious}
                                                                        >
                                                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                                                            {t('actions.previous')}
                                                                        </Button>
                                                                    )}

                                                                    <Button type="submit">
                                                                        {currentAttendeeIndex < attendees.length - 1
                                                                            ? t('actions.next')
                                                                            : t('actions.continue')}
                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        </Form>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </div>
                            ))}
                        </Accordion>
                    </div>

                    {allAttendeesComplete && (
                        <div className="mt-12 p-4 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
                            <div className="flex flex-col md:flex-row  gap-4 md:gap-0 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-300" />
                                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                        {t('summary.complete')}
                                    </p>
                                </div>
                                <Button onClick={nextStep}>
                                    {t('actions.goToPayment')}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AttendeeInfoForm;
