interface StateType {
  user: UserInfo;
  mediaDiveces: DevicesList;
  rtcStatus: MeetingRTCStatus[];
  siteConfig: SiteConfig;
}

interface ReportContext {
  type: 'media' | 'screen';
  lastGenerateTime: number;
  mediaByteReceived: number;
  mediaByteSent: number;
  screenByteReceived: number;
  screenByteSent: number;
  audioByteReceived: number;
  audioByteSent: number;
  receivedPackageLost: number;
  delay: number;
  packageReceived: number;
  maxResolutionSend: string;
  maxResolutionRecv: string;
  screenResolutionSend: string;
  screenResolutionRecv: string;
  mediaSendFrameRate: number;
  mediaRecvFrameRate: number;
  screenSendFrameRate: number;
  screenRecvFrameRate: number;
}
