import { TilbakeKnapp } from '../TilbakeKnapp';
import { Heading } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';

export const NyDialogHeader = () => {
    const headerRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (headerRef.current) {
            headerRef.current.focus();
        }
    }, [headerRef.current]);
    return (
        <div>
            <div className="flex items-center gap-x-4 border-b border-ax-border-neutral-subtle bg-white p-1.5 pl-4">
                <TilbakeKnapp className="md:hidden" />
                <Heading ref={headerRef} tabIndex={-1} level="1" size="small">
                    Start en ny dialog
                </Heading>
            </div>
        </div>
    );
};
