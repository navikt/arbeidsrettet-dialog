import classNames from 'classnames';
import React, { useEffect } from 'react';

import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { getDialogTittel } from '../aktivitet/TextUtils';
import { findAktivitet, isLoadingData, useAktivitetContext } from '../AktivitetProvider';
import { useViewContext } from '../Provider';
import { useAktivitetId } from '../utils/useAktivitetId';
import { useSkjulHodefotForMobilVisning } from '../utils/useSkjulHodefotForMobilVisning';
import { endreDialogSomVises, sendtNyDialog } from '../ViewState';
import styles from './Dialog.module.less';
import NyDialogForm from './NyDialogForm';
import { TittelHeader } from './TittelHeader';

const cls = classNames(styles.dialog, styles.overflowAuto);

function NyDialog() {
    const kansendeMelding = useKansendeMelding();
    useSkjulHodefotForMobilVisning();

    const aktivitetId = useAktivitetId();
    const aktivitetData = useAktivitetContext();

    const aktivitet = findAktivitet(aktivitetData, aktivitetId);
    const defaultTema = getDialogTittel(aktivitet).substr(0, 254); // max 255 char long
    const loadingData = isLoadingData(aktivitetData);

    const { viewState, setViewState } = useViewContext();

    useEffect(() => {
        setViewState(endreDialogSomVises());
    }, [setViewState]);

    if (!kansendeMelding || (aktivitetId && loadingData)) {
        return <div className={styles.dialog} />;
    }

    return (
        <section aria-label="Ny dialog" className={cls}>
            <TittelHeader>Ny dialog</TittelHeader>
            <NyDialogForm
                onSubmit={() => setViewState(sendtNyDialog(viewState))}
                defaultTema={defaultTema}
                aktivitetId={aktivitet?.id}
                key={aktivitet?.id}
            />
        </section>
    );
}

export default NyDialog;
