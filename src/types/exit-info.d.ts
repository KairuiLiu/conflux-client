interface ExitInfo {
  reason: 'exit' | 'finish';
  roomId: string | null;
  userName: string;
  deviceInfo?: UserMeetingDeviceInfo;
}
