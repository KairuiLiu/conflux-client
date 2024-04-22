import { PeerStream } from '@/types/meeting';
import { useEffect, useState } from 'react';
import Peer, { MediaConnection, PeerOptions } from 'peerjs';
import useMeetingStore from '@/context/meeting-context';
import { v4 } from 'uuid';
import useGlobalStore from '@/context/global-context';
import { createEmptyAudioTrack, createEmptyVideoTrack } from './empty-stream';
import { usePeerStateReport } from './peer-state-report';

let fakeVidioTrack: MediaStreamTrack | null = null;
let fakeAudioTrack: MediaStreamTrack | null = null;
let fakeScreenVideoTrack: MediaStreamTrack | null = null;
let fakeScreenAudioTrack: MediaStreamTrack | null = null;

let audioTrack: MediaStreamTrack | null = null;
let videoTrack: MediaStreamTrack | null = null;
let screenVideoTrack: MediaStreamTrack | null = null;
let screenAudioTrack: MediaStreamTrack | null = null;

let mediaStream: MediaStream | null = null;
let screenStream: MediaStream | null = null;

/**
 * Peerjs is not a good choice for this project,
 * 1. can not call / answer with an enpty stream. so we have to use a fake stream
 * 2. will change metadata of stream. (change id, label to new random string). so other peer can not get the stream by id, and we can not send meta data to help identify the stream
 * 3. can not call same peer twice (firefox not support). so, we have to let new peer call the old peer, and make old peer call new peer
 * 4. really hard to send metadata. (call() can send metadata, but answer() can not get metadata), so you need a dataconnection to send metadata. and have to set more callbacks to handle the metadata
 */

/**
 * two way connection
 * B join the meeting:
 * B -call_screen-> A -answer_screen-> B
 * A -call_camera-> B -answer_camera-> A
 */

/**
 * connection info map
 * MeetingContext.meetingStream: muid -> PeerStream {mediaStream, screenStream}
 * connIdMap: muid -> {mediaStream, screenStream}
 */

// TODO: duplicate and self connection

export const connIdMap = new Map<
  string,
  {
    mediaStream?: string;
    screenStream?: string;
  }
>();

function getPeerConfig(globalState: StateType): PeerOptions {
  const port = +window.location.port;

  const config = {
    host: window.location.hostname,
    path: '/api' + globalState.siteConfig.PEER_SERVER_PATH,
    config: {
      iceServers: [
        {
          url: `stun:${window.location.hostname}`,
        },
        {
          url: `turn:${globalState.siteConfig.COTURN_PREFIX ? globalState.siteConfig.COTURN_PREFIX + '.' : ''}${window.location.hostname}`,
          username: globalState.siteConfig.COTURN_USERNAME,
          credential: globalState.siteConfig.COTURN_PASSWORD,
        },
      ],
    },
  } as PeerOptions;

  if (port) config.port = port;

  return config;
}

const updateMediaStream = (peer: Peer) => {
  if (!peer) return;
  const meetingContext = useMeetingStore.getState();

  const oldAudioStreamTrack = audioTrack;
  const newAudioStreamTrack =
    meetingContext.selfState.audioStream?.getTracks()[0] || fakeAudioTrack!;
  if (newAudioStreamTrack !== oldAudioStreamTrack) {
    mediaStream!.removeTrack(oldAudioStreamTrack!);
    mediaStream!.addTrack(newAudioStreamTrack);
    audioTrack = newAudioStreamTrack;
  }

  const oldVideoStreamTrack = videoTrack;
  const newVideoStreamTrack =
    meetingContext.selfState.camStream?.getTracks()[0] || fakeVidioTrack!;
  if (newVideoStreamTrack !== oldVideoStreamTrack) {
    mediaStream!.removeTrack(oldVideoStreamTrack!);
    mediaStream!.addTrack(newVideoStreamTrack);
    videoTrack = newVideoStreamTrack;
  }

  if (
    oldAudioStreamTrack !== newAudioStreamTrack ||
    oldVideoStreamTrack !== newVideoStreamTrack
  ) {
    peer &&
      connIdMap.forEach((connIds, muid) => {
        const mediaConnId = connIds?.mediaStream;
        if (!mediaConnId) return;
        const dataConnection = peer.getConnection(
          muid,
          mediaConnId
        ) as MediaConnection;
        dataConnection &&
          dataConnection.peerConnection.getSenders().forEach((sender) => {
            if (
              sender.track?.id === oldAudioStreamTrack!.id &&
              oldAudioStreamTrack!.id !== audioTrack!.id
            )
              sender.replaceTrack(audioTrack);
            if (
              sender.track?.id === oldVideoStreamTrack!.id &&
              oldVideoStreamTrack!.id !== videoTrack!.id
            )
              sender.replaceTrack(videoTrack);
          });
      });
  }
};

