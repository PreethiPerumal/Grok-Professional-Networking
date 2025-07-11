declare module 'react-link-preview' {
  import { ComponentType } from 'react';
  
  interface LinkPreviewProps {
    url: string;
    className?: string;
    style?: React.CSSProperties;
  }
  
  const ReactLinkPreview: ComponentType<LinkPreviewProps>;
  export default ReactLinkPreview;
} 