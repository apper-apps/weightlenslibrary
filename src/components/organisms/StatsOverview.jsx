import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { differenceInDays, format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatsOverview = ({ weightEntries, mealEntries, goal }) => {
  const stats = useMemo(() => {
    const sortedWeights = weightEntries ? 
      [...weightEntries].sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
    
    const currentWeight = sortedWeights.length > 0 ? 
      sortedWeights[sortedWeights.length - 1].weight : null;
    
    const startWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : null;
    
    const totalChange = currentWeight && startWeight ? 
      currentWeight - startWeight : null;
    
    const daysTracking = sortedWeights.length > 0 ? 
      differenceInDays(
        new Date(sortedWeights[sortedWeights.length - 1].date),
        new Date(sortedWeights[0].date)
      ) + 1 : 0;
    
    const totalMeals = mealEntries ? mealEntries.length : 0;
    
    const totalCalories = mealEntries ? 
      mealEntries.reduce((sum, meal) => sum + (meal.estimatedCalories || 0), 0) : 0;
    
    const avgCaloriesPerDay = totalMeals > 0 && daysTracking > 0 ? 
      totalCalories / Math.max(daysTracking, 1) : 0;

    // Goal progress
    let goalProgress = null;
    if (goal && currentWeight && startWeight) {
      const targetDiff = goal.targetWeight - startWeight;
      const currentDiff = currentWeight - startWeight;
      goalProgress = targetDiff !== 0 ? (currentDiff / targetDiff) * 100 : 0;
    }

    return {
      currentWeight,
      totalChange,
      daysTracking,
      totalMeals,
      avgCaloriesPerDay,
      goalProgress: Math.min(100, Math.max(0, goalProgress || 0))
    };
  }, [weightEntries, mealEntries, goal]);

  const statCards = [
    {
      label: "Current Weight",
      value: stats.currentWeight ? `${stats.currentWeight.toFixed(1)} lbs` : "---",
      icon: "Scale",
      color: "text-primary",
      bgColor: "bg-primary/5"
    },
    {
      label: "Total Change",
      value: stats.totalChange ? 
        `${stats.totalChange > 0 ? '+' : ''}${stats.totalChange.toFixed(1)} lbs` : "---",
      icon: stats.totalChange > 0 ? "TrendingUp" : 
            stats.totalChange < 0 ? "TrendingDown" : "Minus",
      color: stats.totalChange > 0 ? "text-warning" : 
             stats.totalChange < 0 ? "text-success" : "text-secondary",
      bgColor: stats.totalChange > 0 ? "bg-warning/5" : 
               stats.totalChange < 0 ? "bg-success/5" : "bg-secondary/5"
    },
    {
      label: "Days Tracking",
      value: stats.daysTracking || "0",
      icon: "Calendar",
      color: "text-info",
      bgColor: "bg-info/5"
    },
    {
      label: "Meals Logged",
      value: stats.totalMeals || "0",
      icon: "Camera",
      color: "text-accent",
      bgColor: "bg-accent/5"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="text-center" padding="sm">
              <div className={`w-8 h-8 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <ApperIcon name={stat.icon} size={16} className={stat.color} />
              </div>
              <p className="text-xs text-secondary mb-1">{stat.label}</p>
              <p className={`font-display font-bold text-lg ${stat.color}`}>
                {stat.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      {(stats.avgCaloriesPerDay > 0 || goal) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <div className="space-y-4">
              {stats.avgCaloriesPerDay > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Zap" size={16} className="text-warning" />
                    <span className="text-sm text-secondary">Avg Calories/Day</span>
                  </div>
                  <span className="font-display font-semibold text-primary">
                    {Math.round(stats.avgCaloriesPerDay)}
                  </span>
                </div>
              )}
              
              {goal && stats.goalProgress !== null && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Target" size={16} className="text-accent" />
                      <span className="text-sm text-secondary">Goal Progress</span>
                    </div>
                    <span className="font-display font-semibold text-primary">
                      {Math.round(stats.goalProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-accent to-success h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, stats.goalProgress)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default StatsOverview;