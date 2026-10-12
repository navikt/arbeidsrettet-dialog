import { useOppfolgingContext } from '../view/OppfolgingProvider';
import { dataOrUndefined, useErVeileder } from '../view/Provider';
import { useHarSkrivetilgangTilBruker } from '../view/dialogProvider/dialogStore';

export default function useKansendeMelding(): boolean {
    const erVeileder = useErVeileder();
    const oppfolgingContext = useOppfolgingContext();
    const oppfolgingData = dataOrUndefined(oppfolgingContext);
    const harSkrivetilgangTilBruker = useHarSkrivetilgangTilBruker();

    if (!oppfolgingData) {
        return false;
    }

    if (harSkrivetilgangTilBruker === false) {
        return false;
    }

    // Brukere har alltid tilgang til seg selv.
    // Hvis brukeren ikke er kontorsperret har veiledere alltid tilgang
    const harVeilederLeseTilgangTilBrukersKontorsperre = erVeileder
        ? oppfolgingData?.veilederTilgang?.harVeilederLeseTilgangTilBrukersKontorsperre || false
        : true;
    const kanVarsles = oppfolgingData.brukerStatus.krr?.kanVarsles;

    return (
        harVeilederLeseTilgangTilBrukersKontorsperre &&
        oppfolgingData.oppfolging.erUnderOppfolging &&
        !oppfolgingData.brukerStatus.krr.reservertIKrr &&
        kanVarsles &&
        !oppfolgingData.brukerStatus.manuell.erManuell
    );
}
