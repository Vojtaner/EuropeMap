import { motion } from "framer-motion";

interface Props {
  onStart: () => void;
}

const variants = {
  initial: { opacity: 0, x: "100%" }, // Off-screen to the right
  animate: { opacity: 1, x: 0 }, // Animate to the center
  exit: { opacity: 0, x: "-100%" }, // Exit to the left
};
const transition = { duration: 1.5 };
const HomeScreen = ({ onStart }: Props) => {
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
      <h1>
        SLEPÁ
        <br /> MAPA
      </h1>
      <p>
        Vítej! Pusť se do výzvy evropského cestovatele a uhodni všech 10
        států. Zvládneš to?
      </p>
      <button onClick={onStart} className="btn white--border pink--color">
        Začít hru
      </button>
    </motion.div>
  );
};

export default HomeScreen;
