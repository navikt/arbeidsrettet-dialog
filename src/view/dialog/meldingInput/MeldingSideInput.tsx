import classNames from 'classnames';
import TextareaAutosize from '@navikt/ds-react/esm/util/TextareaAutoSize';
import { Alert, Button, ErrorMessage } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { useCompactMode } from '../../../featureToggle/FeatureToggleProvider';
import { useFormContext } from 'react-hook-form';
import { betterErrorMessage, MeldingInputContext } from './inputUtils';
import { MeldingFormValues } from './MeldingInputBox';
import ManagedDialogCheckboxes from '../DialogCheckboxes';
import { dataOrUndefined } from '../../Provider';
import { useOppfolgingContext } from '../../OppfolgingProvider';
import { DialogData } from '../../../utils/Typer';

const MeldingSideInputInner = () => {
    const { onSubmit, noeFeilet } = useContext(MeldingInputContext);
    const {
        register,
        getValues,
        formState: { errors, isSubmitting }
    } = useFormContext<MeldingFormValues>();
    const compactMode = useCompactMode();

    return (
        <form className="flex flex-1 flex-col overflow-hidden" onSubmit={onSubmit} noValidate autoComplete="off">
            <div className={'overflow-hidden p-1 flex flex-col'}>
                <label htmlFor="melding_input" className="hidden ">
                    Skriv om arbeid og oppfølging
                </label>
                <TextareaAutosize
                    id="melding_input"
                    className={classNames(
                        'w-full grow border-2 border-gray-500 focus:border-blue-500 rounded-md p-2 overflow-auto outline-0',
                        { 'border-red-300': errors.melding }
                    )}
                    style={{ overflow: 'auto' }}
                    {...register('melding')}
                    placeholder={'Skriv om arbeid og oppfølging'}
                    minRows={3}
                    maxRows={100} // Will overflow before hitting max lines
                />
                <div className="self-stretch mt-2 flex justify-between">
                    <Button size={compactMode ? 'small' : 'medium'} title="Send" loading={isSubmitting}>
                        Send
                    </Button>
                    {/* Venter på design */}
                    {/*<div className="self-center text-2xl text-text-subtle">*/}
                    {/*    {isSyncingKladd ? (*/}
                    {/*        <div className="flex space-x-2">*/}
                    {/*            <BodyShort>Lagrer...</BodyShort>*/}
                    {/*            <ArrowsCirclepathIcon />*/}
                    {/*        </div>*/}
                    {/*    ) : (*/}
                    {/*        <div className="flex space-x-2">*/}
                    {/*            <BodyShort>Lagret</BodyShort>*/}
                    {/*            <CheckmarkCircleIcon />*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </div>
            </div>
            {errors.melding ? (
                <ErrorMessage className="mt-2" size="small">
                    {betterErrorMessage(errors.melding, getValues('melding')).message}
                </ErrorMessage>
            ) : null}
            {noeFeilet ? (
                <Alert className="mt-4" variant="error">
                    Noe gikk dessverre galt med systemet. Prøv igjen senere.
                </Alert>
            ) : null}
        </form>
    );
};

export const MeldingSideInput = ({ dialog }: { dialog: DialogData }) => {
    const oppfolgingContext = useOppfolgingContext();
    const oppfolging = dataOrUndefined(oppfolgingContext);
    return (
        <section aria-label="Ny melding" className="flex flex-1 bg-white p-4">
            <div className="w-full flex flex-col">
                <ManagedDialogCheckboxes />
                {!oppfolging?.underOppfolging || dialog.historisk ? null : <MeldingSideInputInner />}
            </div>
        </section>
    );
};
