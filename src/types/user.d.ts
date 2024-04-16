type UserRole = 'HOST' | 'PARTICIPANT';

interface UserInfoExchange {
  uuid: string;
  avatar: string?;
  name: string;
  roll: UserRole;
}

interface MeetingConfig {
  autoEnableCamera: boolean;
  defaultCamera: string?;
  autoEnableMic: boolean;
  defaultMic: string?;
  autoEnableSpeaker: boolean;
  defaultSpeaker: string?;
  mirrorCamera: boolean;
  expandCamera: boolean;
}

interface UserInfo extends MeetingConfig {
  uuid: string;
  avatar: string?;
  name: string;
}

interface SiteConfig {
  token: string;
  COTURN_PASSWORD: string;
  COTURN_PATH: string;
  COTURN_USERNAME: string;
  PEER_SERVER_PATH: string;
}
