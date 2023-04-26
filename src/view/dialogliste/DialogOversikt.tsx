import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { Heading, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import { useParams } from 'react-router';

import { AKTIVITETSPLAN_URL, MINSIDE_URL } from '../../constants';
import useKansendeMelding from '../../utils/UseKanSendeMelding';
import { useUserInfoContext } from '../BrukerProvider';
import { useDialogContext } from '../DialogProvider';
import InfoVedIngenDialoger from '../info/InfoVedIngenDialoger';
import OmDialogLenke from '../info/OmDialogLenke';
import DialogListe from './DialogListe';
import styles from './DialogOversikt.module.less';
import DialogOverviewHeader from './NyDialogLink';

const DialogOversiktHeader = ({ erVeileder }: { erVeileder: boolean }) => {
    return (
        <div className="px-4 border-b border-border-divider">
            <div className="flex justify-between py-2">
                {!erVeileder ? (
                    <>
                        <Link href={MINSIDE_URL}>Min side</Link>
                        <Link href={AKTIVITETSPLAN_URL}>Aktivitetsplan</Link>
                    </>
                ) : null}
                <OmDialogLenke />
            </div>
            {!erVeileder ? (
                <Heading level="1" size="large" className="mb-2">
                    Dialog med veilederen din
                </Heading>
            ) : null}
        </div>
    );
};

const DialogOversikt = () => {
    const kanSendeMelding = useKansendeMelding();
    const { dialoger } = useDialogContext();
    const { dialogId } = useParams();
    const userInfoContext = useUserInfoContext();
    const erVeileder = !!userInfoContext?.erVeileder;
    return (
        <div
            className={classNames('flex border-r border-border-divider', styles.dialogOversikt, {
                [styles.dialogValgt]: !!dialogId
            })}
        >
            <DialogOversiktHeader erVeileder={erVeileder} />
            <div className="px-4 bg-gray-100 pt-4">
                <DialogOverviewHeader visible={kanSendeMelding} />
                <InfoVedIngenDialoger className="block" visible={dialoger.length === 0} />
                <DialogListe />
            </div>
        </div>
    );
};

export default DialogOversikt;
