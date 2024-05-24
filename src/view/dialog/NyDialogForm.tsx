import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, GuidePanel, TextField, Textarea } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import loggEvent from '../../felleskomponenter/logging';
import { useRoutes } from '../../routing/routes';
import { UpdateTypes, dispatchUpdate } from '../../utils/UpdateEvent';
import { useDialogContext } from '../DialogProvider';
import { findKladd } from '../KladdProvider';
import { cutStringAtLength } from '../utils/stringUtils';
import useMeldingStartTekst from './UseMeldingStartTekst';
import { HandlingsType } from '../ViewState';
import { useErVeileder, useFnrContext } from '../Provider';
import { useDialogStore } from '../dialogProvider/dialogStore';
import { useShallow } from 'zustand/react/shallow';
import useKansendeMelding from '../../utils/UseKanSendeMelding';

const maxMeldingsLengde = 5000;

const schema = z.object({
    tema: z.string().min(1, 'Du må skrive et tema for dialogen').max(100, 'Tema kan ikke være mer enn 100 tegn'),
    melding: z
        .string()
        .min(1, 'Du må skrive en melding')
        .max(maxMeldingsLengde, `Meldingen kan ikke være mer enn ${maxMeldingsLengde}`)
});

export type NyDialogFormValues = z.infer<typeof schema>;

interface Props {
    defaultTema: string;
    aktivitetId?: string;
}

const NyDialogForm = (props: Props) => {
    const kansendeMelding = useKansendeMelding();
    const { defaultTema, aktivitetId } = props;
    const hentDialoger = useDialogStore((store) => store.hentDialoger);
    const { nyDialog } = useDialogContext();
    const navigate = useNavigate();
    const { dialogRoute, baseRoute } = useRoutes();
    const [noeFeilet, setNoeFeilet] = useState(false);
    const startTekst = useMeldingStartTekst();

    const fnr = useFnrContext();
    const { kladder, oppdaterKladd, slettKladd } = useDialogStore(
        useShallow((store) => ({
            kladder: store.kladder,
            oppdaterKladd: store.oppdaterKladd,
            slettKladd: store.slettKladd
        }))
    );
    const kladd = findKladd(kladder, null, aktivitetId);
    const autoFocusTema = !aktivitetId;

    const defaultValues: NyDialogFormValues = {
        tema: kladd?.overskrift ?? cutStringAtLength(defaultTema, 100, '...'),
        melding: !!kladd?.tekst ? kladd.tekst : startTekst
    };

    const {
        trigger,
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, dirtyFields }
    } = useForm<NyDialogFormValues>({
        defaultValues,
        resolver: zodResolver(schema)
    });

    const melding = watch('melding');
    const tema = watch('tema');

    const timer = useRef<number | undefined>();
    const callback = useRef<() => any>();

    useEffect(() => {
        return () => {
            timer.current && clearInterval(timer.current);
            timer.current && callback.current && callback.current();
        };
    }, []);

    const erVeileder = useErVeileder();

    const setOppdaterKladdCallbackValues = ({
        tema,
        melding
    }: {
        tema: string | undefined;
        melding: string | undefined;
    }) => {
        timer.current && clearInterval(timer.current);
        callback.current = () => {
            timer.current = undefined;
            oppdaterKladd({
                fnr,
                dialogId: null,
                aktivitetId: props.aktivitetId || null,
                overskrift: tema || null,
                tekst: melding || null
            });
        };
        timer.current = window.setTimeout(callback.current, 500);
    };

    useEffect(() => {
        if (dirtyFields.melding || dirtyFields.tema) {
            const dirtyFieldsList = Object.keys(dirtyFields) as ('melding' | 'tema')[];
            // Do not update kladd if any field is invalid
            trigger(dirtyFieldsList).then((isValid) => {
                if (!isValid && !melding && !tema) {
                    slettKladd(null, props.aktivitetId);
                } else if (!isValid) {
                    timer.current = undefined;
                } else {
                    setOppdaterKladdCallbackValues({ melding, tema });
                }
            });
        }
    }, [melding, tema, dirtyFields]);

    const onSubmit = (data: NyDialogFormValues) => {
        const { tema, melding } = data;

        timer.current && clearInterval(timer.current);
        timer.current = undefined;

        loggEvent('arbeidsrettet-dialog.ny.dialog', { paaAktivitet: !!aktivitetId });
        return nyDialog({ melding, tema, aktivitetId, fnr })
            .then((dialog) => {
                slettKladd(null, props.aktivitetId);
                navigate(dialogRoute(dialog.id), { state: { sistHandlingsType: HandlingsType.nyDialog } });
                dispatchUpdate(UpdateTypes.Dialog);
                return dialog;
            })
            .then(() => hentDialoger(fnr))
            .catch(() => setNoeFeilet(true));
    };

    const bigScreen = window.innerWidth >= 768;

    return (
        <div className="relative h-full w-full overflow-scroll bg-gray-100 lg:max-w-lgContainer xl:max-w-none">
            <form
                className="space-y-8 p-8 xl:w-full xl:max-w-max-paragraph"
                onSubmit={handleSubmit((data) => onSubmit(data))}
                autoComplete="off"
            >
                {!erVeileder ? (
                    <>
                        <GuidePanel poster={!bigScreen}>
                            Her kan du skrive til din veileder om arbeid og oppfølging. Du vil få svar i løpet av noen
                            dager.
                        </GuidePanel>
                    </>
                ) : null}
                <TextField
                    label="Tema (obligatorisk)"
                    description="Skriv kort hva dialogen skal handle om"
                    disabled={!!aktivitetId || !kansendeMelding}
                    autoFocus={autoFocusTema}
                    {...register('tema')}
                    error={errors.tema && errors.tema.message}
                />
                <Textarea
                    label="Melding (obligatorisk)"
                    description="Skriv om arbeid og oppfølging"
                    maxLength={5000}
                    {...register('melding')}
                    error={errors.melding && errors.melding.message}
                    autoFocus={!autoFocusTema}
                />

                {noeFeilet ? (
                    <Alert variant="error">Noe gikk dessverre galt med systemet. Prøv igjen senere.</Alert>
                ) : null}

                <div className="flex flex-row gap-x-4">
                    <Button size="small" loading={isSubmitting}>
                        Send
                    </Button>
                    <Button
                        size="small"
                        variant="tertiary"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(baseRoute());
                        }}
                    >
                        Avbryt
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NyDialogForm;
