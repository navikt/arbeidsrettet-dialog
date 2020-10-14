import React, { useContext } from 'react';

import { DialogData, OppfolgingData } from '../../utils/Typer';
import { dataOrUndefined, useOppfolgingContext, UserInfoContext } from '../Provider';
import { VenterSvarFraBruker, VenterSvarFraNAV, ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';

interface Props {
    dialog: DialogData;
}

function erViktig(dialog: DialogData, oppfolging?: OppfolgingData): boolean {
    if (dialog.egenskaper.length > 0) {
        if (dialog.egenskaper[0] === 'ESKALERINGSVARSEL') {
            return oppfolging?.gjeldendeEskaleringsvarsel?.tilhorendeDialogId.toString() === dialog.id;
        }

        return true;
    }

    return false;
}

export function EtikettListe(props: Props) {
    const userInfo = useContext(UserInfoContext);
    const oppfolging = useOppfolgingContext();

    if (props.dialog.historisk) {
        return null;
    }

    const erVeileder = !!userInfo && userInfo.erVeileder;

    const dialogErViktig = erViktig(props.dialog, dataOrUndefined(oppfolging));

    const venterPaSvar = props.dialog.venterPaSvar;
    const visVenterPaaNav = !!userInfo && !props.dialog.ferdigBehandlet && erVeileder;

    return (
        <>
            <VenterSvarFraBruker visible={venterPaSvar} erVeileder={erVeileder} />
            <ViktigMelding visible={dialogErViktig} />
            <VenterSvarFraNAV visible={visVenterPaaNav} />
        </>
    );
}
