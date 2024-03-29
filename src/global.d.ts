/// <reference types="vite-plugin-svgr/client" />

declare module '*.module.less';

declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
