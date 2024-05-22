import { useState } from "react";
import GameScreen from "./components/GameScreen";
import HomeScreen from "./components/HomeScreen";
import { Countries } from "./assets/data/countries";
import ResultScreen from "./components/ResultScreen";
import React from "react";

function App() {
  const [questionArray, setQuestionArray] = useState<number[]>();
  const [finish, setFinish] = useState({ state: false, numberCQ: 0 });

  // Generates random number with in the length of countries list
  function generateQuestionArray() {
    let array: number[] = [];
    let countries = [...Countries];

    for (let i = 0; i < 10; i++) {
      const questionNumber: number = Math.floor(
        Math.random() * countries.length
      );
      if (array.includes(questionNumber)) {
        i--;
      } else {
        array.push(questionNumber);
      }
    }
    setQuestionArray(array);
  }

  function handleFinish(status: boolean, numberCorrectAnsweres: number) {
    setFinish(() => ({ state: status, numberCQ: numberCorrectAnsweres }));
  }

  function handleResetGame() {
    setFinish({ state: false, numberCQ: 0 });
    setQuestionArray(undefined);
  }

  return (
    <>
      {questionArray ? "" : <HomeScreen onStart={generateQuestionArray} />}
      {questionArray && !finish.state ? (
        <GameScreen
          onFinish={handleResetGame}
          isFinished={(state, numberCorrectAnsweres) =>
            handleFinish(state, numberCorrectAnsweres)
          }
          questionArray={questionArray}
        />
      ) : (
        ""
      )}
      {finish.state ? (
        <ResultScreen results={finish.numberCQ} onStart={handleResetGame} />
      ) : (
        ""
      )}
    </>
  );
}

export default App;
