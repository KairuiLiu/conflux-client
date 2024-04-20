import { useRef, useEffect, useState } from 'react';
import Peer, { PeerOptions } from 'peerjs';
import useMeetingStore from '@/context/meeting-context';
import { v4 } from 'uuid';
import useGlobalStore from '@/context/global-context';

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

  if (port) config.port = +window.location.port;

  return config;
}

const usePeer = () => {
  const {
    meetingState,
    selfState,
    meetingStream,
    setMeetingStream,
    setSelfState,
  } = useMeetingStore();
  const [peer, setPeer] = useState<Peer | null>(null);
  const globalState = useGlobalStore();
  const selfStateRef = useRef(selfState);
  const meetingStreamRef = useRef(meetingStream);

  useEffect(() => {
    selfStateRef.current = selfState;
    meetingStreamRef.current = meetingStream;
  }, [selfState, meetingStream]);

  useEffect(() => {
    const muid = v4();
    setSelfState.setMuid(muid);

    const newPeer = new Peer(muid, getPeerConfig(globalState));
    setPeer(newPeer);

    newPeer.on('open', (id) => {
      console.log('peer open', id);
    });

    newPeer.on('call', (call) => {
      console.log('on call', call);
      const localStream = selfStateRef.current.camStream;
      call.answer(localStream ? localStream : undefined);
      call.on('stream', (stream) => {
        console.log('stream', stream);
        const newMeetingStream = new Map(meetingStreamRef.current);
        newMeetingStream.set(call.peer, { active: true, stream });
        setMeetingStream(newMeetingStream);
      });
    });

    return () => newPeer.destroy();
  }, [setMeetingStream, setSelfState]);

  useEffect(() => {
    if (!peer) return;

    const streamMuids = new Set(meetingStreamRef.current.keys());
    const participantMuids = new Set(
      meetingState.participants.map((p) => p.muid)
    );

    participantMuids.forEach((muid) => {
      if (
        muid &&
        !streamMuids.has(muid) &&
        muid !== selfStateRef.current.muid &&
        selfStateRef.current.camStream
      ) {
        console.log('find new participant', muid);
        const call = peer.call(muid, selfStateRef.current.camStream);
        call.on('stream', (stream) => {
          console.log('new stream', stream);
          const newMeetingStream = new Map(meetingStreamRef.current);
          newMeetingStream.set(muid, { active: true, stream });
          setMeetingStream(newMeetingStream);
        });
      }
    });

    streamMuids.forEach((muid) => {
      console.log('lost connection', muid);
      if (!participantMuids.has(muid)) {
        const newMeetingStream = new Map(meetingStreamRef.current);
        newMeetingStream.delete(muid);
        setMeetingStream(newMeetingStream);
      }
    });
  }, [peer, meetingState.participants, setMeetingStream]);

  return peer;
};

export default usePeer;
