import React from "react";
import { Route, Switch } from "react-router-dom";

import Task from "./list.js";

export default () => {
  return (
    <Switch>
      <Route path="/" component={Task} />
    </Switch>
  );
};
