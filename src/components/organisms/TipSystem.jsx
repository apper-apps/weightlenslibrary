import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { differenceInDays } from 'date-fns';

const TipSystem = ({ weightEntries, goal }) => {
  const [currentTip, setCurrentTip] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const tips = [
    {
      Id: 1,
      condition: "plateau",
      message: "Weight plateaus are normal! Try varying your routine or meal timing.",
      priority: 1,
      icon: "TrendingUp"
    },
    {
      Id: 2,
      condition: "no_recent_entries",
      message: "Consistency is key! Try to log your weight daily for better tracking.",
      priority: 2,
      icon: "Calendar"
    },
    {
      Id: 3,
      condition: "rapid_change",
      message: "Significant weight changes can be normal, but consider factors like hydration.",
      priority: 3,
      icon: "Zap"
    },
    {
      Id: 4,
      condition: "goal_progress",
      message: "Great progress! You're on track to reach your goal.",
      priority: 1,
      icon: "Target"
    },
    {
      Id: 5,
      condition: "hydration",
      message: "Daily weight fluctuations are often due to water retention. Stay consistent!",
      priority: 2,
      icon: "Droplets"
    }
  ];

  useEffect(() => {
    if (!weightEntries || weightEntries.length === 0 || dismissed) {
      setCurrentTip(null);
      return;
    }

    const sortedEntries = [...weightEntries].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    // Check for plateau (no significant change in last 7 days with 3+ entries)
    if (sortedEntries.length >= 3) {
      const recentEntries = sortedEntries.slice(0, 7);
      const weights = recentEntries.map(e => e.weight);
      const maxWeight = Math.max(...weights);
      const minWeight = Math.min(...weights);
      
      if (maxWeight - minWeight < 0.5) { // Less than 0.5 lb variation
        setCurrentTip(tips.find(t => t.condition === "plateau"));
        return;
      }
    }

    // Check for no recent entries
    const lastEntry = sortedEntries[0];
    const daysSinceLastEntry = differenceInDays(new Date(), new Date(lastEntry.date));
    
    if (daysSinceLastEntry > 3) {
      setCurrentTip(tips.find(t => t.condition === "no_recent_entries"));
      return;
    }

    // Check for rapid change (more than 3 lbs in 7 days)
    if (sortedEntries.length >= 2) {
      const recent = sortedEntries[0];
      const weekAgo = sortedEntries.find(entry => 
        differenceInDays(new Date(recent.date), new Date(entry.date)) >= 7
      );
      
      if (weekAgo && Math.abs(recent.weight - weekAgo.weight) > 3) {
        setCurrentTip(tips.find(t => t.condition === "rapid_change"));
        return;
      }
    }

    // Check for good progress toward goal
    if (goal && sortedEntries.length >= 2) {
      const current = sortedEntries[0].weight;
      const isLosingWeight = goal.targetWeight < current;
      const recentTrend = sortedEntries[1].weight - current;
      
      if ((isLosingWeight && recentTrend > 0) || (!isLosingWeight && recentTrend < 0)) {
        setCurrentTip(tips.find(t => t.condition === "goal_progress"));
        return;
      }
    }

    // Default tip for daily fluctuations
    if (Math.random() > 0.7) { // Show occasionally
      setCurrentTip(tips.find(t => t.condition === "hydration"));
    }
  }, [weightEntries, goal, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setCurrentTip(null);
  };

  if (!currentTip) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="bg-gradient-to-r from-accent/5 to-accent-purple/5 border-accent/20">
          <div className="flex items-start space-x-3">
            <motion.div
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent/10 to-accent-purple/10 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <ApperIcon name={currentTip.icon} size={20} className="text-accent" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-primary mb-1">
                    💡 Tip
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed">
                    {currentTip.message}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-shrink-0 ml-2 -mt-1"
                >
                  <ApperIcon name="X" size={14} className="text-secondary" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default TipSystem;