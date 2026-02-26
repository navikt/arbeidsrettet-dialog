import { Link } from '@navikt/ds-react';
import React from 'react';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

interface Props {
    erVeileder: boolean;
}

export default function ReservertKrr(props: Props) {
    return props.erVeileder ? <BrukerReservertIKrr /> : <BrukerReservertIKrrVeileder />;
}
const linkReservert = 'https://www.norge.no/nb/digital-borger/reservasjon';

function BrukerReservertIKrrVeileder() {
    return (
        <StatusAdvarselWrapper title="Du har reservert deg mot digital kommunikasjon">
            Du kan ikke sende meldinger i den digitale dialogen fordi du har reservert deg mot digital kommunikasjon i
            kontakt og reservasjonsregisteret (KRR).
            <Link href={linkReservert}>Gå til norge.no for å fjerne reservasjonen.</Link>
        </StatusAdvarselWrapper>
    );
}

function BrukerReservertIKrr() {
    return (
        <StatusAdvarselWrapper title="Brukeren er reservert i KRR">
            Du kan ikke sende meldinger fordi brukeren har reservert seg mot digital kommunikasjon KRR.
            <br />
            <Link href={linkReservert}>Brukeren må gå til norge.no for å fjerne reservasjonen.</Link>
        </StatusAdvarselWrapper>
    );
}
