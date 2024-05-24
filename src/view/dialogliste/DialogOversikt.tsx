import { Heading, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { Suspense } from 'react';
import { Await } from 'react-router';
import { AKTIVITETSPLAN_URL, MINSIDE_URL } from '../../constants';
import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { useDialoger } from '../DialogProvider';
import InfoVedIngenDialoger from '../info/InfoVedIngenDialoger';
import OmDialogLenke from '../info/OmDialogLenke';
import DialogListe from './DialogListe';
import NyDialogLink from './NyDialogLink';
import { useErVeileder } from '../Provider';
import { useRootLoaderData } from '../../routing/loaders';
import { useIsDialogOrNyRoute } from '../../routing/routes';

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
    const isDialogOrNyRoute = useIsDialogOrNyRoute();
    const erVeileder = useErVeileder();
    const ingenDialoger = dialoger.length === 0;
    const erSidebar = isDialogOrNyRoute;
    const loaderData = useRootLoaderData();

    return (
        <div
            className={classNames(
                /* Hvis liten skjerm, bare vis dialog-liste på "Homepage", ikke som sideBar  */
                { 'hidden md:flex': erSidebar },
                { flex: !erSidebar },
                'w-full grow flex-col md:border-r border-border-divider md:max-w-xs xl:min-w-[320px] xl:max-w-[320px]'
            )}
        >
            <DialogOversiktHeader erVeileder={erVeileder} />
            <div className="relative flex flex-1 flex-col overflow-y-scroll border-r border-border-divider bg-gray-100 p-2">
                <>
                    <div className="flex gap-2 p-1 pb-2">
                        <NyDialogLink disabled={!kanSendeMelding} />
                        <OmDialogLenke />
                    </div>
                    <Suspense>
                        <Await resolve={loaderData.dialoger}>
                            {ingenDialoger ? <InfoVedIngenDialoger className="mt-4 h-full md:hidden" /> : null}
                        </Await>
                    </Suspense>
                </>
                <DialogListe />
            </div>
        </div>
    );
};

export default DialogOversikt;
