import React from 'react';
import StatusAdvarsel from './statusAdvarsel/StatusAdvarsel';
import { AppBanner } from './banner/AppBanner';
import styles from './App.module.less';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from './Provider';
import AppBody from './AppBody';

interface Props {
    fnr?: string;
}

function App(props: Props) {
    const baspath = props.fnr ? `/veilarbpersonflatefs/${props.fnr}` : process.env.PUBLIC_URL;
    const wraperClass = props.fnr ? styles.konteinerInside : styles.konteinerUtside;
    const appstyle = props.fnr ? styles.appInside : styles.app;

    return (
        <Router basename={baspath}>
            <div className={wraperClass}>
                <div className={appstyle}>
                    <AppBanner hidden={!!props.fnr} />
                    <Provider fnr={props.fnr}>
                        <StatusAdvarsel />
                        <AppBody />
                    </Provider>
                </div>
            </div>
        </Router>
    );
}

export default App;
