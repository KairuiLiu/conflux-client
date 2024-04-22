type UserRole = 'HOST' | 'PARTICIPANT';

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

type ParticipantState = {
  mic: boolean;
  camera: boolean;
  screen: boolean;
};

interface Participant {
  muid?: string;
  name: string;
  role: 'HOST' | 'PARTICIPANT';
  state: ParticipantState;
  avatar: string;
  expandCamera: boolean;
  mirrorCamera: boolean;
}

interface SiteConfig {
  token: string;
  COTURN_PASSWORD: string;
  COTURN_PREFIX: string;
  COTURN_USERNAME: string;
  PEER_SERVER_PATH: string;
}
