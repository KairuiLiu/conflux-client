import Avatar from '@/components/avatar';
import useGlobalStore from '@/context/global-context';
import { useState } from 'react';

export default function UserSetting() {
  const state = useGlobalStore((d) => d);
  const setState = useGlobalStore.setState;

  const [avatar, setAvatar] = useState<string | null>(state.user.avatar);
  const [name, setName] = useState<string>(state.user.name);
  const user = { avatar, name };

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e?.target?.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      if (!e.target) return;
      const base64 = e.target.result as string;
      setAvatar(base64);
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <>
      <section className="flex flex-col">
        <div className="grid flex-grow grid-cols-[min-content_min-content] gap-8 p-5">
          <p className="self-center">Avatar</p>
          <div className="relative h-[96px] w-[96px] cursor-pointer">
            <Avatar user={user} size={96} />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleAvatarChange}
            />
          </div>

          <p className="self-center">Name</p>
          <div>
            <input
              required
              placeholder="Input your name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-check peer"
            />
            <p className="invisible absolute mt-2 text-sm text-red-600 opacity-0 transition-all peer-invalid:visible peer-invalid:opacity-100">
              You must provide a name
            </p>
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-3 p-5 pb-0">
        <button
          className="btn btn-remove-focus btn-primary-outline"
          onClick={() => {
            setAvatar(state.user.avatar);
            setName(state.user.name);
          }}
        >
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={() =>
            name.trim() &&
            setState((state) => ({
              ...state,
              user: { ...state.user, avatar, name: name.trim() },
            }))
          }
        >
          Save
        </button>
      </div>
    </>
  );
}
