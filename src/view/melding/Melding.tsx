import { PersonIcon } from '@navikt/aksel-icons';
import remarkBreaks from 'remark-breaks';
import { BodyShort, Chat } from '@navikt/ds-react';
import React from 'react';

import { ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';
import { formaterDateAndTime } from '../../utils/Date';
import { MeldingsData } from '../../utils/Typer';
import { useUserInfoContext } from '../BrukerProvider';
import Markdown from 'react-markdown';
import { linkifyToMarkdown } from './linkify';
import {
    renderMarkdownH1Tag,
    renderMarkdownH2Tag,
    renderMarkdownPreTag,
    renderMarkdownCodeTag,
    renderMarkdownATag,
} from './markdownComponents';

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
                        <span className="prose prose-md prose-compact mt-2 max-w-none">
                            <Markdown
                                remarkPlugins={[remarkBreaks]}
                                components={{
                                    /* Don't render headings (h1) created by adding equal signs on the next line as headings, render as normal p + hr instead */
                                    h1: renderMarkdownH1Tag,
                                    /* Don't render headings (h2) created by adding dash on the next line as headings, render as normal p + hr instead */
                                    h2: renderMarkdownH2Tag,
                                    /* Don't render the pre-tag at all, just render the children */
                                    pre: renderMarkdownPreTag,
                                    /* Don't render the code-tag, render it as a normal p instead */
                                    code: renderMarkdownCodeTag,
                                    a: renderMarkdownATag,
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
