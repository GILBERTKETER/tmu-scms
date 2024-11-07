import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    if (colorMode === "dark") {
      bodyClass.add(className);
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      bodyClass.remove(className);
      document.body.removeAttribute('arco-theme');
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
