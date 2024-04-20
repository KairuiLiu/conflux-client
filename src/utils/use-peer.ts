import { useEffect, useState, useCallback } from 'react';
import Peer, { DataConnection, MediaConnection, PeerOptions } from 'peerjs';
import useMeetingStore from '@/context/meeting-context';
import { v4 } from 'uuid';
import useGlobalStore from '@/context/global-context';
import { PeerStreamMetadataExchange } from '@/types/meeting';

const connIdMap = new Map<
  string,
  {
    data?: string;
    media?: string;
  }
>();

const localStream = new MediaStream();
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
    debug: 3,
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

  function updateMetaData() {
    const meetingContext = useMeetingStore.getState();
    localStream.getTracks().forEach((track) => {
      localStream.removeTrack(track);
    });

    metaData.camStream = [];
    metaData.audioStream = [];
    metaData.screenStream = [];

    meetingContext.selfState.audioStream?.getTracks()?.forEach((track) => {
      localStream.addTrack(track);
      metaData.audioStream.push(track.id);
    });
    meetingContext.selfState.camStream?.getTracks()?.forEach((track) => {
      localStream.addTrack(track);
      metaData.camStream.push(track.id);
    });
    meetingContext.selfState.screenStream?.getTracks()?.forEach((track) => {
      localStream.addTrack(track);
      metaData.screenStream.push(track.id);
    });
  }

  const handleOnStream = useCallback(
    (call: MediaConnection, stream: MediaStream) => {
      console.log('###########Stream received1', stream);
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
      console.log('###########Data received2', metadata);
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

    newPeer.on('open', (id) => {
      console.log('###########Peer open3', id);
    });

    newPeer.on('connection', (call) => {
      call.on('open', () => {
        // receive metadata
        console.log('###########On connection4', call);
        call.on('data', (data) => {
          handleOnData(data as PeerStreamMetadataExchange);
        });
        // send metadata
        const metaExchange = {
          id: muid,
          metadata: metaData,
        };
        console.log('###########Send metadata5', metaExchange);
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
      console.log('###########On call6', call);
      console.log('###########Answering stream8', localStream);
      debugger
      call.answer(localStream);
      // receive stream
      call.on('stream', (stream) => {
        debugger;
        console.log('###########Stream received7', stream);
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
    if (!peer?.open || !selfState.muid) return;
    setTimeout(()=>{
      meetingState.participants.forEach((p) => {
        if (p.muid === selfState.muid) return;
        const dataConnect = peer.connect(p.muid!);
        console.log('###########Connecting to12', p.muid!);
        debugger
        const mediaConnect = peer.call(p.muid!, localStream);

        dataConnect.on('open', () => {
          console.log('###########Data connection open9', dataConnect);
          dataConnect.on('data', (data) => {
            handleOnData(data as PeerStreamMetadataExchange);
          });
          console.log('###########send metadata10', metaData);
          dataConnect.send({
            id: selfState.muid,
            metadata: metaData,
          });
        });

        mediaConnect.on('stream', (stream) => {
          debugger;
          console.log('###########Stream received11', mediaConnect);
          handleOnStream(mediaConnect, stream);
        });

        connIdMap.set(p.muid!, {
          data: dataConnect.connectionId,
          media: mediaConnect.connectionId,
        });
      });
    },5000)
  }, [peer?.open, peer, handleOnData, handleOnStream, selfState.muid]);

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
    updateMetaData();
    connIdMap.forEach((connIds) => {
      const dataConnectionId = connIds?.data;
      if (!dataConnectionId) return;
      const dataConnection = peer.getConnection(
        peer.id,
        dataConnectionId
      ) as DataConnection;
      dataConnection?.send({ id: selfState.muid, metadata: metaData });
    });
  }, [selfState, peer]);
};

export default usePeer;
