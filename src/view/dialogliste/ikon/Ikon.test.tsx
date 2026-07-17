import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { DialogData } from '../../../utils/Typer';
import Ikon from './Ikon';
import React from 'react';

const dialogUtenAktivitet: DialogData = {
    ferdigBehandlet: false,
    venterPaSvar: false,
    historisk: false,
    id: '1',
    aktivitetId: null,
    egenskaper: [],
    henvendelser: [],
    lest: false,
    lestAvBrukerTidspunkt: null,
    overskrift: 'Overskrift',
    sisteDato: '2024-11-01T09:58:58.061Z',
};

describe('Ikon (DialogPreviewIkon)', () => {
    it('dialog med aktivitet', () => {
        const { getByLabelText } = render(<Ikon dialog={dialogUtenAktivitet} />);
    });

    it('dialog uten aktivitet', () => {
        render(<Ikon dialog={dialogUtenAktivitet} />);
    });
});
