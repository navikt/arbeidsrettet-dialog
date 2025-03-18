import { Link } from '@navikt/ds-react';
import React from 'react';

const urlRegex = /((?:[\w-]+:\/\/?|www(?:-\w+)?\.)[^\s()<>]+)/gi;

interface TextSection {
    value: string;
    type: 'text' | 'link';
}

const toNodes = (sections: TextSection[]) => {
    return (
        <>
            {sections.map((section, index) => {
                if (section.type === 'text') {
                    return (
                        <span key={index} className="[overflow-wrap:anywhere]">
                            {section.value}
                        </span>
                    );
                } else {
                    const href = section.value.toLowerCase().startsWith('www.')
                        ? `https://${section.value}`
                        : section.value;
                    return (
                        <Link className="break-all" key={index} href={href}>
                            {section.value}
                        </Link>
                    );
                }
            })}
        </>
    );
};

export const isMarkdownLink = (match: RegExpExecArray, text: string) => {
    const prefix = match.index !== 0 ? text[match.index - 1] : null;
    return prefix === '(' || prefix === '[';
};

const collectMatches = (text: string) => {
    const matches = [];
    let match = null;
    while ((match = urlRegex.exec(text)) != null) {
        matches.push(match);
    }
    return matches;
};

const mergeTextParts = (allMatches: RegExpExecArray[], text: string): TextSection[] => {
    const { parts, endOfPreviousMatch } = allMatches.reduce(
        ({ endOfPreviousMatch, parts }, match) => {
            const textMatch = match[0];
            return {
                parts: [
                    ...parts,
                    ...[
                        {
                            value: text.slice(endOfPreviousMatch, match.index),
                            type: 'text'
                        },
                        {
                            value: textMatch,
                            type: 'link'
                        }
                    ]
                ].filter((section) => !!section.value) as TextSection[],
                endOfPreviousMatch: match.index + textMatch.length
            };
        },
        { endOfPreviousMatch: 0, parts: [] as TextSection[] }
    );
    if (text.slice(endOfPreviousMatch).length == 0) {
        return parts;
    } else {
        return [
            ...parts,
            {
                value: text.slice(endOfPreviousMatch),
                type: 'text'
            }
        ];
    }
};

export const splitOnLinks = (text: string): TextSection[] => {
    const allMatches = collectMatches(text).filter((match) => !isMarkdownLink(match, text));
    if (!allMatches?.length) return [{ value: text, type: 'text' }];
    return mergeTextParts(allMatches, text);
};

export const linkify = (text: string) => toNodes(splitOnLinks(text));

export const linkifyToMarkdown = (text: string) => {
    return splitOnLinks(text).reduce((result: string, current: TextSection) => {
        if (current.type === 'link') {
            const href = current.value.toLowerCase().startsWith('www.') ? `https://${current.value}` : current.value;
            return result + `[${current.value}](${href})`;
        } else {
            return result + current.value;
        }
    }, '');
};
