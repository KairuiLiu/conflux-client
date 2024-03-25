import React, { createContext, useState } from 'react';

interface StateType {
  count: number;
}

const initialState: StateType = {
  count: 0,
};

export const Context = createContext<{
  state: StateType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}>({
  state: initialState,
  setState: () => null,
});

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState(initialState);

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};
