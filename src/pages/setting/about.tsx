import useGlobalStore from '@/context/global-context';
import { HeartIcon, LinkIcon } from '@heroicons/react/24/solid';

export default function About() {
  const state = useGlobalStore((d) => d);

  return (
    <>
      <div className="flex h-full flex-col justify-between overflow-auto">
        <div className="grid grid-cols-[min-content_min-content] gap-8 text-nowrap p-5">
          <p>Client version</p>
          <p>{`${process.env.VERSION}${
            process.env.MODE ? `-${process.env.MODE}` : ''
          }-${process.env.BUILDTIME}`}</p>
          <p>Server version</p>
          <p>
            {state.siteConfig.BUILD_VERSION}-{state.siteConfig.BUILD_TIME}
          </p>
          <p>Source code</p>
          <p>
            <a
              className="flex gap-1"
              href="https://github.com/KairuiLiu/conflux"
              target="_blank"
            >
              <LinkIcon className="w-4" /> GitHub
            </a>
          </p>
          <p>License</p>
          <p>GPLv3</p>
        </div>
        <p className="flex items-center justify-center">
          &copy; 2022 - {new Date().getFullYear()}
          <span className="animate-icon-animate mx-1.5 text-red-500">
            <HeartIcon className="w-4" />
          </span>{' '}
          Liu Kairui
        </p>
      </div>
    </>
  );
}
