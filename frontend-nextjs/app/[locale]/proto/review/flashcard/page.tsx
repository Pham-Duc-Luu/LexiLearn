import React from "react";
import FlipCard, { FlipCardList } from "./FlipCard";
import { Progress } from "@nextui-org/react";
import ReviewProcessBar from "./ReviewProcessBar";

const page = () => {
  return (
    <div className=" relative content-center h-full flex justify-center items-center">
      <ReviewProcessBar></ReviewProcessBar>
      <FlipCardList></FlipCardList>
    </div>
  );
};

export default page;
