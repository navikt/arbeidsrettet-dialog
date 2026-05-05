import { Tag, TagProps } from '@navikt/ds-react';
import React from 'react';

import { StillingFraNavSoknadsstatus } from '../../../utils/aktivitetTypes';

interface Etikett {
    text: string;
    variant: TagProps['variant'];
}

const getEtikett: Record<StillingFraNavSoknadsstatus, Etikett> = {
    VENTER: { text: 'Venter på å bli kontaktet', variant: 'success' },
    SKAL_PAA_INTERVJU: { text: 'Skal på intervju', variant: 'info' },
    JOBBTILBUD: { text: 'Fått jobbtilbud 🎉', variant: 'neutral' },
    AVSLAG: { text: 'Ikke fått jobben', variant: 'neutral' },
    CV_DELT: { text: 'CV er delt med arbeidsgiver', variant: 'info' },
    IKKE_FATT_JOBBEN: { text: 'Ikke fått jobben', variant: 'neutral' },
    FATT_JOBBEN: { text: 'Fått jobben 🎉', variant: 'neutral' },
};

interface Props {
    etikett?: StillingFraNavSoknadsstatus;
}

function StillingFraNavEtikett(props: Props) {
    const { etikett } = props;

    if (!etikett) return null;

    const { text, variant } = getEtikett[etikett] || {};

    return (
        <Tag className="mr-2" variant={variant} size="small">
            {text}
        </Tag>
    );
}

export default StillingFraNavEtikett;
