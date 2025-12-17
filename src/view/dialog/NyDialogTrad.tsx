import React, { Suspense, useEffect, useMemo } from 'react';

import { StringOrUndefined } from '../../utils/Typer';
import { getDialogTittel } from '../aktivitet/TextUtils';
import { findAktivitet, MaybeAktivitet, useAktivitetContext } from '../AktivitetProvider';
import { useAktivitetId } from '../utils/useAktivitetId';
import { HandlingsType, useSetViewContext } from '../ViewState';
import NyDialogForm from './NyDialogForm';
import { Await } from 'react-router';
import { useRootLoaderData } from '../../routing/loaders';
import { Button, GuidePanel, Textarea, TextField } from '@navikt/ds-react';

export default function NyDialogTrad() {
    const aktivitetId: StringOrUndefined = useAktivitetId();
    const aktivitetData = useAktivitetContext();
    const aktivitet: MaybeAktivitet = findAktivitet(aktivitetData, aktivitetId);
    const defaultTema = getDialogTittel(aktivitet);
    const setViewState = useSetViewContext();

    useEffect(() => {
        setViewState({ sistHandlingsType: HandlingsType.ingen });
    }, []);

    const loaderData = useRootLoaderData();
    const requiredData = useMemo(() => {
        return Promise.all([
            loaderData.oppfolging,
            loaderData.veilederNavn,
            loaderData.me,
            loaderData.aktiviteter,
            loaderData.arenaAktiviteter,
        ]);
    }, []);

    return (
        <Suspense fallback={<DialogFormFallback />}>
            <Await resolve={requiredData}>
                <NyDialogForm defaultTema={defaultTema} aktivitetId={aktivitet?.id} />
            </Await>
        </Suspense>
    );
}

export const DialogFormFallback = () => {
    const bigScreen = window.innerWidth >= 768;
    return (
        <div className="relative h-full w-full overflow-scroll bg-ax-bg-neutral-soft lg:max-w-lgContainer xl:max-w-none">
            <div className="space-y-8 p-8 xl:w-full xl:max-w-max-paragraph">
                <GuidePanel poster={!bigScreen}>
                    Her kan du skrive til din veileder om arbeid og oppfølging. Du vil få svar i løpet av noen dager.
                </GuidePanel>
                <TextField
                    label="Tema (obligatorisk)"
                    description="Skriv kort hva dialogen skal handle om"
                    disabled={true}
                />
                <Textarea disabled={true} label="Melding (obligatorisk)" description="Skriv om arbeid og oppfølging" />
                <div className="flex flex-row gap-x-4">
                    <Button disabled={true} size="small">
                        Send
                    </Button>
                    <Button disabled={true} size="small" variant="tertiary">
                        Avbryt
                    </Button>
                </div>
            </div>
        </div>
    );
};
