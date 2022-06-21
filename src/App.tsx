import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "unity/build.loader.js",
    dataUrl: "unity/build.data",
    frameworkUrl: "unity/build.framework.js",
    codeUrl: "unity/build.wasm",
  });

  return (
    <Unity unityProvider={unityProvider} />
  )
}

export default App
