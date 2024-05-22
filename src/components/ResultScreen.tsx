import {motion} from "framer-motion"

interface Props {
  onStart: () => void;
  results: number
}

const ResultScreen = ({onStart,results}:Props) => {
  
  let verbalEvaluation = ""
  switch (true) {
    case results < 5:
      verbalEvaluation = "Zeměpis asi není tvoje silná stránka!";
      break;
    case results <= 6:
      verbalEvaluation = "Dobře!";
      break;
    case results <= 8:
      verbalEvaluation = "Velmi dobře!";
      break;
    case results <= 10:
      verbalEvaluation = "Výborně!";
      break;
  }
   const variants = {
     initial: { opacity: 0, x: "100%" }, // Off-screen to the right
     animate: { opacity: 1, x: 0 }, // Animate to the center
     exit: { opacity: 0, x: "-100%" }, // Exit to the left
   };
    const transition = { duration: 1.5 };
  
  return (
    <motion.div
      className="general-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      layout
      transition={transition}
    >
      <h1>Konec hry</h1>
      <p className="result">{verbalEvaluation}</p>
      <p>Uhodl jsi {results}/10 států</p>
      <button onClick={onStart} className="btn white--border pink--color">
        Začít hru znovu
      </button>
    </motion.div>
  );
};

export default ResultScreen;
