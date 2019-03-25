import React from "react";
import { Mutation } from "react-apollo";
import REPOSITORY_FRAGMENT from "../fragments";
import Link from "../../Link";
import Button from "../../Button";

import "../style.css";

import {
  ADD_STAR_TO_REPOSITORY,
  REMOVE_STAR_FROM_REPOSITORY,
  WATCH_REPOSITORY
} from "../mutations";

const VIEWER_SUBSCRIPTION_STATE = {
  SUBSCRIBED: "SUBSCRIBED",
  UNSUBSCRIBED: "UNSUBSCRIBED"
};

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTION_STATE.SUBSCRIBED;

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription }
      }
    }
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  let { totalCount } = repository.watchers;
  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTION_STATE.SUBSCRIBED
      ? totalCount + 1
      : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    }
  });
};

const updateAddStar = (
  client,
  {
    data: {
      addStar: {
        starrable: { id, viewerHasStarred }
      }
    }
  }
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: getUpdatedStarData(client, id, viewerHasStarred)
  });
};

const updateRemoveStar = (
  client,
  {
    data: {
      removeStar: {
        starrable: { id, viewerHasStarred }
      }
    }
  }
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: getUpdatedStarData(client, id, viewerHasStarred)
  });
};

const getUpdatedStarData = (client, id, viewerHasStarred) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  let { totalCount } = repository.stargazers;
  totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1;

  return {
    ...repository,
    stargazers: {
      ...repository.stargazers,
      totalCount
    }
  };
};

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        <Mutation
          mutation={WATCH_REPOSITORY}
          variables={{
            repositoryId: id,
            viewerSubscriptionState: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTION_STATE.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTION_STATE.SUBSCRIBED
          }}
          optimisticResponse={{
            updateSubscription: {
              __typename: "Mutation",
              subscribable: {
                __typename: "Repository",
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTION_STATE.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTION_STATE.SUBSCRIBED
              }
            }
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button
              className={"RepositoryItem-title-action"}
              onClick={updateSubscription}
            >
              {watchers.totalCount}{" "}
              {isWatch(viewerSubscription) ? "Unwatch" : "Watch"}
            </Button>
          )}
        </Mutation>

        {!viewerHasStarred ? (
          <Mutation
            mutation={ADD_STAR_TO_REPOSITORY}
            variables={{
              repositoryId: id
            }}
            optimisticResponse={{
              addStar: {
                __typename: "Mutation",
                starrable: {
                  __typename: "Repository",
                  id,
                  viewerHasStarred: !viewerHasStarred
                }
              }
            }}
            update={updateAddStar}
          >
            {(addStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={addStar}
              >
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={REMOVE_STAR_FROM_REPOSITORY}
            variables={{ repositoryId: id }}
            optimisticResponse={{
              removeStar: {
                __typename: "Mutation",
                starrable: {
                  __typename: "Repository",
                  id,
                  viewerHasStarred: !viewerHasStarred
                }
              }
            }}
            update={updateRemoveStar}
          >
            {(removeStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={removeStar}
              >
                {stargazers.totalCount} Unstar
              </Button>
            )}
          </Mutation>
        )}
      </div>

      <div className="RepositoryItem-title-action">
        {stargazers.totalCount} Stars
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
