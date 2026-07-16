import { PeriodeData } from '../utils/Typer';
import {
    brukerKanIkkeVarsles,
    erKRRBruker,
    erManuellBruker,
    erIkkeUnderOppfolging,
    ingenOppfPerioder,
    erIkkeRegistrertIKRR,
} from './demo/localstorage';
import { OppfolgingDataGraphqlResponse } from '../view/OppfolgingProvider';

const oppfPerioder: PeriodeData[] = [
    {
        startTidspunkt: '2017-01-30T10:46:10.971+01:00',
        sluttTidspunkt: '2017-12-31T10:46:10.971+01:00',
        kvpPerioder: [],
        id: '1',
    },
    {
        startTidspunkt: '2018-01-31T10:46:10.971+01:00',
        sluttTidspunkt: null,
        kvpPerioder: [],
        id: '2',
    },
];
const oppfolgingData: OppfolgingDataGraphqlResponse = {
    brukerStatus: {
        manuell: {
            erManuell: erManuellBruker(),
        },
        krr: {
            reservertIKrr: erKRRBruker(),
            registrertIKrr: !erIkkeRegistrertIKRR(),
            kanVarsles: !brukerKanIkkeVarsles(),
        },
    },
    oppfolging: {
        erUnderOppfolging: ingenOppfPerioder() ? false : !erIkkeUnderOppfolging(),
    },
    veilederTilgang: {
        harVeilederLeseTilgangTilBrukersKontorsperre: true,
    },
    oppfolgingsPerioder: ingenOppfPerioder() ? [] : oppfPerioder,
};

export default oppfolgingData;
