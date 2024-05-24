import React, { Suspense } from 'react';

import { useDialoger } from '../DialogProvider';
import DialogIkkeValgt from '../info/DialogIkkeValgt';
import InfoVedIngenDialoger from '../info/InfoVedIngenDialoger';
import { Await, useLoaderData, useRouteLoaderData } from 'react-router';
import { Loader } from '@navikt/ds-react';
import { useRootLoaderData } from '../../routing/loaders';

const IkkeValgtDialogMelding = () => {
    const dialoger = useDialoger();
    const harDialoger = dialoger.length > 0;
    const loaderData = useRootLoaderData();

    return (
        <Suspense fallback={<LoadingDialoger />}>
            <Await resolve={loaderData.dialoger}>
                <div className="hidden w-full justify-center border-r border-border-divider bg-gray-100 pt-8 md:flex lg:max-w-lgContainer xl:max-w-none">
                    {harDialoger ? <DialogIkkeValgt /> : <InfoVedIngenDialoger className="mx-2" />}
                </div>
            </Await>
        </Suspense>
    );
};

const LoadingDialoger = () => {
    return (
        <div className="hidden w-full justify-center border-r border-border-divider bg-gray-100 pt-8 md:flex lg:max-w-lgContainer xl:max-w-none">
            <Loader size="xlarge" />
        </div>
    );
};

export default IkkeValgtDialogMelding;
