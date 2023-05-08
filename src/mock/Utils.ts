import { joinPaths } from '@navikt/navspa/dist/async/utils';

import { USE_HASH_ROUTER } from '../constants';
import { settSammenmedSlasher } from '../view/utils/utils';

export function rndId() {
    const crypto: Crypto = window.crypto;
    let array = new Uint32Array(1);
    crypto.getRandomValues(array);

    return `${Math.floor(array[0] % 100_000_000)}`;
}

const isNineDigits = (val: string) => /^\d{9}$/.test(val);
export const toggleFnrInUrl = (hashPart: string, fnr?: string) => {
    const parts = hashPart.split('/').slice(1);
    if (fnr && parts[0] === fnr) {
        return '#/' + parts.join('/');
    } else if (fnr && parts[0] !== fnr) {
        return '#/' + [fnr, ...parts].join('/');
    } else if (!fnr && parts.length === 0) {
        return '#/';
    } else if (!fnr && isNineDigits(parts[0].toString())) {
        return '#/' + parts.slice(1).join('/');
    } else {
        return '#/';
    }
};

export const gotoStartTestPage = (fnr?: string) => {
    const pathnamePrefix = `${import.meta.env.BASE_URL}${USE_HASH_ROUTER ? '#/' : ''}`;
    console.log('pathnameprefix', pathnamePrefix);
    console.log('fnr', fnr);
    if (USE_HASH_ROUTER) {
        // const hashPartOfUrl = toggleFnrInUrl(window.location.hash, fnr);
        window.history.replaceState({}, '', pathnamePrefix);
    } else {
        window.history.replaceState({}, '', `${pathnamePrefix}${fnr ?? ''}`);
    }
};
