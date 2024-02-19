import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {

  return (
    <footer className="bg-gray-800 text-white py-8 fixed bottom-0 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm">&copy; {"2024"} Your Company. All rights reserved.</div>
        <div className="flex mt-4 md:mt-0">
          <a href="#" className="text-white hover:text-blue-500 mr-4"><FaFacebook /></a>
          <a href="#" className="text-white hover:text-blue-500 mr-4"><FaTwitter /></a>
          <a href="#" className="text-white hover:text-blue-500"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
