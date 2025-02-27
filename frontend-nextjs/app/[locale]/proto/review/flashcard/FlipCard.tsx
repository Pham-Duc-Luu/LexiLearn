"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { BiDislike, BiLike } from "react-icons/bi";
import * as _ from "lodash";
import {
  FlashCardType,
  setCurrentFlashcardIndex,
  updateReviewResultWithIndex,
} from "@/store/Proto-slice/ReviewFlashcard.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/store/Proto-slice/ProtoStore.slice";
import { CgEditFlipV } from "react-icons/cg";

const FlipCard = ({
  Flashcard,
  CARD_OFFSET,
  SCALE_FACTOR,
  index,
}: {
  Flashcard: FlashCardType;
  CARD_OFFSET: number;
  SCALE_FACTOR: number;
  index: number;
}) => {
  const [isFlip, setIsFlip] = useState(false);
  const [duration, setDuration] = useState(0.25);
  const [isDisplay, setIsDisplay] = useState(true);
  const [isDisableFlip, setIsDisableFlip] = useState(false);
  const { currentFlashcardIndex, flashcards } = useAppSelector(
    (state) => state.ReviewFlashCard
  );

  useEffect(() => {
    if (
      Flashcard.index < currentFlashcardIndex - 1 ||
      Flashcard.index > currentFlashcardIndex + 4
    ) {
      setIsDisplay(false);
    } else {
      setIsDisplay(true);
    }
  }, [Flashcard.index, currentFlashcardIndex]);

  const handlerFlip = () => {
    !isDisableFlip && setIsFlip(!isFlip);
  };

  const handleNextCardAnimationComplete = () => {
    if (
      Flashcard.index < currentFlashcardIndex ||
      Flashcard.index > currentFlashcardIndex + 4
    ) {
      setIsDisplay(false);
    }

    setIsDisableFlip(false);
  };

  const handleNextCardAnimationStart = () => {
    setIsDisableFlip(true);
  };
  return (
    <>
      <motion.div
        onAnimationComplete={() => handleNextCardAnimationComplete()}
        onAnimationStart={() => handleNextCardAnimationStart()}
        className={cn(
          " lg:w-[1000px] lg:h-[450px] w-20 h-20  rounded-sm   absolute bg-transparent flex flex-col justify-between",
          !isDisplay && "hidden"
        )}
        key={index}
        exit={{ top: 200, opacity: 0 }}
        style={{
          transformOrigin: "top center",
          perspective: "1000px",
        }}
        transition={{ duration: 0.4, delay: 0 }}
        animate={{
          top:
            Flashcard.index === currentFlashcardIndex - 1
              ? 200
              : (Flashcard.index - currentFlashcardIndex) * -CARD_OFFSET,
          left:
            Flashcard.index === currentFlashcardIndex - 1
              ? Flashcard.review_result === "bad"
                ? -200
                : 200
              : 0,

          opacity: Flashcard.index === currentFlashcardIndex - 1 ? 0 : 1,
          scale: 1 - (Flashcard.index - currentFlashcardIndex) * SCALE_FACTOR, // decrease scale for cards that are behind
          zIndex: flashcards?.length - Flashcard.index, //  decrease z-index for the cards that are behind
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d", // Enable 3D transformations
          }}
          animate={{
            rotateX: isFlip ? 180 : 0, // Flip effect
          }}
          className=""
          transition={{ duration, ease: "easeInOut" }}
        >
          {/* Front Side */}
          <motion.div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              scale: 0.97,
              backfaceVisibility: "hidden", // Hide when flipped
            }}
            exit={{ opacity: 0 }}
            animate={{ opacity: !isFlip ? 1 : 0 }}
            onClick={() => handlerFlip()}
            transition={{ duration, ease: "easeInOut" }}
            className=" "
          >
            <Card
              className={cn(
                " w-full h-full overflow-hidden  rounded-sm shadow-2xl border-t-3 border-b-[8px] border-x-3 ",
                Flashcard?.review_result === "default" && "border-color-4",
                Flashcard?.review_result === "bad" && "border-warning",
                Flashcard?.review_result === "good" && "border-success"
              )}
            >
              <CardBody
                className={cn(
                  " py-2  grid   gap-6 overflow-hidden grid-cols-2",
                  Flashcard?.review_result === "default" && "bg-color-4/20",
                  Flashcard?.review_result === "bad" && "bg-warning/20",
                  Flashcard?.review_result === "good" && "bg-success/20"
                )}
              >
                <Image
                  alt="Card front"
                  loading="lazy"
                  src={Flashcard?.front_image}
                  isZoomed
                  disableSkeleton={false}
                  height={400}
                  className=" rounded-sm order-2 border-gray-400 flex justify-center items-center content-center"
                  radius="sm"
                />
                <div className=" w-full h-full  flex justify-center items-center overflow-y-scroll">
                  <span className=" text-6xl font-bold">
                    {Flashcard?.index}
                    {Flashcard?.front_text}
                  </span>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Back Side */}
          <motion.div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden", // Hide when flipped
              transform: "rotateX(180deg)", // Rotate back face
            }}
            animate={{ opacity: !isFlip ? 0 : 1 }}
            transition={{ duration, ease: "easeInOut" }}
            onClick={() => handlerFlip()}
          >
            <Card
              className={cn(
                "  w-full h-full overflow-hidden  rounded-sm shadow-2xl border-color-4 border-t-3 border-b-[8px] border-x-3 ",
                Flashcard?.review_result === "default" && "border-color-4",
                Flashcard?.review_result === "bad" && "border-warning",
                Flashcard?.review_result === "good" && "border-success"
              )}
            >
              <CardBody
                className={cn(
                  " py-2  grid   gap-6 overflow-hidden grid-cols-2",
                  Flashcard?.review_result === "default" && "bg-color-4/20",
                  Flashcard?.review_result === "bad" && "bg-warning/20",
                  Flashcard?.review_result === "good" && "bg-success/20"
                )}
              >
                <Image
                  alt="Card front"
                  loading="lazy"
                  height={400}
                  isZoomed
                  className="object-fill rounded-sm aspect-square border-2 border-gray-400 "
                  src={Flashcard?.back_image}
                  radius="sm"
                />
                <div className=" w-full h-full  flex flex-col justify-center items-center">
                  <span className=" text-6xl font-bold">
                    {Flashcard?.back_text}
                  </span>
                  <span>{Flashcard?.back_example}</span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
      {Flashcard.index === currentFlashcardIndex && (
        <Button
          className=" absolute translate-x-full translate-y-1/2 bottom-1/2 -right-4 border-x-2 border-t-2 border-b-4 bg-color-3/20 border-color-3"
          radius="sm"
          variant="flat"
          startContent={<CgEditFlipV size={20} />}
          onClick={() => {
            handlerFlip();
          }}
          size="lg"
        >
          Flip
        </Button>
      )}
    </>
  );
};
let interval: any;

