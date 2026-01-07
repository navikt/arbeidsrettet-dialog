export enum Env {
    Local = 'local',
    Dev = 'dev',
    Prod = 'prod',
}

export const getEnv = (): Env => {
    const { hostname } = window.location;
    if (hostname.includes('dev.nav.no')) return Env.Dev;
    if (hostname.includes('nav.no')) return Env.Prod;
    return Env.Local;
};
