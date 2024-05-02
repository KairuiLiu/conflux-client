/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useGlobalStore from '@/context/global-context';
import useMeetingStore from '@/context/meeting-context';
import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import toastConfig from '../utils/toast-config';

const timeStampPool = new Map<string, number>();

export const socket = io('', {
  autoConnect: false,
});

export function useSocketListener<Msg extends ServerKeys>(
  msg: Msg,
  callback: (data: ExtractCbDataType<ServerToClientEvents[Msg]>) => void,
  totalOrder: boolean = false,
  k: string = msg
) {
  const stableCallback = useCallback(callback, []);

  useEffect(() => {
    socket.disconnected && socket.connect();
    console.log(`[WS-LISTENING] ${msg}}`);
    const cb = (data: any) => {
      console.log(`[WS-REV] ${msg}`, data);
      const { time, message } = data;
      if (totalOrder) {
        if (timeStampPool.has(k) && timeStampPool.get(k)! > time) {
          console.log(`[WS-PASS] ${k} ${data}`);
        }
        timeStampPool.set(k, time);
      }
      if (message && message !== 'SUCCESS') toast.info(message, toastConfig);
      return stableCallback(data);
    };
    socket.on(msg, cb as any);

    return () => {
      console.log(`[WS-STOPING] ${msg}`);
      socket.off(msg, cb as any);
    };
  }, [msg, stableCallback, totalOrder]);
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
