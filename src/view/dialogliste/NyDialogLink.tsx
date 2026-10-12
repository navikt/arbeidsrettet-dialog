import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useRoutes } from '../../routing/routes';
import { Link } from 'react-router';
import useKansendeMelding from '../../utils/UseKanSendeMelding';

const NyDialogLink = ({ visKanIkkeSendeSom }: { visKanIkkeSendeSom: 'hidden' | 'disabled' }) => {
    const { nyRoute } = useRoutes();
    const kanSendeMelding = useKansendeMelding();

    if (visKanIkkeSendeSom == 'hidden') return null;
    return (
        <Link to={nyRoute()}>
            <Button disabled={!kanSendeMelding} className="flex-grow" size="small" icon={<PlusIcon aria-hidden />}>
                Ny dialog
            </Button>
        </Link>
    );
};
export default NyDialogLink;
