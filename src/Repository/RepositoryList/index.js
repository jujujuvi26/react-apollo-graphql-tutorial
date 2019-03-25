import React from "react";

import RepositoryItem from "../RepositoryItem";

import "../style.css";

const RepositoryLIst = ({ repositories }) =>
  repositories.edges.map(({ node }) => (
    <div key={node.id} className="RepositoryItem">
      <RepositoryItem {...node} />
    </div>
  ));

export default RepositoryList;
