import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const CameraCapture = ({ onMealCaptured }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [estimatedCalories, setEstimatedCalories] = useState(null);
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsCapturing(true);
      // Simulate camera access delay
      setTimeout(() => {
        fileInputRef.current?.click();
        setIsCapturing(false);
      }, 500);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleImageCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        setShowPreview(true);
        
        // Simulate AI processing
        setTimeout(() => {
          const calories = Math.floor(Math.random() * 400) + 200; // 200-600 calories
          setEstimatedCalories(calories);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMeal = async () => {
    if (!capturedImage || !estimatedCalories) return;
    
    try {
      const mealEntry = {
        Id: Date.now(),
        photoUrl: capturedImage,
        estimatedCalories,
        date: new Date()
      };
      
      await onMealCaptured(mealEntry);
      
      // Reset state
      setCapturedImage(null);
      setEstimatedCalories(null);
      setShowPreview(false);
      fileInputRef.current.value = '';
      
      toast.success(`Meal logged: ~${estimatedCalories} calories`);
    } catch (error) {
      toast.error("Failed to save meal. Please try again.");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setEstimatedCalories(null);
    setShowPreview(false);
    fileInputRef.current.value = '';
  };

  return (
    <>
      {/* Fixed Camera Button */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={handleCameraClick}
          disabled={isCapturing}
          className="w-16 h-16 rounded-full shadow-deep bg-accent hover:bg-accent/90 border-4 border-white"
        >
          {isCapturing ? (
            <motion.div
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <ApperIcon name="Camera" size={24} className="text-white" />
          )}
        </Button>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />

      {/* Camera Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl max-w-sm w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg text-primary">
                    Meal Captured
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetake}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {capturedImage && (
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured meal"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    {/* Portion estimation overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="portion-circle w-20 h-20 rounded-full"></div>
                      <div className="portion-circle w-16 h-16 rounded-full absolute top-8 right-8"></div>
                      <div className="portion-circle w-12 h-12 rounded-full absolute bottom-8 left-8"></div>
                    </div>
                  </div>
                )}

                {/* AI Processing */}
                {!estimatedCalories ? (
                  <div className="text-center py-4">
                    <motion.div
                      className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-sm text-secondary">
                      Analyzing portions and estimating calories...
                    </p>
                  </div>
                ) : (
                  <motion.div
                    className="bg-surface rounded-lg p-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <ApperIcon name="Zap" size={20} className="text-accent" />
                      <span className="font-display font-bold text-2xl text-primary">
                        ~{estimatedCalories}
                      </span>
                      <span className="text-sm text-secondary">calories</span>
                    </div>
                    <p className="text-xs text-secondary">
                      AI-estimated based on portion sizes
                    </p>
                  </motion.div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleRetake}
                    className="flex-1"
                  >
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    Retake
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSaveMeal}
                    disabled={!estimatedCalories}
                    className="flex-1"
                  >
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Meal
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CameraCapture;