const updateScreenStream = (peer: Peer) => {
  if (!peer) return;
  const meetingContext = useMeetingStore.getState();

  const oldScreenVideoTrack = screenVideoTrack;
  const newScreenVideoTrack =
    meetingContext.selfState.screenStream?.getVideoTracks()[0] ||
    fakeScreenVideoTrack;
  const oldScreenAudioTrack = screenAudioTrack;
  const newScreenAudioTrack =
    meetingContext.selfState.screenStream?.getAudioTracks()[0] ||
    fakeScreenAudioTrack;

  if (newScreenAudioTrack !== oldScreenAudioTrack) {
    screenStream!.removeTrack(oldScreenAudioTrack!);
    screenStream!.addTrack(newScreenAudioTrack!);
    screenAudioTrack = newScreenAudioTrack;
  }

  if (newScreenVideoTrack !== oldScreenVideoTrack) {
    screenStream!.removeTrack(oldScreenVideoTrack!);
    screenStream!.addTrack(newScreenVideoTrack!);
    screenVideoTrack = newScreenVideoTrack;
  }

  peer &&
    connIdMap.forEach((connIds, muid) => {
      const screenConnId = connIds?.screenStream;
      if (!screenConnId) return;
      const screenConnection = peer.getConnection(
        muid,
        screenConnId
      ) as MediaConnection;
      screenConnection &&
        screenConnection.peerConnection.getSenders().forEach((sender) => {
          if (
            sender.track?.id === oldScreenAudioTrack!.id &&
            oldScreenAudioTrack!.id !== newScreenAudioTrack!.id
          )
            sender.replaceTrack(newScreenAudioTrack);
          if (
            sender.track?.id === oldScreenVideoTrack!.id &&
            oldScreenVideoTrack!.id !== newScreenVideoTrack!.id
          )
            sender.replaceTrack(newScreenVideoTrack);
        });
    });
};

const initFakeStream = () => {
  fakeVidioTrack ??= createEmptyVideoTrack();
  fakeAudioTrack ??= createEmptyAudioTrack();
  fakeScreenVideoTrack ??= createEmptyVideoTrack();
  fakeScreenAudioTrack ??= createEmptyAudioTrack();

  audioTrack ??= fakeAudioTrack;
  videoTrack ??= fakeVidioTrack;
  screenAudioTrack ??= fakeScreenAudioTrack;
  screenVideoTrack ??= fakeScreenVideoTrack;

  mediaStream ??= new MediaStream([audioTrack, videoTrack]);
  screenStream ??= new MediaStream([screenAudioTrack, screenVideoTrack]);
};

const handleOnStream = (
  call: MediaConnection,
  stream: MediaStream,
  k: keyof PeerStream
) => {
  const { meetingStream, setMeetingStream } = useMeetingStore.getState();

  const newMeetingStream = new Map(meetingStream);
  const oldStreams = newMeetingStream.get(call.peer);

  newMeetingStream.set(call.peer, {
    ...oldStreams,
    [k]: stream,
  });

  setMeetingStream(newMeetingStream);
};

