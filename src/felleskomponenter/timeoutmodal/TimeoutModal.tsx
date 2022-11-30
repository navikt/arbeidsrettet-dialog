import './Timeoutmodal.less';

import { Hovedknapp } from 'nav-frontend-knapper';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import React, { useContext, useEffect, useState } from 'react';

import { baseApiPath } from '../../utils/UseApiBasePath';
import { UserInfoContext } from '../../view/BrukerProvider';
import { useFnrContext } from '../../view/Provider';
import { getContextPath } from '../../view/utils/utils';
import { hiddenIfHoc } from '../HiddenIfHoc';
import loggEvent from '../logging';
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

interface Props {
    visDemo?: boolean;
}

function TimeoutModal(props: Props) {
    const { visDemo } = props;
    const [skalVises, setSkalVises] = useState(false);

    const userInfo = useContext(UserInfoContext);
    const erVeileder = userInfo?.erVeileder ?? 'ukjent';
    const brukerId = userInfo?.id ?? 'ukjent';

    const fnr = useFnrContext();
    const [apiBasePath, setApiBasePath] = useState(baseApiPath(!!fnr));
    useEffect(() => {
        setApiBasePath(baseApiPath(!!fnr));
    }, [fnr]);

    const baseUrl = userInfo?.erVeileder
        ? window.location.origin + getContextPath()
        : window.location.origin + '/arbeid/dialog';

    useEffect(() => {
        fetch(apiBasePath + '/api/auth', {
            credentials: 'same-origin',
            headers: getHeaders()
        })
            .then((response) => {
                return response.json();
            })
            .then((authExp) => {
                const { remainingSeconds } = authExp;

                if (remainingSeconds) {
                    const expirationInMillis = remainingSeconds * 1000;

                    setTimeout(() => {
                        setSkalVises(true);
                        loggEvent('timeout-modal', { brukerId }, { erVeileder });
                    }, expirationInMillis);
                }
            })
            .catch((e) => {
                console.log('catch', e);
            });
    }, [brukerId, erVeileder, apiBasePath]);

    const apen = skalVises || !!visDemo;

    return (
        <NavFrontendModal
            isOpen={apen}
            className="timeoutbox-modal"
            contentLabel="Du må logge inn på nytt."
            shouldCloseOnOverlayClick={false}
            closeButton={false}
            onRequestClose={() => setSkalVises(false)}
        >
            <Veilederpanel svg={<ObsSVG />} type="plakat" kompakt={true}>
                <div className="timeoutbox-nedtelling">
                    <Systemtittel className="timeoutbox-modal__tittel">Du er logget ut.</Systemtittel>
                    <Normaltekst className="timeoutbox-modal__beskrivelse">
                        Du må logge inn på nytt.
                        <br />
                        Du kan fortsette der du slapp etter innlogging.
                    </Normaltekst>

                    <Hovedknapp
                        className="timeoutbox-modal__startpaanytt"
                        onClick={() => window.location.assign(baseUrl)}
                    >
                        {/* Loginservice støtter kun returnurl til baseUrl */}
                        Start på nytt nå
                    </Hovedknapp>
                </div>
            </Veilederpanel>
        </NavFrontendModal>
    );
}

export default hiddenIfHoc(TimeoutModal);
