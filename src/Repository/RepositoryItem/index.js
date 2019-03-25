import React from "react";
import { Mutation } from "react-apollo";

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
          }}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button
              className={"RepositoryItem-title-action"}
              data-test-id={updateSubscription}
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
