import { GlobalAlert, Heading, Link } from '@navikt/ds-react';
import React from 'react';

interface Props {
    readonly children: React.ReactNode;
}

export default function StatusAdvarselWrapper({ children }: Props) {
    return <GlobalAlert status="warning">{children}</GlobalAlert>;
}

const linkKanIkkeVarsles = 'https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon';

export function KanIkkeKontakteElektroniskVeileder() {
    return (
        <StatusAdvarselWrapper>
            <Heading level="2" size="small">
                Kontaktinfo til bruker er utdatert i KRR
            </Heading>
            Du kan ikke sende meldinger i dialogen fordi kontaktinformasjonen til brukeren er utdatert i KRR.
            <br />
            <Link href={linkKanIkkeVarsles}>Brukeren må gå til norge.no for å oppdatere.</Link>
        </StatusAdvarselWrapper>
    );
}
