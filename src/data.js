import osData from './data/os.json';
import oopData from './data/oop.json';
import dbData from './data/db.json';
import netData from './data/net.json';
import dsaData from './data/dsa.json';
import sysData from './data/sys.json';
import dsaTemplates from './data/dsa_templates.json';

export const D = [
  osData,
  oopData,
  dbData,
  netData,
  dsaData,
  sysData
];

export const TOPICS = [
  { id: 'os', icon: '⚙️', title: 'OS' },
  { id: 'oop', icon: '🧱', title: 'OOP' },
  { id: 'db', icon: '🗄️', title: 'DBMS' },
  { id: 'net', icon: '🌐', title: 'Networking' },
  { id: 'dsa', icon: '🔢', title: 'DSA' },
  { id: 'sys', icon: '🏗️', title: 'System Design' }
];

export const DSA_TEMPLATES = dsaTemplates;
