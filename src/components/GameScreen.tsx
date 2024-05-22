import { motion } from "framer-motion";
import { Countries } from "../assets/data/countries";
import { useRef, useState } from "react";
import { SVGMap } from "./SVGCompnents/SVGMap";
import cross from "../assets/images/cross.png";

interface Props {
  questionArray: number[];
  isFinished: (state: boolean, countCorrect: number) => void;
  onFinish: () => void;
}

interface Question {
  answer: boolean | undefined;
}

const GameScreen = ({ questionArray, isFinished, onFinish }: Props) => {
  const [isAnsweredCorrect, setIsAnsweredCorrect] = useState<
    boolean | undefined
  >(undefined);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

  const currentQuestion = answeredQuestions.length;
  const correctAnswers = useRef<number>(0);

  if (answeredQuestions.length > 0) {
    correctAnswers.current = answeredQuestions.reduce(
      (acc, cur) => (cur.answer ? ++acc : acc),
      0
    );
  }

  answeredQuestions.length === 10
    ? isFinished(true, correctAnswers.current)
    : "";

  function handleSelect(object: EventTarget & SVGPathElement) {
    if (isAnsweredCorrect !== undefined) {
      return;
    }
    const result: Question = { answer: undefined };
    if (object.id === Countries[questionArray[currentQuestion]][0]) {
      result.answer = true;
      setIsAnsweredCorrect(true);
    } else {
      result.answer = false;
      setIsAnsweredCorrect(false);
    }

    setTimeout(() => {
      setAnsweredQuestions((prevAnsweredQuestions) => [
        ...prevAnsweredQuestions,
        result,
      ]);
      setIsAnsweredCorrect(undefined);
    }, 3000);
  }

  const variants = {
    initial: { x: "150%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  };
  const variants2 = {
    initial: { opacity: 0, x: "-150%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  };
  const transition = { duration: 1.8 };
  const transition2 = { duration: 1 };

  return (
    <motion.div
      className="grid__game pink--color"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      layout
      transition={transition2}
    >
      <div className="grid-item banner ">
        <h2 className="country--name">
          {Countries[questionArray[currentQuestion]][1]}
        </h2>

        <div className="answer-grid">
          {isAnsweredCorrect === undefined ? (
            ""
          ) : isAnsweredCorrect ? (
            <motion.div
              className="capital-box"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants2}
              layout
              transition={transition}
            >
              <h4 className="title">Hlavní město:</h4>

              <h3 className="city">
                {Countries[questionArray[currentQuestion]][2]}
              </h3>
            </motion.div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants2}
              layout
              transition={transition}
            >
              <h3 className="wrong__answer">ŠPATNĚ</h3>
            </motion.div>
          )}

          {isAnsweredCorrect === undefined ? (
            ""
          ) : isAnsweredCorrect ? (
            <motion.img
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              layout
              transition={transition}
              className="flag"
              src={Countries[questionArray[currentQuestion]][3]}
              alt={Countries[questionArray[currentQuestion]][1] + " vlajka"}
            />
          ) : (
            <motion.img
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              layout
              transition={transition}
              src={cross}
              className="cross"
            />
          )}
        </div>
      </div>
      <div className="grid-item map">
        <SVGMap
          idState={Countries[questionArray[currentQuestion]][0]}
          isCorrect={isAnsweredCorrect}
          onSelect={(object) => handleSelect(object)}
        />
      </div>
      <div className="grid-item banner">
        <div className="score">Počet: {currentQuestion + 1}/10</div>
        <button className="btn-img">
          <h3 onClick={onFinish} className="end--game">
            Ukončit hru
          </h3>
        </button>
      </div>
    </motion.div>
  );
};

export default GameScreen;
