import { Link } from '@navikt/ds-react';
import React from 'react';

import { ARBEIDSSOKERREGISTRERING_URL } from '../../constants';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

interface Props {
    erVeileder: boolean;
}

export default function IkkeUnderOppfolging(props: Props) {
    return props.erVeileder ? (
        <StatusAdvarselWrapper>Bruker er ikke under oppfølging og kan ikke sende meldinger</StatusAdvarselWrapper>
    ) : (
        <HarPerioderBruker />
    );
}

function HarPerioderBruker() {
    return (
        <StatusAdvarselWrapper title="Du er ikke lenger registrert hos Nav">
            Hvis du fortsatt skal få oppfølging fra Nav og ha dialog med veileder må du være registrert.
            <br />
            <Link href={`${ARBEIDSSOKERREGISTRERING_URL}`}>Registrer deg hos Nav</Link>
        </StatusAdvarselWrapper>
    );
}
