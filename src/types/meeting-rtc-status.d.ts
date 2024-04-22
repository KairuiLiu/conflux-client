type MeetingRTCStatusKey =
  | 'Bandwidth'
  | 'PackageLost'
  | 'Delay'
  | 'Bitrate'
  | 'Microphone'
  | 'Speaker'
  | 'Resolution'
  | 'Framerate';

interface MeetingRTCStatusItem {
  upload?: number | string;
  download?: number | string;
  value?: number | string;
  suffix?: string;
}

type MeetingRTCStatus = {
  [key in MeetingRTCStatusKey]?: MeetingRTCStatusItem;
} & {
  title: 'Network' | 'Audio' | 'Video' | 'Screen Sharing';
};
