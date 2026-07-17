import React from 'react';

import { VenterSvarFraBruker, VenterSvarFraNAV, ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';
import { DialogData } from '../../utils/Typer';
import { useErVeileder } from '../Provider';

interface Props {
    dialog: DialogData;
}

function erViktig(dialog: DialogData): boolean {
    if (dialog.egenskaper.length > 0) {
        if (dialog.egenskaper[0] === 'ESKALERINGSVARSEL') {
            return true;
        }
        return true;
    }
    return false;
}

export function EtikettListe({ dialog }: Props) {
    const { historisk, ferdigBehandlet, venterPaSvar } = dialog;
    const erVeileder = useErVeileder();

    if (historisk) {
        return null;
    }

    const dialogErViktig = erViktig(dialog);
    const visVenterPaaNav = !ferdigBehandlet && erVeileder;

    return (
        <>
            <VenterSvarFraBruker visible={venterPaSvar} erVeileder={erVeileder} />
            <ViktigMelding visible={dialogErViktig} />
            <VenterSvarFraNAV visible={visVenterPaaNav} />
        </>
    );
}
