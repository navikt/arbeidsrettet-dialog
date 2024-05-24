import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router';

import loggEvent from '../felleskomponenter/logging';
import { useRoutes } from '../routing/routes';
import { useEventListener } from './utils/useEventListner';
import { HandlingsType } from './ViewState';

interface EventDetails {
    dialogId?: string;
    aktivitetId?: string;
}

function listener(e: KeyboardEvent) {
    if (!(e.key === 'Enter' && (e.metaKey || e.ctrlKey))) return;

    const target: (EventTarget & HTMLTextAreaElement) | null = e.target as (EventTarget & HTMLTextAreaElement) | null;
    if (target && target.form) {
        target.form.dispatchEvent(new Event('submit'));
    }
}

const LOGGING_ANTALLBRUKERE_DIALOG = 'arbeidsrettet-dialog.antallBrukere';

function loggingAntallBrukere() {
    loggEvent(LOGGING_ANTALLBRUKERE_DIALOG);
}

export function EventHandler() {
    const navigate = useNavigate();
    const { dialogRoute, nyRoute } = useRoutes();
    useEventListener<EventDetails>('visDialog', (event) => {
        const { dialogId, aktivitetId } = event.detail;
        if (!!dialogId) {
            navigate(dialogRoute(dialogId), { state: { sistHandlingsType: HandlingsType.ingen } });
        } else if (!!aktivitetId) {
            navigate(nyRoute(aktivitetId), { state: { sistHandlingsType: HandlingsType.ingen } });
        }
    });

    useLayoutEffect(() => {
        loggingAntallBrukere();
        document.body.addEventListener('keydown', listener);
        return () => document.body.removeEventListener('keydown', listener);
    }, []);

    return <></>;
}
