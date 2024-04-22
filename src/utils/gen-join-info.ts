export function genJoinInfo(user: string, title: string, id: string) {
  return `${user} invites you to join a conflux video meeting.
Meeting topic: ${title}
Meeting ID: ${id.replace(/(.{1,3})/g, '$1 ').trim()}
Meeting link: ${window.location.origin}/j/${id}`;
}
