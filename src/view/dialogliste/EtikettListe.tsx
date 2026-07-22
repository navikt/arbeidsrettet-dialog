import React from 'react';

import { VenterSvarFraBruker, VenterSvarFraNAV, ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';
import { DialogData } from '../../utils/Typer';
import { useErVeileder } from '../Provider';
import { useGjeldendeStansVarselDialogId } from '../dialogProvider/dialogStore';

interface Props {
    dialog: DialogData;
}

function erViktig(dialog: DialogData, gjeldendeStansVarselDialogId: number | undefined): boolean {
    if (dialog.egenskaper.length > 0) {
        if (dialog.egenskaper[0] === 'ESKALERINGSVARSEL') {
            return dialog.id === gjeldendeStansVarselDialogId?.toString();
        }
        return true;
    }
    return false;
}

export function EtikettListe({ dialog }: Props) {
    const { historisk, ferdigBehandlet, venterPaSvar } = dialog;
    const erVeileder = useErVeileder();
    const gjeldendeStansVarselDialogId = useGjeldendeStansVarselDialogId();

    if (historisk) {
        return null;
    }

    const dialogErViktig = erViktig(dialog, gjeldendeStansVarselDialogId);
    const visVenterPaaNav = !ferdigBehandlet && erVeileder;

    return (
        <>
            <VenterSvarFraBruker visible={venterPaSvar} erVeileder={erVeileder} />
            <ViktigMelding visible={dialogErViktig} />
            <VenterSvarFraNAV visible={visVenterPaaNav} />
        </>
    );
}
