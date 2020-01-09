import React from 'react';
import classNames from 'classnames';
import styles from './sokestatusEtikett.module.less';
import EtikettBase from './etikett-base';
import { StillingsStatus } from '../../../utils/AktivitetTypes';

const INGEN_VALGT = 'INGEN_VALGT';
const SOKNAD_SENDT = 'SOKNAD_SENDT';
const INNKALT_TIL_INTERVJU = 'INNKALT_TIL_INTERVJU';
const AVSLAG = 'AVSLAG';
const JOBBTILBUD = 'JOBBTILBUD';

const getCls = (etikettnavn?: StillingsStatus): string => {
    switch (etikettnavn) {
        case SOKNAD_SENDT:
            return styles.soknadSendt;
        case INNKALT_TIL_INTERVJU:
            return styles.inkaltTilIntervju;
        case JOBBTILBUD:
            return styles.jobbtilbud;
        case AVSLAG:
            return styles.avslag;
        case INGEN_VALGT:
        case undefined:
        case null:
            return styles.ikkeStartet;
    }
};

const getText = (etikettnavn?: StillingsStatus): string => {
    switch (etikettnavn) {
        case SOKNAD_SENDT:
            return 'Sendt søknad';
        case INNKALT_TIL_INTERVJU:
            return 'Skal på intervju';
        case JOBBTILBUD:
            return 'Fått jobbtilbud 🎉';
        case AVSLAG:
            return 'Fått avslag';
        case INGEN_VALGT:
        case undefined:
        case null:
            return 'Ikke startet';
    }
};

export interface Props {
    etikett?: StillingsStatus;
    className?: string;
    hidden?: boolean;
}

function SokeStatusEtikett(props: Props) {
    const { etikett, className, hidden } = props;

    const cls = getCls(etikett);

    return (
        <EtikettBase className={classNames(cls, className)} hidden={hidden}>
            {getText(etikett)}
        </EtikettBase>
    );
}

export default SokeStatusEtikett;
