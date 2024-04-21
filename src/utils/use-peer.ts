import { useEffect, useState, useCallback } from 'react';
import Peer, { DataConnection, MediaConnection, PeerOptions } from 'peerjs';
import useMeetingStore from '@/context/meeting-context';
import { v4 } from 'uuid';
import useGlobalStore from '@/context/global-context';
import { PeerStreamMetadataExchange } from '@/types/meeting';
import {
  fakeAudioTrack,
  fakeCameraTrack,
  fakeScreenVideoTrack,
  fakeScreenAudioTrack,
  localStream,
} from './empty-stream';

let audioTrack = fakeAudioTrack;
let videoTrack = fakeCameraTrack;
let screenTrack = fakeScreenVideoTrack;
const screenAudioTrack = fakeScreenAudioTrack;

console.log('###########Fake audioTrack', audioTrack.id);
console.log('###########Fake videoTrack', videoTrack.id);
console.log('###########Fake screenTrack', screenTrack.id);
console.log('###########Fake screenAudioTrack', screenAudioTrack.id);

const connIdMap = new Map<
  string,
  {
    data?: string;
    media?: string;
  }
>();

const metaData = {
  camStream: [] as string[],
  audioStream: [] as string[],
  screenStream: [] as string[],
};

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

  const updateMetaData = useCallback((peer: Peer) => {
    if (!peer) return;
    const meetingContext = useMeetingStore.getState();

    const oldAudioStreamTrack = audioTrack;
    const newAudioStreamTrack =
      meetingContext.selfState.audioStream?.getTracks()[0];
    if (newAudioStreamTrack && newAudioStreamTrack !== oldAudioStreamTrack) {
      localStream.removeTrack(oldAudioStreamTrack);
      localStream.addTrack(newAudioStreamTrack);
      audioTrack = newAudioStreamTrack;
      metaData.audioStream = [newAudioStreamTrack.id];
      console.log(
        '###########Replace audio track from',
        oldAudioStreamTrack.id,
        'to',
        audioTrack.id
      );
    }

    const oldVideoStreamTrack = videoTrack;
    const newVideoStreamTrack =
      meetingContext.selfState.camStream?.getTracks()[0];
    if (newVideoStreamTrack && newVideoStreamTrack !== oldVideoStreamTrack) {
      localStream.removeTrack(oldVideoStreamTrack);
      localStream.addTrack(newVideoStreamTrack);
      videoTrack = newVideoStreamTrack;
      metaData.camStream = [newVideoStreamTrack.id];
      console.log(
        '###########Replace camera track from',
        oldVideoStreamTrack.id,
        'to',
        videoTrack.id
      );
    }

    const oldScreenStreamTrack = screenTrack;
    const newScreenStreamTrack =
      meetingContext.selfState.screenStream?.getTracks()[0];
    if (newScreenStreamTrack && newScreenStreamTrack !== oldScreenStreamTrack) {
      localStream.removeTrack(oldScreenStreamTrack);
      localStream.addTrack(newScreenStreamTrack);
      screenTrack = newScreenStreamTrack;
      metaData.screenStream = [newScreenStreamTrack.id];
      console.log(
        '###########Replace screen track from',
        oldScreenStreamTrack.id,
        'to',
        screenTrack.id
      );
    }

    peer &&
      connIdMap.forEach((connIds, muid) => {
        console.log('###########Find Connection ', muid, connIds);
        const dataConnectionId = connIds?.data;
        if (dataConnectionId) {
          const dataConnection = peer.getConnection(
            muid,
            dataConnectionId
          ) as DataConnection;
          if (dataConnection)
            console.log(
              '###########Send metadata to ',
              dataConnection.peer,
              metaData
            );
          dataConnection &&
            dataConnection?.send({
              id: meetingContext.selfState.muid,
              metadata: metaData,
            });
        }

        const mediaConnectionId = connIds?.media;
        if (mediaConnectionId) {
          const mediaConnection = peer.getConnection(
            muid,
            mediaConnectionId
          ) as MediaConnection;
          mediaConnection &&
            mediaConnection.peerConnection.getSenders().forEach((sender) => {
              if (
                sender.track?.id === oldAudioStreamTrack.id &&
                oldAudioStreamTrack.id !== audioTrack.id
              ) {
                sender.replaceTrack(audioTrack);
              }
              if (
                sender.track?.id === oldVideoStreamTrack.id &&
                oldVideoStreamTrack.id !== videoTrack.id
              ) {
                sender.replaceTrack(videoTrack);
              }
              if (
                sender.track?.id === oldScreenStreamTrack.id &&
                oldScreenStreamTrack.id !== screenTrack.id
              ) {
                sender.replaceTrack(screenTrack);
              }
            });
        }
      });
  }, []);

  const handleOnStream = useCallback(
    (call: MediaConnection, stream: MediaStream) => {
      console.log('###########Stream received');
      stream.getTracks().forEach((track) => {
        console.log('###########Track', track);
      });
      const meetingContext = useMeetingStore.getState();
      const newMeetingStream = new Map(meetingContext.meetingStream);
      const oldStream = newMeetingStream.get(call.peer);
      newMeetingStream.set(call.peer, {
        stream,
        metadata: oldStream?.metadata,
      });
      setMeetingStream(newMeetingStream);
    },
    [setMeetingStream]
  );

  const handleOnData = useCallback(
    (data: PeerStreamMetadataExchange) => {
      const metadata = data.metadata;
      const id = data.id;
      console.log('###########Data received', metadata);
      const meetingContext = useMeetingStore.getState();
      const newMeetingStream = new Map(meetingContext.meetingStream);
      const oldStream = newMeetingStream.get(id);
      newMeetingStream.set(id, {
        stream: oldStream?.stream,
        metadata,
      });
      setMeetingStream(newMeetingStream);
    },
    [setMeetingStream]
  );

  // create peer and process oncall event
  useEffect(() => {
    const muid = v4();
    setSelfState.setMuid(muid);

    const newPeer = new Peer(muid, getPeerConfig(globalState));
    setPeer(newPeer);

    newPeer.on('open', () => {});

    newPeer.on('connection', (call) => {
      call.on('open', () => {
        // receive metadata
        call.on('data', (data) => {
          handleOnData(data as PeerStreamMetadataExchange);
        });
        // send metadata
        const metaExchange = {
          id: muid,
          metadata: metaData,
        };
        console.log('###########Send metadata', metaExchange);
        call.send(metaExchange);
        // save connection id
        if (!connIdMap.has(call.peer)) connIdMap.set(call.peer, {});
        const connId = connIdMap.get(call.peer);
        connIdMap.set(call.peer, {
          ...connId,
          data: call.connectionId,
        });
      });
    });

    newPeer.on('call', (call) => {
      console.log('###########sending media to ', call.connectionId!);
      localStream.getTracks().forEach((track) => {
        console.log('###########Track', track);
      });
      call.answer(localStream);
      // receive stream
      call.on('stream', (stream) => {
        handleOnStream(call, stream);
      });

      // save connection id
      if (!connIdMap.has(call.peer)) connIdMap.set(call.peer, {});
      const connId = connIdMap.get(call.peer);
      connIdMap.set(call.peer, {
        ...connId,
        media: call.connectionId,
      });
    });

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, [
    setMeetingStream,
    setSelfState,
    globalState,
    handleOnData,
    handleOnStream,
  ]);

  // if peer is ready, connect to all participants
  useEffect(() => {
    if (!peer?.open || !selfState.muid || tryConnected) return;
    setTryConnected(true);
    meetingState.participants.forEach((p) => {
      if (p.muid === selfState.muid) return;

      const dataConnect = peer.connect(p.muid!);
      dataConnect.on('open', () => {
        dataConnect.on('data', (data) => {
          handleOnData(data as PeerStreamMetadataExchange);
        });
        console.log('###########send metadata', metaData);
        dataConnect.send({
          id: selfState.muid,
          metadata: metaData,
        });
      });

      console.log('###########sending media to ', p.muid!);
      localStream.getTracks().forEach((track) => {
        console.log('###########Track', track);
      });
      const mediaConnect = peer.call(p.muid!, localStream);
      mediaConnect.on('stream', (stream) => {
        handleOnStream(mediaConnect, stream);
      });

      connIdMap.set(p.muid!, {
        data: dataConnect.connectionId,
        media: mediaConnect.connectionId,
      });
    });
  }, [
    peer?.open,
    peer,
    handleOnData,
    handleOnStream,
    selfState.muid,
    tryConnected,
    meetingState.participants,
  ]);

  // someone exit, remove stream
  useEffect(() => {
    if (!peer) return;

    const streamMuids = new Set(meetingStream.keys());
    const participantMuids = new Set(
      meetingState.participants.map((p) => p.muid)
    );

    streamMuids.forEach((muid) => {
      if (!participantMuids.has(muid)) {
        console.log('[PEER] close connect: ', muid);
        const newMeetingStream = new Map(meetingStream);
        newMeetingStream.delete(muid);
        setMeetingStream(newMeetingStream);
      }
      if (connIdMap.has(muid)) {
        connIdMap.delete(muid);
      }
    });
  }, [peer, meetingState.participants, setMeetingStream]);

  // on self change, boardcast participants
  useEffect(() => {
    if (!peer || !selfState.muid) return;
    updateMetaData(peer);
  }, [selfState, peer]);
};

export default usePeer;
