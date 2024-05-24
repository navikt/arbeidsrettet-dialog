import React, { Suspense, useCallback } from 'react';
import { Await, useParams } from 'react-router';
import { DialogData } from '../../utils/Typer';
import { useDialoger } from '../DialogProvider';
import { DialogPreviewListe } from './DialogPreview';
import HistoriskeDialogerOversikt from './HistoriskDialogListe';
import { useRootLoaderData } from '../../routing/loaders';
import { Loader } from '@navikt/ds-react';

interface Res {
    naaverende: DialogData[];
    historiske: DialogData[];
}

function splitHistoriske(acc: Res, cur: DialogData) {
    cur.historisk ? acc.historiske.push(cur) : acc.naaverende.push(cur);
    return acc;
}

export function DialogListe() {
    const dialoger = useDialoger();
    const { dialogId } = useParams();

    const sorterteDialoger = dialoger.sort((a, b) => sortDialoger(a, b));
    const { naaverende, historiske } = sorterteDialoger.reduce(splitHistoriske, { naaverende: [], historiske: [] });

    const loaderData = useRootLoaderData();
    const requiredData = useCallback(() => {
        return Promise.all([loaderData.dialoger, loaderData.arenaAktiviteter, loaderData.aktiviteter]);
    }, []);

    return (
        <div role="navigation" aria-label="Dialoger">
            <Suspense fallback={<DialogListeFallback />}>
                <Await resolve={requiredData}>
                    <DialogPreviewListe dialoger={naaverende} valgDialog={dialogId} />
                    <HistoriskeDialogerOversikt historiske={historiske} valgDialog={dialogId} />
                </Await>
            </Suspense>
        </div>
    );
}

function sortDialoger(a: DialogData, b: DialogData): number {
    const adato = a.sisteDato === null ? '' : '' + a.sisteDato;
    const bdato = b.sisteDato === null ? '' : '' + b.sisteDato;
    return adato > bdato ? -1 : adato === bdato ? 0 : 1;
}

const DialogListeFallback = () => {
    return (
        <div className="bg-green-300">
            <div>QWERQWKJASDKJASKJ</div>
            <Loader />
        </div>
    );
};

export default DialogListe;
