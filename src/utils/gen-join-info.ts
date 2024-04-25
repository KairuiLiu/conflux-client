import { getLocalDateTime } from './get-local-time';

export function genJoinInfo(
  user: string,
  title: string,
  id: string,
  meetingTime: number | undefined
) {
  return `${user} invites you to join a conflux video meeting.
Meeting ID: ${id.replace(/(.{1,3})/g, '$1 ').trim()}
Meeting topic: ${title}${
    meetingTime &&
    `
Meeting time: ${getLocalDateTime(meetingTime, true)}`
  }
Meeting link: ${window.location.origin}/j/${id}`;
}
