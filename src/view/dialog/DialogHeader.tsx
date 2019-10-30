import React from 'react';
import { VenstreChevron } from 'nav-frontend-chevron';
import { DialogData } from '../../utils/Typer';
import { AktivitetskortPreview } from '../aktivitet/AktivitetskortPreview';
import { Undertittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';

interface Props {
    dialog: DialogData;
}

//TODO: Fikse, header vises bare når skjermen er liten eller middels stor
export function DialogHeader(props: Props) {
    return (
        <div className="dialog__header">
            <Link to="/" className="tilbake-til-oversikt">
                <VenstreChevron stor className="tilbake-til-oversikt__pilknapp" />
                Oversikt
            </Link>
            {props.dialog.aktivitetId == null ? (
                <Undertittel className="dialog__tittel">{props.dialog.overskrift}</Undertittel>
            ) : (
                <AktivitetskortPreview dialog={props.dialog} />
            )}
        </div>
    );
}
