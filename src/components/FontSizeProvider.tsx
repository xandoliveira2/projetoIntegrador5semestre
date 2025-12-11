import { createContext, ReactNode, useContext, useState } from "react";

interface FontSizeContextProps {
  fontSize: number;
  increase: () => void;
  decrease: () => void;
  setMinMax: (min: number, max: number) => void;
}

const FontSizeContext = createContext<FontSizeContextProps | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState(16);

  // limites padrões
  const [minSize, setMinSize] = useState(16);
  const [maxSize, setMaxSize] = useState(32);

  const increase = () => {
    setFontSize((prev) => {
      const novo = prev + 1;
      return novo > maxSize ? maxSize : novo;     // 🔥 nunca passa do máximo
    });
  };

  const decrease = () => {
    setFontSize((prev) => {
      const novo = prev - 1;
      return novo < minSize ? minSize : novo;     // 🔥 nunca passa do mínimo
    });
  };

  const setMinMax = (min: number, max: number) => {
    setMinSize(min);
    setMaxSize(max);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, increase, decrease, setMinMax }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }
  return context;
};
