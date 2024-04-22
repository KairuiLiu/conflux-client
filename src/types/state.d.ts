interface StateType {
  user: UserInfo;
  mediaDiveces: DevicesList;
  rtcStatus: MeetingRTCStatus[];
  siteConfig: SiteConfig;
}

interface ReportContext {
  lastGenerateTime: number;
  byteReceived: number;
  byteSent: number;
  sentpackageLost: number;
  receivedPackageLost: number;
  delay: number;
}
