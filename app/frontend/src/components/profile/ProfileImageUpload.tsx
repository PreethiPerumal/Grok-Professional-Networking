import React, { useState, useRef, useCallback } from 'react';
import { profileApi } from './api';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onImageUpload,
  loading = false,
  error = null,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    // Clear previous errors
    setValidationError(null);

    // Validate file
    const validation = profileApi.validateImageFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    onImageUpload(file);
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        
        {/* Current Image Display */}
        {(currentImageUrl || preview) && (
          <div className="mb-4">
            <img
              src={preview || getImageUrl(currentImageUrl!)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200 shadow-lg"
            />
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileInput}
            className="hidden"
            disabled={loading}
          />

          <div className="space-y-2">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <div className="text-sm text-gray-600">
              <button
                type="button"
                onClick={openFileDialog}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Click to upload
              </button>
              {' '}or drag and drop
            </div>
            
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 5MB
            </p>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  {error || validationError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {!loading && !error && !validationError && preview && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  Image uploaded successfully!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 