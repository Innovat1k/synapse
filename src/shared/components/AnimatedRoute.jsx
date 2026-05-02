import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";

export const AnimatedRoute = ({ children }) => (
  <AnimatePresence mode="wait">
    <PageTransition>{children}</PageTransition>
  </AnimatePresence>
);
