import { refreshMediaDevice } from '@/utils/media-devices';
import { Dispatch, SetStateAction } from 'react';

let registeredMeidaChange = false;
let registeredPermissionChange = false;

export function initListener(
  setState: React.Dispatch<React.SetStateAction<StateType>>
) {
  addMediaStateListener(setState);
  addMediaPermissionListener(setState);
}

function addMediaPermissionListener(
  setState: Dispatch<SetStateAction<StateType>>
) {
  if (!navigator.mediaDevices || registeredPermissionChange) return;
  registeredPermissionChange = true;
  try {
    navigator.permissions
      .query({ name: 'camera' as unknown as PermissionName })
      .then((permissionStatus) => {
        permissionStatus.onchange = () => {
          refreshMediaDevice('video', setState);
        };
      })
      .catch(() => {});
    navigator.permissions
      .query({ name: 'microphone' as unknown as PermissionName })
      .then((permissionStatus) => {
        permissionStatus.onchange = () => {
          refreshMediaDevice('audio', setState);
        };
      })
      .catch(() => {});
  } catch (error) {
    console.log(error);
  }
}

function addMediaStateListener(setState: Dispatch<SetStateAction<StateType>>) {
  if (!navigator.mediaDevices || registeredMeidaChange) return;
  registeredMeidaChange = true;
  navigator.mediaDevices.addEventListener('devicechange', () => {
    refreshMediaDevice('audio', setState);
    refreshMediaDevice('video', setState);
  });
}
