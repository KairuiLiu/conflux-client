function getWeight(
  participant: Participant,
  selfMuid: string,
  screenShareFirst: boolean
) {
  if (screenShareFirst && participant.state.screen) return 0;
  if (participant.muid === selfMuid) return 1;
  if (participant.role === 'HOST') return 2;
  return 3;
}

function sortParticipants(
  participants: Participant[],
  selfMuid: string,
  screenShareFirst: boolean = false
): Participant[] {
  return [...participants].sort((a, b) => {
    return (
      getWeight(a, selfMuid, screenShareFirst) -
      getWeight(b, selfMuid, screenShareFirst)
    );
  });
}

export default sortParticipants;
