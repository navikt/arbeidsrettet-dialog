import { GlobalAlert, Link } from '@navikt/ds-react';
import React from 'react';

interface Props {
    readonly children: React.ReactNode;
    readonly title?: string;
}

export default function StatusAdvarselWrapper({ children, title }: Props) {
    return (
        <GlobalAlert status="warning">
            {title && (
                <GlobalAlert.Header>
                    <GlobalAlert.Title>{title}</GlobalAlert.Title>
                </GlobalAlert.Header>
            )}
            <GlobalAlert.Content>{children}</GlobalAlert.Content>
        </GlobalAlert>
    );
}

const linkKanIkkeVarsles = 'https://www.norge.no/nb/digital-borger/oppdater-kontaktinformasjon';

export function KanIkkeKontakteElektroniskVeileder() {
    return (
        <GlobalAlert status="warning">
            <GlobalAlert.Header>
                <GlobalAlert.Title>Kontaktinfo til bruker er utdatert i KRR</GlobalAlert.Title>
            </GlobalAlert.Header>
            <GlobalAlert.Content>
                Du kan ikke sende meldinger i dialogen fordi kontaktinformasjonen til brukeren er utdatert i KRR.
                <br />
                <Link href={linkKanIkkeVarsles}>Brukeren må gå til norge.no for å oppdatere.</Link>
            </GlobalAlert.Content>
        </GlobalAlert>
    );
}
