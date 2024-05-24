import { Link } from '@navikt/ds-react';
import React from 'react';

import { ARBEIDSSOKERREGISTRERING_URL } from '../../constants';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

interface Props {
    erVeileder: boolean;
}

export default function AldriUnderOppfolging(props: Props) {
    return props.erVeileder ? <Veileder /> : <Bruker />;
}

function Veileder() {
    return (
        <StatusAdvarselWrapper>
            Denne brukeren har ikke vært og er ikke under arbeidrettet oppfølging.
        </StatusAdvarselWrapper>
    );
}

function Bruker() {
    return (
        <StatusAdvarselWrapper>
            Du må være registrert hos NAV for å ha digital dialog med veileder. <br />
            <Link href={`${ARBEIDSSOKERREGISTRERING_URL}`}>Registrer deg hos NAV</Link>
        </StatusAdvarselWrapper>
    );
}
