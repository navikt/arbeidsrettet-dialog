import { describe, expect } from 'vitest';

import { isNotMarkdownLink, linkifyToMarkdown, splitOnLinks } from './linkify';

describe('linkify.tsx', () => {
    it('should not skip last part', () => {
        expect(splitOnLinks('qwe www.nav.no qwe ')).toStrictEqual([
            { value: 'qwe ', type: 'text' },
            { value: 'www.nav.no', type: 'link' },
            { value: ' qwe ', type: 'text' }
        ]);
    });

    it('should handle with no urls', () => {
        expect(splitOnLinks('Langt avsnitt her')).toStrictEqual([{ value: 'Langt avsnitt her', type: 'text' }]);
    });

    it('should handle text starting with url', () => {
        expect(splitOnLinks('www.nav.no Langt avsnitt her')).toStrictEqual([
            { value: 'www.nav.no', type: 'link' },
            { value: ' Langt avsnitt her', type: 'text' }
        ]);
    });

    it('should handle text ending with url', () => {
        expect(splitOnLinks('Langt avsnitt her www.nav.no')).toStrictEqual([
            { value: 'Langt avsnitt her ', type: 'text' },
            { value: 'www.nav.no', type: 'link' }
        ]);
    });
    it('should handle text with only url', () => {
        expect(splitOnLinks('www.nav.no')).toStrictEqual([{ value: 'www.nav.no', type: 'link' }]);
    });
});

describe('linkifyToMarkdown', () => {
    it('should handle text starting with url', () => {
        const input = `
            trykk her www.nav.no med tekst etterpå
        `;
        const output = `
            trykk her [www.nav.no](https://www.nav.no) med tekst etterpå
        `;
        expect(linkifyToMarkdown(input.trim())).toStrictEqual(output.trim());
    });

    it('should handle text ending with url', () => {
        const input = `
            trykk her www.nav.no`;
        const output = `
            trykk her [www.nav.no](https://www.nav.no)`;
        expect(linkifyToMarkdown(input.trim())).toStrictEqual(output.trim());
    });

    it('should handle link where url and text is equal', () => {
        const input = `
            trykk her www.nav.no med tekst etterpå
        `;
        const output = `
            trykk her [www.nav.no](https://www.nav.no) med tekst etterpå
        `;
        expect(linkifyToMarkdown(input.trim())).toStrictEqual(output.trim());
    });

    it('should not change valid markdown links', () => {
        const input = `
            trykk her [ikke trykk her](https://www.nav.no) [www.vg.no](https://www.vg.no)
        `;
        const output = `
            trykk her [ikke trykk her](https://www.nav.no) [www.vg.no](https://www.vg.no)
        `;
        expect(linkifyToMarkdown(input.trim())).toStrictEqual(output.trim());
    });
});

describe('isNotMarkdownLink', () => {
    it('should handle starting with match', () => {
        const match = {
            index: 0,
            '0': 'nav.no'
        } as RegExpExecArray;
        expect(isNotMarkdownLink(match, 'nav.no')).toBeTruthy();
    });

    it('starting with ( is markdown link', () => {
        const match = {
            index: 1,
            '0': 'nav.no'
        } as RegExpExecArray;
        expect(isNotMarkdownLink(match, '(nav.no')).toBeFalsy();
    });

    it('starting with [ is markdown link', () => {
        const match = {
            index: 1,
            '0': 'nav.no'
        } as RegExpExecArray;
        expect(isNotMarkdownLink(match, '[nav.no')).toBeFalsy();
    });
});
