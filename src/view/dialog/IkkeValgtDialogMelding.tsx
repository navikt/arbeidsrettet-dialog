import React from 'react';

import DialogIkkeValgt from '../info/DialogIkkeValgt';
import InfoVedIngenDialoger from '../info/InfoVedIngenDialoger';
import { useAntallDialoger } from '../dialogProvider/storeHooks';

const IkkeValgtDialogMelding = () => {
    const antallDialoger = useAntallDialoger();
    const harDialoger = (antallDialoger || 0) > 0;

    return (
        <div className="hidden w-full justify-center border-r border-border-divider bg-gray-100 pt-8 md:flex lg:max-w-lgContainer xl:max-w-none">
            {harDialoger ? <DialogIkkeValgt /> : <InfoVedIngenDialoger />}
        </div>
    );
};

export default IkkeValgtDialogMelding;
