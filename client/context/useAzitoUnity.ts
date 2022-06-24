import { useUnityContext } from "react-unity-webgl";

export const useAzitoUnity = () => {
  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "unity/build.loader.js",
    dataUrl: "unity/build.data",
    frameworkUrl: "unity/build.framework.js",
    codeUrl: "unity/build.wasm",
  });

  return { unityProvider, sendMessage };
};
