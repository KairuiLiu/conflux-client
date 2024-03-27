import React, { createContext, useEffect, useState } from 'react';
import { initState } from './init-state';
import { initListener } from './init-listener';

interface ContextProviderProps {
  children: React.ReactNode;
}

const globalState: StateType = initState();

export const Context = createContext<{
  state: StateType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}>({
  state: globalState,
  setState: () => null,
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState(globalState);
  useEffect(() => {
    initListener(setState);
  }, []);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};
