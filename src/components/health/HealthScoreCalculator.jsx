import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const HealthScoreCalculator = () => {
  const { t } = useTranslation("home");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    exerciseFrequency: "",
    sleepHours: "",
    stressLevel: "",
    dietQuality: "",
    medicalConditions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric values to numbers
    const numericValue = [
      "age",
      "weight",
      "height",
      "exerciseFrequency",
      "sleepHours",
      "stressLevel",
      "dietQuality",
    ].includes(name)
      ? Number(value)
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const calculateBMIScore = (weight, height) => {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // BMI scoring (0-100)
    if (bmi < 18.5) return 60; // Underweight
    if (bmi >= 18.5 && bmi < 25) return 100; // Normal weight
    if (bmi >= 25 && bmi < 30) return 70; // Overweight
    return 40; // Obese
  };

  const calculateExerciseScore = (frequency) => {
    // Exercise scoring (0-100)
    if (frequency >= 5) return 100;
    if (frequency >= 3) return 80;
    if (frequency >= 1) return 60;
    return 30;
  };

  const calculateSleepScore = (hours) => {
    // Sleep scoring (0-100)
    if (hours >= 7 && hours <= 9) return 100;
    if (hours >= 6 && hours <= 10) return 80;
    if (hours >= 5 && hours <= 11) return 60;
    return 40;
  };

  const calculateStressScore = (level) => {
    // Stress scoring (0-100) - lower stress is better
    return 100 - (level - 1) * 10;
  };

  const calculateDietScore = (quality) => {
    // Diet scoring (0-100)
    return quality * 10;
  };

  const calculateAgeScore = (age) => {
    // Age scoring (0-100) - adjusted for different age groups
    if (age < 18) return 90;
    if (age < 30) return 100;
    if (age < 50) return 90;
    if (age < 70) return 80;
    return 70;
  };

  const calculateScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data before calculating
    const validationErrors = [];
    if (!formData.age || formData.age < 0 || formData.age > 120) {
      validationErrors.push("Age must be between 0 and 120");
    }
    if (!formData.weight || formData.weight < 0 || formData.weight > 500) {
      validationErrors.push("Weight must be between 0 and 500 kg");
    }
    if (!formData.height || formData.height < 0 || formData.height > 300) {
      validationErrors.push("Height must be between 0 and 300 cm");
    }
    if (
      !formData.exerciseFrequency ||
      formData.exerciseFrequency < 0 ||
      formData.exerciseFrequency > 30
    ) {
      validationErrors.push(
        "Exercise frequency must be between 0 and 30 times per week"
      );
    }
    if (
      !formData.sleepHours ||
      formData.sleepHours < 0 ||
      formData.sleepHours > 24
    ) {
      validationErrors.push("Sleep hours must be between 0 and 24");
    }
    if (
      !formData.stressLevel ||
      formData.stressLevel < 1 ||
      formData.stressLevel > 10
    ) {
      validationErrors.push("Stress level must be between 1 and 10");
    }
    if (
      !formData.dietQuality ||
      formData.dietQuality < 1 ||
      formData.dietQuality > 10
    ) {
      validationErrors.push("Diet quality must be between 1 and 10");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      setLoading(false);
      return;
    }

    try {
      // Calculate individual scores
      const bmiScore = calculateBMIScore(formData.weight, formData.height);
      const exerciseScore = calculateExerciseScore(formData.exerciseFrequency);
      const sleepScore = calculateSleepScore(formData.sleepHours);
      const stressScore = calculateStressScore(formData.stressLevel);
      const dietScore = calculateDietScore(formData.dietQuality);
      const ageScore = calculateAgeScore(formData.age);

      // Calculate weighted average
      const weights = {
        bmi: 0.25,
        exercise: 0.2,
        sleep: 0.15,
        stress: 0.15,
        diet: 0.15,
        age: 0.1,
      };

      const finalScore = Math.round(
        bmiScore * weights.bmi +
          exerciseScore * weights.exercise +
          sleepScore * weights.sleep +
          stressScore * weights.stress +
          dietScore * weights.diet +
          ageScore * weights.age
      );

      // Generate explanation and improvements
      const explanation = getScoreExplanation(finalScore);
      const improvements = getImprovements({
        bmiScore,
        exerciseScore,
        sleepScore,
        stressScore,
        dietScore,
        ageScore,
      });

      setScore({
        score: finalScore,
        explanation,
        improvements,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error calculating health score:", error);
      setError("Failed to calculate health score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreExplanation = (score) => {
    if (score >= 80)
      return "Excellent health! You're maintaining a very healthy lifestyle.";
    if (score >= 60)
      return "Good health! You're on the right track with some room for improvement.";
    if (score >= 40)
      return "Fair health. There are several areas where you can make improvements.";
    return "Poor health. Significant lifestyle changes are recommended.";
  };

  const getImprovements = (scores) => {
    const improvements = [];

    if (scores.bmiScore < 80) {
      improvements.push(
        "Consider adjusting your diet and exercise routine to achieve a healthier BMI."
      );
    }
    if (scores.exerciseScore < 80) {
      improvements.push(
        "Try to increase your exercise frequency to at least 3 times per week."
      );
    }
    if (scores.sleepScore < 80) {
      improvements.push(
        "Aim for 7-9 hours of sleep per night for optimal health."
      );
    }
    if (scores.stressScore < 80) {
      improvements.push(
        "Practice stress management techniques like meditation or deep breathing."
      );
    }
    if (scores.dietScore < 80) {
      improvements.push(
        "Focus on maintaining a balanced diet with plenty of fruits and vegetables."
      );
    }

    // Always return at least 2 improvements
    if (improvements.length < 2) {
      improvements.push("Regular health check-ups are recommended.");
      improvements.push(
        "Stay hydrated by drinking plenty of water throughout the day."
      );
    }

    return improvements.slice(0, 3); // Return top 3 improvements
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md whitespace-pre-line">
          {error}
        </div>
      )}
      {showForm ? (
        <form onSubmit={calculateScore} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                max="120"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="0"
                max="500"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="0"
                max="300"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Exercise (times/week)
              </label>
              <input
                type="number"
                name="exerciseFrequency"
                value={formData.exerciseFrequency}
                onChange={handleInputChange}
                min="0"
                max="30"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sleep Hours
              </label>
              <input
                type="number"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleInputChange}
                min="0"
                max="24"
                step="0.5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stress Level (1-10)
              </label>
              <input
                type="number"
                name="stressLevel"
                value={formData.stressLevel}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Diet Quality (1-10)
              </label>
              <input
                type="number"
                name="dietQuality"
                value={formData.dietQuality}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate Health Score"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div
            className={`text-4xl font-bold mb-4 ${getScoreColor(score.score)}`}
          >
            {score.score}/100
          </div>
          <p className="text-gray-600 mb-4">{score.explanation}</p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Areas for Improvement:</h3>
            <ul className="list-disc list-inside text-left">
              {score.improvements.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Recalculate Score
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthScoreCalculator;
