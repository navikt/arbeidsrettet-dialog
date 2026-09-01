import cx from 'classnames';
import React from 'react';

import { erInternFlate } from './constants';
import { UppdateEventHandler } from './utils/UpdateEvent';
import { Provider } from './view/Provider';
import { Routes } from './routing/routes';
import { useShallow } from 'zustand/react/shallow';
import { useFnrStore } from './fnrStore';
import { createBrowserRouter } from 'react-router';

interface Props {
    enhet?: string;
    visAktivitetDefault?: boolean;
    createRouter: typeof createBrowserRouter;
}

const App = (props: Props) => {
    const { visAktivitetDefault } = props;
    const fnr = useFnrStore(useShallow((state) => state.fnr));
    return (
        <Provider visAktivitetDefault={visAktivitetDefault} fnr={fnr} erVeileder={!!fnr}>
            <UppdateEventHandler />
            <div
                className={cx('flex overflow-auto flex-row', {
                    'max-h-[calc(100vh-180px)] min-h-[calc(100vh-180px)]': erInternFlate,
                    'max-h-[calc(100vh-80px)] min-h-[calc(100vh-80px)]': !erInternFlate,
                })}
            >
                <Routes createRouter={props.createRouter} />
            </div>
        </Provider>
    );
};

export default App;
