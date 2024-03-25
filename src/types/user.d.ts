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

interface UserInfo {
  uuid: string;
  avatar: string?;
  name: string;
  autoEnableCamera: boolean;
  defaultCamera: string?;
  autoEnableMic: boolean;
  defaultMic: string?;
  autoEnableSpeaker: boolean;
  defaultSpeaker: string?;
}
