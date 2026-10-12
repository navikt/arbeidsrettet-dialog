import React from 'react';
import StatusAdvarselWrapper from './StatusAdvarselWrapper';

export default function IkkeTilgang() {
    return (
        <StatusAdvarselWrapper title={'Ikke tilgang til å sende meldinger'}>
            Du har ikke tilgang til å sende dialogmeldinger.
        </StatusAdvarselWrapper>
    );
}
