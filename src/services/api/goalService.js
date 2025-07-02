import { goalData } from '@/services/mockData/goalData';

class GoalService {
  constructor() {
    this.currentGoal = goalData.length > 0 ? { ...goalData[0] } : null;
  }

  async getCurrent() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!this.currentGoal) return null;
    
    return {
      ...this.currentGoal,
      targetDate: new Date(this.currentGoal.targetDate),
      createdDate: new Date(this.currentGoal.createdDate)
    };
  }

  async set(goal) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.currentGoal = {
      ...goal,
      targetDate: goal.targetDate instanceof Date ? goal.targetDate : new Date(goal.targetDate),
      createdDate: goal.createdDate instanceof Date ? goal.createdDate : new Date(goal.createdDate)
    };
    
    return { ...this.currentGoal };
  }

  async clear() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.currentGoal = null;
    return true;
  }
}

export const goalService = new GoalService();