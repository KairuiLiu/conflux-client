import { Tab } from '@headlessui/react';
import {
  UserIcon,
  UserGroupIcon,
  GlobeAsiaAustraliaIcon,
} from '@heroicons/react/24/solid';
import UserSetting from './user-setting';

const settingCategories = [
  {
    icon: <UserIcon className="h-5 w-5" />,
    name: 'User Setting',
    page: <UserSetting />,
  },
  {
    icon: <UserGroupIcon className="h-5 w-5" />,
    name: 'Meeting Setting',
    page: <div>ok meetin</div>,
  },
  {
    icon: <GlobeAsiaAustraliaIcon className="h-5 w-5" />,
    name: 'System Info',
    page: <div>ok system</div>,
  },
];

export default function Setting() {
  return (
    <main className="flex flex-grow items-center justify-center px-2">
      <section className="panel-classic flex flex-col">
        <div className="border-b-2 border-gray-300 p-4 text-2xl font-semibold">
          <h3>Setting</h3>
        </div>
        <div className="flex w-full max-w-md sm:px-0">
          <Tab.Group>
            <Tab.List className="flex flex-col gap-3 border-r-2 border-gray-300 p-5">
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
            <Tab.Panels className="min-w-50 p-5">
              {settingCategories.map(({ name, page }) => (
                // TODO focus
                <Tab.Panel className="focus:ring-0" key={name}>
                  {page}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </main>
  );
}
