enum UserRole {
  Host,
  Participant,
}

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
