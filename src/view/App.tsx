import React from 'react';
import StatusAdvarsel from './statusAdvarsel/StatusAdvarsel';
import { AppBanner } from './banner/AppBanner';
import styles from './App.module.less';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from './Provider';
import { EventHandler } from './EventHandler';
import AppBody from './AppBody';
import TimeoutModal from '../felleskomponenter/timeoutmodal/TimeoutModal';
import ReactModal from 'react-modal';

interface Props {
    fnr?: string;
}

function App(props: Props) {
    const basepath = props.fnr ? `/veilarbpersonflatefs/${props.fnr}` : process.env.PUBLIC_URL;
    const wraperClass = props.fnr ? styles.konteinerInside : styles.konteinerUtside;
    const appstyle = props.fnr ? styles.appInside : styles.app;

    if (!props.fnr) {
        const id = document.getElementById('root') ? '#root' : '#modal-a11y-wrapper';
        ReactModal.setAppElement(id);
    }

    return (
        <Router basename={basepath}>
            <div className={wraperClass}>
                <div className={appstyle}>
                    <EventHandler />
                    <AppBanner hidden={!!props.fnr} />
                    <Provider fnr={props.fnr}>
                        <StatusAdvarsel />
                        <AppBody />
                    </Provider>
                    <TimeoutModal hidden={!!props.fnr} />
                </div>
            </div>
        </Router>
    );
}

export default App;
