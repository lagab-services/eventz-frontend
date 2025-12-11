import {useContext} from "react";
import {MultiStepFormContext} from "@/components/multi-step-form/MultiStepFormContext";

export const useMultiStepForm = () => {
    const context = useContext(MultiStepFormContext);
    if (!context) {
        throw new Error('useMultiStepForm must be used within MultiStepForm');
    }
    return context;
};