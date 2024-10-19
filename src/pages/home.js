import React from 'react'
import Layout from "../components/Layout";

//Images
import globe from "../public/Globe.jpg"
import timeline from "../public/timeline.png"

export default function Home() {
  return (
    <Layout>
        <div className="bg-black pb-16">
            {/*Introduction*/}
            <div className="w-11/12 m-auto z-10 flex flex-col items-center pt-16">
                <div className="text-gray-100 text-6xl text-center p-2 mt-8 font-bold leading-tight">
                Memories
                <br />
                Across the globe
                </div>
                <img src={globe} layout="fixed" width={650} height={650}/>
            </div>

            {/*Description*/}
            <div className="py-4 mt-8 text-center text-3xl font-semibold text-gray-100 leading-loose">
                Combine all of your favorite memories onto one giant collaborative map.
                <br />
                Build your own timeline of those meaningful events.
            </div>

            <div className="text-gray-100 text-5xl text-center mt-24 font-bold leading-tight mb-4">
                A Glimpse into the past,
            </div>
            <div className="w-4/5 m-auto z-0 flex flex-col items-center p-8">
                <img src={timeline} layout="fixed" width={1000}/>
            </div>
            <div className="text-gray-100 text-5xl text-center font-bold leading-tight mt-4">
                A Glimpse into the future.
            </div>

            {/*Description*/}
            <div className="py-4 mt-16 text-center text-3xl font-semibold text-gray-100 leading-loose">
                Use a cutting edge AI model to generate potential new memories.
                <br />
                The future is at your fingertips.
            </div>
        </div>
    </Layout>
  );
}