import React from 'react';
import OkMessage from '../../felleskomponenter/mesage/OkMessage';
import { HandlingsType, ViewState } from '../ViewState';
import { DialogData } from '../../utils/Typer';

interface Props {
    viewState: ViewState;
    dialog: DialogData;
}

export function DialogSendtBekreftelse(props: Props) {
    const { viewState, dialog } = props;
    const henvendelseTekst =
        viewState.sistHandlingsType === HandlingsType.nyHenvendelse
            ? 'Sendt. Du kan forvente svar i løpet av noen dager'
            : null;
    const dialogTekst =
        viewState.sistHandlingsType === HandlingsType.nyDialog
            ? `Meldingen om "${dialog.overskrift}" er sendt. Du kan forvente svar i løpet av noen dager`
            : null;
    const tekst = henvendelseTekst || dialogTekst;

    if (!tekst) {
        return null;
    }

    return (
        <div>
            <OkMessage>{tekst}</OkMessage>
        </div>
    );
}

export default DialogSendtBekreftelse;