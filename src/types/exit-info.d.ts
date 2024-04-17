interface ExitInfo {
  reason: 'exit' | 'finish' | 'kicked';
  roomId: string;
  userName: string;
}
