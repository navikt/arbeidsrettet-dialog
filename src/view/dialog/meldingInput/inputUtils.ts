import { FieldError } from 'react-hook-form';
import React, { MutableRefObject, useEffect, useRef } from 'react';
export const maxMeldingsLengde = 5000;
export const betterErrorMessage = (error: FieldError, melding: string): FieldError => {
    const tooBig = error.type === 'too_big';
    return {
        ...error,
        message: tooBig
            ? `Meldingen kan ikke være mer enn ${maxMeldingsLengde} tegn, men er ${melding.length}`
            : error.message,
    };
};

export const debounced = <T extends Function>(
    fn: T,
): { hasPendingTask: () => boolean; cleanup: () => void; invoke: T } => {
    let timer: any | undefined;
    const invoke = (...args: any): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = undefined;
        }, 500);
    };
    const cleanup = () => {
        clearTimeout(timer);
    };
    const hasPendingTask = () => {
        return timer !== undefined;
    };
    return { cleanup, invoke: invoke as unknown as T, hasPendingTask };
};

export interface MeldingInputArgs {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    noeFeilet: boolean;
    kladdErLagret: boolean;
}
export const MeldingInputContext = React.createContext<MeldingInputArgs>({
    onSubmit: (_) => Promise.resolve(),
    noeFeilet: false,
    kladdErLagret: false,
});

export const useFocusBeforeHilsen = (textAreaRef: MutableRefObject<HTMLTextAreaElement | null>) => {
    // Avoid setting focus twice, making the textarea "flash"
    const hasFocus = useRef(false);
    useEffect(() => {
        if (textAreaRef.current === null) return;
        const setHasFocusTrue = (_: FocusEvent) => (hasFocus.current = true);
        const setHasFocusFalse = (_: FocusEvent) => (hasFocus.current = false);
        textAreaRef.current?.addEventListener('blur', setHasFocusFalse);
        textAreaRef.current?.addEventListener('focus', setHasFocusTrue);
    }, [textAreaRef.current]);
};

export const setCursorBeforeHilsen = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const textBox = event.target;
    if (textBox) {
        const textValue = textBox.value;
        const lines = textValue.split('\n');
        const lastLine = lines.at(-1);

        if (lastLine && lastLine.trim().startsWith('Hilsen')) {
            const numLinesBeforeLast = lines.length - 2;
            const cursorPosition = lines.slice(0, numLinesBeforeLast).join('\n').length;

            textBox.setSelectionRange(cursorPosition, cursorPosition);
            textBox.focus();
        }
    }
};
