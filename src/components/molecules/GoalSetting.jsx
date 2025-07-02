import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const GoalSetting = ({ currentWeight, onGoalSet, existingGoal }) => {
  const [targetWeight, setTargetWeight] = useState(
    existingGoal ? existingGoal.targetWeight.toString() : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(!existingGoal);

  const calculateProjectedDate = (current, target) => {
    if (!current || !target) return null;
    
    const weightDiff = Math.abs(current - target);
    const weeksNeeded = Math.ceil(weightDiff / 1.5); // Assuming 1-2 lbs per week
    
    return addDays(new Date(), weeksNeeded * 7);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const target = parseFloat(targetWeight);
    if (!target || target <= 0 || target > 1000) {
      toast.error("Please enter a valid target weight");
      return;
    }

    if (!currentWeight) {
      toast.error("Please record your current weight first");
      return;
    }

    if (Math.abs(target - currentWeight) < 1) {
      toast.error("Target weight should be at least 1 lb different from current weight");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projectedDate = calculateProjectedDate(currentWeight, target);
      
      const goal = {
        targetWeight: target,
        targetDate: projectedDate,
        createdDate: new Date()
      };
      
      await onGoalSet(goal);
      setShowForm(false);
      toast.success("Goal set successfully!");
    } catch (error) {
      toast.error("Failed to set goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingGoal && !showForm) {
    const isGoingDown = existingGoal.targetWeight < currentWeight;
    const weightDiff = Math.abs(currentWeight - existingGoal.targetWeight);
    const progress = currentWeight ? Math.max(0, Math.min(100, 
      ((currentWeight - (isGoingDown ? existingGoal.targetWeight : currentWeight)) / 
       (isGoingDown ? currentWeight - existingGoal.targetWeight : existingGoal.targetWeight - currentWeight)) * 100
    )) : 0;

    return (
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Target" size={20} className="text-accent" />
              <h3 className="font-display font-semibold text-lg text-primary">
                Your Goal
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <ApperIcon name="Edit" size={14} className="mr-1" />
              Edit
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-secondary">Current</p>
              <p className="font-display font-bold text-xl text-primary">
                {currentWeight || '---'} lbs
              </p>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-accent to-success h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-secondary text-center mt-1">
                {progress.toFixed(0)}% to goal
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-secondary">Target</p>
              <p className="font-display font-bold text-xl text-primary">
                {existingGoal.targetWeight} lbs
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-3 text-center">
            <p className="text-sm text-secondary">
              {weightDiff.toFixed(1)} lbs to go
            </p>
            {existingGoal.targetDate && (
              <p className="text-xs text-secondary mt-1">
                Projected: {format(existingGoal.targetDate, 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Target" size={20} className="text-accent" />
              <h3 className="font-display font-semibold text-lg text-primary">
                Set Your Goal
              </h3>
            </div>
            {existingGoal && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            )}
          </div>

          <Input
            label="Target Weight (lbs)"
            type="number"
            step="0.1"
            min="1"
            max="1000"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="Enter your target weight"
            required
          />

          {currentWeight && targetWeight && (
            <motion.div
              className="bg-surface rounded-lg p-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-secondary">
                {Math.abs(parseFloat(targetWeight) - currentWeight).toFixed(1)} lbs 
                {parseFloat(targetWeight) < currentWeight ? ' to lose' : ' to gain'}
              </p>
              {calculateProjectedDate(currentWeight, parseFloat(targetWeight)) && (
                <p className="text-xs text-secondary mt-1">
                  Estimated completion: {format(
                    calculateProjectedDate(currentWeight, parseFloat(targetWeight)), 
                    'MMM d, yyyy'
                  )}
                </p>
              )}
            </motion.div>
          )}

          <div className="flex space-x-3">
            {existingGoal && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={!targetWeight || isSubmitting}
              className={existingGoal ? "flex-1" : "w-full"}
            >
              <ApperIcon name="Target" size={16} className="mr-2" />
              {existingGoal ? 'Update Goal' : 'Set Goal'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default GoalSetting;