import React from "react";
import { Redirect } from "react-router-dom";

const RedirectToNotFound = () => {
  return <Redirect to="/404notfound" />;
};

export default RedirectToNotFound;