import { Link } from '@navikt/ds-react';
import React from 'react';

import { ARBEIDSSOKERREGISTRERING_URL } from '../../constants';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

interface Props {
    erVeileder: boolean;
}

export default function IkkeUnderOppfolging(props: Props) {
    return props.erVeileder ? (
        <StatusAdvarselWrapper>Bruker er ikke under oppfølging</StatusAdvarselWrapper>
    ) : (
        <HarPerioderBruker />
    );
}

function HarPerioderBruker() {
    return (
        <StatusAdvarselWrapper>
            Du er ikke lenger registrert hos NAV. Hvis du fortsatt skal få oppfølging fra NAV og ha dialog med veileder
            må du være registrert.
            <br />
            <Link href={`${ARBEIDSSOKERREGISTRERING_URL}`}>Registrer deg hos NAV</Link>
        </StatusAdvarselWrapper>
    );
}
