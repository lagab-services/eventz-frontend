"use client";

import React from 'react';
import { CustomField } from '@/types/customFields';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {Path, UseFormReturn} from 'react-hook-form';

interface CustomFieldRendererProps<TFormValues extends Record<string, unknown>> {
    customField: CustomField;
    form: UseFormReturn<TFormValues>;
}

export const CustomFieldRenderer = <TFormValues extends Record<string, unknown>>({ customField, form }: CustomFieldRendererProps<TFormValues>) => {
    const fieldPath = `customFields.${customField.fieldName}` as Path<TFormValues>;

    const renderField = () => {
        switch (customField.fieldType) {
            case 'TEXT':
            case 'NUMBER':
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{ required: customField.isRequired ? `${customField.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {customField.fieldLabel}
                                    {customField.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type={customField.fieldType === 'NUMBER' ? 'number' : 'text'}
                                        className="bg-background"
                                        placeholder={customField.placeholder}
                                        value={(formField.value ?? "")as string}
                                        onChange={e => formField.onChange(e.target.value)} // map RHF onChange
                                        onBlur={formField.onBlur}
                                        ref={formField.ref}
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
                        rules={{ required: customField.isRequired ? `${customField.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>
                                    {customField.fieldLabel}
                                    {customField.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={customField.placeholder}
                                        className="bg-background"
                                        value={(formField.value ?? "")as string}
                                        onChange={e => formField.onChange(e.target.value)} // map RHF onChange
                                        onBlur={formField.onBlur}
                                        ref={formField.ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'SELECT': {
                const options = customField.fieldOptions
                    ? JSON.parse(customField.fieldOptions).map((opt: string) => opt.trim())
                    : [];
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{required: customField.isRequired ? `${customField.fieldLabel} est requis` : false}}
                        render={({field: formField}) => (
                            <FormItem>
                                <FormLabel>
                                    {customField.fieldLabel}
                                    {customField.isRequired && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <Select onValueChange={formField.onChange} value={(formField.value ?? "") as string}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder={customField.placeholder}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options.map((option: string) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                );
            }

            case 'CHECKBOX':
                return (
                    <FormField
                        control={form.control}
                        name={fieldPath}
                        rules={{ required: customField.isRequired ? `${customField.fieldLabel} est requis` : false }}
                        render={({ field: formField }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={!!formField.value}
                                        onCheckedChange={formField.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        {customField.fieldLabel}
                                        {customField.isRequired && <span className="text-red-500 ml-1">*</span>}
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
