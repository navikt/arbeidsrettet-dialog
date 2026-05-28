export type ValueOrNull<T> = T | null;
export type StringOrNull = ValueOrNull<string>;
export type NumberOrNull = ValueOrNull<number>;
export type ValueOrUndefined<T> = T | undefined;
export type StringOrUndefined = ValueOrUndefined<string>;

export interface NyDialogMeldingData {
    tekst: string;
    dialogId?: string;
    overskrift?: string;
    aktivitetId?: string;
    fnr?: string;
    venterPaaSvarFraBruker?: boolean;
}

export interface DialogData {
    id: string;
    aktivitetId: StringOrNull;
    overskrift: StringOrNull;
    sisteTekst: StringOrNull;
    sisteDato: string;
    opprettetDato: StringOrNull;
    historisk: boolean;
    lest: boolean;
    venterPaSvar: boolean;
    ferdigBehandlet: boolean;
    lestAvBrukerTidspunkt: StringOrNull;
    erLestAvBruker: boolean;
    henvendelser: MeldingsData[];
    egenskaper: string[];
}

export interface MeldingsData {
    id: string;
    dialogId: string;
    avsender: string;
    avsenderId: string;
    sendt: string;
    lest: boolean;
    tekst: string;
    viktig: boolean;
}

export interface Bruker {
    id: string;
    erVeileder: boolean;
    erBruker: boolean;
}

export interface OppfolgingData {
    fnr: string;
    aktorId: string;
    veilederId: StringOrNull;
    reservasjonKRR: boolean;
    registrertKRR: boolean;
    kanVarsles: boolean;
    manuell: boolean;
    underOppfolging: boolean;
    underKvp: boolean;
    oppfolgingUtgang: StringOrNull;
    gjeldendeEskaleringsvarsel: Eskaleringsvarsel | null;
    kanStarteOppfolging: boolean;
    avslutningStatus: StringOrNull;
    oppfolgingsPerioder: PeriodeData[];
    harSkriveTilgang: boolean;
    kanReaktiveres: boolean;
    inaktiveringsdato: StringOrNull;
    erSykmeldtMedArbeidsgiver: boolean;
    servicegruppe: StringOrNull;
    formidlingsgruppe: StringOrNull;
}

export interface Eskaleringsvarsel {
    varselId: string;
    aktorId: string;
    opprettetAv: string;
    opprettetDato: string;
    avsluttetDato: StringOrNull;
    tilhorendeDialogId: number;
}

export interface PeriodeData {
    aktorId: string;
    veileder: boolean;
    startDato: StringOrNull;
    sluttDato: StringOrNull;
    begrunnelse: StringOrNull;
    kvpPerioder: KvpPerioder[];
    uuid: string;
}

interface KvpPerioder {
    opprettetDato: StringOrNull;
    avsluttetDato: StringOrNull;
}

export interface KladdData {
    dialogId: StringOrNull;
    aktivitetId: StringOrNull;
    overskrift: StringOrNull;
    tekst: StringOrNull;
}

export interface SistOppdatert {
    sistOppdatert: Date;
}

export interface TilgangData {
    harSkrivetilgangTilBruker: boolean;
}
