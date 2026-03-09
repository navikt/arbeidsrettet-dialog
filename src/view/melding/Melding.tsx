import { ExternalLinkIcon, PersonIcon } from '@navikt/aksel-icons';
import remarkBreaks from 'remark-breaks';
import { BodyShort, Chat } from '@navikt/ds-react';
import React, { ClassAttributes, FunctionComponent, HTMLAttributes } from 'react';

import { ViktigMelding } from '../../felleskomponenter/etiketer/Etikett';
import { formaterDateAndTime } from '../../utils/Date';
import { MeldingsData } from '../../utils/Typer';
import { useUserInfoContext } from '../BrukerProvider';
import Markdown, { ExtraProps } from 'react-markdown';
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
                        <span className="prose prose-md prose-compact mt-2 max-w-none">
                            <Markdown
                                remarkPlugins={[remarkBreaks]}
                                components={{
                                    h1: renderMarkdownH1Tag,
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

const renderMarkdownATag: FunctionComponent<
    ClassAttributes<HTMLAnchorElement> & HTMLAttributes<HTMLAnchorElement> & ExtraProps
> = ({ node, ...props }) => (
    <span className="inline-flex items-center">
        <a {...props} target="_blank" rel="noopener noreferrer" />
        <ExternalLinkIcon className="ml-1 inline-block" aria-label="Lenke åpnes i ny fane" />
    </span>
);

const isMarkdownHeadingCreatedUsingDashOrEqualSignOnNextLine = (node: Element) => {
    console.log(node);
    const firstChild = node?.children[0];
    if (firstChild?.type !== 'text') return false;
    return firstChild?.position?.start?.column === 1;
};

const renderMarkdownH1Tag: FunctionComponent<
    ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps
> = ({ node, children }) => {
    if (isMarkdownHeadingCreatedUsingDashOrEqualSignOnNextLine(node)) {
        return (
            <>
                <p>{children}</p>
                <hr />
            </>
        );
    }
    return <h1>children</h1>;
};
const renderMarkdownH2Tag: FunctionComponent<
    ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps
> = ({ node, children }) => {
    if (isMarkdownHeadingCreatedUsingDashOrEqualSignOnNextLine(node)) {
        return (
            <>
                <p>{children}</p>
                <hr />
            </>
        );
    }
    return <h2>children</h2>;
};
const renderMarkdownPreTag: FunctionComponent<
    ClassAttributes<HTMLPreElement> & HTMLAttributes<HTMLPreElement> & ExtraProps
> = ({ node, children, ...props }) => {
    return children;
};
const renderMarkdownCodeTag: FunctionComponent<
    ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps
> = ({ node, children, ...props }) => {
    return <p>{children}</p>;
};
