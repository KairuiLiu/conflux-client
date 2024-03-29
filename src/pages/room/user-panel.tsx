import { Square2StackIcon, XMarkIcon } from '@heroicons/react/24/outline';
import UserItemCard from './user-item-card';

const UserPanle: React.FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  return (
    <>
      <div className="flex max-h-full items-center justify-between px-4 py-2 text-lg">
        <h3>Participants (2)</h3>
        <button className="btn btn-remove-focus btn-text" onClick={handleClose}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex h-full flex-shrink flex-col gap-3 overflow-auto p-4">
        <UserItemCard />
      </div>
      <button className="btn btn-text flex items-center gap-2 rounded-t-none p-4 text-left font-normal">
        <Square2StackIcon className="h-4 w-4" />
        Copy Join Info
      </button>
    </>
  );
};

export default UserPanle;
