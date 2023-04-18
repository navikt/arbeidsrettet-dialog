import { ChevronLeftIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './TilbakeKnapp.module.less';

export const TilbakeKnapp = () => (
    <Link to="/" title="Til dialoger" className={styles.tilbakeTilOversikt}>
        <ChevronLeftIcon stor />
    </Link>
);
