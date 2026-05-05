/// <reference types="vite-plugin-svgr/client" />

declare module '*.module.less';

declare module '@navikt/ds-css/dist/index.css?inline' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
