import catalog from 'virtual:learning-content';
import dsaTemplates from './data/dsa_templates.json';
import { toSubjectGroups } from './content/adapter';

export const CONTENT = catalog;
export const D = toSubjectGroups(catalog);
export const MIGRATION_BASELINES = catalog.migrationBaselines;

export const TOPICS = catalog.subjects.map(({ id, icon, title }) => ({ id, icon, title }));

export const DSA_TEMPLATES = dsaTemplates;
