import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format, subDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';

const WeightGraph = ({ weightEntries, goal, loading }) => {
  const chartData = useMemo(() => {
    if (!weightEntries || weightEntries.length === 0) return null;

    const sortedEntries = [...weightEntries].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    const series = [{
      name: 'Weight',
      data: sortedEntries.map(entry => ({
        x: new Date(entry.date).getTime(),
        y: entry.weight
      }))
    }];

    // Add goal line if exists
    if (goal && sortedEntries.length > 0) {
      const firstDate = new Date(sortedEntries[0].date);
      const lastDate = new Date(sortedEntries[sortedEntries.length - 1].date);
      const futureDate = goal.targetDate ? new Date(goal.targetDate) : 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      series.push({
        name: 'Goal',
        data: [
          { x: firstDate.getTime(), y: goal.targetWeight },
          { x: Math.max(lastDate.getTime(), futureDate.getTime()), y: goal.targetWeight }
        ]
      });
    }

    return series;
  }, [weightEntries, goal]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 2],
      dashArray: [0, 5]
    },
    colors: ['#00D084', '#4A4A4A'],
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 1,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#4A4A4A', fontSize: '12px' },
        formatter: function(value) {
          return format(new Date(value), 'MMM d');
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: {
        text: 'Weight (lbs)',
        style: { color: '#4A4A4A', fontSize: '12px' }
      },
      labels: {
        style: { colors: '#4A4A4A', fontSize: '12px' },
        formatter: function(value) {
          return value.toFixed(1);
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
      style: { fontSize: '12px' },
      x: {
        formatter: function(value) {
          return format(new Date(value), 'MMM d, yyyy');
        }
      },
      y: {
        formatter: function(value, { seriesIndex }) {
          return seriesIndex === 0 ? 
            `${value.toFixed(1)} lbs` : 
            `Goal: ${value.toFixed(1)} lbs`;
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Inter',
      markers: { width: 8, height: 8 }
    },
    markers: {
      size: [4, 0],
      colors: ['#00D084'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: { size: 6 }
    }
  };

  if (loading) {
    return (
      <Card>
        <Loading type="graph" />
      </Card>
    );
  }

  if (!weightEntries || weightEntries.length === 0) {
    return (
      <Card>
        <Empty 
          type="weight"
          actionLabel="Add First Entry"
          onAction={() => {
            // This would scroll to weight input or open it
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Card>
    );
  }

  const latestWeight = weightEntries[weightEntries.length - 1]?.weight;
  const previousWeight = weightEntries.length > 1 ? 
    weightEntries[weightEntries.length - 2]?.weight : null;
  const weightChange = previousWeight ? latestWeight - previousWeight : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="TrendingDown" size={20} className="text-accent" />
              <h3 className="font-display font-semibold text-lg text-primary">
                Weight Progress
              </h3>
            </div>
            
            {weightChange !== null && (
              <div className={`flex items-center space-x-1 text-sm ${
                weightChange > 0 ? 'text-warning' : 
                weightChange < 0 ? 'text-success' : 'text-secondary'
              }`}>
                <ApperIcon 
                  name={weightChange > 0 ? "TrendingUp" : 
                        weightChange < 0 ? "TrendingDown" : "Minus"} 
                  size={14} 
                />
                <span>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                </span>
              </div>
            )}
          </div>

          <div className="weight-graph rounded-lg overflow-hidden">
            <Chart
              options={chartOptions}
              series={chartData}
              type="line"
              height={300}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <p className="text-xs text-secondary">Current</p>
              <p className="font-display font-bold text-lg text-primary">
                {latestWeight?.toFixed(1)} lbs
              </p>
            </div>
            
            {goal && (
              <div className="text-center">
                <p className="text-xs text-secondary">Goal</p>
                <p className="font-display font-bold text-lg text-primary">
                  {goal.targetWeight} lbs
                </p>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-xs text-secondary">Entries</p>
              <p className="font-display font-bold text-lg text-primary">
                {weightEntries.length}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeightGraph;