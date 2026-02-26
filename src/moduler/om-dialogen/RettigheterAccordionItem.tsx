import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import React, { useState } from 'react';

export function RettigheterAccordionItem() {
    const [open, setOpen] = useState(false);

    function handleClick() {
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
                <Heading level="2" size="small" className="text-ax-text-neutral">
                    Rettigheter og personvern
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <BodyShort>
                    Informasjon du gir i meldinger til veilederen din brukes til å vurdere behovet ditt for hjelp fra
                    Nav.
                </BodyShort>
                <Heading level="3" size="xsmall" className="pt-4">
                    Manuell oppfølging
                </Heading>
                <BodyShort className="pb-4">
                    Nav henter informasjon om deg fra Folkeregisteret og sjekker mot Kontakt- og reservasjonsregisteret.
                </BodyShort>
                <BodyShort>
                    Hvis du ikke ønsker å bruke den digitale dialogen, så kan du reservere deg mot digital kommunikasjon
                    med det offentlige hos Norge. no Hvis du reserverer deg mot digital kommunikasjon, vil Nav følge deg
                    opp manuelt.
                </BodyShort>

                <Heading level="3" size="xsmall" className="pt-4">
                    Deling og lagring
                </Heading>
                <BodyShort className="pb-4">
                    Opplysningene i dialogen og aktivitetsplanen blir ikke delt med andre offentlige etater, med mindre
                    de har rett til å hente slike opplysninger.
                </BodyShort>
                <BodyShort className="pb-4">
                    Opplysningene i dialogen og aktivitetsplanen blir lagret og oppbevart etter arkivloven. Meldinger i
                    dialogen kan ikke slettes når de først er opprettet.
                </BodyShort>
                <BodyShort>
                    Les mer om{' '}
                    <Link href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten">
                        hvordan Nav behandler personopplysninger
                    </Link>
                    .
                </BodyShort>
            </Accordion.Content>
        </Accordion.Item>
    );
}
