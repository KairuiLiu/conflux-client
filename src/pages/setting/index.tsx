import { Tab } from '@headlessui/react';
import {
  UserIcon,
  UserGroupIcon,
  GlobeAsiaAustraliaIcon,
} from '@heroicons/react/24/solid';
import UserSetting from './user-setting';
import MeetSetting from './meet-setting';
import MeetSystemInfo from './meet-system-info';

const settingCategories = [
  {
    icon: <UserIcon className="h-5 w-5" />,
    name: 'User Setting',
    page: () => <UserSetting />,
  },
  {
    icon: <UserGroupIcon className="h-5 w-5" />,
    name: 'Meeting Setting',
    page: () => <MeetSetting />,
  },
  {
    icon: <GlobeAsiaAustraliaIcon className="h-5 w-5" />,
    name: 'System Info',
    page: () => <MeetSystemInfo />,
  },
];

// TODO migrate to component
export default function Setting() {
  return (
    <main className="flex flex-grow items-center justify-center px-2">
      <section className="panel-classic flex flex-col">
        <div className="border-b-2 border-gray-300 p-4 text-2xl font-semibold">
          <h3>Setting</h3>
        </div>
        <div className="flex h-[calc(100dvh-200px)] max-h-[700px] min-h-80 w-dvw min-w-80 max-w-3xl flex-col sm:flex-row">
          <Tab.Group>
            <Tab.List className="flex flex-shrink-0 flex-grow-0 flex-col gap-3 border-b-2 border-gray-300 p-5 sm:border-b-0 sm:border-r-2 ">
              {settingCategories.map(({ icon, name }) => (
                <Tab
                  key={name}
                  className={({ selected }) =>
                    `btn btn-remove-focus flex items-center gap-1 text-left ${selected ? 'btn-primary' : 'btn-text'}`
                  }
                >
                  {icon}
                  {name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="felx-grow flex h-0 flex-shrink flex-grow p-7 sm:h-full">
              {settingCategories.map(({ name, page }) => (
                <Tab.Panel
                  className="focus-visible::outline-none flex flex-grow flex-col justify-between focus:outline-none focus:ring-0 focus-visible:ring-0"
                  key={name}
                >
                  {page()}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </main>
  );
}
