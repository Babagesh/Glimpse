import React from 'react';
import { motion } from 'framer-motion';
import Layout from "../components/Layout";

// Images
import purposeImage from "../public/people.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function OurPurpose() {
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
            Our Purpose
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
          Our app is designed to help you organize and cherish your memories 
          in an easy and accessible way. 
          <br />
          We understand that remembering special moments can be challenging, 
          especially for those who may struggle with memory retention.
        </motion.div>

        {/* Additional Description */}
        <motion.div
          className="py-4 mt-4 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          With our intuitive platform, you can effortlessly capture, 
          store, and revisit your treasured memories whenever you need a 
          reminder of the beautiful experiences in your life.
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="w-11/12 md:w-3/4 lg:w-2/3 m-auto flex flex-col items-center p-8"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <img
            src={purposeImage}
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
            alt="Our Purpose"
          />
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          className="py-4 mt-16 text-center text-3xl font-semibold leading-loose"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Join us on this journey to create and celebrate memories that matter.
        </motion.div>
      </div>
    </Layout>
  );
}
