import { ExternalLinkIcon, PersonIcon } from '@navikt/aksel-icons';
import { BodyShort, Chat, HStack } from '@navikt/ds-react';
import React from 'react';

import { ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';
import { formaterDateAndTime } from '../../utils/Date';
import { MeldingsData } from '../../utils/Typer';
import { useUserInfoContext } from '../BrukerProvider';
import Markdown from 'react-markdown';
import { linkifyToMarkdown } from './linkify';

function accessibleText(erBruker: boolean, erMeldingFraBruker: boolean) {
    if (erMeldingFraBruker) {
        return erBruker ? 'Deg' : 'Bruker';
    }

    return 'Nav';
}

interface Props {
    henvendelseData: MeldingsData;
    viktigMarkering: boolean;
}

export function escapeOrderedList(text: string) {
    return text.replace(/^(\d+)\. /gm, '$1\\. ');
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
                            <Markdown
                                components={{
                                    a: ({ node, ...props }) => (
                                        <span className="inline-flex items-center">
                                            <a {...props} target="_blank" rel="noopener noreferrer" />
                                            <ExternalLinkIcon
                                                className="ml-1 inline-block"
                                                aria-label="Lenke åpnes i ny fane"
                                            />
                                        </span>
                                    )
                                }}
                                disallowedElements={['script']}
                            >
                                {escapeOrderedList(linkifyToMarkdown(tekst))}
                            </Markdown>
                        </span>
                    </div>
                </Chat.Bubble>
            </Chat>
        </div>
    );
}
