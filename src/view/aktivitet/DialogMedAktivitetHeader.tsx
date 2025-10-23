import { BodyShort, Link, Switch } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import { loggKlikkVisAktivitet } from '../../metrics/amplitude-utils';
import { Aktivitet, AktivitetTypes, ArenaAktivitet, ArenaAktivitetTypes } from '../../utils/aktivitetTypes';
import { formaterDate, getKlokkeslett } from '../../utils/Date';
import { useVisAktivitetContext } from '../AktivitetToggleContext';
import { useErVeileder } from '../Provider';
import { useSelectedAktivitet } from '../utils/useAktivitetId';
import { aktivitetLenke, visAktivitetsplan } from './AktivitetskortLenke';
import { TilbakeKnapp } from '../dialog/TilbakeKnapp';
import { getTypeTextByAktivitet } from './TextUtils';
import { DialogTittel } from '../dialog/DialogTittel';

const noOp = () => {};

export function DialogMedAktivitetHeader() {
    const aktivitet = useSelectedAktivitet();
    const { visAktivitet, setVisAktivitet } = useVisAktivitetContext();
    const erVeileder = useErVeileder();

    if (!aktivitet) {
        return null;
    }
    const infotekst = getInfoText(aktivitet);
    const typeTekst = getTypeTextByAktivitet(aktivitet);

    return (
        <div className="flex w-full md:flex-row flex-row items-center align-text-">
            <div className="flex flex-1 flex-row items-center gap-x-2 lg:max-w-lgContainer xl:max-w-none">
                <TilbakeKnapp className="md:hidden" />
                <div className="md:ml-4 flex items-baseline gap-2">
                    <DialogTittel tittel={aktivitet.tittel} ariaLabel={`${typeTekst}: ${aktivitet?.tittel}`} />
                    {infotekst && <BodyShort className="text-text-subtle">{infotekst}</BodyShort>}
                </div>
            </div>
            <div className="flex gap-4">
                <Link
                    href={aktivitetLenke(aktivitet.id)}
                    onClick={erVeileder ? visAktivitetsplan(aktivitet.id) : noOp}
                >
                    Gå til aktiviteten
                </Link>
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
