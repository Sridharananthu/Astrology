import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center mt-auto w-full overflow-hidden">
      <p>
        © {new Date().getFullYear()} AstroConnect. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
