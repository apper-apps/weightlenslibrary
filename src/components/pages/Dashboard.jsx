import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import WeightInput from '@/components/molecules/WeightInput';
import CameraCapture from '@/components/molecules/CameraCapture';
import GoalSetting from '@/components/molecules/GoalSetting';
import WeightGraph from '@/components/organisms/WeightGraph';
import TipSystem from '@/components/organisms/TipSystem';
import StatsOverview from '@/components/organisms/StatsOverview';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { weightService } from '@/services/api/weightService';
import { mealService } from '@/services/api/mealService';
import { goalService } from '@/services/api/goalService';

const Dashboard = () => {
  const [weightEntries, setWeightEntries] = useState([]);
  const [mealEntries, setMealEntries] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [weights, meals, currentGoal] = await Promise.all([
        weightService.getAll(),
        mealService.getAll(),
        goalService.getCurrent()
      ]);
      
      setWeightEntries(weights);
      setMealEntries(meals);
      setGoal(currentGoal);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWeightAdded = async (newWeight) => {
    const savedWeight = await weightService.create(newWeight);
    setWeightEntries(prev => [...prev, savedWeight]);
  };

  const handleMealCaptured = async (newMeal) => {
    const savedMeal = await mealService.create(newMeal);
    setMealEntries(prev => [...prev, savedMeal]);
  };

  const handleGoalSet = async (newGoal) => {
    const savedGoal = await goalService.set(newGoal);
    setGoal(savedGoal);
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Error 
          message={error}
          onRetry={loadData}
          type="data"
        />
      </div>
    );
  }

  const currentWeight = weightEntries.length > 0 ? 
    weightEntries[weightEntries.length - 1]?.weight : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className="text-center py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display font-bold text-3xl text-primary mb-2">
          WeightLens
        </h1>
        <p className="text-secondary text-sm">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.header>
{/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-32 space-y-6">
        {/* Stats Overview */}
        <StatsOverview 
          weightEntries={weightEntries}
          mealEntries={mealEntries}
          goal={goal}
        />

        {/* Weight Graph */}
        <WeightGraph 
          weightEntries={weightEntries}
          goal={goal}
          loading={false}
        />

        {/* Goal Setting */}
        <GoalSetting
          currentWeight={currentWeight}
          onGoalSet={handleGoalSet}
          existingGoal={goal}
        />

        {/* Weight Input */}
        <WeightInput onWeightAdded={handleWeightAdded} />

        {/* Tip System */}
        <TipSystem 
          weightEntries={weightEntries}
          goal={goal}
        />
      </div>

      {/* Camera Capture - Fixed Bottom */}
      <CameraCapture onMealCaptured={handleMealCaptured} />
    </div>
  );
};

export default Dashboard;