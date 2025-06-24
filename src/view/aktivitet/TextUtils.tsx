import {
    Aktivitet,
    AktivitetStatus,
    AktivitetTypes,
    AlleAktivitetTypes,
    ArenaAktivitet,
    ArenaAktivitetTypes,
    EksternAktivitetTypes
} from '../../utils/aktivitetTypes';

export function getStatusText(status: AktivitetStatus): string {
    switch (status) {
        case AktivitetStatus.PLANLAGT:
            return 'Planlegger';
        case AktivitetStatus.GJENNOMFORES:
            return 'Gjennomfører';
        case AktivitetStatus.FULLFORT:
            return 'Fullført';
        case AktivitetStatus.BRUKER_ER_INTERESSERT:
            return 'Forslag';
        case AktivitetStatus.AVBRUTT:
            return 'Avbrutt';
    }
}

export function getTypeTextByAktivitet(aktivitet: Aktivitet | ArenaAktivitet): string {
    if (aktivitet.type === AktivitetTypes.EKSTERN_AKTIVITET) {
        return getTypeText(aktivitet.eksternAktivitet?.type!!);
    }
    return getTypeText(aktivitet.type);
}

export function getTypeText(type: AlleAktivitetTypes): string {
    switch (type) {
        case AktivitetTypes.MOTE:
            return 'Møte med Nav';
        case AktivitetTypes.STILLING:
            return 'Stilling';
        case AktivitetTypes.SOKEAVTALE:
            return 'Jobbsøking';
        case AktivitetTypes.SAMTALEREFERAT:
            return 'Samtalereferat';
        case AktivitetTypes.BEHANDLING:
            return 'Behandling';
        case AktivitetTypes.EGEN:
            return 'Jobbrettet egenaktivitet';
        case AktivitetTypes.IJOBB:
            return 'Jobb jeg har nå';
        case AktivitetTypes.STILLING_FRA_NAV:
            return 'Stilling fra Nav';
        case ArenaAktivitetTypes.TILTAKSAKTIVITET:
            return 'Tiltak gjennom Nav';
        case ArenaAktivitetTypes.GRUPPEAKTIVITET:
            return 'Gruppeaktivitet';
        case ArenaAktivitetTypes.UTDANNINGSAKTIVITET:
            return 'Utdanning';
        case EksternAktivitetTypes.ARENA_TILTAK:
            return 'Tiltak gjennom Nav';
        case EksternAktivitetTypes.MIDLERTIDIG_LONNSTILSKUDD:
            return 'Midlertidig lønnstilskudd';
        case EksternAktivitetTypes.VARIG_LONNSTILSKUDD:
            return 'Varig lønnstilskudd';
        case EksternAktivitetTypes.ARBEIDSTRENING:
            return 'Arbeidstrening';
        case EksternAktivitetTypes.VARIG_TILRETTELAGT_ARBEID_I_ORDINAER_VIRKSOMHET:
            return 'Varig tilrettelagt arbeid i ordinær virksomhet';
        case EksternAktivitetTypes.MENTOR:
            return 'Mentor';
        case EksternAktivitetTypes.ARBFORB:
            return 'Arbeidsforberedende trening';
        case EksternAktivitetTypes.ARBRRHDAG:
            return 'Arbeidsrettet rehabilitering';
        case EksternAktivitetTypes.DIGIOPPARB:
            return 'Digitalt jobbsøkerkurs';
        case EksternAktivitetTypes.GRUPPEAMO:
            return 'Arbeidsmarkedsopplæring (Gruppe)';
        case EksternAktivitetTypes.INDOPPFAG:
            return 'Oppfølging';
        case EksternAktivitetTypes.AVKLARAG:
            return 'Avklaring';
        case EksternAktivitetTypes.GRUFAGYRKE:
            return 'Fag- og yrkesopplæring (Gruppe)';
        case EksternAktivitetTypes.JOBBK:
            return 'Jobbklubb';
        case EksternAktivitetTypes.VASV:
            return 'Tilrettelagt arbeid';
        case EksternAktivitetTypes.REKRUTTERINGSTREFF:
            return 'Rekuttteringstreff';
    }
}

export function getDialogTittel(aktivitet: Aktivitet | ArenaAktivitet | undefined): string {
    if (!aktivitet) {
        return '';
    }
    const { type, tittel } = aktivitet;

    switch (type) {
        case AktivitetTypes.BEHANDLING:
        case AktivitetTypes.SOKEAVTALE:
            return tittel ?? '';
        case AktivitetTypes.EGEN:
            return `Egenaktivitet: ${tittel}`;
        case AktivitetTypes.MOTE:
            return `Møte: ${tittel}`;
        case AktivitetTypes.EKSTERN_AKTIVITET:
            return `${getTypeText((aktivitet as Aktivitet).eksternAktivitet!!.type)}: ${tittel}`;
        default:
            return `${getTypeText(type)}: ${tittel}`;
    }
}
