import { Systemtittel } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';

import { compareDates } from '../../utils/Date';
import { DialogData, HenvendelseData, StringOrNull } from '../../utils/Typer';
import LestAvTidspunkt from '../lest/LestTidspunkt';
import { useSkjulHodefotForMobilVisning } from '../utils/useSkjulHodefotForMobilVisning';
import { Henvendelse } from './Henvendelse';
import styles from './HenvendelseList.module.less';

interface Props {
    dialogData: DialogData;
}

function sisteLesteHenvendelse(lest: StringOrNull, henvendelser: HenvendelseData[]) {
    if (!lest) {
        return null;
    }

    const lesteMeldinger = henvendelser.filter((henvendelse) => compareDates(henvendelse.sendt, lest) >= 0);
    const sistLeste = lesteMeldinger[lesteMeldinger.length - 1];
    return sistLeste ? sistLeste.id : null;
}

export function HenvendelseList(props: Props) {
    const { lestAvBrukerTidspunkt, henvendelser } = props.dialogData;

    const sorterteHenvendelser = !!henvendelser ? henvendelser.sort((a, b) => compareDates(b.sendt, a.sendt)) : [];

    useSkjulHodefotForMobilVisning();

    useEffect(() => {
        requestAnimationFrame(() => {
            const elem = document.querySelector('#henvendelse-scroll-list');
            if (elem !== null) {
                elem.scrollTo({ top: elem.scrollHeight, behavior: 'auto' });
            }
        });
    }, [henvendelser]);

    if (!henvendelser) {
        return null;
    }

    const erViktig = props.dialogData.egenskaper[0] === 'ESKALERINGSVARSEL';
    const sisteHenvendelseLestAvBruker = sisteLesteHenvendelse(lestAvBrukerTidspunkt, sorterteHenvendelser);

    return (
        <section id="henvendelse-scroll-list" aria-label="Meldinger" className={styles.henvendelseList}>
            <Systemtittel className="visually-hidden">Meldinger</Systemtittel>
            <div className={styles.henvendelseContainer}>
                {sorterteHenvendelser.map((henvendelse, index) => (
                    <React.Fragment key={henvendelse.id}>
                        <div className={styles.henvendelseItem}>
                            <Henvendelse
                                henvendelseData={henvendelse}
                                viktigMarkering={(erViktig && index === 0) || henvendelse.viktig}
                            />
                        </div>
                        <LestAvTidspunkt
                            tidspunkt={lestAvBrukerTidspunkt!}
                            visible={henvendelse.id === sisteHenvendelseLestAvBruker}
                        />
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}
