import { getTime } from 'date-fns';
import { DefaultBodyType, StrictRequest } from 'msw';

export const getSistOppdatert = (): ((req: StrictRequest<DefaultBodyType>) => { sistOppdatert: number | Date }) => {
    const now = new Date();
    let timestamp = getTime(now);
    let oppdaterTimestamp = true;

    return (req) => {
        const respons = { sistOppdatert: timestamp };

        if (oppdaterTimestamp) timestamp = getTime(new Date());

        oppdaterTimestamp = false;
        return respons;
    };
};
