import { VenstreChevron } from 'nav-frontend-chevron';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './TilbakeKnapp.module.less';

export function TilbakeKnapp() {
    return (
        <Link to="/" title="Til dialoger" className={styles.tilbakeTilOversikt}>
            <VenstreChevron stor />
        </Link>
    );
}
