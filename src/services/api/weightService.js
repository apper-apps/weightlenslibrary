import { weightData } from '@/services/mockData/weightData';

class WeightService {
  constructor() {
    this.data = [...weightData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...this.data].map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const entry = this.data.find(item => item.Id === parseInt(id));
    if (!entry) {
      throw new Error('Weight entry not found');
    }
    
    return {
      ...entry,
      date: new Date(entry.date)
    };
  }

  async create(entry) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.data.length > 0 ? 
      Math.max(...this.data.map(item => item.Id)) : 0;
    
    const newEntry = {
      ...entry,
      Id: maxId + 1,
      date: entry.date instanceof Date ? entry.date : new Date(entry.date)
    };
    
    this.data.push(newEntry);
    return { ...newEntry };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Weight entry not found');
    }
    
    const updatedEntry = {
      ...this.data[index],
      ...updates,
      Id: parseInt(id),
      date: updates.date instanceof Date ? updates.date : new Date(updates.date)
    };
    
    this.data[index] = updatedEntry;
    return { ...updatedEntry };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Weight entry not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const weightService = new WeightService();