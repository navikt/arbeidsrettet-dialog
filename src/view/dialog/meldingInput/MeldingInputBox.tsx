import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import loggEvent from '../../../felleskomponenter/logging';
import { DialogData } from '../../../utils/Typer';
import { dispatchUpdate, UpdateTypes } from '../../../utils/UpdateEvent';
import { useDialogContext } from '../../DialogProvider';
import { sendtNyMelding, useSetViewContext, useViewContext } from '../../ViewState';
import useMeldingStartTekst from '../UseMeldingStartTekst';
import { MeldingInput } from './MeldingInput';
import { debounced, maxMeldingsLengde, MeldingInputContext } from './inputUtils';
import { Status } from '../../../api/typer';
import ManagedDialogCheckboxes from '../DialogCheckboxes';
import { useDialogStore, useSilentlyHentDialoger } from '../../dialogProvider/dialogStore';
import { useErVeileder, useFnrContext } from '../../Provider';
import useKansendeMelding from '../../../utils/UseKanSendeMelding';
import { useShallow } from 'zustand/react/shallow';

interface Props {
    dialog: DialogData; // Bruker prop og ikke context siden komponent ikke skal rendrer uten en valgt dialog
}

const schema = (startTekst: string) =>
    z.object({
        melding: z
            .string()
            .min(1, 'Du må fylle ut en melding')
            .max(maxMeldingsLengde, `Meldingen kan ikke være mer enn ${maxMeldingsLengde}`)
            .refine((melding) => melding !== startTekst, {
                message: 'Du må fylle ut en melding'
            })
    });

export type MeldingFormValues = z.infer<ReturnType<typeof schema>>;

const MeldingInputBox = ({ dialog: valgtDialog }: Props) => {
    const erVeileder = useErVeileder();
    const aktivDialog = !valgtDialog.historisk;
    const kanSendeMelding = useKansendeMelding();
    const kanSendeHenveldelse = kanSendeMelding && aktivDialog;

    const { nyMelding } = useDialogContext();
    const fnr = useFnrContext();
    const silentlyHentDialoger = useSilentlyHentDialoger();
    const [noeFeilet, setNoeFeilet] = useState(false);
    const startTekst = useMeldingStartTekst();
    const { kladder, oppdaterKladd, slettKladd, oppdaterStatus } = useDialogStore(
        useShallow((store) => ({
            kladder: store.kladder,
            oppdaterKladd: store.oppdaterKladd,
            slettKladd: store.slettKladd,
            oppdaterStatus: store.kladdStatus
        }))
    );

    const kladd = kladder.find((k) => k.aktivitetId === valgtDialog.aktivitetId && k.dialogId === valgtDialog.id);
    const viewState = useViewContext();
    const setViewState = useSetViewContext();

    const defaultValues: MeldingFormValues = {
        melding: kladd?.tekst || startTekst
    };
    const formHandlers = useForm<MeldingFormValues>({
        defaultValues,
        resolver: zodResolver(schema(startTekst))
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
        debouncedOppdaterKladd({
            fnr,
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
                    reset({ melding: startTekst });
                    return dialog;
                })
                .then(() => silentlyHentDialoger(fnr))
                .then(() => {
                    setNoeFeilet(false);
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

    const memoedHandleSubmit = useMemo(() => {
        return handleSubmit((data) => onSubmit(data));
    }, [onSubmit]);
    const args = useMemo(() => {
        return { noeFeilet, onSubmit: memoedHandleSubmit, kladdErLagret };
    }, [noeFeilet, memoedHandleSubmit, kladdErLagret]);

    if (!kanSendeHenveldelse && erVeileder) return <ManagedDialogCheckboxes dialog={valgtDialog} />; //hvis bruker går inn uner krr eller manuel må veileder kunne fjerne venter på

    if (!kanSendeHenveldelse) {
        return null;
    }
    return (
        <FormProvider {...formHandlers}>
            <MeldingInputContext.Provider value={args}>
                <MeldingInput />
            </MeldingInputContext.Provider>
        </FormProvider>
    );
};

export default MeldingInputBox;
