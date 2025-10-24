import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

// Beverage-related COCO class labels
const BEVERAGE_LABELS = [
  'bottle',
  'wine glass',
  'cup',
  'bowl'
];

let detectorInstance: any = null;

export const initBeverageDetector = async () => {
  if (!detectorInstance) {
    console.log('Loading beverage detection model...');
    detectorInstance = await pipeline(
      'object-detection',
      'Xenova/detr-resnet-50',
      { device: 'webgpu' }
    );
    console.log('Model loaded successfully!');
  }
  return detectorInstance;
};

export const detectBeverage = async (imageFile: File): Promise<{ detected: boolean; count: number; labels: string[] }> => {
  try {
    const detector = await initBeverageDetector();
    
    // Convert file to image URL
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Run detection with higher threshold to reduce false positives
    const results = await detector(imageUrl, {
      threshold: 0.5,
      percentage: true,
    });
    
    // Clean up
    URL.revokeObjectURL(imageUrl);
    
    // Filter for beverage-related objects
    const beverages = results.filter((result: any) => 
      BEVERAGE_LABELS.some(label => 
        result.label.toLowerCase().includes(label.toLowerCase())
      )
    );
    
    console.log('Detection results:', results);
    console.log('Beverages found:', beverages);
    
    return {
      detected: beverages.length > 0,
      count: beverages.length,
      labels: beverages.map((b: any) => b.label)
    };
  } catch (error) {
    console.error('Error detecting beverage:', error);
    throw error;
  }
};
