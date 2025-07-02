import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { format } from 'date-fns';

const WeightInput = ({ onWeightAdded }) => {
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const weightValue = parseFloat(weight);
    if (!weightValue || weightValue <= 0 || weightValue > 1000) {
      toast.error("Please enter a valid weight between 1-1000 lbs");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newEntry = {
        Id: Date.now(),
        weight: weightValue,
        date: new Date(),
        source: 'manual'
      };
      
      await onWeightAdded(newEntry);
      setWeight('');
      setShowInput(false);
      toast.success("Weight recorded successfully!");
    } catch (error) {
      toast.error("Failed to record weight. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAddWeight = async (increment) => {
    // For demo purposes, we'll add a base weight + increment
    const baseWeight = 150; // This would come from last recorded weight in real app
    const newWeight = baseWeight + increment;
    
    setIsSubmitting(true);
    
    try {
      const newEntry = {
        Id: Date.now(),
        weight: newWeight,
        date: new Date(),
        source: 'manual'
      };
      
      await onWeightAdded(newEntry);
      toast.success(`Weight recorded: ${newWeight} lbs`);
    } catch (error) {
      toast.error("Failed to record weight. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showInput) {
    return (
      <Card className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <ApperIcon name="Scale" size={20} className="text-accent" />
          <h3 className="font-display font-semibold text-lg text-primary">
            Record Weight
          </h3>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowInput(true)}
            className="w-full"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Weight Entry
          </Button>
          
          <div className="text-sm text-secondary">
            <p className="mb-2">Quick add from scale sync:</p>
            <div className="flex space-x-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => quickAddWeight(-1)}
                disabled={isSubmitting}
              >
                -1 lb
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => quickAddWeight(0)}
                disabled={isSubmitting}
              >
                Same
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => quickAddWeight(1)}
                disabled={isSubmitting}
              >
                +1 lb
              </Button>
            </div>
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
              <ApperIcon name="Scale" size={20} className="text-accent" />
              <h3 className="font-display font-semibold text-lg text-primary">
                Record Weight
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowInput(false)}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <Input
            label="Weight (lbs)"
            type="number"
            step="0.1"
            min="1"
            max="1000"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your current weight"
            required
          />

          <div className="text-xs text-secondary text-center">
            Today, {format(new Date(), 'MMM d, yyyy • h:mm a')}
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowInput(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={!weight || isSubmitting}
              className="flex-1"
            >
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Weight
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default WeightInput;