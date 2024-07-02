import { PersonIcon } from '@navikt/aksel-icons';
import { BodyShort, Chat } from '@navikt/ds-react';
import React from 'react';

import { ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';
import { formaterDateAndTime } from '../../utils/Date';
import { MeldingsData } from '../../utils/Typer';
import { useUserInfoContext } from '../BrukerProvider';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function accessibleText(erBruker: boolean, erMeldingFraBruker: boolean) {
    if (erMeldingFraBruker) {
        return erBruker ? 'Deg' : 'Bruker';
    }

    return 'NAV';
}

interface Props {
    henvendelseData: MeldingsData;
    viktigMarkering: boolean;
}

export function Melding(props: Props) {
    const { viktigMarkering } = props;
    const { avsender, sendt, tekst, avsenderId } = props.henvendelseData;
    const brukerData = useUserInfoContext();
    const erBruker = brukerData?.erBruker ?? false;

    const erMeldingFraBruker: boolean = avsender === 'BRUKER';
    const date: string = formaterDateAndTime(sendt);
    const toppTekst = erMeldingFraBruker || !avsenderId ? date : `${date} - ${avsenderId}`;

    const erFraSegSelv = (erBruker && erMeldingFraBruker) || (!erBruker && !erMeldingFraBruker);

    return (
        <div className="mt-4" role="row">
            <BodyShort className="hidden">{accessibleText(erBruker, erMeldingFraBruker)}</BodyShort>
            <Chat
                timestamp={toppTekst}
                size="small"
                avatar={erMeldingFraBruker ? <PersonIcon aria-hidden className="!h-6 !w-6" /> : 'NAV'}
                position={erMeldingFraBruker ? 'right' : 'left'}
                className="p-0"
                variant={erFraSegSelv ? 'info' : 'subtle'}
            >
                <Chat.Bubble>
                    <div className="flex flex-col items-start">
                        <ViktigMelding visible={viktigMarkering} />
                        <span className="mt-2 whitespace-pre-wrap">
                            <Markdown disallowedElements={['script']} remarkPlugins={[remarkGfm]}>
                                {tekst}
                            </Markdown>
                        </span>
                    </div>
                </Chat.Bubble>
            </Chat>
        </div>
    );
}
