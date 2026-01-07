import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, GuidePanel, TextField, Textarea, BodyShort, Checkbox } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { redirect, useNavigate } from 'react-router';
import { z } from 'zod';
import loggEvent from '../../felleskomponenter/logging';
import { useRoutes } from '../../routing/routes';
import { findKladd } from '../KladdProvider';
import { cutStringAtLength } from '../utils/stringUtils';
import useMeldingStartTekst from './UseMeldingStartTekst';
import { useErVeileder, useFnrContext } from '../Provider';
import { useDialogStore } from '../dialogProvider/dialogStore';
import { useShallow } from 'zustand/react/shallow';
import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { ActionFunction, useFetcher } from 'react-router-dom';
import { Status } from '../../api/typer';
import { SubmitTarget } from 'react-router-dom/dist/dom';
import { NyTradArgs } from '../DialogProvider';
import { dispatchUpdate, UpdateTypes } from '../../utils/UpdateEvent';
import { useInnsynsrett } from '../../api/useInnsynsrett';
import { setCursorBeforeHilsen } from './meldingInput/inputUtils';

interface Props {
    defaultTema: string;
    aktivitetId?: string;
}

const NyDialogForm = (props: Props) => {
    const kansendeMelding = useKansendeMelding();
    const { defaultTema, aktivitetId } = props;
    const innsynsrett = useInnsynsrett();
    const navigate = useNavigate();
    const { baseRoute } = useRoutes();
    const startTekst = useMeldingStartTekst();
    const fnr = useFnrContext();
    const [venterPaaSvarFraBruker, setventerPaaSvarFraBruker] = useState<boolean>(false);
    const { kladder, oppdaterKladd, slettKladd, noeFeilet } = useDialogStore(
        useShallow((store) => ({
            kladder: store.kladder,
            oppdaterKladd: store.oppdaterKladd,
            slettKladd: store.slettKladd,
            noeFeilet: store.status === Status.ERROR,
        })),
    );

    const kladd = findKladd(kladder, null, aktivitetId);

    const defaultValues: NyDialogFormValues = {
        tema: kladd?.overskrift ?? cutStringAtLength(defaultTema, 100, '...'),
        melding: !!kladd?.tekst ? kladd.tekst : startTekst,
    };

    const maxMeldingsLengde = 5000;

    const schema = z.object({
        tema: z.string().min(1, 'Du må skrive et tema for dialogen').max(100, 'Tema kan ikke være mer enn 100 tegn'),
        melding: z
            .string()
            .min(1, 'Du må skrive en melding')
            .max(maxMeldingsLengde, `Meldingen kan ikke være mer enn ${maxMeldingsLengde}`)
            .refine((melding) => melding !== startTekst, {
                message: 'Du må fylle ut en melding',
            }),
    });

    type NyDialogFormValues = z.infer<typeof schema>;

    const {
        trigger,
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<NyDialogFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === 'submitting';

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

    const setOppdaterKladdCallbackValues = ({
        tema,
        melding,
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
                tekst: melding || null,
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

    const onSubmit = async (data: NyDialogFormValues) => {
        const { tema, melding } = data;

        timer.current && clearInterval(timer.current);
        timer.current = undefined;

        loggEvent('arbeidsrettet-dialog.ny.dialog', { paaAktivitet: !!aktivitetId });
        // This will submit to route action
        fetcher.submit({ melding, tema, aktivitetId, fnr, venterPaaSvarFraBruker } as SubmitTarget, {
            method: 'POST',
            action: '/ny',
            encType: 'application/json',
        });
    };

    const bigScreen = window.innerWidth >= 768;
    const toggleVenterPaSvar = () => setventerPaaSvarFraBruker(!venterPaaSvarFraBruker);

    return (
        <div className="relative h-full w-full overflow-scroll bg-gray-100 lg:max-w-lgContainer xl:max-w-none">
            <form
                className="space-y-8 p-8 xl:w-full xl:max-w-max-paragraph"
                onSubmit={handleSubmit((data) => onSubmit(data))}
                autoComplete="off"
            >
                <GuidePanel poster={!bigScreen}>
                    <BodyShort>
                        Her kan du skrive til din veileder om arbeid og oppfølging. Du vil få svar i løpet av noen
                        dager.
                    </BodyShort>
                    {innsynsrett && (
                        <BodyShort>Husk at dine foresatte kan be om å få lese det du skriver her.</BodyShort>
                    )}
                </GuidePanel>
                <TextField
                    label="Tema (obligatorisk)"
                    description="Skriv kort hva dialogen skal handle om"
                    disabled={!!aktivitetId || !kansendeMelding}
                    {...register('tema')}
                    error={errors.tema && errors.tema.message}
                />
                <Textarea
                    label="Melding (obligatorisk)"
                    description="Skriv om arbeid og oppfølging"
                    disabled={!kansendeMelding}
                    maxLength={5000}
                    {...register('melding')}
                    error={errors.melding && errors.melding.message}
                    onFocus={setCursorBeforeHilsen}
                />

                {noeFeilet ? (
                    <Alert variant="error">Noe gikk dessverre galt med systemet. Prøv igjen senere.</Alert>
                ) : null}

                {useErVeileder() ? (
                    <Checkbox
                        value={'venterPaSvar'}
                        size="small"
                        className="pr-8"
                        checked={venterPaaSvarFraBruker}
                        onChange={toggleVenterPaSvar}
                    >
                        Venter på svar fra bruker
                    </Checkbox>
                ) : null}
                <div className="flex flex-row gap-x-4">
                    <Button size="small" loading={isSubmitting} disabled={!kansendeMelding || isSubmitting}>
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

export const nyDialogAction: (fnr: string | undefined) => ActionFunction =
    (fnr) =>
    async ({ request }) => {
        try {
            const { slettKladd, nyDialog, silentlyHentDialoger } = useDialogStore.getState();
            if (request.bodyUsed) {
                throw Error('Body used');
            }
            const data: NyTradArgs = await request.json();
            const dialog = await nyDialog(data);
            if (dialog) {
                slettKladd(null, dialog.aktivitetId);
                dispatchUpdate(UpdateTypes.Dialog);
                silentlyHentDialoger(fnr);
                return redirect(`/${dialog.id}?nyDialog`);
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

export default NyDialogForm;
