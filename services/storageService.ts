
import { TestimonialEntry } from '../types';

const STORAGE_KEY = 'mimosa_testimonials_v1';

export const storageService = {
  saveEntry: (entry: TestimonialEntry): void => {
    const entries = storageService.getAllEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    if (existingIndex > -1) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  getAllEntries: (): TestimonialEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getEntryById: (id: string): TestimonialEntry | undefined => {
    return storageService.getAllEntries().find(e => e.id === id);
  },

  deleteEntry: (id: string): void => {
    const entries = storageService.getAllEntries().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
};
