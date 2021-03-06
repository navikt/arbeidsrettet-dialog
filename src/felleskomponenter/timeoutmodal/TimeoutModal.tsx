import './Timeoutmodal.less';

import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import React, { useEffect, useState } from 'react';

import { getApiBasePath } from '../../utils/Fetch';
import { hiddenIfHoc } from '../HiddenIfHoc';
import { ReactComponent as ObsSVG } from './obs.svg';

export const getCookie = (name: string) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        NAV_CSRF_PROTECTION: getCookie('NAV_CSRF_PROTECTION')
    };
}

function utloptTidspunktMinusSeksMinutter(remainingSeconds: number): number {
    return (remainingSeconds - 360) * 1000;
}

interface Props {
    fnr?: string;
    visDemo?: boolean;
}

function TimeoutModal(props: Props) {
    const { visDemo, fnr } = props;
    const [skalVises, setSkalVises] = useState(false);

    useEffect(() => {
        fetch(getApiBasePath(fnr) + '/api/auth', {
            credentials: 'same-origin',
            headers: getHeaders()
        })
            .then((response) => {
                return response.json();
            })
            .then((authExp) => {
                const { remainingSeconds } = authExp;

                if (remainingSeconds) {
                    const expirationInMillis = utloptTidspunktMinusSeksMinutter(remainingSeconds);
                    const expiresAt = new Date().getTime() + expirationInMillis;

                    setTimeout(() => {
                        setSkalVises(true);
                    }, expirationInMillis);

                    document.addEventListener('mousedown', () => {
                        const hasExpired = new Date().getTime() >= expiresAt;
                        setSkalVises(hasExpired);
                    });
                }
            })
            .catch((e) => {
                console.log('catch', e);
            });
    }, [fnr]);

    const apen = skalVises || !!visDemo;
    return (
        <NavFrontendModal
            isOpen={apen}
            className="timeoutbox-modal"
            contentLabel="Du logges snart ut"
            shouldCloseOnOverlayClick={false}
            closeButton={false}
            onRequestClose={() => setSkalVises(false)}
        >
            <Veilederpanel svg={<ObsSVG />} type="plakat" kompakt={true}>
                <div className="timeoutbox-nedtelling">
                    <Systemtittel className="timeoutbox-modal__tittel">Du logges snart ut</Systemtittel>
                    <Normaltekst className="timeoutbox-modal__beskrivelse">
                        Du kan fortsette i 5 minutter til, før du blir logget ut.
                    </Normaltekst>
                    <div className="timeoutbox-modal__button-row">
                        <Hovedknapp className="timeoutbox-modal__avbryt" onClick={() => setSkalVises(false)}>
                            Avbryt
                        </Hovedknapp>
                        <Knapp onClick={() => window.location.reload()}>Start på nytt nå</Knapp>
                    </div>
                </div>
            </Veilederpanel>
        </NavFrontendModal>
    );
}

export default hiddenIfHoc(TimeoutModal);
