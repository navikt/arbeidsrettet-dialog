import { Alert } from '@navikt/ds-react';
import React from 'react';
import { useAktivitetStore, useTiltaksAktivitetStore } from '../AktivitetProvider';
import { Status } from '../../api/typer';

function DialogHeaderFeil() {
    const aktiviteterStatus = useAktivitetStore((state) => state.status);
    const tiltaksAktiviteterAktiviteterStatus = useTiltaksAktivitetStore((state) => state.status);
    const erFeil = aktiviteterStatus == Status.ERROR || tiltaksAktiviteterAktiviteterStatus == Status.ERROR;

    if (!erFeil) {
        return null;
    }

    return (
        <div className="">
            <Alert fullWidth variant="error">
                Noe gikk galt, og du får dessverre ikke sett informasjon fra aktivitetsplanen. Prøv igjen senere.
            </Alert>
        </div>
    );
}

export default DialogHeaderFeil;
