import { Button } from '@navikt/ds-react';
import React from 'react';

import { OppfolgingsApi } from '../../api/UseApiBasePath';
import { fetchData } from '../../utils/Fetch';
import { UpdateTypes, dispatchUpdate } from '../../utils/UpdateEvent';
import { useOppfolgingContext } from '../OppfolgingProvider';
import StatusAdvarselWrapper, { UtdatertKontaktInformasjonIKrrVeileder } from './StatusAdvarselWrapper';
import { useFnrContext } from '../Provider';

interface Props {
    erVeileder: boolean;
}

function ManuellBruker(props: Props) {
    return props.erVeileder ? <UtdatertKontaktInformasjonIKrrVeileder /> : <Bruker />;
}

function Bruker() {
    const oppfolgingData = useOppfolgingContext();
    const fnr = useFnrContext();

    const fjernManuell = () => {
        fetchData(OppfolgingsApi.settDigigtal, {
            method: 'POST',
        })
            .then(() => oppfolgingData.hentOppfolging(fnr))
            .then(() => dispatchUpdate(UpdateTypes.Oppfolging));
    };

    return (
        <div className="flex flex-col">
            <StatusAdvarselWrapper title={'Ikke digital oppfølging'}>
                Du har ikke digital oppfølging fra Nav. Du kan derfor ikke ha digital dialog med veileder
            </StatusAdvarselWrapper>
            <Button onClick={fjernManuell} className="mt-4 self-center">
                {' '}
                Endre til digital oppfølging{' '}
            </Button>
        </div>
    );
}

export default ManuellBruker;
