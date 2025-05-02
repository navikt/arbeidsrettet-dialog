import { NumberOrNull, StringOrNull } from './Typer';

export enum AktivitetTypes {
    EGEN = 'EGEN',
    STILLING = 'STILLING',
    SOKEAVTALE = 'SOKEAVTALE',
    IJOBB = 'IJOBB',
    BEHANDLING = 'BEHANDLING',
    MOTE = 'MOTE',
    SAMTALEREFERAT = 'SAMTALEREFERAT',
    STILLING_FRA_NAV = 'STILLING_FRA_NAV',
    EKSTERN_AKTIVITET = 'EKSTERNAKTIVITET'
}

export type AlleAktivitetTypes =
    | Exclude<AktivitetTypes, AktivitetTypes.EKSTERN_AKTIVITET>
    | ArenaAktivitetTypes
    | EksternAktivitetTypes;

export enum KanalTypes {
    OPPMOTE = 'OPPMOTE',
    TELEFON = 'TELEFON',
    INTERNETT = 'INTERNETT'
}

export enum AktivitetStatus {
    PLANLAGT = 'PLANLAGT',
    GJENNOMFORES = 'GJENNOMFORES',
    FULLFORT = 'FULLFORT',
    BRUKER_ER_INTERESSERT = 'BRUKER_ER_INTERESSERT',
    AVBRUTT = 'AVBRUTT'
}

export type StillingStatus =
    | 'INGEN_VALGT'
    | 'SOKNAD_SENDT'
    | 'INNKALT_TIL_INTERVJU'
    | 'AVSLAG'
    | 'JOBBTILBUD'
    | null
    | undefined;

export interface CvKanDelesData {
    kanDeles: boolean;
    endretTidspunkt: StringOrNull;
    avtaltDato: StringOrNull;
    endretAv: StringOrNull;
    endretAvType: BrukerType;
}
export type BrukerType = 'NAV' | 'BRUKER';

export enum StillingFraNavSoknadsstatus {
    VENTER = 'VENTER',
    SKAL_PAA_INTERVJU = 'SKAL_PAA_INTERVJU',
    JOBBTILBUD = 'JOBBTILBUD',
    AVSLAG = 'AVSLAG',
    CV_DELT = 'CV_DELT',
    IKKE_FATT_JOBBEN = 'IKKE_FATT_JOBBEN',
    FATT_JOBBEN = 'FATT_JOBBEN'
}
export interface StillingFraNavData {
    cvKanDelesData: CvKanDelesData;
    soknadsfrist: StringOrNull;
    svarfrist: StringOrNull;
    arbeidsgiver: StringOrNull;
    bestillingsId: string;
    stillingsId: StringOrNull;
    arbeidssted: StringOrNull;
    varselId: StringOrNull;
    lenke: StringOrNull; //mangler i backend
    soknadsstatus: StillingFraNavSoknadsstatus;
    //    livslopsstatus: Livslopsstatus;
}

export interface Aktivitet {
    id: string;
    versjon: StringOrNull;

    tittel: StringOrNull;
    beskrivelse: StringOrNull;
    lenke: StringOrNull;
    type: AktivitetTypes;
    status: AktivitetStatus;
    fraDato: StringOrNull;
    tilDato: StringOrNull;
    opprettetDato: string;
    endretDato: StringOrNull;
    endretAv: StringOrNull;
    historisk: boolean;
    avsluttetKommentar: StringOrNull;
    avtalt: boolean;
    endretAvType: StringOrNull;
    transaksjonsType: StringOrNull;
    malid: StringOrNull;
    oppfolgingsperiodeId: string;

    // stillingaktivitet
    etikett: StillingStatus;
    kontaktperson: StringOrNull;
    arbeidsgiver: StringOrNull;
    arbeidssted: StringOrNull;
    stillingsTittel: StringOrNull;

    // egenaktivitet
    hensikt: StringOrNull;
    oppfolging: StringOrNull;

    //sokeAvtaleAktivitet
    antallStillingerSokes: NumberOrNull;
    antallStillingerIUken: NumberOrNull;
    avtaleOppfolging: StringOrNull;

    //iJobbAktivitet
    jobbStatus: StringOrNull;
    ansettelsesforhold: StringOrNull;
    arbeidstid: StringOrNull;

    //behandlingAktivitet
    behandlingType: StringOrNull;
    behandlingSted: StringOrNull;
    effekt: StringOrNull;
    behandlingOppfolging: StringOrNull;

    //møte
    adresse: StringOrNull;
    forberedelser: StringOrNull;
    kanal?: KanalTypes;
    referat: StringOrNull;
    erReferatPublisert: boolean;

    // stillingFraNav
    stillingFraNavData?: StillingFraNavData;

    // eksternaktivitet
    eksternAktivitet?: EksternAktivitetData;
}

export interface EksternAktivitetData {
    type: EksternAktivitetTypes;
}

export enum EksternAktivitetTypes {
    ARENA_TILTAK = 'ARENA_TILTAK',
    MIDLERTIDIG_LONNSTILSKUDD = 'MIDLERTIDIG_LONNSTILSKUDD',
    VARIG_LONNSTILSKUDD = 'VARIG_LONNSTILSKUDD',
    INDOPPFAG = 'INDOPPFAG',
    ARBFORB = 'ARBFORB',
    AVKLARAG = 'AVKLARAG',
    VASV = 'VASV',
    ARBRRHDAG = 'ARBRRHDAG',
    DIGIOPPARB = 'DIGIOPPARB',
    JOBBK = 'JOBBK',
    GRUPPEAMO = 'GRUPPEAMO',
    GRUFAGYRKE = 'GRUFAGYRKE',
    REKRUTTERINGSTREFF = 'REKRUTTERINGSTREFF'
}

export enum ArenaAktivitetTypes {
    TILTAKSAKTIVITET = 'TILTAKSAKTIVITET',
    GRUPPEAKTIVITET = 'GRUPPEAKTIVITET',
    UTDANNINGSAKTIVITET = 'UTDANNINGSAKTIVITET'
}

export interface ArenaAktivitet {
    //Felles
    id: string;
    status: AktivitetStatus;
    type: ArenaAktivitetTypes;
    tittel: StringOrNull;
    beskrivelse: StringOrNull;
    fraDato: StringOrNull;
    tilDato: StringOrNull;
    opprettetDato: StringOrNull;
    avtalt: boolean;
    etikett: StringOrNull;

    // Tiltaksaktivitet
    deltakelseProsent: NumberOrNull;
    tiltaksnavn: StringOrNull;
    tiltakLokaltNavn: StringOrNull;
    arrangoer: StringOrNull;
    bedriftsnummer: StringOrNull;
    antallDagerPerUke: NumberOrNull;
    statusSistEndret: StringOrNull;

    // Gruppeaktivitet
    moeteplanListe: object[] | null;
}
