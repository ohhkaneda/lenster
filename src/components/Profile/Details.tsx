import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import Follow from '@components/Shared/Follow'
import Slug from '@components/Shared/Slug'
import Unfollow from '@components/Shared/Unfollow'
import { Tooltip } from '@components/UI/Tooltip'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { HashtagIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { isVerified } from '@lib/isVerified'
import { linkifyOptions } from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import { useTheme } from 'next-themes'
import React, { useContext, useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'
import { useEnsLookup } from 'wagmi'

import DoesFollow from './DoesFollow'
import Followerings from './Followerings'

dayjs.extend(relativeTime)

export const DOES_FOLLOW_QUERY = gql`
  query DoesFollow($request: DoesFollowRequest!) {
    doesFollow(request: $request) {
      follows
    }
  }
`

interface Props {
  profile: Profile
}

const Details: React.FC<Props> = ({ profile }) => {
  const [following, setFollowing] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const [{ data: ensName }] = useEnsLookup({ address: profile?.ownedBy })
  const { resolvedTheme } = useTheme()
  const { data: followData, loading: followLoading } = useQuery(
    DOES_FOLLOW_QUERY,
    {
      variables: {
        request: {
          followInfos: [
            {
              // Am I following them
              followerAddress: profile.ownedBy,
              profileId: currentUser?.id
            },
            {
              // Do they follow me
              followerAddress: currentUser?.ownedBy,
              profileId: profile.id
            }
          ]
        }
      },
      skip: !profile || !currentUser,
      onCompleted(data) {
        setFollowing(data?.doesFollow[1]?.follows)
      }
    }
  )

  const MetaDetails = ({
    children,
    icon
  }: {
    children: React.ReactChild
    icon: React.ReactChild
  }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div>{children}</div>
    </div>
  )

  return (
    <div className="mb-4">
      <div className="space-y-5">
        <div className="relative w-32 h-32 -mt-24 sm:-mt-36 sm:h-52 sm:w-52">
          <img
            src={getAvatar(profile)}
            className="w-32 h-32 bg-gray-200 rounded-xl ring-8 sm:h-52 sm:w-52 dark:bg-gray-700 ring-gray-50 dark:ring-black"
            alt={profile?.handle}
          />
        </div>
        <div className="py-3 space-y-1">
          <div className="flex items-center gap-1.5 text-2xl font-bold truncate">
            <div className="truncate">{profile?.name ?? profile?.handle}</div>
            {isVerified(profile?.handle) && (
              <Tooltip content="Verified">
                <BadgeCheckIcon className="w-6 h-6 text-brand-500" />
              </Tooltip>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {profile?.name ? (
              <Slug slug={formatUsername(profile?.handle)} prefix="@" />
            ) : (
              <Slug slug={formatUsername(profile?.ownedBy)} />
            )}
            {currentUser && currentUser.id !== profile.id && (
              <DoesFollow followData={followData?.doesFollow[0]} />
            )}
          </div>
        </div>
        <div className="space-y-5">
          <Followerings profile={profile} />
          {followLoading ? (
            <div className="h-[34px] rounded-lg w-28 shimmer" />
          ) : following ? (
            <Unfollow profile={profile} setFollowing={setFollowing} showText />
          ) : (
            <Follow profile={profile} setFollowing={setFollowing} showText />
          )}
          {profile?.bio && (
            <div className="mr-0 leading-7 sm:mr-10 linkify">
              <Linkify tagName="div" options={linkifyOptions}>
                {profile?.bio}
              </Linkify>
            </div>
          )}
          <div className="space-y-2">
            <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
              {profile?.id}
            </MetaDetails>
            {profile?.location && (
              <MetaDetails icon={<LocationMarkerIcon className="w-4 h-4" />}>
                {profile?.location}
              </MetaDetails>
            )}
          </div>
          <div className="space-y-2.5">
            {profile?.website && (
              <MetaDetails
                icon={
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${profile?.website}`}
                    className="w-5 h-5 rounded-full"
                    alt="Website"
                  />
                }
              >
                <a href={profile?.website} target="_blank" rel="noreferrer">
                  {profile?.website}
                </a>
              </MetaDetails>
            )}
            {profile?.twitterUrl && (
              <MetaDetails
                icon={
                  resolvedTheme === 'dark' ? (
                    <img
                      src={`${STATIC_ASSETS}/brands/twitter-light.svg`}
                      className="w-5"
                      alt="Twitter Logo"
                    />
                  ) : (
                    <img
                      src={`${STATIC_ASSETS}/brands/twitter-dark.svg`}
                      className="w-5"
                      alt="Twitter Logo"
                    />
                  )
                }
              >
                <a href={profile?.twitterUrl} target="_blank" rel="noreferrer">
                  {profile?.twitterUrl?.replace('https://twitter.com/', '')}
                </a>
              </MetaDetails>
            )}
            {ensName && (
              <MetaDetails
                icon={<img src="/ens.svg" className="w-5 h-5" alt="ENS Logo" />}
              >
                <a
                  href={`https://app.ens.domains/name/${ensName}/details`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ensName}
                </a>
              </MetaDetails>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
