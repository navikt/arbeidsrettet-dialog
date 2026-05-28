import React from 'react';

import { useUserInfoContext } from '../BrukerProvider';
import { useOppfolgingContext } from '../OppfolgingProvider';
import { dataOrUndefined } from '../Provider';
import AldriUnderOppfolging from './AldriUnderOppfolging';
import IkkeUnderOppfolging from './IkkeUnderOppfolging';
import KanIkkeVarsles from './KanIkkeVarsles';
import ManuellBruker from './ManuellBruker';
import ReservertKrr from './ReservertKrr';
import ErIkkeRegistrertIKrrAdversel from './ErIkkeRegistrertIKrrAdverselBruker';
import { useHarSkrivetilgangTilBruker } from '../dialogProvider/dialogStore';
import IkkeTilgang from './IkkeTilgang';

export default function StatusAdvarsel() {
    const oppfolgingDataContext = useOppfolgingContext();
    const oppfolgingData = dataOrUndefined(oppfolgingDataContext);
    const UserInfo = useUserInfoContext();
    const harSkrivetilgangTilBruker = useHarSkrivetilgangTilBruker();

    if (!oppfolgingData || !UserInfo) {
        return null;
    }

    const erVeileder = UserInfo.erVeileder;
    const erUnderOppfolging = oppfolgingData.underOppfolging;
    const harOppfolgingsPerioder = oppfolgingData.oppfolgingsPerioder.length > 0;
    const erReservertKrr = oppfolgingData.reservasjonKRR;
    const kanVarsles = oppfolgingData.kanVarsles;
    const manuellBruker = oppfolgingData.manuell;
    const kanReaktiveres = oppfolgingData.kanReaktiveres;
    const erRegistrertIKrrBruker = oppfolgingData.registrertKRR;

    if (!erUnderOppfolging && !harOppfolgingsPerioder) {
        return <AldriUnderOppfolging erVeileder={erVeileder} />;
    }
    if (!erUnderOppfolging || kanReaktiveres) {
        return <IkkeUnderOppfolging erVeileder={erVeileder} />;
    }
    if (erReservertKrr) {
        return <ReservertKrr erVeileder={erVeileder} />;
    }
    if (manuellBruker) {
        return <ManuellBruker erVeileder={erVeileder} />;
    }
    if (!kanVarsles && erRegistrertIKrrBruker) {
        return <KanIkkeVarsles erVeileder={erVeileder} />;
    }
    if (!erRegistrertIKrrBruker) {
        return <ErIkkeRegistrertIKrrAdversel erVeileder={erVeileder} />;
    }
    if (erVeileder && harSkrivetilgangTilBruker === false) {
        return <IkkeTilgang />;
    }

    return null;
}
