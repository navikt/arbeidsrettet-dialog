import { GlobalAlert } from '@navikt/ds-react';
import React from 'react';
import { useAktivitetStore, useTiltaksAktivitetStore } from '../AktivitetProvider';
import { Status } from '../../api/typer';
import { useDialogStore } from '../dialogProvider/dialogStore';

function DialogHeaderFeil() {
    const aktiviteterStatus = useAktivitetStore((state) => state.status);
    const tiltaksAktiviteterAktiviteterStatus = useTiltaksAktivitetStore((state) => state.status);
    const dialogFeil = useDialogStore((state) => state.status === Status.ERROR);
    const erFeil = aktiviteterStatus == Status.ERROR || tiltaksAktiviteterAktiviteterStatus == Status.ERROR;

    if (!erFeil && !dialogFeil) {
        return null;
    }

    if (dialogFeil) {
        return <GlobalAlert status="error">Noe gikk galt ved henting av dialoger. Prøv igjen senere</GlobalAlert>;
    }

    return (
        <GlobalAlert status="error">
            Noe gikk galt, og du får dessverre ikke sett informasjon fra aktivitetsplanen. Prøv igjen senere.
        </GlobalAlert>
    );
}

export default DialogHeaderFeil;
