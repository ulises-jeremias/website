import { describe, expect, it } from 'vitest';
import { buildCreateAwesomeCommand } from './buildCommand.js';

describe('buildCreateAwesomeCommand', () => {
  it('builds Node commands with npm create -- separator and space-separated addons', () => {
    expect(
      buildCreateAwesomeCommand({
        family: 'node',
        projectName: 'my-app',
        template: 'react-vite-boilerplate',
        addons: ['tailwind-css', 'zustand'],
      }),
    ).toBe(
      'npm create awesome-node-app@latest my-app -- --template react-vite-boilerplate --addons tailwind-css zustand',
    );
  });

  it('builds Python commands with repeated --addons flags', () => {
    expect(
      buildCreateAwesomeCommand({
        family: 'python',
        projectName: 'my-api',
        template: 'fastapi-starter',
        addons: ['github-setup', 'fastapi-sqlalchemy'],
      }),
    ).toBe(
      'uvx create-awesome-python-app@latest my-api --template fastapi-starter --addons github-setup --addons fastapi-sqlalchemy',
    );
  });

  it('builds V commands with comma-separated --addons', () => {
    expect(
      buildCreateAwesomeCommand({
        family: 'v',
        projectName: 'my-vapp',
        template: 'web-server',
        addons: ['v-sqlite', 'v-docker'],
      }),
    ).toBe('create-vlang-app my-vapp --template web-server --addons v-sqlite,v-docker');
  });

  it('omits addon flags when none selected', () => {
    expect(
      buildCreateAwesomeCommand({
        family: 'v',
        template: 'cli-app',
        addons: [],
      }),
    ).toBe('create-vlang-app my-app --template cli-app');
  });
});
