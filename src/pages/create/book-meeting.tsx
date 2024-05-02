import MeetingInfoCard from '@/components/meeting-info-card';
import useMeetingStore from '@/context/meeting-context';
import { genJoinInfo } from '@/utils/gen-join-info';
import { getLocalDate, getLocalTime } from '@/utils/get-local-time';
import toastConfig from '@/utils/toast-config';
import { writeClipboard } from '@/utils/write-clipboard';
import { Dialog, Transition } from '@headlessui/react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Fragment } from 'react/jsx-runtime';

const BookMeeting: FC<{
  onBook: (time: number) => Promise<void>;
  showCalendar: boolean;
  setShowCalendar: (showCalendar: boolean) => void;
}> = ({ onBook, showCalendar, setShowCalendar }) => {
  const meetingContext = useMeetingStore((d) => d);
  const navigate = useNavigate();

  const [canClose, setCanClose] = useState(true);
  const [bookDate, setBookDate] = useState(getLocalDate(Date.now()));
  const [bookTime, setBookTime] = useState(getLocalTime(Date.now()));

  function checkDate() {
    if (!bookDate.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) return false;
    const [y, m, d] = bookDate.split('-').map(Number);
    if (m < 1 || m > 12) return false;
    const daysInMonth = new Date(y, m, 0).getDate();
    if (d < 1 || d > daysInMonth) return false;
    return true;
  }

  function checkTime() {
    if (!bookTime.match(/^\d{1,2}:\d{1,2}$/)) return false;
    const [h, m] = bookTime.split(':').map(Number);
    if (h < 0 || h > 23) return false;
    if (m < 0 || m > 59) return false;
    return true;
  }

  function handleBook() {
    if (!checkDate() || !checkTime())
      return toast.error('Invalid Date or Time', toastConfig);
    setCanClose(false);
    const timeStamp = new Date(`${bookDate}T${bookTime}:00`).getTime();
    onBook(timeStamp).then(
      () => {
        setCanClose(true);
      },
      () => {
        setCanClose(true);
      }
    );
  }

  function closeCalendar() {
    if (!canClose) return;
    if (meetingContext.meetingState.id) meetingContext.resetMeetingContext();
    setShowCalendar(false);
  }

  function handleJoin() {
    navigate(`/room/${meetingContext.meetingState.id}`);
  }

  function handleBackHome() {
    meetingContext.resetMeetingContext();
    navigate(`/`);
  }

  function handleCopy() {
    writeClipboard(
      genJoinInfo(
        meetingContext.meetingState.organizer?.name,
        meetingContext.meetingState.title || '',
        meetingContext.meetingState.id,
        meetingContext.meetingState.meetingStartTime,
        meetingContext.meetingState.passcode
      )
    );
  }

  return (
    <Transition appear show={showCalendar} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeCalendar}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {!meetingContext.meetingState.id ? (
                <Dialog.Panel className="min-w-xl w-fit transform overflow-hidden rounded-2xl bg-white p-6 px-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900"
                  >
                    Book a Meeting
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="grid flex-grow grid-cols-[min-content_minmax(0px,_1fr)] items-center gap-3 p-2">
                      <p>Date</p>
                      <div>
                        <input
                          required
                          placeholder="YYYY-MM-DD"
                          type="text"
                          value={bookDate}
                          onChange={(e) => setBookDate(e.target.value)}
                          className="input input-check peer"
                        />
                      </div>
                      <p>Time</p>
                      <div>
                        <input
                          required
                          placeholder="HH:MM"
                          type="text"
                          value={bookTime}
                          onChange={(e) => setBookTime(e.target.value)}
                          className="input input-check peer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="btn btn-primary-outline"
                      onClick={closeCalendar}
                    >
                      Canecl
                    </button>
                    <button className="btn btn-primary" onClick={handleBook}>
                      Book
                    </button>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className="min-w-xl w-fit transform overflow-hidden rounded-2xl bg-white p-6 px-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900"
                  >
                    Your Meeting Info
                  </Dialog.Title>
                  <div className="mt-6">
                    <MeetingInfoCard withTopic />
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      className="btn btn-primary-outline"
                      onClick={handleCopy}
                    >
                      Copy Meeting Info
                    </button>
                    <button
                      className="btn btn-primary-outline"
                      onClick={handleJoin}
                    >
                      Join Now
                    </button>
                    <button
                      className="btn btn-primary px-4"
                      onClick={handleBackHome}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookMeeting;
