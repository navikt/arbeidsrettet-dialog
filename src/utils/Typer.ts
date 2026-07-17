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
    reservasjonKRR: boolean;
    registrertKRR: boolean;
    kanVarsles: boolean;
    manuell: boolean;
    underOppfolging: boolean;
    underKvp: boolean;
    oppfolgingsPerioder: PeriodeData[];
    harSkriveTilgang: boolean;
}

export interface PeriodeData {
    startTidspunkt: string;
    sluttTidspunkt: StringOrNull;
    kvpPerioder: KvpPerioder[];
    id: string;
}

interface KvpPerioder {
    startTidspunkt: string;
    sluttTidspunkt: StringOrNull;
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
