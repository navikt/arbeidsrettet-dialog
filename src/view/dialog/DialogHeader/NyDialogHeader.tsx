import { TilbakeKnapp } from '../TilbakeKnapp';
import { Heading } from '@navikt/ds-react';
import React from 'react';

export const NyDialogHeader = () => {
    return (
        <div>
            <div className="flex items-center gap-x-4 border-b border-border-divider bg-white p-1.5 pl-4">
                <TilbakeKnapp className="md:hidden" />
                <Heading level="1" size="small">
                    Start en ny dialog
                </Heading>
            </div>
        </div>
    );
};
