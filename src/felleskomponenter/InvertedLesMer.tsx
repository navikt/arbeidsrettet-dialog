import { ReadMore } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

import style from './InvertedLesMer.module.less';

interface Props {
    apneTekst: string;
    lukkTekst: string;
    hidden?: boolean;
    children: React.ReactNode;
}

export default function InvertedLestMer(props: Props) {
    const [vis, setVis] = useState(false);
    const toggle = () => setVis(!vis);

    const { apneTekst, lukkTekst, hidden, children } = props;

    if (hidden) {
        return null;
    }

    const tekst = vis ? lukkTekst : apneTekst;

    return (
        <div className={classNames('mb-4', style.invertedLesMer)}>
            <div>
                <ReadMore open={vis} onClick={toggle} header={tekst} children={null} />
            </div>
            {/* @ts-ignore react-collapse bundles older @types/react incompatible with React 19 */}
            <Collapse isOpened={vis}>{vis ? children : null}</Collapse>
        </div>
    );
}
