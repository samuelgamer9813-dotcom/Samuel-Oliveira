
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { swapClothing } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { ArrowRightIcon, SparklesIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModelImageUpload = useCallback(async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setModelImage(base64);
      setResultImage(null);
    } catch (err) {
      setError('Failed to read model image.');
    }
  }, []);

  const handleClothingImageUpload = useCallback(async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setClothingImage(base64);
      setResultImage(null);
    } catch (err) {
      setError('Failed to read clothing image.');
    }
  }, []);

  const handleSwap = useCallback(async () => {
    if (!modelImage || !clothingImage) {
      setError('Please upload both a model and a clothing image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const modelImageRaw = modelImage.split(',')[1];
      const clothingImageRaw = clothingImage.split(',')[1];

      const generatedImage = await swapClothing(modelImageRaw, clothingImageRaw);
      setResultImage(`data:image/png;base64,${generatedImage}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, clothingImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Clothing Swap
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Upload a model and a clothing item to see the magic happen.
          </p>
        </header>

        <main className="flex flex-col items-center gap-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <ImageUploader
              id="model-uploader"
              title="Model Image"
              onImageUpload={handleModelImageUpload}
              imageUrl={modelImage}
            />
            <ImageUploader
              id="clothing-uploader"
              title="Clothing Image"
              onImageUpload={handleClothingImageUpload}
              imageUrl={clothingImage}
            />
          </div>

          <button
            onClick={handleSwap}
            disabled={!modelImage || !clothingImage || isLoading}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-800 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute -inset-0.5 -z-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-all duration-200"></span>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon />
                Swap Clothing
              </>
            )}
          </button>

          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}

          <div className="w-full max-w-4xl mt-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-300">Result</h2>
            <div className="relative w-full aspect-square bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
              {isLoading && (
                <div className="flex flex-col items-center text-gray-400">
                    <svg className="animate-spin h-10 w-10 text-pink-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AI is working its magic...</span>
                </div>
              )}
              {!isLoading && resultImage && (
                <img src={resultImage} alt="Generated result" className="object-contain w-full h-full" />
              )}
              {!isLoading && !resultImage && (
                <div className="text-center text-gray-500">
                  <p>Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
