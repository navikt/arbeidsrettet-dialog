import { Alert } from '@navikt/ds-react';
import React from 'react';

export default function StatusAdvarselWrapper(props: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center border-b border-border-divider p-4">
            <Alert variant="warning">{props.children}</Alert>
        </div>
    );
}

export function KanIkkeKontakteElektroniskVeileder() {
    return <StatusAdvarselWrapper>Du kan ikke kontakte denne brukeren elektronisk.</StatusAdvarselWrapper>;
}
