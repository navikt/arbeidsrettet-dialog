import { Link } from '@navikt/ds-react';
import React from 'react';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

export default function ErIkkeRegistrertIKrrAdverselBruker() {
    return <BrukerIkkeIIKrr />;
}

const linkIkkeRegistrertIKrr = 'https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon';

function BrukerIkkeIIKrr() {
    return (
        <StatusAdvarselWrapper title="Vi har ikke din kontaktinformasjon">
            Du kan ikke sende meldinger i dialogen fordi du ikke har registrert e-post eller telefonnummeret ditt i
            kontakt og reservasjonsregisteret (KRR).
            <Link href={linkIkkeRegistrertIKrr}>Gå til norge.no for å registrere.</Link>
        </StatusAdvarselWrapper>
    );
}
