import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import loggEvent from '../../../felleskomponenter/logging';
import { DialogData } from '../../../utils/Typer';
import { dispatchUpdate, UpdateTypes } from '../../../utils/UpdateEvent';
import { useDialogContext } from '../../DialogProvider';
import { useKladdContext } from '../../KladdProvider';
import { sendtNyMelding, useSetViewContext, useViewContext } from '../../ViewState';
import useMeldingStartTekst from '../UseMeldingStartTekst';
import { Breakpoint, useBreakpoint } from '../../utils/useBreakpoint';
import { MeldingBottomInput } from './MeldingBottomInput';
import { MeldingSideInput } from './MeldingSideInput';
import { debounced, maxMeldingsLengde, MeldingInputContext } from './inputUtils';
import { useVisAktivitet } from '../../AktivitetToggleContext';
import { Status } from '../../../api/typer';
import ManagedDialogCheckboxes from '../DialogCheckboxes';
import { useFnrContext } from '../../Provider';
import useKansendeMelding from '../../../utils/UseKanSendeMelding';
import { useHentDialoger } from '../../dialogProvider/storeHooks';

const schema = z.object({
    melding: z
        .string()
        .min(1, 'Du må fylle ut en melding')
        .max(maxMeldingsLengde, `Meldingen kan ikke være mer enn ${maxMeldingsLengde}`)
});

export type MeldingFormValues = z.infer<typeof schema>;

interface Props {
    dialog: DialogData; // Bruker prop og ikke context siden komponent ikke skal rendrer uten en valgt dialog
}

const MeldingInputBox = ({ dialog: valgtDialog }: Props) => {
    const aktivDialog = !valgtDialog.historisk;
    const kanSendeMelding = useKansendeMelding();
    const kanSendeHenveldelse = kanSendeMelding && aktivDialog;

    const { nyMelding } = useDialogContext();
    const fnr = useFnrContext();
    const hentDialoger = useHentDialoger();
    const [noeFeilet, setNoeFeilet] = useState(false);
    const startTekst = useMeldingStartTekst();
    const visAktivitet = useVisAktivitet();
    const { kladder, oppdaterKladd, slettKladd, oppdaterStatus } = useKladdContext();
    const kladd = kladder.find((k) => k.aktivitetId === valgtDialog.aktivitetId && k.dialogId === valgtDialog.id);
    const viewState = useViewContext();
    const setViewState = useSetViewContext();

    const defaultValues: MeldingFormValues = {
        melding: kladd?.tekst || startTekst
    };
    const formHandlers = useForm<MeldingFormValues>({
        defaultValues,
        resolver: zodResolver(schema)
    });
    const { handleSubmit, reset, watch } = formHandlers;

    const valgtDialogId = valgtDialog.id;
    useEffect(() => {
        reset(defaultValues);
    }, [valgtDialogId]);

    const melding = watch('melding');
    const {
        cleanup: stopKladdSyncing,
        invoke: debouncedOppdaterKladd,
        hasPendingTask: kladdSkalOppdateres
    } = useMemo(() => {
        return debounced(oppdaterKladd);
    }, []);

    useEffect(() => {
        if (melding === defaultValues.melding) return;
        debouncedOppdaterKladd(fnr, {
            dialogId: valgtDialog.id,
            aktivitetId: valgtDialog.aktivitetId,
            overskrift: null,
            tekst: melding
        });
    }, [melding]);

    const onSubmit = useMemo(() => {
        return ({ melding }: MeldingFormValues) => {
            setNoeFeilet(false);
            stopKladdSyncing();
            loggEvent('arbeidsrettet-dialog.ny.henvendelse', { paaAktivitet: !!valgtDialog.aktivitetId });
            return nyMelding({ melding, dialog: valgtDialog, fnr })
                .then((dialog) => {
                    slettKladd(valgtDialog.id, valgtDialog.aktivitetId);
                    return dialog;
                })
                .then(() => hentDialoger(fnr))
                .then(() => {
                    setNoeFeilet(false);
                    reset({ melding: startTekst });
                    setViewState(sendtNyMelding(viewState));
                    dispatchUpdate(UpdateTypes.Dialog);
                })
                .catch((e) => {
                    console.log({ e });
                    setNoeFeilet(true);
                });
        };
    }, [slettKladd, setViewState, startTekst, stopKladdSyncing, valgtDialog.aktivitetId, valgtDialog.id, viewState]);

    const kladdErLagret = melding !== startTekst && !kladdSkalOppdateres() && Status.OK === oppdaterStatus;

    const breakpoint = useBreakpoint();
    const memoedHandleSubmit = useMemo(() => {
        return handleSubmit((data) => onSubmit(data));
    }, [onSubmit]);
    const args = useMemo(() => {
        return { noeFeilet, onSubmit: memoedHandleSubmit, kladdErLagret };
    }, [noeFeilet, memoedHandleSubmit, kladdErLagret]);

    // Important! Avoid re-render of textarea-input because it loses focus
    const Input = useCallback(() => {
        if (visAktivitet && [Breakpoint.md, Breakpoint.lg, Breakpoint.xl].includes(breakpoint)) {
            return <MeldingBottomInput />;
        } else if ([Breakpoint.initial, Breakpoint.sm, Breakpoint.md].includes(breakpoint)) {
            return <MeldingBottomInput />;
        } else {
            return <MeldingSideInput />;
        }
    }, [breakpoint, visAktivitet]);

    if (!kanSendeHenveldelse && (valgtDialog.venterPaSvar || !valgtDialog.ferdigBehandlet))
        return <ManagedDialogCheckboxes />; //hvis bruker går inn uner krr eller manuel må veileder kunne fjerne venter på

    if (!kanSendeHenveldelse) return null;
    return (
        <FormProvider {...formHandlers}>
            <MeldingInputContext.Provider value={args}>
                <Input />
            </MeldingInputContext.Provider>
        </FormProvider>
    );
};

export default MeldingInputBox;
