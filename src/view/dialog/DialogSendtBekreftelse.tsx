import { BodyShort, HelpText, InlineMessage } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';

import { StringOrNull } from '../../utils/Typer';
import { HandlingsType, useViewContext } from '../ViewState';
import styles from './DialogSendtBekreftelse.module.less';
import { useFnrContext } from '../Provider';
import { useSelectedDialog } from '../utils/useAktivitetId';

function getTekst(handling: HandlingsType, erVeileder: boolean, overskrift: StringOrNull) {
    if (erVeileder && HandlingsType.ingen !== handling) {
        return 'Sendt. Bruker får beskjed på sms eller e-post om en halvtime';
    } else if (HandlingsType.nyMelding === handling) {
        return 'Sendt. Du får svar i løpet av noen dager.';
    } else if (HandlingsType.nyDialog === handling) {
        if (!overskrift) {
            return 'Sendt. Du får svar i løpet av noen dager.';
        }
        return `Meldingen om "${overskrift}" er sendt. Du får svar i løpet av noen dager.`;
    }
}

function Melding(props: { tekst?: string; erVeileder: boolean }) {
    const [hasRendred, setHasRendred] = useState(false);
    useEffect(() => {
        setHasRendred(true);
    }, []);

    const { tekst, erVeileder } = props;

    return !tekst ? null : (
        <div className="flex justify-center" aria-hidden={!hasRendred}>
            <InlineMessage status="success">
                <BodyShort>{tekst}</BodyShort>
            </InlineMessage>
            {erVeileder && (
                <HelpText className="ml-1.5">
                    <div className={styles.hjelpeTekstInnhold}>
                        <BodyShort>
                            Hvis ikke brukeren leser dialogmeldingen innen en halvtime, så vil brukeren motta meldingen
                            på den måten de har registrert i det offentlige kontaktregisteret. Brukeren får beskjed om
                            en ny melding og det lenkes til dialogen. Beskjeden sendes gjennom Altinn i åpningstiden
                            9-17 på hverdager.
                        </BodyShort>
                        <BodyShort>
                            Sender du flere meldinger innen en halv time så blir det kun sendt én SMS eller e-post.
                        </BodyShort>
                    </div>
                </HelpText>
            )}
        </div>
    );
}

function DialogSendtBekreftelse() {
    const fnr = useFnrContext();
    const dialog = useSelectedDialog();
    const { sistHandlingsType } = useViewContext();
    const erVeileder = !!fnr;
    const sistHandling = sistHandlingsType;

    const tekst = dialog ? getTekst(sistHandling, erVeileder, dialog.overskrift) : undefined;
    return (
        <div role="status" className="pb-4">
            <Melding erVeileder={erVeileder} tekst={tekst} />
        </div>
    );
}

export default DialogSendtBekreftelse;
