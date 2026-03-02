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

/**
 * Sørger for at linjer som starter med * eller - blir tolket som Markdown-lister
 * ved å legge til en tom linje foran første listepunkt og trimme innrykk.
 */
export function ensureMarkdownLists(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trimStart();
        const isListItem = /^[*\-] /.test(trimmed);
        const prevLine = result.length > 0 ? result[result.length - 1] : '';
        const prevIsListItem = /^[*\-] /.test(prevLine.trimStart());

        if (isListItem && !prevIsListItem && prevLine.trim() !== '') {
            result.push('');
        }
        result.push(isListItem ? trimmed : lines[i]);
    }

    return result.join('\n');
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
                        <span className="prose prose-md prose-compact mt-2 max-w-none">
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
                                    ),
                                }}
                                disallowedElements={['script']}
                            >
                                {ensureMarkdownLists(escapeOrderedList(linkifyToMarkdown(tekst)))}
                            </Markdown>
                        </span>
                    </div>
                </Chat.Bubble>
            </Chat>
        </div>
    );
}
