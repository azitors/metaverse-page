import { useUnityContext } from 'react-unity-webgl';

export const useAzitoUnity = () => {
  const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } =
    useUnityContext({
      loaderUrl: 'unity/Unity.loader.js',
      dataUrl: 'unity/Unity.data',
      frameworkUrl: 'unity/Unity.framework.js',
      codeUrl: 'unity/Unity.wasm',
    });

  return { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded };
};
