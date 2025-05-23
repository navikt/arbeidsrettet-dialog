import { fetchData } from '../utils/Fetch';
import { createGenericStore } from '../utils/genericStore';
import { aktivitetBasePath } from './UseApiBasePath';

export const fetchInnsynsrett = (fnr: string | undefined) =>
    fetchData<Innsynsrett>(`${aktivitetBasePath}/api/innsynsrett`, {
        method: 'POST',
        body: JSON.stringify({ fnr })
    });

interface Innsynsrett {
    foresatteHarInnsynsrett: boolean;
}

export const useInnsynsrettStore = createGenericStore(
    undefined as Innsynsrett | undefined,
    fetchInnsynsrett,
    'hente innsynrett'
);

export const useInnsynsrett = () =>
    useInnsynsrettStore((state) => {
        return state.data?.foresatteHarInnsynsrett;
    });
