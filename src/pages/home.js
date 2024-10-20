import React from 'react';
import { motion } from 'framer-motion';
import Layout from "../components/Layout";

// Images
import globe from "../public/Globe.jpg";
import timeline from "../public/timeline.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function Home() {
  return (
    <Layout>
      <div className="bg-black text-gray-100 pb-16">
        {/* Introduction */}
        <motion.div
          className="w-11/12 md:w-3/4 lg:w-2/3 m-auto flex flex-col items-center pt-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl text-center font-extrabold leading-tight">
            Memories
            <br />
            Across the Globe
          </h1>
          <motion.img
            src={globe}
            className="mt-8 rounded-lg shadow-lg transition-transform"
            alt="Globe"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ duration: 0.8, delay: 0.1}}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          className="py-4 mt-8 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Combine all of your favorite memories onto one giant collaborative map.
          <br />
          Build your own timeline of those meaningful events.
        </motion.div>

        <motion.h2
          className="text-5xl text-center font-bold leading-tight mt-24 mb-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          A Glimpse into the past,
        </motion.h2>
        
        <motion.div
          className="w-11/12 md:w-3/4 lg:w-2/3 m-auto flex flex-col items-center p-8"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <img
            src={timeline}
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
            alt="Timeline"
          />
        </motion.div>

        <motion.h2
          className="text-5xl text-center font-bold leading-tight mt-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 1 }}
        >
          A Glimpse into the future.
        </motion.h2>

        {/* Description */}
        <motion.div
          className="py-4 mt-16 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Use a cutting-edge AI model to generate potential new memories.
          <br />
          The future is at your fingertips.
        </motion.div>
      </div>
    </Layout>
  );
}
