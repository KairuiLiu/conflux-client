function getUserShortName(name: string) {
  const input = name.trim();
  if (input.includes(' ')) {
    const parts = input.split(' ');
    const abbreviation = parts[0].charAt(0) + parts.at(-1)!.charAt(0);
    return abbreviation.toUpperCase();
  } else return input.substring(0, 2).toUpperCase();
}

const Avatar: React.FC<{
  user: {
    avatar?: string | null;
    name: string;
  };
  size?: number;
}> = ({ user, size = 32 }) => {
  const username = user.name.replace(/^User_([a-zA-Z0-9]{8})$/, '$1');
  const avatarColorIndex =
    username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;

  return (
    size > 0 && (
      <div
        className="flex flex-shrink-0 select-none items-center justify-center overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        {user.avatar ? (
          <img
            src={'/api/avatar?fileName=' + user.avatar}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div
            className={`${avatarColors[avatarColorIndex]} text-center, flex h-full w-full items-center justify-center`}
          >
            <span
              className="font-bold text-white"
              style={{ fontSize: size / 2 }}
            >
              {getUserShortName(username)}
            </span>
          </div>
        )}
      </div>
    )
  );
};

const avatarColors = [
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-green-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-sky-400',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-violet-400',
  'bg-purple-400',
  'bg-fuchsia-400',
  'bg-pink-400',
  'bg-rose-400',
];

export default Avatar;
