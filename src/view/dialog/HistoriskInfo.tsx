import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import NyDialogLink from '../dialogliste/NyDialogLink';
import useKansendeMelding from '../../utils/UseKanSendeMelding';

interface Props {
    hidden?: boolean;
}

function HistoriskInfo({ hidden }: Props) {
    const kanSendeMelding = useKansendeMelding();
    if (hidden) {
        return null;
    }

    return (
        <div className="m-4 flex flex-col items-center justify-center xl:max-w-max-paragraph xl:self-center">
            <BodyShort className="pb-4">
                Dette er en dialog fra en tidligere periode, og du kan derfor ikke svare på den.
            </BodyShort>
            <div className="self-start">{kanSendeMelding ? <NyDialogLink /> : null}</div>
        </div>
    );
}

export default HistoriskInfo;
