import { BodyShort, Detail, Heading, LinkPanel } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
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

function Tittel(props: TittelProps) {
    const tittel = props.aktivitet ? getDialogTittel(props.aktivitet) : props.tittel;
    return (
        <Heading className="overflow-hidden text-ellipsis" level="2" size="small">
            {tittel}
        </Heading>
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
    ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK'
}

export type TabChangeEvent = { tabId: string };
function DialogPreview(props: Props) {
    const dialogref = useRef<HTMLDivElement | null>(null);
    const [skalScrolle, setSkalScrolle] = useState<boolean>(false);

    const { dialog, valgtDialogId } = props;
    const { id, sisteDato, aktivitetId, lest, overskrift, historisk } = dialog;
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
        <LinkPanel
            className={classNames('my-1 max-w-full !gap-0 border p-2', styles.dialogPreview, styles.linkPanel, {
                'bg-[#e6f0ff]': detteErValgtDialog,
                [styles.ulestDialog]: !dialog.lest
            })}
            href={dialogRoute(id)}
            aria-current={detteErValgtDialog && true}
            onClick={onGoTo}
        >
            {!dialog.lest ? <div className="w-2 bg-surface-info flex flex-row"></div> : null}
            <div className="flex flex-1 flex-row py-2 pl-2">
                <div className="min-w-0 flex-grow">
                    <BodyShort className="sr-only">{typeText(dialog)}</BodyShort>
                    <Tittel tittel={overskrift} aktivitet={aktivitet} />
                    <Detail>{datoString}</Detail>
                    <EtikettListe dialog={dialog} />
                    <BodyShort className="hidden">{meldingerText(dialog.henvendelser.length)}</BodyShort>
                </div>
                <BodyShort aria-hidden="true" className="ml-2 flex items-center">
                    {dialog.henvendelser.length}
                </BodyShort>
                <div ref={dialogref}></div>
            </div>
        </LinkPanel>
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
        }
        setAntallDialoger(dialoger.length);
    }, [dialoger]);

    if (dialoger.length === 0) return null;
    return (
        <div role="region" aria-live="polite">
            <ul aria-label="Dialogliste">
                {dialoger.map((dialog, index) => (
                    <li
                        key={dialog.id}
                        className={classNames('', {
                            [styles.fadeIn]: index === 0 && skalFadeIn
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
