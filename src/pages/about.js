import React from 'react';
import { motion } from 'framer-motion';
import Layout from "../components/Layout";

// Images
import aboutImage from "../public/memories.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function About() {
  return (
    <Layout>
      <div className="bg-black text-gray-100 pb-16">
        {/* Title */}
        <motion.div
          className="w-11/12 md:w-3/4 lg:w-2/3 m-auto flex flex-col items-center pt-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl text-center font-extrabold leading-tight">
            About Us
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div
          className="py-4 mt-8 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          We are dedicated to bringing your memories to life through technology.
          <br />
          Our mission is to create a platform where every moment matters.
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="w-11/12 md:w-3/4 lg:w-2/3 m-auto flex flex-col items-center p-8"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img
            src={aboutImage}
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
            alt="About Us"
          />
        </motion.div>

        {/* Our Values */}
        <motion.h2
          className="text-5xl text-center font-bold leading-tight mt-24 mb-4"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Our Values
        </motion.h2>

        <motion.div
          className="py-4 mt-4 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ul className="list-disc list-inside">
            <li>Innovation: Embracing cutting-edge technology.</li>
            <li>Collaboration: Working together to build memories.</li>
            <li>Accessibility: Making our platform easy for everyone.</li>
          </ul>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          className="py-4 mt-16 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Join us on this journey to create and cherish unforgettable memories!
        </motion.div>
      </div>
    </Layout>
  );
}
