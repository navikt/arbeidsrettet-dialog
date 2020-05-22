import React from 'react';
import { DialogData, StringOrNull } from '../../utils/Typer';
import { EtikettLiten, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import { EtikettListe } from './EtikettListe';
import { formaterDate } from '../../utils/Date';
import WrapInReactLink from '../../felleskomponenter/WrapInReactLink';
import classNames from 'classnames';
import styles from './DialogPreview.module.less';
import Ikon from './ikon/Ikon';
import { getDialogTittel } from '../aktivitet/TextUtils';
import { Aktivitet, ArenaAktivitet } from '../../utils/AktivitetTypes';
import { findAktivitet, useAktivitetContext } from '../AktivitetProvider';
import { Flipper, Flipped } from 'react-flip-toolkit';

interface TittelProps {
    aktivitet?: Aktivitet | ArenaAktivitet;
    tittel: StringOrNull;
}

function Tittel(props: TittelProps) {
    const tittel = props.aktivitet ? getDialogTittel(props.aktivitet) : props.tittel;
    return (
        <Systemtittel tag="p" className={styles.heading}>
            {tittel}
        </Systemtittel>
    );
}

function typeText(dialog: DialogData) {
    if (dialog.aktivitetId) {
        return dialog.lest ? 'Dialog om aktivitet' : 'Ulest dialog om aktivitet';
    }
    return dialog.lest ? 'Dialog' : 'Ulest dialog';
}

function meldingerText(length: number) {
    if (length <= 1) {
        return `${length} melding i dialogen`;
    }
    return `${length} meldinger i dialogen`;
}

interface Props {
    dialog: DialogData;
    valgtDialogId?: string;
}

function DialogPreview(props: Props) {
    const { dialog, valgtDialogId } = props;
    const { id, sisteDato, aktivitetId, lest, overskrift } = dialog;
    const aktivitetData = useAktivitetContext();

    const datoString = !!sisteDato ? formaterDate(sisteDato) : '';
    const aktivitet = findAktivitet(aktivitetData, aktivitetId);
    const lenkepanelCls = classNames(styles.preview, {
        [styles.innholdUlest]: !lest,
        [styles.innholdValgt]: id === valgtDialogId
    });
    const markoer = lest ? styles.markoerLest : styles.markoerUlest;

    return (
        <LenkepanelBase className={lenkepanelCls} href={`/${id}`} linkCreator={WrapInReactLink}>
            <div className={markoer} />
            <Ikon dialog={dialog} />
            <div className={styles.content}>
                <Normaltekst className="visually-hidden">{typeText(dialog)}</Normaltekst>
                <Tittel tittel={overskrift} aktivitet={aktivitet} />
                <EtikettLiten className={styles.dato}>{datoString}</EtikettLiten>
                <EtikettListe dialog={dialog} />
                <Normaltekst className="visually-hidden">{meldingerText(dialog.henvendelser.length)}</Normaltekst>
            </div>
            <Normaltekst aria-hidden="true">{dialog.henvendelser.length}</Normaltekst>
        </LenkepanelBase>
    );
}

interface ListeProps {
    dialoger: DialogData[];
    valgDialog?: string;
}

export function DialogPreviewListe(props: ListeProps) {
    const { dialoger, valgDialog } = props;

    return (
        <Flipper flipKey={dialoger.map((d) => d.id).join('')}>
            <div role="list" aria-label="Dialogliste">
                {dialoger.map((dialog) => (
                    <Flipped flipId={dialog.id} key={dialog.id}>
                        <div role="listitem">
                            <DialogPreview dialog={dialog} key={dialog.id} valgtDialogId={valgDialog} />
                        </div>
                    </Flipped>
                ))}
            </div>
        </Flipper>
    );
}

export default DialogPreview;
