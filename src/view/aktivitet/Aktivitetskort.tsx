import { Heading } from '@navikt/ds-react';
import React from 'react';

import { useVisAktivitet } from '../AktivitetToggleContext';
import { useCompactMode } from '../../featureToggle/FeatureToggleProvider';
import { useSelectedAktivitet, useSelectedDialog } from '../utils/useAktivitetId';
import { getAktivitetType } from '../utils/utils';
import AktivitetIngress from './AktivitetIngress';
import { AktivitetskortInfoBox } from './AktivitetskortInfoBox';
import Brodsmulesti from './Brodsmulesti';
import AvtaltMarkering from './etiketter/avtalt-markering';
import classNames from 'classnames';

export function Aktivitetskort() {
    const aktivitet = useSelectedAktivitet();
    const compactMode = useCompactMode();
    const visAktivitet = useVisAktivitet();
    const harDialog = useSelectedDialog();

    if (!aktivitet) {
        if (compactMode) {
            return (
                <div className="hidden 2xl:flex 2xl:w-full 2xl:max-w-screen-w-1/4 border-l border-border-divider"></div>
            );
        }
        return <div className="border-l border-border-divider xl:w-full xl:max-w-screen-w-1/3" />;
    }

    const { status, tittel, avtalt } = aktivitet;
    return (
        <div
            className={classNames(' w-full border-l border-border-divider lg:max-w-[320px] xl:max-w-screen-w-1/3', {
                'lg:flex hidden': !harDialog && aktivitet,
                hidden: !visAktivitet,
                ' lg:flex hidden': visAktivitet,
                '2xl:flex 2xl:max-w-screen-w-1/4': compactMode,
                'hidden lg:flex': !compactMode
            })}
        >
            <section
                aria-label="Aktivitet knyttet til dialog"
                className="m-4 mr-0 w-full overflow-y-auto overflow-x-visible xl:max-w-max-paragraph"
            >
                <Brodsmulesti status={status} type={getAktivitetType(aktivitet)} />
                <Heading size={compactMode ? 'small' : 'large'} level="1">
                    {tittel}
                </Heading>
                <AktivitetIngress aktivitetType={getAktivitetType(aktivitet)} />
                <AktivitetskortInfoBox aktivitet={aktivitet} />
                <AvtaltMarkering hidden={!avtalt} />
            </section>
        </div>
    );
}
