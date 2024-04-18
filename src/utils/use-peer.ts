import useMeetingStore from '@/context/meeting-context';
import Peer from 'peerjs';
import { useEffect } from 'react';

const usePeerConnections = () => {
  const meetingContext = useMeetingStore((d) => d);

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => {
      meetingContext.setSelfState.setMuid(id);
    });

    peer.on('call', (call) => {
      // navigator.mediaDevices
      //   .getUserMedia({ video: true, audio: true })
      //   .then((stream) => {
      //     call.answer(stream);
      //     handleStream(call, stream);
      //   })
      //   .catch((err) => {
      //     console.error('Failed to get local stream', err);
      //   });

      if (!meetingContext.meetingStream.has('TODO')) {
        console.error('Stream not found');
        return;
      }
      const stream = meetingContext.meetingStream.get('TODO');
      if (stream) call.answer(stream.stream);

      call.on('stream', (remoteStream) => {
        console.log('stream', remoteStream);
      });
    });

    return () => peer.destroy();
  }, []);

  useEffect(() => {
    // muid in steamMap
    const streamMuid = [...meetingContext.meetingStream]
      .map((d) => d[0])
      .sort();
    const particapantsMuid = meetingContext.meetingState.participants.map(
      (d) => d.muid
    );
    console.log(streamMuid);
    console.log(particapantsMuid);
    // find muid in particapants but not in map -> connect peer

    // find muid in map but not in particapants -> disconnect
  }, [meetingContext.meetingState.participants, meetingContext.meetingStream]);
};

export default usePeerConnections;
