import { Button, ErrorMessage, LocalAlert, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject, useContext, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { betterErrorMessage, MeldingInputContext, useFocusBeforeHilsen, setCursorBeforeHilsen } from './inputUtils';
import { MeldingFormValues } from './MeldingInputBox';
import { PaperplaneIcon } from '@navikt/aksel-icons';
import { Breakpoint, useBreakpoint } from '../../utils/useBreakpoint';
import { dataOrUndefined } from '../../Provider';
import { useOppfolgingContext } from '../../OppfolgingProvider';
import KladdLagret from './KladdLagret';
import { useSelectedDialog } from '../../utils/useAktivitetId';
import ManagedDialogCheckboxes from '../DialogCheckboxes';
import MeldingPreview from './MeldingPreview';

const MeldingBottomInputInner = () => {
    const { onSubmit, noeFeilet } = useContext(MeldingInputContext);
    const {
        register,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useFormContext<MeldingFormValues>();
    const breakpoint = useBreakpoint();
    const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
    useFocusBeforeHilsen(textAreaRef);
    const [visForhandsvisning, setVisForhandsvisning] = useState(false);
    const melding = watch('melding');

    const formHooks = register('melding');
    return (
        <div>
            <form className="flex flex-1 flex-col" onSubmit={onSubmit} noValidate autoComplete="off">
                <div className="flex items-end gap-2">
                    <label htmlFor="melding_input" className="sr-only">
                        Skriv om arbeid og oppfølging
                    </label>
                    <Textarea
                        id="melding_input"
                        className="w-full"
                        {...formHooks}
                        ref={(ref) => {
                            textAreaRef.current = ref;
                            formHooks.ref(ref);
                        }}
                        placeholder={'Skriv om arbeid og oppfølging'}
                        minRows={3}
                        maxRows={12}
                        maxLength={5000}
                        label="Skriv om arbeid og oppfølging"
                        hideLabel
                        onFocus={setCursorBeforeHilsen}
                    />
                    <div className="flex flex-col relative space-y-2 pb-6">
                        <Button
                            size="small"
                            className="self-center mx-2"
                            title="Send"
                            icon={breakpoint === Breakpoint.initial ? <PaperplaneIcon /> : undefined}
                            loading={isSubmitting}
                        >
                            {breakpoint !== Breakpoint.initial ? 'Send' : ''}
                        </Button>
                        <div className="-ml-8 bottom-0 right-0 absolute w-24 h-5 overflow-x-visible">
                            <KladdLagret />
                        </div>
                    </div>
                </div>
                {errors.melding ? (
                    <ErrorMessage className="mt-2" size="small">
                        {betterErrorMessage(errors.melding, getValues('melding')).message}
                    </ErrorMessage>
                ) : null}
                {noeFeilet ? (
                    <LocalAlert status={'error'} className="mt-4">
                        Noe gikk dessverre galt med systemet. Prøv igjen senere.
                    </LocalAlert>
                ) : null}
            </form>
            <MeldingPreview
                tekst={melding}
                visible={visForhandsvisning}
                onToggle={() => setVisForhandsvisning((prev) => !prev)}
            />
        </div>
    );
};

export const MeldingBottomInput = () => {
    const oppfolgingContext = useOppfolgingContext();
    const oppfolging = dataOrUndefined(oppfolgingContext);
    const dialog = useSelectedDialog();
    if (!dialog) {
        console.log('Invisble');
        return null;
    }
    return (
        <section
            aria-label="Ny melding"
            className="flex justify-center border-t border-ax-border-neutral-subtle p-4 overflow-y-scroll"
        >
            <div className="grow justify-self-center ">
                <ManagedDialogCheckboxes dialog={dialog} />
                {!oppfolging?.underOppfolging || dialog.historisk ? null : <MeldingBottomInputInner />}
            </div>
        </section>
    );
};
