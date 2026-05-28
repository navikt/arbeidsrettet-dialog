import { useOppfolgingContext } from '../view/OppfolgingProvider';
import { dataOrUndefined } from '../view/Provider';
import { useHarSkrivetilgangTilBruker } from '../view/dialogProvider/dialogStore';

export default function useKansendeMelding(): boolean {
    const oppfolgingContext = useOppfolgingContext();
    //TODO min id pasport
    const oppfolgingData = dataOrUndefined(oppfolgingContext);
    const harSkrivetilgangTilBruker = useHarSkrivetilgangTilBruker();

    if (!oppfolgingData) {
        return false;
    }

    if (harSkrivetilgangTilBruker === false) {
        return false;
    }

    const kanVarsles = oppfolgingData.kanVarsles;

    return (
        oppfolgingData.harSkriveTilgang &&
        oppfolgingData.underOppfolging &&
        !oppfolgingData.reservasjonKRR &&
        kanVarsles &&
        !oppfolgingData.manuell
    );
}
