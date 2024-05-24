import { PeriodeData } from '../utils/Typer';
import {
    brukerKanIkkeVarsles,
    erKRRBruker,
    erManuellBruker,
    erIkkeUnderOppfolging,
    ingenOppfPerioder
} from './demo/localstorage';

const oppfPerioder: PeriodeData[] = [
    {
        aktorId: '1234567988888',
        veileder: false,
        startDato: '2017-01-30T10:46:10.971+01:00',
        sluttDato: '2017-12-31T10:46:10.971+01:00',
        begrunnelse: null,
        kvpPerioder: [],
        uuid: '1'
    },
    {
        aktorId: '1234567988888',
        veileder: false,
        startDato: '2018-01-31T10:46:10.971+01:00',
        sluttDato: null,
        begrunnelse: null,
        kvpPerioder: [],
        uuid: '2'
    }
];
const oppfolgingData = {
    fnr: null,
    veilederId: '101010',
    reservasjonKRR: erKRRBruker(),
    manuell: erManuellBruker(),
    underOppfolging: ingenOppfPerioder() ? false : !erIkkeUnderOppfolging(),
    underKvp: false,
    oppfolgingUtgang: null,
    gjeldendeEskaleringsvarsel: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: ingenOppfPerioder() ? [] : oppfPerioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    kanVarsles: !brukerKanIkkeVarsles(),
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00'
};

export default oppfolgingData;
