import { Button, LocalAlert, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject, useContext, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { betterErrorMessage, setCursorBeforeHilsen, MeldingInputContext, useFocusBeforeHilsen } from './inputUtils';
import { MeldingFormValues } from './MeldingInputBox';
import ManagedDialogCheckboxes from '../DialogCheckboxes';
import { dataOrUndefined } from '../../Provider';
import { useOppfolgingContext } from '../../OppfolgingProvider';
import KladdLagret from './KladdLagret';
import { useSelectedDialog } from '../../utils/useAktivitetId';
import MeldingPreview from './MeldingPreview';

const MeldingSideInputInner = () => {
    const { onSubmit, noeFeilet } = useContext(MeldingInputContext);
    const {
        register,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useFormContext<MeldingFormValues>();
    const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
    useFocusBeforeHilsen(textAreaRef);
    const [visForhandsvisning, setVisForhandsvisning] = useState(false);
    const melding = watch('melding');

    const formHooks = register('melding');
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <form className="flex flex-col shrink-0" onSubmit={onSubmit} noValidate autoComplete="off">
                <div className={'flex flex-col'}>
                    <Textarea
                        label="Skriv om arbeid og oppfølging"
                        hideLabel
                        id="melding_input"
                        error={
                            errors.melding ? (
                                <div>{betterErrorMessage(errors.melding, getValues('melding')).message}</div>
                            ) : null
                        }
                        className="overflow-auto"
                        {...formHooks}
                        ref={(ref) => {
                            textAreaRef.current = ref;
                            formHooks.ref(ref);
                        }}
                        placeholder={'Skriv om arbeid og oppfølging'}
                        minRows={3}
                        maxRows={100} // Will overflow before hitting max lines
                        maxLength={5000}
                        onFocus={setCursorBeforeHilsen}
                    />
                    <div className="self-stretch mt-2 flex justify-between items-end">
                        <Button size="small" title="Send" disabled={isSubmitting} loading={isSubmitting}>
                            Send
                        </Button>
                        <KladdLagret />
                    </div>
                </div>

                {noeFeilet ? (
                    <LocalAlert className="mt-4" status="error">
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

export const MeldingSideInput = () => {
    const oppfolgingContext = useOppfolgingContext();
    const oppfolging = dataOrUndefined(oppfolgingContext);
    const dialog = useSelectedDialog();
    if (!dialog) return null;
    return (
        <section aria-label="Ny melding" className="flex flex-1 bg-white p-4">
            <div className="w-full flex flex-col">
                <ManagedDialogCheckboxes dialog={dialog} />
                {!oppfolging?.underOppfolging || dialog.historisk ? null : <MeldingSideInputInner />}
            </div>
        </section>
    );
};
