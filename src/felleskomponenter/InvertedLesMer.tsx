import LesMerToggle from 'nav-frontend-lesmerpanel/lib/lesmerpanelToggle';
import React, { useState } from 'react';
import { UnmountClosed } from 'react-collapse';

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

    return (
        <div className={style.invertedLesMer}>
            <div className={style.toggle}>
                <LesMerToggle erApen={vis} onClick={toggle} apneTekst={apneTekst} lukkTekst={lukkTekst} />
            </div>
            <UnmountClosed isOpened={vis}>{children}</UnmountClosed>
        </div>
    );
}
