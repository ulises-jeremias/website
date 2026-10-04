/** Shared Hornero OS repository destinations used by route content and its transition map. */
export const horneroRepositoryUrls = {
  composition: 'https://github.com/HorneroOS/hornero',
  shell: 'https://github.com/HorneroOS/shell',
  desktopDefaults: 'https://github.com/HorneroOS/config',
  systemCli: 'https://github.com/HorneroOS/hornero/tree/main/cli',
  greeter: 'https://github.com/HorneroOS/greeter',
} as const;

export const horneroSystemRepositories = [
  { id: 'shell', label: 'Desktop shell', href: horneroRepositoryUrls.shell },
  { id: 'defaults', label: 'Desktop defaults', href: horneroRepositoryUrls.desktopDefaults },
  { id: 'cli', label: 'System CLI', href: horneroRepositoryUrls.systemCli },
  { id: 'greeter', label: 'Login screen', href: horneroRepositoryUrls.greeter },
] as const;
