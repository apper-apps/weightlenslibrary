import { mealData } from '@/services/mockData/mealData';

class MealService {
  constructor() {
    this.data = [...mealData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return [...this.data].map(meal => ({
      ...meal,
      date: new Date(meal.date)
    }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const meal = this.data.find(item => item.Id === parseInt(id));
    if (!meal) {
      throw new Error('Meal entry not found');
    }
    
    return {
      ...meal,
      date: new Date(meal.date)
    };
  }

  async create(meal) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const maxId = this.data.length > 0 ? 
      Math.max(...this.data.map(item => item.Id)) : 0;
    
    const newMeal = {
      ...meal,
      Id: maxId + 1,
      date: meal.date instanceof Date ? meal.date : new Date(meal.date)
    };
    
    this.data.push(newMeal);
    return { ...newMeal };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Meal entry not found');
    }
    
    const updatedMeal = {
      ...this.data[index],
      ...updates,
      Id: parseInt(id),
      date: updates.date instanceof Date ? updates.date : new Date(updates.date)
    };
    
    this.data[index] = updatedMeal;
    return { ...updatedMeal };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Meal entry not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const mealService = new MealService();