import { Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import EksternLenke from '../../felleskomponenter/EksternLenke';
import { StringOrNull } from '../../utils/Typer';
import { linkify } from '../melding/linkify';

interface TekstomradeProps {
    merkelapptekst: string;
    verdi?: StringOrNull;
}

export default function InformasjonElement(props: TekstomradeProps) {
    const { verdi, merkelapptekst } = props;
    if (!verdi) {
        return <InformasjonElementRaw {...props} />;
    }

    return (
        <InformasjonElementRaw merkelapptekst={merkelapptekst}>
            <span className="overflow-hidden text-ellipsis whitespace-pre-wrap">{linkify(verdi)}</span>
        </InformasjonElementRaw>
    );
}

export function LenkeInformasjonElement(props: TekstomradeProps) {
    const { verdi, merkelapptekst } = props;
    if (!verdi) {
        return <InformasjonElementRaw {...props} />;
    }

    return (
        <InformasjonElementRaw merkelapptekst={merkelapptekst}>
            <EksternLenke lenke={verdi} />
        </InformasjonElementRaw>
    );
}

interface PropTypes {
    merkelapptekst: string;
    children?: ReactNode;
}

export function InformasjonElementRaw(props: PropTypes) {
    const { merkelapptekst, children } = props;

    if (!children) return null;

    return (
        <div className={classNames('min-w-4 my-4 grow flex-wrap')}>
            <Heading level="2" size="xsmall">
                {merkelapptekst}
            </Heading>
            {children}
        </div>
    );
}
