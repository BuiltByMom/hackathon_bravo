import { User } from '@sophon/shared';
import fs from 'fs';
import path from 'path';
import { Contact } from '../models/Contact';

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }));
}

if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify({ contacts: [] }));
}

// Helper function to read JSON file
const readJsonFile = <T>(filePath: string): T => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write JSON file
const writeJsonFile = <T>(filePath: string, data: T): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User operations
export const userService = {
  getAll: (): User[] => {
    const data = readJsonFile<{ users: User[] }>(USERS_FILE);
    return data.users;
  },

  getById: (id: string): User | undefined => {
    const users = userService.getAll();
    return users.find((user) => user.id === id);
  },

  getByEmail: (email: string): User | undefined => {
    const users = userService.getAll();
    return users.find((user) => user.email === email);
  },

  getByTag: (tag: string): User | undefined => {
    const users = userService.getAll();
    return users.find((user) => user.tag === tag);
  },

  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = userService.getAll();
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    writeJsonFile(USERS_FILE, { users });
    return newUser;
  },

  update: (id: string, updates: Partial<User>): User | undefined => {
    const users = userService.getAll();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    const updatedUser = {
      ...users[index],
      ...updates,
      updatedAt: new Date(),
    };
    users[index] = updatedUser;
    writeJsonFile(USERS_FILE, { users });
    return updatedUser;
  },

  delete: (id: string): boolean => {
    const users = userService.getAll();
    const filteredUsers = users.filter((user) => user.id !== id);
    if (filteredUsers.length === users.length) return false;
    writeJsonFile(USERS_FILE, { users: filteredUsers });
    return true;
  },
};

// Contact operations
export const contactService = {
  getAll: (): Contact[] => {
    const data = readJsonFile<{ contacts: Contact[] }>(CONTACTS_FILE);
    return data.contacts;
  },

  getById: (id: string): Contact | undefined => {
    const contacts = contactService.getAll();
    return contacts.find((contact) => contact.id === id);
  },

  getByUserId: (userId: string): Contact[] => {
    const contacts = contactService.getAll();
    return contacts.filter((contact) => contact.userId === userId);
  },

  create: (contact: Omit<Contact, 'id'>): Contact => {
    const contacts = contactService.getAll();
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
    };
    contacts.push(newContact);
    writeJsonFile(CONTACTS_FILE, { contacts });
    return newContact;
  },

  update: (id: string, updates: Partial<Contact>): Contact | undefined => {
    const contacts = contactService.getAll();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) return undefined;

    const updatedContact = {
      ...contacts[index],
      ...updates,
    };
    contacts[index] = updatedContact;
    writeJsonFile(CONTACTS_FILE, { contacts });
    return updatedContact;
  },

  delete: (id: string): boolean => {
    const contacts = contactService.getAll();
    const filteredContacts = contacts.filter((contact) => contact.id !== id);
    if (filteredContacts.length === contacts.length) return false;
    writeJsonFile(CONTACTS_FILE, { contacts: filteredContacts });
    return true;
  },
};
