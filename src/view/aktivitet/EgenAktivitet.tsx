import React from 'react';

import { Aktivitet } from '../../utils/aktivitetTypes';
import { formaterDate } from '../../utils/Date';
import InformasjonElement, { LenkeInformasjonElement } from './InformasjonElement';

interface PropTypes {
    aktivitet: Aktivitet;
}

export default function EgenAktivitet(props: PropTypes) {
    const { fraDato, tilDato, hensikt, oppfolging, beskrivelse, lenke } = props.aktivitet;

    return (
        <>
            <InformasjonElement merkelapptekst="Fra dato" verdi={formaterDate(fraDato)} />
            <InformasjonElement merkelapptekst="Til dato" verdi={formaterDate(tilDato)} />
            <InformasjonElement merkelapptekst="Mål med aktiviteten" verdi={hensikt} />
            <InformasjonElement merkelapptekst="Min huskeliste" verdi={oppfolging} />
            <InformasjonElement merkelapptekst="Beskrivelse" verdi={beskrivelse} />
            <LenkeInformasjonElement merkelapptekst="Lenke" verdi={lenke} />
        </>
    );
}
