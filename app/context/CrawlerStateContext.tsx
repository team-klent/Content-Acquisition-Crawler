'use client';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { CrawlerSource } from '../(main)/_components/utils';

interface ICrawlerStateContext {
  selection: CrawlerSource | null;
  setSelection: Dispatch<SetStateAction<CrawlerSource | null>>;
}

const stateInitialValue: ICrawlerStateContext = {
  selection: {
    id: '',
    source: '',
    script: '',
    status: '',
    type: '',
  },
  setSelection: () => {},
};

const CrawlerStateContext = createContext<ICrawlerStateContext | undefined>(
  stateInitialValue
);

const useCrawlerStateContext = (): ICrawlerStateContext => {
  const context = useContext(CrawlerStateContext);
  if (context === undefined) {
    throw new Error(
      'useCrawlerStateContext must be used within its StateProvider'
    );
  }
  return context;
};

const CrawlerStateProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selection, setSelection] = useState<CrawlerSource | null>(null);

  return (
    <CrawlerStateContext.Provider value={{ selection, setSelection }}>
      {children}
    </CrawlerStateContext.Provider>
  );
};

export { CrawlerStateProvider, useCrawlerStateContext };
