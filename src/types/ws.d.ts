/* eslint-disable @typescript-eslint/ban-types */

interface SocketBase {
  token: string;
  room_id: string;
}

declare interface ClientDataType<T, D> {
  type: T;
  data: D;
  time: number;
  message?: string;
}

declare interface ServerDataType<T, D> {
  type: T;
  data: D;
  message?: string;
}

declare type ServerEventListenersCb<T, D> = (
  args: ServerDataType<T, D>
) => void;
declare type ClientEventListenersCb<T, D> = (
  args: ClientDataType<T, D & SocketBase>
) => void;

declare type ExtractCbDataType<F> = F extends (args: infer A) => void
  ? A
  : never;

declare interface ClientToServerEvents {
  JOIN_MEETING: ClientEventListenersCb<
    'JOIN_MEETING',
    {
      user_name: string;
      muid: string;
      avatar: string;
      state: ParticipantState;
      expandCamera: boolean;
      mirrorCamera: boolean;
    }
  >;
  LEAVE_MEETING: ClientEventListenersCb<'LEAVE_MEETING', {}>;
  FINISH_MEETING: ClientEventListenersCb<'FINISH_MEETING', {}>;
  UPDATE_USER_STATE: ClientEventListenersCb<'UPDATE_USER_STATE', Participant>;
  REMOVE_USER: ClientEventListenersCb<'REMOVE_USER', { muid: string }>;
  BOARDCAST_CHAT: ClientEventListenersCb<'BOARDCAST_CHAT',  Chat>;
  disconnect: ClientEventListenersCb<'disconnect', {}>;
}

declare interface ServerToClientEvents {
  RES_JOIN_MEETING: ServerEventListenersCb<'RES_JOIN_MEETING', MeetingState>;
  RES_LEAVE_MEETING: ServerEventListenersCb<'RES_LEAVE_MEETING', null>;
  RES_FINISH_MEETING: ServerEventListenersCb<'RES_FINISH_MEETING', null>;
  RES_UPDATE_USER_STATE: ServerEventListenersCb<'RES_UPDATE_USER_STATE', null>;
  RES_REMOVE_USER: ServerEventListenersCb<'RES_REMOVE_USER', null>;

  CHAT: ServerEventListenersCb<'CHAT',  Chat>;
  USER_UPDATE: ServerEventListenersCb<'USER_UPDATE', MeetingState>;
  FINISH_MEETING: ServerEventListenersCb<'FINISH_MEETING', null>;
  USER_STATE_UPDATE: ServerEventListenersCb<'USER_STATE_UPDATE', Participant>;
  disconnect: ServerEventListenersCb<'disconnect', null>;
}

type ClientKeys = keyof ClientToServerEvents;
type ServerKeys = keyof ServerToClientEvents;

declare type ClientRoomKeys =
  | 'JOIN_MEETING'
  | 'LEAVE_MEETING'
  | 'FINISH_MEETING'
  | 'disconnect';
declare type ClientMeetingKeys = 'UPDATE_USER_STATE' | 'REMOVE_USER' | 'BOARDCAST_CHAT';

declare type ControllerKeys = ClientRoomKeys | ClientMeetingKeys;

declare type Controllers<T extends keyof EToD, S, I> = {
  [K in T]: (
    args: K extends keyof ClientToServerEvents
      ? GetDataTypeOfEventName<K>
      : unknown,
    sc: S,
    io: I
  ) => Promise<
    addRESPrefix<K> extends keyof ClientToServerEvents
      ? ServerDataType<addRESPrefix<K>, GetDataTypeOfEventName<addRESPrefix<K>>>
      : void
  >;
};

declare interface InterServerEvents {}
declare type ServerType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>;
declare type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>;
