import { USE_HASH_ROUTER } from '../constants';
import { featureToggleQuery } from '../featureToggle/const';

export const stripTrailingSlash = (str: string) => {
    return str.endsWith('/') ? str.substring(0, str.length - 1) : str;
};
// export const apiBasePath =
const getApiBasePath = () => {
    const mode = import.meta.env.MODE;
    if (mode === 'test') {
        return window.location.origin;
    }
    return USE_HASH_ROUTER ? '' : stripTrailingSlash(import.meta.env.VITE_DIALOG_API_URL ?? '/');
};
export const apiBasePath = getApiBasePath();

const dialogBasePath = `${apiBasePath}/veilarbdialog/api`;
export const DialogApi = {
    ferdigBehandlet: (dialogId: string, ferdigBehandlet: boolean) =>
        `${dialogBasePath}/dialog/${dialogId}/ferdigbehandlet/${ferdigBehandlet}`,
    venterPaSvar: (id: string, venterPaSvar: boolean) =>
        `${dialogBasePath}/dialog/${id}/venter_pa_svar/${venterPaSvar}`,
    kladd: `${dialogBasePath}/kladd`,
    opprettDialog: `${dialogBasePath}/dialog`,
    sistOppdatert: `${dialogBasePath}/dialog/sistOppdatert`,
    settLest: (dialogId: string) => `${dialogBasePath}/dialog/${dialogId}/les`,
    logg: `${dialogBasePath}/logger/event`,
    graphql: `${apiBasePath}/veilarbdialog/graphql`
};

export const aktivitetBasePath = `${apiBasePath}/veilarbaktivitet`;
export const AktivitetApi = {
    hentAktiviteter: `${aktivitetBasePath}/api/aktivitet`,
    hentArenaAktiviteter: `${aktivitetBasePath}/api/arena/tiltak`,
    hentFeatureToggles: `${aktivitetBasePath}/api/feature?${featureToggleQuery}`
};

const oppfolgingBasePath = `${apiBasePath}/veilarboppfolging/api`;
export const OppfolgingsApi = {
    me: `${oppfolgingBasePath}/oppfolging/me`,
    settDigigtal: `${oppfolgingBasePath}/oppfolging/settDigital`,
    oppfolgingUrl: `${oppfolgingBasePath}/v3/oppfolging/hent-status`
};
