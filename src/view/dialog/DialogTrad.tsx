import { Loader } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { useRoutes } from '../../routes';
import { UpdateTypes, dispatchUpdate } from '../../utils/UpdateEvent';
import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { useVisAktivitet } from '../AktivitetToggleContext';
import { useDialogContext } from '../DialogProvider';
import { useCompactMode } from '../../featureToggle/FeatureToggleProvider';
import { Meldinger } from '../melding/Meldinger';
import { useFnrContext } from '../Provider';
import { useSelectedAktivitet, useSelectedDialog } from '../utils/useAktivitetId';
import { useEventListener } from '../utils/useEventListner';
import { endreDialogSomVises, useViewContext } from '../ViewState';
import MeldingInputBox from './meldingInput/MeldingInputBox';
import HistoriskInfo from './HistoriskInfo';

function DialogTrad() {
    const scrollContainerRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
    const aktivitet = useSelectedAktivitet();
    const compactMode = useCompactMode();
    const kanSendeMelding = useKansendeMelding();
    const { lesDialog } = useDialogContext();

    const valgtDialog = useSelectedDialog();
    const dialogId = valgtDialog?.id;
    const fnr = useFnrContext();
    const visAktivitet = useVisAktivitet();

    const { viewState, setViewState } = useViewContext();
    const [activeTab, setActiveTab] = useState(!document.hidden);
    const [activePersonflateTab, setActivePersonflateTab] = useState(true);

    const lest = !valgtDialog ? true : valgtDialog.lest;

    useEffect(() => {
        setViewState(endreDialogSomVises(viewState, dialogId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogId]);

    useEffect(() => {
        const listener = () => setActiveTab(!document.hidden);
        document.addEventListener('visibilitychange', listener, false);
        return () => document.removeEventListener('visibilitychange', listener);
    }, [setActiveTab]);

    useEventListener<{ tabId: string; dialogId?: string }>('veilarbpersonflatefs.tab-clicked', (event) => {
        const correctDialogInView = !event.detail.dialogId ? true : dialogId === event.detail.dialogId;
        if (event.detail.tabId === 'DIALOG' && correctDialogInView) {
            setActivePersonflateTab(true);
        } else {
            setActivePersonflateTab(false);
        }
    });

    useEffect(() => {
        if (!lest && activeTab && activePersonflateTab) {
            if (!dialogId) return;
            lesDialog(dialogId).then(() => {
                dispatchUpdate(UpdateTypes.Dialog);
                window.dispatchEvent(new Event('aktivitetsplan.dialog.lest')); //lest teller i personflata
            });
        }
    }, [dialogId, lest, activeTab, activePersonflateTab, lesDialog]);

    const routes = useRoutes();
    const navigate = useNavigate();

    useEffect(() => {
        if (!valgtDialog) {
            navigate(routes.baseRoute(), { replace: true });
        }
    }, [navigate, routes, valgtDialog]);

    useEffect(() => {
        scrollContainerRef?.current?.scrollTo({
            top: scrollContainerRef?.current?.scrollHeight
        });
    }, [scrollContainerRef, valgtDialog]);

    if (!valgtDialog) {
        return <Loader />;
    }

    const aktivDialog = !valgtDialog.historisk;
    const kanSendeHenveldelse = kanSendeMelding && aktivDialog;

    return (
        <section
            className={classNames('flex w-full grow xl:max-w-none', {
                'flex-col lg:max-w-lgContainer xl:max-w-none': !compactMode,
                'flex-col lg:flex-row 2xl:flex-row': compactMode && aktivitet && !visAktivitet,
                'flex-col 2xl:flex-row': compactMode && aktivitet && visAktivitet,
                'flex-col lg:flex-row': compactMode && !aktivitet
            })}
        >
            <div ref={scrollContainerRef} className="relative flex flex-1 grow flex-col overflow-y-scroll">
                <Meldinger dialogData={valgtDialog} fnr={fnr} />
                <HistoriskInfo hidden={aktivDialog} kanSendeMelding={kanSendeMelding} />
            </div>
            <MeldingInputBox dialog={valgtDialog} kanSendeHenveldelse={kanSendeHenveldelse} />
        </section>
    );
}

export default DialogTrad;
