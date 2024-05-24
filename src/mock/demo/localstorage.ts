export const LocalStorageElement = {
    BRUKER_TYPE: 'brukertype',
    IKKE_UNDER_OPPFOLGING: 'ikke_under_oppfolging',
    MANUELL_BRUKER: 'manuellbruker',
    KRR_BRUKER: 'krrbruker',
    INGEN_OPPF_PERIODER: 'ingen_oppf_perioder',
    KAN_IKKE_VARSLES: 'bruker_kan_ikke_varsles',
    INGEN_DIALOGER: 'ingen_dialoger',
    FAILURE_RATE: 'failure_rate',
    DIALOG_FEILER: 'dialog_feiler',
    AKTIVITET_FEILER: 'aktivitet_feiler',
    ARENAAKTIVITET_FEILER: 'arenaaktivitet_feiler',
    NY_DIALOG_SEND_MELDING_FEILER: 'ny_dialog_eller_send_melding_feiler'
};

export const BRUKER_TYPE = {
    INTERN: 'intern',
    EKSTERN: 'ekstern'
};

export const settLocalStorage = (key: string, value: any) => {
    window.localStorage.setItem(key, value);
};

export const hentFraLocalStorage = (key: string) => {
    return window.localStorage.getItem(key);
};

const erSatt = (localStorageElement: string) => {
    return hentFraLocalStorage(localStorageElement) === 'true';
};

export const erIkkeUnderOppfolging = () => erSatt(LocalStorageElement.IKKE_UNDER_OPPFOLGING);

export const erManuellBruker = () => erSatt(LocalStorageElement.MANUELL_BRUKER);

export const erKRRBruker = () => erSatt(LocalStorageElement.KRR_BRUKER);

export const ingenOppfPerioder = () => erSatt(LocalStorageElement.INGEN_OPPF_PERIODER);

export const brukerKanIkkeVarsles = () => erSatt(LocalStorageElement.KAN_IKKE_VARSLES);

export const erEksternBruker = () => hentFraLocalStorage(LocalStorageElement.BRUKER_TYPE) === BRUKER_TYPE.EKSTERN;

export const harIngenDialoger = () => erSatt(LocalStorageElement.INGEN_DIALOGER);

export const harDialogFeilerSkruddPa = () => erSatt(LocalStorageElement.DIALOG_FEILER);

export const harAktivitetFeilerSkruddPa = () => erSatt(LocalStorageElement.AKTIVITET_FEILER);

export const harArenaaktivitetFeilerSkruddPa = () => erSatt(LocalStorageElement.ARENAAKTIVITET_FEILER);

export const harNyDialogEllerSendMeldingFeilerSkruddPa = () =>
    erSatt(LocalStorageElement.NY_DIALOG_SEND_MELDING_FEILER);

export function getFailureRate(): number {
    const value = hentFraLocalStorage(LocalStorageElement.FAILURE_RATE);
    return value ? Number.parseInt(value) : 0;
}
