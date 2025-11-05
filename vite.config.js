/// <reference types="vitest" />
// import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { execSync } from 'child_process';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    // Make sure release is set client-side, automatic release tagging did not work
    process.env.VITE_SENTRY_RELEASE = execSync('git rev-parse HEAD').toString().trim();

    return {
        appType: 'spa',
        build: {
            sourcemap: true,
            manifest: 'asset-manifest.json',
            outDir: 'build',
        },
        plugins: [
            react({
                babel: {
                    babelrc: true,
                },
            }),
            svgr(),
            // visualizer({
            //     filename: 'bundle-stats.html'
            // })
        ],
        server: {
            port: 3000,
        },
        test: {
            environment: 'jsdom',
            include: ['**/*.test.ts', '**/*.test.tsx'],
            globals: true,
            setupFiles: ['./src/test/setup.tsx'],
            coverage: {
                provider: 'v8',
                include: ['src'],
                exclude: [
                    'src/mock',
                    'src/stories',
                    'src/**.test.ts',
                    'src/**/**.test.tsx',
                    'src/global.d.ts',
                    'src/polyfill.ts',
                ],
            },
        },
    };
});
