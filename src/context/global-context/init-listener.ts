import { refreshMediaDevice } from '@/utils/media-devices';
import toastConfig from '@/utils/toast-config';
import { toast } from 'react-toastify';

let registeredMeidaChange = false;
let registeredPermissionChange = false;

export function initListener(
  setState: (v: (state: StateType) => StateType) => void
): void {
  addMediaStateListener(setState);
  addMediaPermissionListener(setState);
}

function addMediaPermissionListener(
  setState: (v: (state: StateType) => StateType) => void
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
    console.info('[ERROR] on getting permission ', error);
    toast.error(
      'Camera access denied. Please check settings and try again.',
      toastConfig
    );
  }
}

function addMediaStateListener(
  setState: (v: (state: StateType) => StateType) => void
) {
  if (!navigator.mediaDevices || registeredMeidaChange) return;
  registeredMeidaChange = true;
  navigator.mediaDevices.addEventListener('devicechange', () => {
    refreshMediaDevice('audio', setState);
    refreshMediaDevice('video', setState);
  });
}