const usePeer = () => {
  const {
    selfState,
    meetingStream,
    setMeetingStream,
    setSelfState,
    meetingState,
  } = useMeetingStore();
  const [peer, setPeer] = useState<Peer | null>(null);
  const globalState = useGlobalStore();
  const [tryConnected, setTryConnected] = useState(false);
  usePeerStateReport(peer);

  // create peer and process oncall event
  useEffect(() => {
    if (peer) return;
    initFakeStream();
    const muid = v4();
    setSelfState.setMuid(muid);

    const newPeer = new Peer(muid, getPeerConfig(globalState));
    setPeer(newPeer);

    newPeer.on('open', () => {});

    newPeer.on('call', (call) => {
      const { type } = call.metadata;
      call.answer(type === 'screenStream' ? screenStream! : mediaStream!);
      call.on('stream', (stream) => {
        console.log(
          `[Peer] on receive ${type} stream from ${call.peer} to ${selfState.muid} @ ${call.connectionId}`
        );
        handleOnStream(call, stream, type);
      });

      // save connection id
      if (!connIdMap.has(call.peer)) connIdMap.set(call.peer, {});
      const connId = connIdMap.get(call.peer);
      connIdMap.set(call.peer, {
        ...connId,
        [type]: call.connectionId,
      });
    });

    return () => {
      if (newPeer) newPeer.destroy();
    };
  }, []);

  // Join a room, when peer is ready, connect to all participants for screenshare
  useEffect(() => {
    if (!peer?.open || !selfState.muid || tryConnected) return;
    setTryConnected(true);
    meetingState.participants.forEach((p) => {
      if (p.muid === selfState.muid) return;
      const mediaConnect = peer.call(p.muid!, mediaStream!, {
        metadata: { type: 'screenStream' },
      });
      console.log(
        `[Peer] calling media from ${selfState.muid} to ${p.muid} @ ${mediaConnect.connectionId}`
      );
      mediaConnect.on('stream', (stream) => {
        console.log(
          `[Peer] on receive screen stream from ${mediaConnect.peer} to ${selfState.muid} @ ${mediaConnect.connectionId}`
        );
        handleOnStream(mediaConnect, stream, 'screenStream');
      });
      if (!connIdMap.has(p.muid!)) connIdMap.set(p.muid!, {});
      connIdMap.set(p.muid!, {
        ...connIdMap.get(p.muid!),
        screenStream: mediaConnect.connectionId,
      });
    });
  }, [
    peer?.open,
    peer,
    selfState.muid,
    tryConnected,
    meetingState.participants,
  ]);

  // someone join the meeting, connect to him for media
  // someone leave the meeting, close the connection
  useEffect(() => {
    if (!peer || !selfState.muid || !tryConnected) return;

    const streamMuids = new Set(meetingStream.keys());
    const participantMuids = new Set(
      meetingState.participants.map((p) => p.muid)
    );

    streamMuids.forEach((muid) => {
      if (!participantMuids.has(muid)) {
        const newMeetingStream = new Map(meetingStream);
        newMeetingStream.delete(muid);
        setMeetingStream(newMeetingStream);
        if (connIdMap.has(muid)) connIdMap.delete(muid);
      }
    });

    participantMuids.forEach((muid) => {
      // find a new participant
      if (!muid || streamMuids.has(muid) || muid === selfState.muid) return;
      const mediaConnect = peer.call(muid, mediaStream!, {
        metadata: { type: 'mediaStream' },
      });
      console.log(
        `[Peer] calling media from ${selfState.muid} to ${muid} @ ${mediaConnect.connectionId}`
      );
      mediaConnect.on('stream', (stream) => {
        console.log(
          `[Peer] on receive media stream from ${mediaConnect.peer} to ${selfState.muid} @ ${mediaConnect.connectionId}`
        );
        handleOnStream(mediaConnect, stream, 'mediaStream');
      });
      if (!connIdMap.has(muid)) connIdMap.set(muid, {});
      connIdMap.set(muid, {
        ...connIdMap.get(muid),
        mediaStream: mediaConnect.connectionId,
      });
    });
  }, [
    peer,
    meetingState.participants,
    setMeetingStream,
    meetingStream,
    selfState.muid,
  ]);

  // on self change, boardcast participants
  useEffect(() => {
    if (!peer || !selfState.muid) return;
    updateMediaStream(peer);
  }, [selfState.camStream, selfState.audioStream, selfState.muid, peer]);

  useEffect(() => {
    if (!peer || !selfState.muid) return;
    updateScreenStream(peer);
  }, [selfState.screenStream, selfState.muid, peer]);
};

export default usePeer;
