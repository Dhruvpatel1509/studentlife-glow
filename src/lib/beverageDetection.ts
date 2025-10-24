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
      threshold: 0.65,
      percentage: true,
    });
    
    // Clean up
    URL.revokeObjectURL(imageUrl);
    
    // Filter for beverage-related objects with stricter matching
    const beverages = results.filter((result: any) => {
      const label = result.label.toLowerCase();
      const score = result.score;
      
      // Must have high confidence (above 0.65) and match exact beverage labels
      if (score < 0.65) return false;
      
      // Check for exact matches only
      return BEVERAGE_LABELS.some(beverageLabel => {
        const normalizedLabel = beverageLabel.toLowerCase();
        // Exact match or label contains the beverage type
        return label === normalizedLabel || 
               label.includes(normalizedLabel) || 
               normalizedLabel.includes(label);
      });
    });
    
    console.log('Detection results:', results);
    console.log('Beverages found:', beverages);
    
    // Additional validation: must find at least one beverage with high confidence
    const validBeverages = beverages.filter((b: any) => b.score >= 0.7);
    
    return {
      detected: validBeverages.length > 0,
      count: validBeverages.length,
      labels: validBeverages.map((b: any) => b.label)
    };
  } catch (error) {
    console.error('Error detecting beverage:', error);
    throw error;
  }
};
