export type ThemeMode = 'light' | 'dark';

const readTheme = (element: Element | null): ThemeMode | undefined => {
    if (!element) return undefined;

    const dataTheme = element.getAttribute('data-theme');
    if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme;
    if (element.classList.contains('dark')) return 'dark';
    if (element.classList.contains('light')) return 'light';

    return undefined;
};

export const resolveTheme = (hostElement?: HTMLElement): ThemeMode => {
    if (hostElement) {
        const akselThemeRoot = hostElement.closest('.aksel-theme, [data-theme="dark"], [data-theme="light"]');
        const akselTheme = readTheme(akselThemeRoot);
        if (akselTheme) return akselTheme;

        const themedAncestor = hostElement.closest('.dark, .light');
        const ancestorTheme = readTheme(themedAncestor);
        if (ancestorTheme) return ancestorTheme;
    }

    return readTheme(document.body) ?? readTheme(document.documentElement) ?? 'light';
};

