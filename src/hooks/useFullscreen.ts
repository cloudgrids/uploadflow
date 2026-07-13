import { useEffect, useRef, useState } from 'react';

export function useFullscreen<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const root = elementRef.current?.getRootNode();
    const handleFullscreenChange = () => {
      const fullscreenElement = root instanceof ShadowRoot ? root.fullscreenElement : document.fullscreenElement;
      setIsFullscreen(fullscreenElement === elementRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    if (root instanceof ShadowRoot) root.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (root instanceof ShadowRoot) root.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await elementRef.current?.requestFullscreen();
  };

  return { elementRef, isFullscreen, toggleFullscreen };
}
