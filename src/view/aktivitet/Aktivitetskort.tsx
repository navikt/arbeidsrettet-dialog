import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { hasData } from '@nutgaard/use-fetch';
import { AktivitetskortInfoBox } from './AktivitetskortInfoBox';
import styles from './Aktivitetskort.module.less';
import { useParams } from 'react-router';
import { useDialogContext } from '../Provider';
import Brodsmulesti from './Brodsmulesti';
import AktivitetskortLenke from './AktivitetskortLinke';
import AktivitetIngress from './AktivitetIngress';
import AvtaltMarkering from './etiketter/avtalt-markering';
import { useAktivitetId } from '../utils/useAktivitetId';
import { findAktivitet, useAktivitetContext } from '../AktivitetProvider';

export function Aktivitetskort() {
    const dialoger = useDialogContext();
    const dialogData = hasData(dialoger) ? dialoger.data : [];
    const { dialogId } = useParams();
    const aktivitetData = useAktivitetContext();

    const dialog = dialogData.find(dialog => dialog.id === dialogId);
    const aktivitetId = useAktivitetId() ?? dialog?.aktivitetId;
    const aktivitet = findAktivitet(aktivitetData, aktivitetId);

    if (!aktivitet) {
        return null;
    }

    const { status, tittel, type, avtalt, id } = aktivitet;

    return (
        <div className={styles.aktivitetskort}>
            <Brodsmulesti status={status} type={type} />
            <Systemtittel>{tittel}</Systemtittel>
            <AktivitetskortLenke aktivitetId={id} />
            <AktivitetIngress aktivitetType={type} />
            <AktivitetskortInfoBox aktivitet={aktivitet} />
            <AvtaltMarkering hidden={!avtalt} />
        </div>
    );
}
