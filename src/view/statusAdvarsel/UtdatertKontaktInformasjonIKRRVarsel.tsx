import React from 'react';

import { UtdatertKontaktInformasjonIKrrVeileder } from './StatusAdvarselWrapper';
import UtdatertKontaktinformasjonIKrrBruker from './UtdatertKontaktinformasjonIKrrBruker';

interface Props {
    erVeileder: boolean;
}

export default function UtdatertKontaktInformasjonIKRRVarsel(props: Props) {
    return props.erVeileder ? <UtdatertKontaktInformasjonIKrrVeileder /> : <UtdatertKontaktinformasjonIKrrBruker />;
}
