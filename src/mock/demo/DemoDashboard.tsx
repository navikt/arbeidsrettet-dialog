import { Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useState } from 'react';

import {
    BRUKER_TYPE,
    LocalStorageElement,
    brukerKanIkkeVarsles,
    erEksternBruker,
    erKRRBruker,
    erManuellBruker,
    erIkkeUnderOppfolging,
    getFailureRate,
    harAktivitetFeilerSkruddPa,
    harArenaaktivitetFeilerSkruddPa,
    harDialogFeilerSkruddPa,
    harIngenDialoger,
    harNyDialogEllerSendMeldingFeilerSkruddPa,
    ingenOppfPerioder,
    settLocalStorage
} from './localstorage';

interface Props {
    skul: () => void;
}

const brukertypeRadios = [
    {
        label: 'Veileder',
        value: BRUKER_TYPE.INTERN
    },
    {
        label: 'Eksternbruker',
        value: BRUKER_TYPE.EKSTERN
    }
];

const brukerTilstandRadios = [
    {
        label: 'Ikke under oppfølging',
        value: LocalStorageElement.IKKE_UNDER_OPPFOLGING,
        checked: erIkkeUnderOppfolging()
    },
    {
        label: 'Manuell',
        value: LocalStorageElement.MANUELL_BRUKER,
        checked: erManuellBruker()
    },
    {
        label: 'KRR',
        value: LocalStorageElement.KRR_BRUKER,
        checked: erKRRBruker()
    },
    {
        label: 'Ingen oppfølgingsperioder',
        value: LocalStorageElement.INGEN_OPPF_PERIODER,
        checked: ingenOppfPerioder()
    },
    {
        label: 'Bruker kan ikke varsles',
        value: LocalStorageElement.KAN_IKKE_VARSLES,
        checked: brukerKanIkkeVarsles()
    },
    {
        label: 'Ingen dialoger',
        value: LocalStorageElement.INGEN_DIALOGER,
        checked: harIngenDialoger()
    }
];

const tekniskTilstandRadios = [
    {
        label: 'Dialog feiler',
        value: LocalStorageElement.DIALOG_FEILER,
        checked: harDialogFeilerSkruddPa()
    },
    {
        label: 'Aktivitet feiler',
        value: LocalStorageElement.AKTIVITET_FEILER,
        checked: harAktivitetFeilerSkruddPa()
    },
    {
        label: 'Arenaaktivitet feiler',
        value: LocalStorageElement.ARENAAKTIVITET_FEILER,
        checked: harArenaaktivitetFeilerSkruddPa()
    },
    {
        label: 'Ny dialog/send feiler',
        value: LocalStorageElement.NY_DIALOG_SEND_MELDING_FEILER,
        checked: harNyDialogEllerSendMeldingFeilerSkruddPa()
    }
];

const getChecked = (values: { label: string; value: string; checked: boolean }[]): string[] => {
    return values.filter((it) => it.checked).map((it) => it.value);
};

const DemoDashboard = (props: Props) => {
    const [failureRange, setFailureRange] = useState(getFailureRate());

    const endreFeilureRate = (value: number) => {
        settLocalStorage(LocalStorageElement.FAILURE_RATE, value);
        window.location.reload();
    };

    const endreTilstand: React.MouseEventHandler<HTMLInputElement> = (e) => {
        const checkbox = e.currentTarget;
        const saveInSessionStorage = Object.values(LocalStorageElement).indexOf(checkbox.id) > -1;
        if (saveInSessionStorage) {
            settLocalStorage(checkbox.id, checkbox.checked);
            window.location.reload();
        }
    };

    const getBrukertype = () => {
        if (erEksternBruker()) {
            return BRUKER_TYPE.EKSTERN;
        }
        return BRUKER_TYPE.INTERN;
    };

    const endreBrukerType = (value: typeof BRUKER_TYPE.EKSTERN | typeof BRUKER_TYPE.INTERN) => {
        settLocalStorage(LocalStorageElement.BRUKER_TYPE, value);
        window.location.reload();
    };

    return (
        <section className="flex flex-wrap px-4 py-8">
            <Heading level="1" size="medium" className="blokk-s">
                DEMO
            </Heading>
            <RadioGroup
                legend="Brukertype"
                name="brukertype-rdio-panel"
                value={getBrukertype()}
                onChange={endreBrukerType}
            >
                {brukertypeRadios.map(({ label, value }) => (
                    <Radio key={value} id={value} value={value}>
                        {label}
                    </Radio>
                ))}
            </RadioGroup>
            <CheckboxGroup value={getChecked(brukerTilstandRadios)} legend={'Brukers tilstand'}>
                {brukerTilstandRadios.map(({ label, value }) => (
                    <Checkbox key={value} value={value} id={value} onClick={endreTilstand}>
                        {label}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <CheckboxGroup value={getChecked(tekniskTilstandRadios)} legend="Teknisk">
                {tekniskTilstandRadios.map(({ label, value }) => (
                    <Checkbox key={value} value={value} id={value} onClick={endreTilstand}>
                        {label}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <form className="flex p-4">
                <Button onClick={props.skul}>Skul demo banner</Button>

                <div className="flex flex-col pt-4">
                    <label htmlFor="myRange">Failure rate {failureRange}: </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={failureRange}
                        id="myRange"
                        onChange={(ev) => setFailureRange(Number.parseInt(ev.target.value))}
                        onBlur={() => endreFeilureRate(failureRange)}
                    />
                </div>
            </form>
        </section>
    );
};

export default DemoDashboard;
