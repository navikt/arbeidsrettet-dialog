import React from 'react';

import { useUserInfoContext } from '../BrukerProvider';
import { useOppfolgingContext } from '../OppfolgingProvider';
import { dataOrUndefined } from '../Provider';
import AldriUnderOppfolging from './AldriUnderOppfolging';
import IkkeUnderOppfolging from './IkkeUnderOppfolging';
import UtdatertKontaktInformasjonIKRRVarsel from './UtdatertKontaktInformasjonIKRRVarsel';
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
    const erUnderOppfolging = oppfolgingData.oppfolging.erUnderOppfolging;
    const harOppfolgingsPerioder = oppfolgingData.oppfolgingsPerioder.length > 0;
    const erReservertKrr = oppfolgingData.brukerStatus.krr.reservertIKrr;
    const kanVarsles = oppfolgingData.brukerStatus.krr.kanVarsles;
    const manuellBruker = oppfolgingData.brukerStatus.manuell.erManuell;
    const erRegistrertIKrrBruker = oppfolgingData.brukerStatus.krr.registrertIKrr;

    if (!erUnderOppfolging && !harOppfolgingsPerioder) {
        return <AldriUnderOppfolging erVeileder={erVeileder} />;
    }
    if (!erUnderOppfolging) {
        return <IkkeUnderOppfolging erVeileder={erVeileder} />;
    }
    if (erReservertKrr) {
        return <ReservertKrr erVeileder={erVeileder} />;
    }
    if (manuellBruker) {
        return <ManuellBruker erVeileder={erVeileder} />;
    }
    if (!kanVarsles && erRegistrertIKrrBruker) {
        return <UtdatertKontaktInformasjonIKRRVarsel erVeileder={erVeileder} />;
    }
    if (!erRegistrertIKrrBruker) {
        return <ErIkkeRegistrertIKrrAdversel erVeileder={erVeileder} />;
    }
    if (erVeileder && harSkrivetilgangTilBruker === false) {
        return <IkkeTilgang />;
    }

    return null;
}
