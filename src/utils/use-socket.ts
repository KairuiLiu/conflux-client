/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useGlobalStore from '@/context/global-context';
import useMeetingStore from '@/context/meeting-context';
import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export const socket = io('', {
  autoConnect: false,
});

export function useSocketListener<Msg extends ServerKeys>(
  msg: Msg,
  callback: (data: ExtractCbDataType<ServerToClientEvents[Msg]>) => void
) {
  const stableCallback = useCallback(callback, []);

  useEffect(() => {
    socket.disconnected && socket.connect();
    const cb = (data: any) => {
      console.log(`REV [${msg}]`, data);
      return stableCallback(data);
    };
    socket.on(msg, cb as any);

    return () => {
      socket.off(msg, stableCallback as any);
    };
  }, [msg, stableCallback]);
}

export function useSyncSocket<Msg extends ClientKeys>(
  msg: Msg,
  data: ExtractCbDataType<ClientToServerEvents[Msg]> | {} = {},
  dep: any = data,
  ready: (
    data: ExtractCbDataType<ClientToServerEvents[Msg]> | {}
  ) => boolean = () => true
) {
  useEffect(() => {
    ready(data) && emitSocket(msg, data);
  }, [JSON.stringify(dep)]);
}

export function emitSocket<Msg extends ClientKeys>(
  msg: Msg,
  data: ExtractCbDataType<ClientToServerEvents[Msg]> | {} = {}
) {
  const globalContext = useGlobalStore.getState();
  const meetingContext = useMeetingStore.getState();

  console.log(`SEND [${msg}]`, {
    ...data,
    token: globalContext.siteConfig.token,
    room_id: meetingContext.meetingState.id,
  });

  socket.disconnected && socket.connect();
  socket.emit(msg, {
    ...data,
    token: globalContext.siteConfig.token,
    room_id: meetingContext.meetingState.id,
  });
}
