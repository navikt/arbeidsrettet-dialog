import React from 'react';

import { useAktivitetContext, useHentAktiviteter } from '../view/AktivitetProvider';
import { useOppfolgingContext } from '../view/OppfolgingProvider';
import { useEventListener } from '../view/utils/useEventListner';
import { useFnrContext } from '../view/Provider';
import { useHentDialoger } from '../view/dialogProvider/dialogStore';

export enum UpdateTypes {
    Dialog = 'DIALOG',
    Oppfolging = 'OPPFOLGING',
    Aktivitet = 'AKTIVITET'
}
/*
        'uppdate' er en skrivefeil, men jeg ser at det samme navnet blir brukt i aktivitetsplanen, arbeidsrettet-dialog og veilarbpersonflate,
        så jeg gjør ikke noe med det inntil videre.
    */
interface UpdateEventType {
    uppdate: string;
    avsender?: string;
}

const eventName = 'uppdate';

export function dispatchUpdate(update: UpdateTypes) {
    window.dispatchEvent(
        new CustomEvent<UpdateEventType>(eventName, { detail: { uppdate: update, avsender: 'dialog' } })
    );
}

function isUpdateEvent(toBeDetermined: CustomEvent): toBeDetermined is CustomEvent<UpdateEventType> {
    return !!(toBeDetermined as CustomEvent<UpdateEventType>).type;
}

export function UppdateEventHandler() {
    const fnr = useFnrContext();
    const hentAktiviteter = useHentAktiviteter();
    const hentDialoger = useHentDialoger();
    const oppfolgingContext = useOppfolgingContext();
    useEventListener(eventName, (event) => {
        if (!isUpdateEvent(event)) {
            return;
        }

        const updateType = event.detail.uppdate;
        const avsennder = event.detail.avsender;

        if (avsennder === 'dialog') {
            return;
        }

        switch (updateType) {
            case UpdateTypes.Aktivitet:
                return hentAktiviteter(fnr);
            case UpdateTypes.Dialog:
                return hentDialoger(fnr);
            case UpdateTypes.Oppfolging:
                return oppfolgingContext.hentOppfolging(fnr);
        }
    });

    return <></>;
}
