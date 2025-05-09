import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for handling camera and media operations
 * @returns {Object} Media state and handlers
 */
export const useMedia = (options = {}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const webcamRef = useRef(null);
  
  const defaultOptions = {
    width: 1280,
    height: 720,
    aspectRatio: 4/3,
    facingMode: isFrontCamera ? 'user' : 'environment',
    audio: false,
  };

  const videoConstraints = {
    ...defaultOptions,
    ...options,
    facingMode: isFrontCamera ? 'user' : 'environment',
  };
  
  // Request camera permission
  const requestPermission = useCallback(async () => {
    try {
      setHasPermission(null);
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      });
      
      setHasPermission(true);
      
      // Clean up stream when done
      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError(err.message || 'Could not access camera');
      setHasPermission(false);
    }
  }, [videoConstraints]);
  
  // Initialize camera permission check
  useEffect(() => {
    const cleanup = requestPermission();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [requestPermission]);
  
  // Toggle between front and back cameras
  const toggleCamera = useCallback(() => {
    setIsFrontCamera(prev => !prev);
  }, []);
  
  // Toggle camera flash (if available)
  const toggleFlash = useCallback(() => {
    if (webcamRef.current) {
      const track = webcamRef.current.stream?.getVideoTracks()[0];
      if (track && 'imageCaptureCapabilities' in track) {
        try {
          // This is not supported in all browsers
          const capabilities = track.getCapabilities();
          if (capabilities.torch) {
            const newFlashState = !isFlashOn;
            track.applyConstraints({
              advanced: [{ torch: newFlashState }],
            });
            setIsFlashOn(newFlashState);
          }
        } catch (err) {
          console.error('Flash not supported or error:', err);
        }
      }
    }
  }, [isFlashOn]);
  
  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (!webcamRef.current) {
      setCameraError('Camera not initialized');
      return null;
    }
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      return imageSrc;
    } catch (err) {
      console.error('Error capturing image:', err);
      setCameraError('Failed to capture image');
      return null;
    }
  }, []);
  
  // Reset captured image
  const resetCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);
  
  // Handle file selection from device
  const handleFileUpload = useCallback((file) => {
    if (!file) return null;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setCapturedImage(imageData);
        resolve(imageData);
      };
      reader.onerror = (err) => {
        console.error('Error reading file:', err);
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  
  // Compress and resize image for upload
  const processImageForUpload = useCallback((imageData, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      try {
        setIsProcessing(true);
        
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image
          const compressedImageData = canvas.toDataURL('image/jpeg', quality);
          setIsProcessing(false);
          resolve(compressedImageData);
        };
        
        img.onerror = (err) => {
          setIsProcessing(false);
          reject(err);
        };
        
        img.src = imageData;
      } catch (err) {
        setIsProcessing(false);
        reject(err);
      }
    });
  }, []);

  return {
    webcamRef,
    hasPermission,
    cameraError,
    cameraReady,
    setCameraReady,
    isFrontCamera,
    isFlashOn,
    capturedImage,
    isProcessing,
    videoConstraints,
    requestPermission,
    toggleCamera,
    toggleFlash,
    captureImage,
    resetCapture,
    handleFileUpload,
    processImageForUpload
  };
};