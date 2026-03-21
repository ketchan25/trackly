import { create } from 'zustand';

interface VisibilityStateData {
    isOpen: boolean;
    taskId: string | null;
    attachmentPaths: string[];
    storeAttachmentPath: (id: string) => void;
    clearAttachmentPaths: () => void;
}

interface VisibilityStateActions {
    openPreview: (id: string) => void;
    closePreview: () => void;
}

interface VisibilityState extends VisibilityStateData, VisibilityStateActions {}

export const useTaskStore = create<VisibilityState>((set) => ({
    isOpen: false,
    taskId: null,
    attachmentPaths: [],
    storeAttachmentPath: (path) => set((state) => ({ attachmentPaths: [...state.attachmentPaths, path]})),
    clearAttachmentPaths: () => set(() => ({ attachmentPaths: []})),
    openPreview: (id: string) => set(() => ({ isOpen: true, taskId: id })),
    closePreview: () => set({ isOpen: false, taskId: null }),
}));