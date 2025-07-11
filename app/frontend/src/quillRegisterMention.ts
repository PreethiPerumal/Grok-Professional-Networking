// Register quill-mention module properly
import { Quill } from 'react-quill';

// Track registration to avoid double registration
let isRegistered = false;

export const registerQuillMention = () => {
  if (isRegistered) return;
  
  try {
    // Register the module if Quill is available
    if (typeof Quill !== 'undefined' && Quill) {
      // For now, we'll skip the mention module to avoid import issues
      // The basic quill editor will still work without mentions
      console.log('Quill editor ready (mention module skipped for now)');
      isRegistered = true;
      
      // TODO: Add mention functionality back when module loading is resolved
      // The quill-mention module has browser environment dependencies
      // that cause issues with Vite's module resolution
      // 
      // To add mentions back:
      // 1. Ensure quill-mention is properly installed
      // 2. Use dynamic import with proper error handling
      // 3. Register the module only after successful import
      // 
      // Example:
      // import('quill-mention').then((QuillMention) => {
      //   Quill.register('modules/mention', QuillMention);
      //   console.log('Mention module registered successfully');
      // }).catch((error) => {
      //   console.warn('Mention module not available:', error);
      // });
    }
  } catch (error) {
    console.error('Failed to register quill modules:', error);
  }
};

// Auto-register when this module is imported
registerQuillMention(); 