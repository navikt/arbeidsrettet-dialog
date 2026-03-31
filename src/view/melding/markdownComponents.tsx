import { ExternalLinkIcon } from '@navikt/aksel-icons';
import React, { ClassAttributes, FunctionComponent, HTMLAttributes } from 'react';
import { ExtraProps } from 'react-markdown';

export const renderMarkdownATag: FunctionComponent<
    ClassAttributes<HTMLAnchorElement> & HTMLAttributes<HTMLAnchorElement> & ExtraProps
> = ({ node, ...props }) => (
    <span className="inline-flex items-center">
        <a {...props} target="_blank" rel="noopener noreferrer" />
        <ExternalLinkIcon className="ml-1 inline-block" aria-label="Lenke åpnes i ny fane" />
    </span>
);

interface Position {
    start: { column: number };
}

const isMarkdownHeadingCreatedUsingDashOrEqualSignOnNextLine = (
    node: { children: { type: string; position?: Position }[]; position?: Position } | undefined,
) => {
    const nodeHasMultipleChildren = (node?.children?.length ?? 0) > 1;

    if (nodeHasMultipleChildren && node?.position?.start?.column === 1) {
        return true;
    }

    const firstChild = node?.children[0];
    if (firstChild?.type !== 'text') return false;
    return firstChild?.position?.start?.column === 1;
};

export const renderMarkdownH1Tag: FunctionComponent<
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
    return <h1>{children}</h1>;
};

export const renderMarkdownH2Tag: FunctionComponent<
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
    return <h2>{children}</h2>;
};

export const renderMarkdownPreTag: FunctionComponent<
    ClassAttributes<HTMLPreElement> & HTMLAttributes<HTMLPreElement> & ExtraProps
> = ({ node, children, ...props }) => {
    return children;
};

export const renderMarkdownCodeTag: FunctionComponent<
    ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps
> = ({ node, children, ...props }) => {
    return <p>{children}</p>;
};
