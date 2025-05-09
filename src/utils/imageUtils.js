// Utility for optimizing images (base64)
export const optimizeImageIfPossible = async (base64Image) => {
  try {
    if (!document.createElement('canvas').getContext) {
      return base64Image;
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_WIDTH) {
          height = Math.round(height * MAX_WIDTH / width);
          width = MAX_WIDTH;
        } else if (height > MAX_HEIGHT) {
          width = Math.round(width * MAX_HEIGHT / height);
          height = MAX_HEIGHT;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedImage = canvas.toDataURL('image/jpeg', 0.7);
        if (optimizedImage.length < base64Image.length) {
          resolve(optimizedImage);
        } else {
          resolve(base64Image);
        }
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  } catch (err) {
    return base64Image;
  }
};
