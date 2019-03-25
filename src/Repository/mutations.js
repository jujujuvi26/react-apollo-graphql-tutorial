import gql from "graphql-tag";

export const ADD_STAR_TO_REPOSITORY = gql`
{
  mutation ($repositoryId: ID!) {
    addStar (input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
}
`;

export const REMOVE_STAR_FROM_REPOSITORY = gql`
{
  mutation ($repositoryId: ID!) {
    removeStar (input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
}
`;

export const WATCH_REPOSITORY = gql`
{
  mutation ($repositoryId: ID!, $viewerSubscriptionState: SubscriptionState!) {
    updateSubscription (input: { subscribableId: $repositoryId, state: $viewerSubscriptionState }) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
}
`;
