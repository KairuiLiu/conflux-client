import { useContext } from 'react';
import { Context } from '@/context';

export default function Home() {
  const { state, setState } = useContext(Context);

  return (
    <div>
      <p className="p-4">{state.count}</p>
      <button
        onClick={() => {
          setState((currentState) => ({
            ...currentState,
            count: currentState.count + 1,
          }));
        }}
      >
        +1
      </button>
    </div>
  );
}
