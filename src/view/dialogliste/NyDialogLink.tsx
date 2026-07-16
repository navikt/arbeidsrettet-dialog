import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useRoutes } from '../../routing/routes';
import { Link } from 'react-router';

const NyDialogLink = ({ disabled }: { disabled: boolean }) => {
    const { nyRoute } = useRoutes();
    return (
        <Link to={nyRoute()}>
            <Button disabled={disabled} className="flex-grow" size="small" icon={<PlusIcon aria-hidden />}>
                Ny dialog
            </Button>
        </Link>
    );
};
export default NyDialogLink;
