import React, { Suspense, useEffect } from 'react';

import { StringOrUndefined } from '../../utils/Typer';
import { getDialogTittel } from '../aktivitet/TextUtils';
import { findAktivitet, MaybeAktivitet, useAktivitetContext } from '../AktivitetProvider';
import { useAktivitetId } from '../utils/useAktivitetId';
import { useSkjulHodefotForMobilVisning } from '../utils/useSkjulHodefotForMobilVisning';
import { HandlingsType, useSetViewContext } from '../ViewState';
import NyDialogForm from './NyDialogForm';
import { Await } from 'react-router';
import { useRootLoaderData } from '../../routing/loaders';
import { Button, GuidePanel, Textarea, TextField } from '@navikt/ds-react';
import { useErVeileder } from '../Provider';

export default function NyDialogTrad() {
    useSkjulHodefotForMobilVisning();

    const aktivitetId: StringOrUndefined = useAktivitetId();
    const aktivitetData = useAktivitetContext();
    const aktivitet: MaybeAktivitet = findAktivitet(aktivitetData, aktivitetId);

    const defaultTema = getDialogTittel(aktivitet);

    const setViewState = useSetViewContext();

    useEffect(() => {
        setViewState({ sistHandlingsType: HandlingsType.ingen });
    }, []);

    // if (!kansendeMelding || (aktivitetId && !aktivitet)) {
    //     return <div className={styles.dialog} />;
    // }

    const loaderData = useRootLoaderData();
    const requiredData = Promise.all([loaderData.oppfolging, loaderData.veilederNavn, loaderData.me]);

    return (
        <Suspense fallback={<DialogFormFallback />}>
            <Await resolve={requiredData}>
                <NyDialogForm defaultTema={defaultTema} aktivitetId={aktivitet?.id} loading={false} />
            </Await>
        </Suspense>
    );
}

export const DialogFormFallback = () => {
    const bigScreen = window.innerWidth >= 768;
    const erVeileder = useErVeileder();
    return (
        <div className="relative h-full w-full overflow-scroll bg-gray-100 lg:max-w-lgContainer xl:max-w-none">
            <div className="space-y-8 p-8 xl:w-full xl:max-w-max-paragraph">
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
