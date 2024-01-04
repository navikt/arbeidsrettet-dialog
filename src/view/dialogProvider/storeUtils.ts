import { Status } from '../../api/typer';
import { DialogData } from '../../utils/Typer';
import { DialogRequestStore, DialogStore } from './dialogStore';

const nextStatus = {
    pending: Status.RELOADING,
    fulfilled: Status.OK,
    rejected: Status.ERROR
};

const getNextStatus = (currentStatus: Status, actionType: ActionType) => {
    if (currentStatus === Status.INITIAL && actionType === 'pending') return Status.PENDING;
    return nextStatus[actionType];
};

const reduceRequestActions =
    <SliceName extends keyof DialogRequestStore, T, E>(sliceName: SliceName) =>
    (action: Action<T, E>) =>
    (prevState: DialogStore) => {
        return {
            ...prevState,
            [sliceName]: {
                ...prevState[sliceName],
                status: getNextStatus(prevState[sliceName].status, action.type),
                error: action.type === 'rejected' ? action.payload : undefined,
                data: action.type === 'fulfilled' ? action.payload : prevState[sliceName].data
            }
        };
    };

export const sliceReducer = <SliceName extends keyof DialogRequestStore, T, E>(
    set: (setState: (store: DialogStore) => DialogStore, dontKnow: boolean, name: string) => void,
    sliceName: SliceName
) => {
    const sliceReducer = reduceRequestActions(sliceName);
    return (action: Action<T, E>) => {
        set(sliceReducer(action), false, action.name);
    };
};

export const requestHelpers = <SliceName extends keyof DialogRequestStore, T>({
    sliceName,
    prefix
}: {
    sliceName: SliceName;
    prefix: string;
}) => {
    const sliceReducer = reduceRequestActions(sliceName);
    return {
        pendingState: () => sliceReducer({ name: `${prefix}/pending`, type: 'pending' }),
        fulfilledState: (payload: T) => sliceReducer({ name: `${prefix}/fulfilled`, type: 'fulfilled', payload })
    };
};

export interface RequestState<T> {
    status: Status;
    data: T;
    error: string | undefined;
}
export type HentDialogRequestState = RequestState<{ dialoger: DialogData[]; sistOppdatert: Date }>;
export type RequestStateWithoutPayload = RequestState<undefined>;
export type LesMeldingRequestState = RequestState<undefined>;

type FieldSetter<T, E> = (action: Action<T, E>) => void;
type Thunk<T> = () => Promise<T>;
export async function asyncThunk<T, E>(reducer: FieldSetter<T, E>, thunk: Thunk<T>, prefix: string) {
    try {
        reducer({ name: `${prefix}/pending`, type: 'pending' });
        const payload = await thunk();
        reducer({ name: `${prefix}/fulfilled`, type: 'fulfilled', payload });
        return Promise.resolve(payload);
    } catch (e) {
        reducer({ name: `${prefix}/rejected`, type: 'rejected', payload: e as E });
        return Promise.reject(e as E);
    }
}

type ActionType = 'fulfilled' | 'rejected' | 'pending';

interface SuccessAction<T> {
    type: 'fulfilled';
    payload: T;
    name: string;
}
interface ErrorAction<T> {
    type: 'rejected';
    payload: T;
    name: string;
}
interface InitAction {
    type: 'pending';
    name: string;
}
type Action<T, E> = SuccessAction<T> | ErrorAction<E> | InitAction;
