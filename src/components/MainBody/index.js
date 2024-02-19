import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const MainBody = () => {
  return (
    <main className="bg-white flex flex-col justify-between h-screen">
      <div className="px-4 py-8 md:px-8 lg:px-16 xl:px-32 flex-grow">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold text-center text-black mb-4">
            Docs Image Downloader
          </h1>
          <p className=" text-center text-gray-700 mb-8">
            Download docs images in a single click. Try it now to streamline
            your processes & save time.
          </p>
          <form className="flex flex-col items-center justify-center mb-8">
            <input
              type="text"
              placeholder="Paste document URL here"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4 cursor-blink"
              style={{ animation: "blink 1s step-start 0s infinite" }}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-100 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Submit <FaArrowRightLong className="ml-2" />
            </button>
          </form>
        </div>
      </div>
      <div className="bg-black p-4"></div>
    </main>
  );
};

export default MainBody;
