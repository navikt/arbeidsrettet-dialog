import { useVeilederNavn } from '../../api/useHentVeilederData';
import { useErVeileder } from '../Provider';

const useMeldingStartTekst = () => {
    const veilederNavn = useVeilederNavn();
    const erVeileder = useErVeileder();
    if (!erVeileder) return '';
    if (!veilederNavn) return '';
    return '\n\nHilsen ' + veilederNavn;
};

export default useMeldingStartTekst;
