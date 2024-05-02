import { USE_HASH_ROUTER } from '../constants';
import { featureToggleQuery } from '../featureToggle/const';

export const stripTrailingSlash = (str: string) => {
    return str.endsWith('/') ? str.substring(0, str.length - 1) : str;
};
export const apiBasePath = USE_HASH_ROUTER ? '' : stripTrailingSlash(import.meta.env.VITE_DIALOG_API_URL ?? '/');

const dialogBasePath = `${apiBasePath}/veilarbdialog/api`;
export const DialogApi = {
    ferdigBehandlet: (dialogId: string, ferdigBehandlet: boolean, query: string | undefined) =>
        `${dialogBasePath}/dialog/${dialogId}/ferdigbehandlet/${ferdigBehandlet}${query}`,
    venterPaSvar: (id: string, venterPaSvar: boolean, query: string | undefined) =>
        `${dialogBasePath}/dialog/${id}/venter_pa_svar/${venterPaSvar}${query}`,
    kladd: (query: string | undefined) => `${dialogBasePath}/kladd${query}`,
    hentDialog: (query: string | undefined) => `${dialogBasePath}/dialog${query}`,
    sistOppdatert: `${dialogBasePath}/dialog/sistOppdatert`,
    settLest: (dialogId: string, query: string | undefined) => `${dialogBasePath}/dialog/${dialogId}/les${query}`,
    logg: `${dialogBasePath}/logger/event`
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
