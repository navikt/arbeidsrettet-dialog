import { BodyShort, Detail, LinkCard } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRoutes } from '../../routing/routes';
import { Aktivitet, ArenaAktivitet } from '../../utils/aktivitetTypes';
import { formaterDate } from '../../utils/Date';
import { DialogData, StringOrNull } from '../../utils/Typer';
import { getDialogTittel } from '../aktivitet/TextUtils';
import { findAktivitet, useAktivitetContext } from '../AktivitetProvider';
import { useEventListener } from '../utils/useEventListner';
import styles from './DialogPreview.module.css';
import { EtikettListe } from './EtikettListe';
import { HandlingsType } from '../ViewState';

interface TittelProps {
    aktivitet?: Aktivitet | ArenaAktivitet;
    tittel: StringOrNull;
}

const ALIGN_TO_BOTTOM: ScrollIntoViewOptions = { block: 'end', inline: 'nearest' };

function Tittel(props: TittelProps & { href: string; onClick: (e: React.MouseEvent<HTMLElement>) => void }) {
    const tittel = props.aktivitet ? getDialogTittel(props.aktivitet) : props.tittel;
    return (
        <LinkCard.Title>
            <LinkCard.Anchor href={props.href} onClick={props.onClick}>
                {tittel}
            </LinkCard.Anchor>
        </LinkCard.Title>
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

export enum TabId {
    AKTIVITETSPLAN = 'AKTIVITETSPLAN',
    DIALOG = 'DIALOG',
    VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
    DETALJER = 'DETALJER',
    ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK',
}

export type TabChangeEvent = { tabId: string };

function DialogPreview(props: Props) {
    const dialogref = useRef<HTMLDivElement | null>(null);
    const [skalScrolle, setSkalScrolle] = useState<boolean>(false);

    const { dialog, valgtDialogId } = props;
    const { id, sisteDato, aktivitetId, overskrift } = dialog;
    const detteErValgtDialog = id === valgtDialogId;

    useEventListener<TabChangeEvent>('veilarbpersonflatefs.tab-clicked', ({ detail: { tabId } }) => {
        if (tabId === TabId.DIALOG) setSkalScrolle(true);
    });

    useEffect(() => {
        const dialogElement: HTMLElement | null | undefined = dialogref?.current?.parentElement;
        if (skalScrolle && dialogElement && detteErValgtDialog) {
            dialogElement.scrollIntoView(ALIGN_TO_BOTTOM);
            setSkalScrolle(false);
        }
    }, [dialogref, detteErValgtDialog, skalScrolle]);

    const aktivitetData = useAktivitetContext();

    const datoString = !!sisteDato ? formaterDate(sisteDato) : '';
    const aktivitet = findAktivitet(aktivitetData, aktivitetId);

    const navigate = useNavigate();
    const { dialogRoute } = useRoutes();
    const onGoTo = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        navigate(dialogRoute(id), { state: { sistHandlingsType: HandlingsType.ingen } });
    };

    return (
        <LinkCard
            arrow={false}
            size="small"
            aria-current={detteErValgtDialog || undefined}
            className={classNames(styles.dialogPreview, {
                [styles.valgtDialog]: detteErValgtDialog,
            })}
        >
            <div className={classNames(styles.blueIndicator, { invisible: dialog.lest })} />
            <BodyShort className="sr-only">{typeText(dialog)}</BodyShort>
            <Tittel tittel={overskrift} aktivitet={aktivitet} href={dialogRoute(id)} onClick={onGoTo} />
            <LinkCard.Description>
                <Detail>{datoString}</Detail>
                <EtikettListe dialog={dialog} />
                <BodyShort className="sr-only">{meldingerText(dialog.henvendelser.length)}</BodyShort>
            </LinkCard.Description>
            <div className={styles.arrowArea}>
                <BodyShort aria-hidden="true">{dialog.henvendelser.length}</BodyShort>
                <ChevronRightIcon aria-hidden fontSize="1.75rem" />
            </div>
            <div ref={dialogref} />
        </LinkCard>
    );
}

interface ListeProps {
    dialoger: DialogData[];
    valgDialog?: string;
}

let skalFadeIn = false;

export function DialogPreviewListe({ dialoger, valgDialog }: ListeProps) {
    const [antallDialoger, setAntallDialoger] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (antallDialoger === undefined) {
            skalFadeIn = false;
        } else if (dialoger.length === antallDialoger + 1) {
            skalFadeIn = true;
        } else {
            skalFadeIn = false;
        }
        setAntallDialoger(dialoger.length);
    }, [dialoger]);

    if (dialoger.length === 0) return null;
    return (
        <div role="region" aria-live="polite">
            <ul aria-label="Dialogliste" className="flex flex-col gap-y-1">
                {dialoger.map((dialog, index) => (
                    <li
                        key={dialog.id}
                        className={classNames('', {
                            [styles.fadeIn]: index === 0 && skalFadeIn,
                        })}
                    >
                        <DialogPreview dialog={dialog} valgtDialogId={valgDialog} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DialogPreview;
