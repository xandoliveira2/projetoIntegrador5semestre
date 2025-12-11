// components/FontSizeProvider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface FontSizeContextType {
  fontSize: number;
  increase: () => void;
  decrease: () => void;
  setBounds: (min: number, max: number) => void;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 18,
  increase: () => {},
  decrease: () => {},
  setBounds: () => {},
});

export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<number>(18);

  // limites globais dinâmicos (podem ser ajustados pela tela)
  const [minSize, setMinSize] = useState<number>(12);
  const [maxSize, setMaxSize] = useState<number>(32);
  const STEP = 2;

  // Carregar do AsyncStorage ao iniciar
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@fontSize");
        if (saved) {
          const n = Number(saved);
          // aplica clamp ao carregar
          setFontSize(Math.min(maxSize, Math.max(minSize, n)));
        }
      } catch (e) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // só rodar uma vez

  // Salvar sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem("@fontSize", String(fontSize));
  }, [fontSize]);

  // atualiza bounds dinamicamente (a tela chamará isso)
  const setBounds = (min: number, max: number) => {
    // garante ordem correta
    const safeMin = Math.min(min, max);
    const safeMax = Math.max(min, max);

    setMinSize(safeMin);
    setMaxSize(safeMax);

    // se o fontSize atual estiver fora dos novos bounds, ajusta-o imediatamente
    setFontSize((prev) => {
      const clamped = Math.min(safeMax, Math.max(safeMin, prev));
      return clamped;
    });
  };

  const increase = () => {
    setFontSize((prev) => {
      const next = Math.min(maxSize, prev + STEP);
      if (next === prev) return prev; // evita render desnecessário
      return next;
    });
  };

  const decrease = () => {
    setFontSize((prev) => {
      const next = Math.max(minSize, prev - STEP);
      if (next === prev) return prev;
      return next;
    });
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, increase, decrease, setBounds }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export function useFontSize() {
  return useContext(FontSizeContext);
}
