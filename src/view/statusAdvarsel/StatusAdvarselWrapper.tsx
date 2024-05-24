import { Alert } from '@navikt/ds-react';
import React from 'react';

export default function StatusAdvarselWrapper(props: { children: React.ReactNode }) {
    return (
        <Alert fullWidth variant="warning">
            {props.children}
        </Alert>
    );
}

export function KanIkkeKontakteElektroniskVeileder() {
    return <StatusAdvarselWrapper>Du kan ikke kontakte denne brukeren elektronisk.</StatusAdvarselWrapper>;
}
