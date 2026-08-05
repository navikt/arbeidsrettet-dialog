import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { formaterDateAndTime } from '../../utils/Date';
import Pil from './pil.svg?react';
import { useErVeileder } from '../Provider';

interface Props {
    tidspunkt: string;
}

function LestAvTidspunkt(props: Props) {
    const erVeileder = useErVeileder();
    const tidspunktMedRiktigFormat = formaterDateAndTime(props.tidspunkt);
    if (!erVeileder) return null;
    return (
        <div className="flex items-center justify-center pb-4 pt-2">
            <Pil className="mr-2" />
            <BodyShort>{`Lest av bruker ${tidspunktMedRiktigFormat}`}</BodyShort>
        </div>
    );
}

export default LestAvTidspunkt;
