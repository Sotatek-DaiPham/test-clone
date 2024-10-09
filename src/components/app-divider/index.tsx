import withClient from "@/helpers/with-client";
import { Divider } from "antd";
import React from "react";

const AppDivider = () => {
  return <Divider style={{ borderColor: "#353945", margin: "10px 0" }} />;
};

export default withClient(AppDivider);
