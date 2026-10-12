import { Link } from '@navikt/ds-react';
import React from 'react';

import { START_OPPFOLGING_URL } from '../../constants';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

interface Props {
    erVeileder: boolean;
}

export default function AldriUnderOppfolging(props: Props) {
    return props.erVeileder ? <Veileder /> : <Bruker />;
}

function Veileder() {
    return (
        <StatusAdvarselWrapper title={'Ikke under arbeidsrettet oppfølging'}>
            Denne brukeren har ikke vært og er ikke under arbeidrettet oppfølging.
        </StatusAdvarselWrapper>
    );
}

function Bruker() {
    return (
        <StatusAdvarselWrapper title={'Ikke under oppfølging av Nav'}>
            Du må være under oppfølging hos Nav for å ha digital dialog med veileder. <br />
            <Link href={`${START_OPPFOLGING_URL}`}>Be om oppfølging fra Nav</Link>
        </StatusAdvarselWrapper>
    );
}
