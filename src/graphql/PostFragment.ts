import { gql } from '@apollo/client'

import { PublicationProfileFragment } from './PublicationProfileFragment'

export const PostFragment = gql`
  fragment PostFragment on Post {
    pubId: id
    profile {
      ...PublicationProfileFragment
    }
    collectedBy {
      defaultProfile {
        handle
      }
    }
    collectModule {
      __typename
    }
    stats {
      totalAmountOfComments
      totalAmountOfMirrors
      totalAmountOfCollects
    }
    metadata {
      content
      description
      media {
        original {
          url
          mimeType
        }
      }
    }
    createdAt
  }
  ${PublicationProfileFragment}
`
