import { LitElementBase } from './lit-element-base';

export type Page = typeof LitElementBase & { isPage: true; pageName?: string; icon?: string; anonymous?: boolean };
