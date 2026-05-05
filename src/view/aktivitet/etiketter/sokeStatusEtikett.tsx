import { Tag } from '@navikt/ds-react';
import { TagProps } from '@navikt/ds-react';
import React from 'react';

import { StillingStatus } from '../../../utils/aktivitetTypes';

interface Etikett {
    text: string;
    variant: TagProps['variant'];
}

const getEtikett: Record<Exclude<StillingStatus, undefined | null>, Etikett> = {
    SOKNAD_SENDT: { text: 'Sendt søknad og venter på svar', variant: 'success' },
    INNKALT_TIL_INTERVJU: { text: 'Skal på intervju', variant: 'info' },
    JOBBTILBUD: { text: 'Fått jobbtilbud 🎉', variant: 'warning' },
    AVSLAG: { text: 'Ikke fått jobben', variant: 'neutral' },
    INGEN_VALGT: { text: 'Fått avslag', variant: 'neutral' },
};

interface Props {
    etikett?: StillingStatus;
}

function SokeStatusEtikett(props: Props) {
    const { etikett } = props;

    if (!etikett) return null;

    const { text, variant } = getEtikett[etikett];

    return (
        <Tag className="mr-2" variant={variant} size="small">
            {text}
        </Tag>
    );
}

export default SokeStatusEtikett;
