import { useState, useEffect, useCallback } from 'react';
import { profileApi } from '../components/profile/api';
import type { Profile, ProfileImageUpload } from '../types';

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadImage: (file: File) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Check if we should fetch from cache or server
  const shouldFetchFromServer = useCallback(() => {
    return !profile || Date.now() - lastFetch > CACHE_DURATION;
  }, [profile, lastFetch]);

  // Fetch profile data
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && !shouldFetchFromServer()) {
      return; // Use cached data
    }

    setLoading(true);
    setError(null);

    try {
      const data = await profileApi.getProfile();
      setProfile(data);
      setLastFetch(Date.now());
      
      // Cache in localStorage for offline support
      localStorage.setItem('cachedProfile', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      
      // Try to load from cache if network fails
      const cached = localStorage.getItem('cachedProfile');
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setProfile(data);
            setError('Using cached data (offline mode)');
          }
        } catch (cacheErr) {
          console.error('Failed to load cached profile:', cacheErr);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [shouldFetchFromServer]);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    if (!profile) {
      setError('No profile data available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await profileApi.updateProfile(data);
      setProfile(updatedProfile);
      setLastFetch(Date.now());
      
      // Update cache
      localStorage.setItem('cachedProfile', JSON.stringify({
        data: updatedProfile,
        timestamp: Date.now()
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Upload profile image
  const uploadImage = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      // Validate file first
      const validation = profileApi.validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      const result: ProfileImageUpload = await profileApi.uploadProfileImage(file);
      
      // Update profile with new image URL
      if (profile) {
        const updatedProfile = { ...profile, image_url: result.image_url };
        setProfile(updatedProfile);
        setLastFetch(Date.now());
        
        // Update cache
        localStorage.setItem('cachedProfile', JSON.stringify({
          data: updatedProfile,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Refresh profile (force fetch from server)
  const refreshProfile = useCallback(async () => {
    await fetchProfile(true);
  }, [fetchProfile]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (error?.includes('offline')) {
        clearError();
        fetchProfile(true); // Refresh when back online
      }
    };

    const handleOffline = () => {
      setError('Network connection lost. Using cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, clearError, fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadImage,
    refreshProfile,
    clearError,
  };
}; 