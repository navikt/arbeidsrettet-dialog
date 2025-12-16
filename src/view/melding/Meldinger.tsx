import { Heading } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';

import { compareDates } from '../../utils/Date';
import { DialogData, MeldingsData, StringOrNull } from '../../utils/Typer';
import DialogSendtBekreftelse from '../dialog/DialogSendtBekreftelse';
import LestAvTidspunkt from '../lest/LestTidspunkt';
import { Melding } from './Melding';

interface Props {
    dialogData: DialogData;
}

function sisteLesteHenvendelse(lest: StringOrNull, henvendelser: MeldingsData[]) {
    if (!lest) {
        return null;
    }

    const lesteMeldinger = henvendelser.filter((henvendelse) => compareDates(henvendelse.sendt, lest) >= 0);
    const sistLeste = lesteMeldinger[lesteMeldinger.length - 1];
    return sistLeste ? sistLeste.id : null;
}

export function Meldinger(props: Props) {
    const { lestAvBrukerTidspunkt, henvendelser } = props.dialogData;
    const meldingListRef = useRef<HTMLElement>(null);
    const sorterteHenvendelser = !!henvendelser ? henvendelser.sort((a, b) => compareDates(b.sendt, a.sendt)) : [];

    useEffect(() => {
        requestAnimationFrame(() => {
            if (meldingListRef) {
                meldingListRef.current?.scrollTo({ top: meldingListRef.current.scrollHeight, behavior: 'auto' });
            }
        });
    }, [henvendelser]);

    if (!henvendelser) {
        return null;
    }

    const erViktig = props.dialogData.egenskaper[0] === 'ESKALERINGSVARSEL';
    const sisteHenvendelseLestAvBruker = sisteLesteHenvendelse(lestAvBrukerTidspunkt, sorterteHenvendelser);

    return (
        <section
            id="henvendelse-scroll-list"
            aria-label="Meldinger"
            className="grow overflow-y-scroll relative bg-ax-bg-neutral-soft px-4 xl:justify-center"
            ref={meldingListRef}
            tabIndex={0}
            role="grid"
        >
            <div className="xl:w-full xl:max-w-248 flex flex-col justify-end">
                <Heading level="3" size={'medium'} className="hidden">
                    Meldinger
                </Heading>
                <div className="mb-4">
                    {sorterteHenvendelser.map((henvendelse, index) => (
                        <React.Fragment key={henvendelse.id}>
                            <Melding
                                henvendelseData={henvendelse}
                                viktigMarkering={(erViktig && index === 0) || henvendelse.viktig}
                            />
                            {henvendelse.id === sisteHenvendelseLestAvBruker ? (
                                <LestAvTidspunkt tidspunkt={lestAvBrukerTidspunkt!} />
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
                <DialogSendtBekreftelse />
            </div>
        </section>
    );
}