export const FlipCardList = ({
  offset,
  scaleFactor,
}: {
  offset?: number;
  scaleFactor?: number;
}) => {
  const { flashcards, currentFlashcardIndex } = useAppSelector(
    (state) => state.ReviewFlashCard
  );

  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;

  const dispatch = useAppDispatch();
  return (
    <div className=" flex flex-col justify-center items-center gap-4">
      <motion.div
        style={{
          backgroundColor: "transparent",
          perspective: "1000px",
        }}
        className={cn(" relative lg:w-[1000px] lg:h-[450px] w-20 h-20")}
      >
        <AnimatePresence>
          {flashcards?.map((card, index) => {
            return (
              <FlipCard
                index={index}
                CARD_OFFSET={CARD_OFFSET}
                SCALE_FACTOR={SCALE_FACTOR}
                Flashcard={card}
              ></FlipCard>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <div className=" flex items-center justify-center gap-8">
        <Button
          className=" border-x-2 border-t-2 border-b-4 border-warning"
          radius="sm"
          color="warning"
          variant="flat"
          startContent={<BiDislike size={20} />}
          onClick={() => {
            dispatch(
              updateReviewResultWithIndex({
                index: currentFlashcardIndex,
                review_result: "bad",
              })
            );
            dispatch(setCurrentFlashcardIndex(currentFlashcardIndex + 1));
          }}
          size="lg"
        >
          bad
        </Button>
        <Button
          size="lg"
          className=" border-x-2 border-t-2 border-b-4 border-success"
          radius="sm"
          color="success"
          variant="flat"
          onPress={() => {
            dispatch(
              updateReviewResultWithIndex({
                index: currentFlashcardIndex,
                review_result: "good",
              })
            );

            dispatch(setCurrentFlashcardIndex(currentFlashcardIndex + 1));
          }}
          startContent={<BiLike size={20} />}
        >
          good
        </Button>
      </div>
    </div>
  );
};

export default FlipCard;
