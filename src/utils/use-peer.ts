import { useRef, useEffect, useState } from 'react';
import Peer from 'peerjs';
import useMeetingStore from '@/context/meeting-context';

const usePeer = () => {
  const {
    meetingState,
    selfState,
    meetingStream,
    setMeetingStream,
    setSelfState,
  } = useMeetingStore();
  const [peer, setPeer] = useState<Peer | null>(null);

  const selfStateRef = useRef(selfState);
  const meetingStreamRef = useRef(meetingStream);

  // 更新 ref 以确保它们总是指向最新的 state
  useEffect(() => {
    selfStateRef.current = selfState;
    meetingStreamRef.current = meetingStream;
  }, [selfState, meetingStream]);

  useEffect(() => {
    const newPeer = new Peer();
    setPeer(newPeer);

    newPeer.on('open', (id) => {
      console.log('peer open', id);
      setSelfState.setMuid(id);
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
