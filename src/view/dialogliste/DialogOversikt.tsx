import { Heading, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router';
import { AKTIVITETSPLAN_URL, MINSIDE_URL } from '../../constants';
import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { useUserInfoContext } from '../BrukerProvider';
import { useDialoger } from '../DialogProvider';
import InfoVedIngenDialoger from '../info/InfoVedIngenDialoger';
import OmDialogLenke from '../info/OmDialogLenke';
import { useSelectedDialog } from '../utils/useAktivitetId';
import DialogListe from './DialogListe';
import NyDialogLink from './NyDialogLink';
import { useErVeileder } from '../Provider';

const DialogOversiktHeader = ({ erVeileder }: { erVeileder: boolean }) => {
    if (erVeileder) return null;
    return (
        <div className="flex flex-col gap-y-2 border-b border-border-divider  px-4 py-1">
            <div className="flex gap-x-4 ">
                {!erVeileder ? (
                    <>
                        <Link href={MINSIDE_URL}>Min side</Link>
                        <Link href={AKTIVITETSPLAN_URL}>Aktivitetsplan</Link>
                    </>
                ) : null}
            </div>
            {!erVeileder ? (
                <Heading level="1" size="medium">
                    Dialog med veilederen din
                </Heading>
            ) : null}
        </div>
    );
};

const DialogOversikt = () => {
    const kanSendeMelding = useKansendeMelding();
    const dialoger = useDialoger();
    const dialog = useSelectedDialog();
    const location = useLocation();
    const isNyRoute = location.pathname.startsWith('/ny');
    const erVeileder = useErVeileder();
    const ingenDialoger = dialoger.length === 0;
    const erSidebar = !!dialog || isNyRoute;

    return (
        <div
            className={classNames(
                /* Hvis liten skjerm, bare vis dialog-liste på "Homepage", ikke som sideBar  */
                { 'hidden md:flex': erSidebar },
                { flex: !erSidebar },
                'w-full flex-col border-r border-border-divider ' +
                    'md:max-w-xs ' +
                    'xl:w-[16.7vw] xl:min-w-[320px] xl:max-w-none'
            )}
        >
            <DialogOversiktHeader erVeileder={erVeileder} />
            <div className="relative flex h-full flex-1 flex-col overflow-y-scroll border-r border-border-divider bg-gray-100 p-2">
                <>
                    <div className="flex gap-2 p-1 pb-2">
                        <NyDialogLink disabled={!kanSendeMelding} />
                        <OmDialogLenke />
                    </div>
                    {ingenDialoger ? <InfoVedIngenDialoger className="mt-4 md:hidden" /> : null}
                </>
                <DialogListe />
            </div>
        </div>
    );
};

export default DialogOversikt;
