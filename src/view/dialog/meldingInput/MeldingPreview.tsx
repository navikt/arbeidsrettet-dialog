import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { escapeOrderedList } from '../../melding/Melding';
import { linkifyToMarkdown } from '../../melding/linkify';
import {
    renderMarkdownH1Tag,
    renderMarkdownH2Tag,
    renderMarkdownPreTag,
    renderMarkdownCodeTag,
    renderMarkdownATag,
} from '../../melding/markdownComponents';
import { Breakpoint, useBreakpoint } from '../../utils/useBreakpoint';

interface Props {
    tekst: string;
    visible: boolean;
    onToggle: () => void;
}

const MeldingPreview = ({ tekst, visible, onToggle }: Props) => {
    const breakpoint = useBreakpoint();
    const isMobile = [Breakpoint.initial, Breakpoint.sm].includes(breakpoint);

    if (isMobile) return null;

    return (
        <div>
            <Button
                variant="tertiary"
                className="mt-2 p-2"
                size="xsmall"
                type="button"
                onClick={onToggle}
                icon={visible ? <EyeSlashIcon aria-hidden /> : <EyeIcon aria-hidden />}
            >
                {visible ? 'Skjul forhåndsvisning' : 'Forhåndsvis meldingen'}
            </Button>
            {visible && tekst.trim().length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-ax-border-neutral-subtle p-3 bg-ax-bg-neutral-soft">
                    <span className="prose prose-md prose-compact max-w-none">
                        <Markdown
                            remarkPlugins={[remarkBreaks]}
                            components={{
                                h1: renderMarkdownH1Tag,
                                h2: renderMarkdownH2Tag,
                                pre: renderMarkdownPreTag,
                                code: renderMarkdownCodeTag,
                                a: renderMarkdownATag,
                            }}
                            disallowedElements={['script']}
                        >
                            {escapeOrderedList(linkifyToMarkdown(tekst))}
                        </Markdown>
                    </span>
                </div>
            )}
        </div>
    );
};

export default MeldingPreview;
