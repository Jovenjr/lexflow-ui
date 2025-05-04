import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
});
