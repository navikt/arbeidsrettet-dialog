import { BodyShort, Detail, Heading, Link, Switch } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import { useCompactMode } from '../../featureToggle/FeatureToggleProvider';
import { loggKlikkVisAktivitet } from '../../metrics/amplitude-utils';
import { Aktivitet, AktivitetTypes, ArenaAktivitet, ArenaAktivitetTypes } from '../../utils/aktivitetTypes';
import { formaterDate, getKlokkeslett } from '../../utils/Date';
import { useVisAktivitetContext } from '../AktivitetToggleContext';
import { TilbakeKnapp } from '../dialog/TilbakeKnapp';
import { useFnrContext } from '../Provider';
import { useSelectedAktivitet } from '../utils/useAktivitetId';
import { aktivitetLenke, visAktivitetsplan } from './AktivitetskortLenke';
import { getTypeTextByAktivitet } from './TextUtils';

const noOp = () => {};
export function DialogMedAktivitetHeader() {
    const compactMode = useCompactMode();
    const aktivitet = useSelectedAktivitet();
    const { visAktivitet, setVisAktivitet } = useVisAktivitetContext();
    const fnr = useFnrContext();
    const erVeileder = !!fnr;

    if (!aktivitet) {
        return null;
    }

    const typeTekst = getTypeTextByAktivitet(aktivitet);
    const infotekst = getInfoText(aktivitet);

    return (
        <div
            className={classNames('flex w-full md:flex-row', {
                'flex-col': !compactMode,
                'flex-row items-center': compactMode
            })}
        >
            <div className="flex flex-1 flex-row items-center gap-x-2 lg:max-w-lgContainer xl:max-w-none">
                <TilbakeKnapp className="md:hidden" />
                <div className={classNames('md:ml-4', { 'flex items-baseline gap-2': compactMode })}>
                    <Heading className="" level="1" size="small" aria-label={`${typeTekst}: ${aktivitet?.tittel}`}>
                        {aktivitet?.tittel}
                    </Heading>
                    {infotekst &&
                        (compactMode ? (
                            <BodyShort className="text-text-subtle">{infotekst}</BodyShort>
                        ) : (
                            <Detail className="">{infotekst}</Detail>
                        ))}
                </div>
            </div>
            <div
                className={classNames('', {
                    'md:max-w-[320px] xl:max-w-screen-w-1/3': !compactMode && visAktivitet,
                    'lg:flex-1': compactMode && !visAktivitet,
                    'pl-4 md:max-w-[320px] lg:grow xl:max-w-screen-w-1/3': compactMode && visAktivitet,
                    '2xl:mr-4 2xl:flex-none': compactMode
                })}
            >
                <div
                    className={classNames('flex  justify-between md:mt-0 ', {
                        'flex-row items-center pr-2 2xl:items-end': compactMode,
                        'mt-2 flex-row items-center px-2 md:flex-col md:items-end lg:items-start lg:pl-4': !compactMode,
                        'pl-1': compactMode && !visAktivitet
                    })}
                >
                    {!compactMode && <Detail aria-hidden="true">{typeTekst.toUpperCase()}</Detail>}
                    <Link
                        href={aktivitetLenke(aktivitet.id)}
                        onClick={erVeileder ? visAktivitetsplan(aktivitet.id) : noOp}
                    >
                        Gå til aktiviteten
                    </Link>
                    {compactMode && (
                        <Switch
                            className="hidden lg:flex 2xl:hidden"
                            checked={visAktivitet}
                            value={visAktivitet.toString()}
                            onChange={(_) => {
                                setVisAktivitet(!visAktivitet);
                                loggKlikkVisAktivitet(!visAktivitet);
                            }}
                            size="small"
                        >
                            Vis aktiviteten
                        </Switch>
                    )}
                </div>
            </div>
        </div>
    );
}

export function getInfoText(aktivitet: Aktivitet | ArenaAktivitet): string | null {
    switch (aktivitet.type) {
        case AktivitetTypes.STILLING:
            return aktivitet.arbeidsgiver;
        case AktivitetTypes.MOTE:
            return `${formaterDate(aktivitet.fraDato)} / ${getKlokkeslett(aktivitet.fraDato)}`;
        case AktivitetTypes.SOKEAVTALE:
        case AktivitetTypes.EGEN:
            return `${formaterDate(aktivitet.fraDato)} - ${formaterDate(aktivitet.tilDato)}`;
        case AktivitetTypes.BEHANDLING:
            return aktivitet.behandlingType;
        case AktivitetTypes.SAMTALEREFERAT:
            return `${formaterDate(aktivitet.fraDato)}`;
        case AktivitetTypes.IJOBB:
            return aktivitet.ansettelsesforhold;
        case AktivitetTypes.STILLING_FRA_NAV:
            return aktivitet.beskrivelse;
        case AktivitetTypes.EKSTERN_AKTIVITET:
        case ArenaAktivitetTypes.TILTAKSAKTIVITET:
        case ArenaAktivitetTypes.UTDANNINGSAKTIVITET:
        case ArenaAktivitetTypes.GRUPPEAKTIVITET:
            return null;
    }
}
