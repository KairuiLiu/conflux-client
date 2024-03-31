function requestPermission(name: 'audio' | 'video') {
  return navigator.mediaDevices
    .getUserMedia({ video: name === 'video', audio: name === 'audio' })
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop());
    })
    .catch(() => {});
}

function checkPermission(name: 'audio' | 'video') {
  const permissionName = name === 'audio' ? 'microphone' : 'camera';
  try {
    return navigator.permissions
      .query({ name: permissionName as unknown as PermissionName })
      .then((permissionStatus) => permissionStatus.state === 'granted')
      .catch((error) => {
        console.error('An error occurred:', error);
        return navigator.mediaDevices
          .enumerateDevices()
          .then((devices) =>
            devices.some(
              (device) => device.kind === `${name}input` && device.label !== ''
            )
          );
      });
  } catch (_) {
    return navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        devices.some(
          (device) => device.kind === `${name}input` && device.label !== ''
        )
      );
  }
}

function isDeviceChanged(
  oldDevices: MediaDeviceInfo[],
  newDevices: MediaDeviceInfo[]
) {
  if (oldDevices.length !== newDevices.length) return true;
  return oldDevices.some(
    ({ deviceId }) => !newDevices.find((device) => device.deviceId === deviceId)
  );
}

export async function fetchMediaDevice(
  type: 'audio' | 'video',
  setState: (v: (state: StateType) => StateType) => void
  ) {
  const newDevices = await navigator.mediaDevices.enumerateDevices();
  const newDevicesInfo: DevicesList = {
    camera: newDevices.filter(
      (device) => device.kind === 'videoinput' && device.label !== ''
    ),
    microphone: newDevices.filter(
      (device) => device.kind === 'audioinput' && device.label !== ''
    ),
    speaker: newDevices.filter(
      (device) => device.kind === 'audiooutput' && device.label !== ''
    ),
  };

  setState((prevState:StateType) => {
    if (
      type === 'video' &&
      isDeviceChanged(prevState.mediaDiveces.camera, newDevicesInfo.camera)
    ) {
      return {
        ...prevState,
        mediaDiveces: {
          ...prevState.mediaDiveces,
          camera: newDevicesInfo.camera,
        },
      };
    } else if (
      type === 'audio' &&
      (isDeviceChanged(
        prevState.mediaDiveces.microphone,
        newDevicesInfo.microphone
      ) ||
        isDeviceChanged(prevState.mediaDiveces.speaker, newDevicesInfo.speaker))
    ) {
      return {
        ...prevState,
        mediaDiveces: {
          ...prevState.mediaDiveces,
          microphone: newDevicesInfo.microphone,
          speaker: newDevicesInfo.speaker,
        },
      };
    }
    return prevState;
  });
}

export async function refreshMediaDevice(
  type: 'audio' | 'video',
  setState: (v: (state: StateType) => StateType) => void
) {
  const granted = await checkPermission(type);
  if (!granted) await requestPermission(type);
  fetchMediaDevice(type, setState);
}
