import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface StateType {
  user: UserInfo;
}

interface ContextProviderProps {
  children: React.ReactNode;
}

function getInitialState(): StateType {
  const localStorageState = localStorage.getItem('state');
  if (localStorageState) return JSON.parse(localStorageState);

  const uuid = uuidv4();
  return {
    user: {
      uuid: uuid,
      avatar: null,
      name: `User_${uuid.slice(0, 8)}`,
      autoEnableCamera: false,
      defaultCamera: null,
      autoEnableMic: false,
      defaultMic: null,
      autoEnableSpeaker: true,
      defaultSpeaker: null,
    },
  };
}

const initialState: StateType = getInitialState();

export const Context = createContext<{
  state: StateType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}>({
  state: initialState,
  setState: () => null,
});

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};
