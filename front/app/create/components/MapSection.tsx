"use client";

import { motion } from "framer-motion";

export const MapSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center"
    >
      <p className="text-muted-foreground">地図が表示されます</p>
    </motion.div>
  );
};
