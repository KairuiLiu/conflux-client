export const createEmptyAudioTrack = (): MediaStreamTrack => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const destination = ctx.createMediaStreamDestination();
  oscillator.connect(destination);
  oscillator.start();
  const track = destination.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false }) as MediaStreamTrack;
};

export const createEmptyVideoTrack = (): MediaStreamTrack => {
  const canvas = Object.assign(document.createElement('canvas'), {
    width: 1,
    height: 1,
  });
  canvas.getContext('2d')!.fillRect(0, 0, 1, 1);
  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];
  return Object.assign(track, { enabled: false }) as MediaStreamTrack;
};
