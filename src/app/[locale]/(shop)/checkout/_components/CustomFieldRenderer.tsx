"use client";

import React from 'react';
import { CustomField } from '@/types/customFields';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface CustomFieldRendererProps {
    field: CustomField;
    form: UseFormReturn<any>;
}

export const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({ field, form }) => {
    const fieldPath = `customFields.${field.fieldName}`;

    const renderField = () => {
        switch (field.fieldType) {
            case 'TEXT':
            case 'NUMBER':
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{ required: field.isRequired ? `${field.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {field.fieldLabel}
                                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type={field.fieldType === 'NUMBER' ? 'number' : 'text'}
                                        className="bg-background"
                                        placeholder={field.placeholder}
                                        {...formField}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'TEXTAREA':
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{ required: field.isRequired ? `${field.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {field.fieldLabel}
                                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={field.placeholder}
                                        className="bg-background"
                                        {...formField}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'SELECT':
                const options = field.fieldOptions?.split(',').map(opt => opt.trim()) || [];
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{ required: field.isRequired ? `${field.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {field.fieldLabel}
                                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <Select onValueChange={formField.onChange} value={formField.value} >
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'CHECKBOX':
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{ required: field.isRequired ? `${field.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={formField.value}
                                        onCheckedChange={formField.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        {field.fieldLabel}
                                        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                                    </FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            default:
                return null;
        }
    };

    return renderField();
};
