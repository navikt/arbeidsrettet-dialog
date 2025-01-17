import React from 'react';

import StatusAdvarselWrapper from './StatusAdvarselWrapper';
import { Heading, Link } from '@navikt/ds-react';

const linkKanIkkeVarsles = 'https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon';

const BrukerKanIkkeVarsles = () => (
    <StatusAdvarselWrapper>
        <Heading level="2" size="small">
            Kontaktinformasjonen din er utdatert
        </Heading>
        Du kan ikke sende meldinger i dialogen fordi kontaktinformasjonen din er utdatert i kontakt og
        reservasjonsregisteret (KRR).
        <br />
        <Link href={linkKanIkkeVarsles}>Gå til norge.no for å oppdatere.</Link>
    </StatusAdvarselWrapper>
);

export default BrukerKanIkkeVarsles;
