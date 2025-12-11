import {createContext, ReactNode} from 'react';
import {MultiStepFormContextProps} from "@/types/MultiStepForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MultiStepFormContext = createContext<MultiStepFormContextProps<any> | null>(null);


export const MultiStepFormProvider = ({children, value}: {
    children?: ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: MultiStepFormContextProps<any>
}) => {
    return (
        <MultiStepFormContext.Provider value={value}>
            {children}
        </MultiStepFormContext.Provider>
    );
};