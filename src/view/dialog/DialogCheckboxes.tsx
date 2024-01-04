import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { Status } from '../../api/typer';
import { notEmpty } from '../../utils/TypeHelper';
import { useOppfolgingContext } from '../OppfolgingProvider';
import { dataOrUndefined, useFnrContext } from '../Provider';
import { useSelectedDialog } from '../utils/useAktivitetId';
import { useUserInfoContext } from '../BrukerProvider';
import { useHentDialoger, useSetFerdigBehandlet, useSetVenterPaSvar } from '../dialogProvider/storeHooks';

interface Props {
    toggleFerdigBehandlet(ferdigBehandler: boolean): void;
    toggleVenterPaSvar(venterPaSvar: boolean): void;
    ferdigBehandlet: boolean;
    venterPaSvar: boolean;
    disabled: boolean;
    values: ('ferdigBehandlet' | 'venterPaSvar')[];
    loading: boolean;
}

const DialogCheckboxes = ({
    values,
    ferdigBehandlet,
    toggleFerdigBehandlet,
    toggleVenterPaSvar,
    loading,
    venterPaSvar,
    disabled
}: Props) => {
    return (
        <div className="mb-2 pl-1">
            <CheckboxGroup legend={'Filter'} hideLegend value={values}>
                <div className="flex">
                    <Checkbox
                        value={'ferdigBehandlet'}
                        size="small"
                        className="pr-4"
                        disabled={disabled || loading}
                        onChange={() => toggleFerdigBehandlet(!ferdigBehandlet)}
                    >
                        Venter på svar fra NAV
                    </Checkbox>
                    <Checkbox
                        value={'venterPaSvar'}
                        size="small"
                        className="pr-8"
                        disabled={disabled || loading}
                        onChange={() => toggleVenterPaSvar(!venterPaSvar)}
                    >
                        Venter på svar fra bruker
                    </Checkbox>
                </div>
            </CheckboxGroup>
        </div>
    );
};

const ManagedDialogCheckboxes = () => {
    const visible = useUserInfoContext()?.erVeileder || false;
    const dialog = useSelectedDialog();
    const fnr = useFnrContext();
    const hentDialoger = useHentDialoger();
    const { setFerdigBehandlet, status: ferdigBehandletStatus } = useSetFerdigBehandlet();
    const { setVenterPaSvar, status: venterPaSvarStatus } = useSetVenterPaSvar();

    const oppfolgingContext = useOppfolgingContext();
    const oppfolgingData = dataOrUndefined(oppfolgingContext);

    if (!visible || !dialog) {
        return null;
    }

    const toggleFerdigBehandlet = (ferdigBehandlet: boolean) => {
        setFerdigBehandlet({ id: dialog.id, ferdigBehandlet, fnr }).then(() => hentDialoger(fnr));
    };
    const toggleVenterPaSvar = (venterPaSvar: boolean) => {
        setVenterPaSvar({ id: dialog.id, venterPaSvar, fnr }).then(() => hentDialoger(fnr));
    };
    const disabled = dialog.historisk || !oppfolgingData?.underOppfolging;

    const values = [
        !dialog.ferdigBehandlet ? ('ferdigBehandlet' as const) : undefined,
        dialog.venterPaSvar ? ('venterPaSvar' as const) : undefined
    ].filter(notEmpty);

    const laster = [ferdigBehandletStatus, venterPaSvarStatus].some(
        (status) => status === Status.PENDING || status === Status.RELOADING
    );

    return (
        <DialogCheckboxes
            values={values}
            disabled={disabled}
            loading={laster}
            toggleFerdigBehandlet={toggleFerdigBehandlet}
            toggleVenterPaSvar={toggleVenterPaSvar}
            ferdigBehandlet={dialog.ferdigBehandlet}
            venterPaSvar={dialog.venterPaSvar}
        />
    );
};

export default ManagedDialogCheckboxes;
