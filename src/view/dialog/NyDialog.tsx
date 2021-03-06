import React, { useEffect } from 'react';

import { StringOrUndefined } from '../../utils/Typer';
import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { getDialogTittel } from '../aktivitet/TextUtils';
import { AktivitetContextType, MaybeAktivitet, findAktivitet, useAktivitetContext } from '../AktivitetProvider';
import { useViewContext } from '../Provider';
import { useAktivitetId } from '../utils/useAktivitetId';
import { useSkjulHodefotForMobilVisning } from '../utils/useSkjulHodefotForMobilVisning';
import { endreDialogSomVises, sendtNyDialog } from '../ViewState';
import styles from './Dialog.module.less';
import NyDialogForm from './NyDialogForm';

export default function NyDialog() {
    const kansendeMelding = useKansendeMelding();
    useSkjulHodefotForMobilVisning();

    const aktivitetId: StringOrUndefined = useAktivitetId();
    const aktivitetData: AktivitetContextType = useAktivitetContext();
    const aktivitet: MaybeAktivitet = findAktivitet(aktivitetData, aktivitetId);

    const defaultTema = getDialogTittel(aktivitet);

    const { viewState, setViewState } = useViewContext();

    useEffect(() => {
        setViewState(endreDialogSomVises());
    }, [setViewState]);

    if (!kansendeMelding || (aktivitetId && !aktivitet)) {
        return <div className={styles.dialog} />;
    }

    return (
        <NyDialogForm
            onSubmit={() => setViewState(sendtNyDialog(viewState))}
            defaultTema={defaultTema}
            aktivitetId={aktivitet?.id}
            key={aktivitet?.id}
        />
    );
}
