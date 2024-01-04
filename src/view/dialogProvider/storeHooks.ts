import { useShallow } from 'zustand/react/shallow';
import { useDialogStore } from './dialogStore';

export const useHentDialoger = () => useDialogStore(useShallow((store) => store.hentDialoger));
export const useSetFerdigBehandlet = () => {
    return useDialogStore(
        useShallow((store) => ({
            status: store.setFerdigBehandletState.status,
            setFerdigBehandlet: store.setFerdigBehandlet
        }))
    );
};
export const useSetVenterPaSvar = () => {
    return useDialogStore(
        useShallow((store) => ({
            status: store.setVenterPaSvarState.status,
            setVenterPaSvar: store.setVenterPaSvar
        }))
    );
};
export const useLesDialog = () => {
    return useDialogStore(useShallow((store) => store.lesDialog));
};
export const useDialoger = () => {
    const dialoger = useDialogStore(useShallow((state) => state.hentDialog.data.dialoger || []));
    return dialoger;
};
export const useAntallDialoger = (): number | undefined => {
    return useDialogStore(useShallow((state) => state.hentDialog.data.dialoger.length || undefined));
};
export const useDialog = (id: string | undefined) => {
    return useDialogStore(useShallow((state) => state.hentDialog.data.dialoger?.find((it) => it.id === id)));
};
