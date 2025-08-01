import { v4 as uuidv4 } from 'uuid';

const SUB_ID_KEY = 'cat-voting-sub-id';

export const subIdUtils = {
  // Get existing sub_id from localStorage or create a new one
  getSubId(): string {
    let subId = localStorage.getItem(SUB_ID_KEY);
    
    if (!subId) {
      subId = uuidv4();
      localStorage.setItem(SUB_ID_KEY, subId);
    }
    
    return subId;
  },

  // Clear sub_id (useful for testing or reset functionality)
  clearSubId(): void {
    localStorage.removeItem(SUB_ID_KEY);
  },

  // Set a specific sub_id (useful for testing)
  setSubId(subId: string): void {
    localStorage.setItem(SUB_ID_KEY, subId);
  },
};