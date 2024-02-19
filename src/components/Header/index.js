import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white text-white p-4 flex justify-between items-center ">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src="/Logo.png" alt="Logo" width={40} height={40} />
        <span className="font-semibold text-lg"></span>
      </div>

      {/* Other Header Content */}
      <nav>
        {/* Navigation Links */}
      </nav>
    </header>
  );
};

export default Header;
