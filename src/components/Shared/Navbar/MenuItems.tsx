import { Button } from '@components/UI/Button'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { Menu, Transition } from '@headlessui/react'
import {
  CogIcon,
  LogoutIcon,
  SwitchHorizontalIcon,
  UserIcon
} from '@heroicons/react/outline'
import { getAvatar } from '@lib/getAvatar'
import clsx from 'clsx'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Fragment, useContext } from 'react'
import { useAccount, useNetwork } from 'wagmi'

import Slug from '../Slug'

const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} passHref>
    <a {...rest}>{children}</a>
  </Link>
)

interface Props {
  indexerData: {
    ping: string
  }
}

const MenuItems: React.FC<Props> = ({ indexerData }) => {
  const { theme, setTheme } = useTheme()
  const [{ data: network }, switchNetwork] = useNetwork()
  const [{}, disconnect] = useAccount()
  const { profiles, currentUser, currentUserLoading, setSelectedProfile } =
    useContext(AppContext)

  return (
    <>
      {currentUserLoading ? (
        <div className="w-8 h-8 rounded-full shimmer" />
      ) : currentUser && !network.chain?.unsupported ? (
        <Menu as="div">
          {({ open }) => (
            <>
              <Menu.Button
                as="img"
                src={getAvatar(currentUser)}
                className="w-8 h-8 border rounded-full cursor-pointer dark:border-gray-700"
                alt={currentUser.handle}
              />
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white border shadow-sm rounded-xl dark:bg-gray-900 dark:border-gray-800 focus:outline-none"
                >
                  <Menu.Item
                    as={NextLink}
                    href={`/u/${currentUser.handle}`}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer space-y-1 rounded-lg'
                      )
                    }
                  >
                    <div>Logged in as</div>
                    <div className="truncate">
                      <Slug
                        className="font-bold"
                        slug={currentUser.handle}
                        prefix="@"
                      />
                    </div>
                  </Menu.Item>
                  <div className="border-b dark:border-gray-800" />
                  <Menu.Item
                    as={NextLink}
                    href={`/u/${currentUser.handle}`}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer rounded-lg'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <UserIcon className="w-4 h-4" />
                      <div>Your Profile</div>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    as={NextLink}
                    href="/settings"
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer rounded-lg'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <CogIcon className="w-4 h-4" />
                      <div>Settings</div>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    as="a"
                    onClick={() => {
                      localStorage.removeItem('selectedProfile')
                      localStorage.removeItem('accessToken')
                      localStorage.removeItem('refreshToken')
                      disconnect()
                      location.href = '/'
                    }}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-gray-100 dark:bg-gray-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 cursor-pointer rounded-lg'
                      )
                    }
                  >
                    <div className="flex items-center space-x-1.5">
                      <LogoutIcon className="w-4 h-4" />
                      <div>Logout</div>
                    </div>
                  </Menu.Item>
                  {profiles.length > 0 && (
                    <>
                      <div className="border-b dark:border-gray-800" />
                      <div className="m-2">
                        <div className="flex items-center px-4 pt-1 pb-2 space-x-1.5 text-sm font-bold text-gray-600">
                          <SwitchHorizontalIcon className="w-4 h-4" />
                          <div>Switch to</div>
                        </div>
                        {profiles.map((profile: Profile, index: number) => (
                          <div
                            key={profile.id}
                            className="block text-sm text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                          >
                            <button
                              className="flex items-center w-full px-4 py-1.5 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => {
                                localStorage.setItem(
                                  'selectedProfile',
                                  index.toString()
                                )
                                setSelectedProfile(index)
                              }}
                            >
                              <img
                                className="w-5 h-5 border rounded-full dark:border-gray-700"
                                src={getAvatar(profile)}
                                alt={profile.handle}
                              />
                              <div className="truncate">{profile.handle}</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="border-b dark:border-gray-800" />
                  <div className="flex items-center px-5 py-3 space-x-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={theme === 'light' ? 'text-xl' : ''}
                    >
                      ????
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={theme === 'dark' ? 'text-xl' : ''}
                    >
                      ????
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={theme === 'system' ? 'text-xl' : ''}
                    >
                      ????
                    </button>
                  </div>
                  {indexerData && (
                    <>
                      <div className="border-b dark:border-gray-800" />
                      <div className="flex items-center px-6 py-3 space-x-2.5 text-sm">
                        <div
                          className={clsx(
                            { 'bg-green-500': indexerData?.ping === 'pong' },
                            { 'bg-red-500': indexerData?.ping !== 'pong' },
                            'p-[4.5px] rounded-full animate-pulse'
                          )}
                        />
                        <div>
                          {indexerData?.ping === 'pong'
                            ? 'Indexer active'
                            : 'Indexer inactive'}
                        </div>
                      </div>
                    </>
                  )}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      ) : network.chain?.unsupported && switchNetwork ? (
        <Button
          variant="danger"
          icon={<SwitchHorizontalIcon className="w-4 h-4" />}
          onClick={() => switchNetwork(80001)}
        >
          Switch Network
        </Button>
      ) : (
        <Link href="/" passHref>
          <Button>Login</Button>
        </Link>
      )}
    </>
  )
}

export default MenuItems
