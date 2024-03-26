import { refreshMediaDevice } from '@/utils/media-devices';
import { Dispatch, SetStateAction } from 'react';

export function initListener(
  setState: React.Dispatch<React.SetStateAction<StateType>>
) {
  addMediaStateListener(setState);
  addMediaPermissionListener(setState);
}

function addMediaPermissionListener(
  setState: Dispatch<SetStateAction<StateType>>
) {
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
  addEventListener('devicechange', () => {
    console.log('device change');
    refreshMediaDevice('audio', setState);
    refreshMediaDevice('video', setState);
  });
}
