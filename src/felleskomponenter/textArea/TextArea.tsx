import TextareaAutosize from 'react-textarea-autosize';

import React, { ChangeEvent, useState } from 'react';
import styles from './TextArea.module.less';
import { FieldState } from '@nutgaard/use-formstate';
import { guid } from 'nav-frontend-js-utils';
import { Teller } from './Teller';
import { Feilemelding } from './Feilmelding';
import classNames from 'classnames';

interface Props {
    initialValue?: string;
    pristine?: boolean;
    autoFocus?: boolean;
    touched: boolean;
    error?: string;
    input: FieldState['input'];
    visTellerFra?: number;
    placeholder?: string;
    maxLength: number;
    label: any;
    submittoken?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function useGuid(): string {
    const useState1 = useState(guid());

    return useState1[0];
}

export default function EkspanderbartTekstArea(props: Props) {
    const {
        touched,
        error,
        input,
        pristine,
        initialValue,
        visTellerFra,
        onChange,
        submittoken,
        maxLength,
        ...rest
    } = props;

    const id = input.id ? input.id : guid();
    const feilmeldingId = useGuid();
    const tellerId = useGuid();

    const feil = error && !!submittoken ? error : undefined;
    const inputProps = { ...input, ...rest };
    const length = input.value.length;

    const names = classNames(styles.textarea, { [styles.textareaFeil]: feil });

    const _onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange && onChange(e);
        input.onChange(e);
    };

    return (
        <div className={styles.wrapper}>
            <TextareaAutosize
                className={names}
                maxRows={10}
                label="Skriv en melding om arbeid og oppfølging"
                placeholder="Skriv en melding om arbeid og oppfølging"
                aria-invalid={!!feil}
                aria-errormessage={feil ? feilmeldingId : undefined}
                aria-describedby={tellerId}
                {...inputProps}
                onChange={_onChange}
                id={id}
            />
            <div className={styles.subContent}>
                <Feilemelding feilmelding={feil} id={feilmeldingId} />
                <Teller tegn={length} maksTegn={maxLength} visTellerFra={visTellerFra} id={tellerId} />
            </div>
        </div>
    );
}