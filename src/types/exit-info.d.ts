interface ExitInfo {
  reason: 'exit' | 'finish' | 'kicked' | 'network';
  roomId: string;
  userName: string;
}
