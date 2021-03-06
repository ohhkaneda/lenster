import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { humanize } from '@lib/humanize'
import React, { useState } from 'react'

import Followers from './Followers'
import Following from './Following'

interface Props {
  profile: Profile
}

const Followerings: React.FC<Props> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false)
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false)

  return (
    <div className="flex gap-5">
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowingModal(!showFollowingModal)}
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowing)}
        </div>
        <div className="text-gray-500">Following</div>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowersModal(!showFollowersModal)}
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowers)}
        </div>
        <div className="text-gray-500">Followers</div>
      </div>
      <Modal
        title="Following"
        size="md"
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(!showFollowingModal)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title="Followers"
        size="md"
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(!showFollowersModal)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  )
}

export default Followerings
