export const APP_NAME = 'arbeidsrettet-dialog';

export const TEAM_NAME = 'team-dab';

export const USE_HASH_ROUTER =
    import.meta.env.VITE_USE_HASH_ROUTER === 'true' || import.meta.env.STORYBOOK_USE_HASH_ROUTER === 'true';
export const USE_MOCK = import.meta.env.DEV || USE_HASH_ROUTER;

export const MINSIDE_URL = import.meta.env.VITE_MINSIDE_URL as string;
export const START_OPPFOLGING_URL = import.meta.env.VITE_START_OPPFOLGING_URL as string;
export const AKTIVITETSPLAN_URL = import.meta.env.VITE_AKTIVITETSPLAN_URL as string;

export const erInternFlate = ['dev-intern', 'prod-intern'].includes(import.meta.env.MODE);
export const erEksternFlate = ['dev-ekstern', 'prod-ekstern'].includes(import.meta.env.MODE);
