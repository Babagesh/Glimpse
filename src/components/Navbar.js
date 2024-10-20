import React from "react";
import {Link} from "react-router-dom"

function Navbar() {
  return (
    <div className="fixed top-0 right-0 left-0 px-4 py-2.5 bg-transparent backdrop-blur-sm z-40 text-white flex justify-between align-center">
      <Link to="/">
        <button className="text-xl">
          <p>Glimpses</p>
        </button>
      </Link>
      <div className="flex items-center">
        {(
          <Link to="/ourpurpose">
            <button className="ml-8">
              <p>Our Purpose</p>
            </button>
          </Link>
        )}
        <Link to="/about">
          <button className="ml-8">
            <p>About</p>
          </button>
        </Link>
        {/*user.id ? (
          <button
            className="ml-8 bg-blue-600 py-1 px-6 rounded-md"
            //onClick={}
          >
            <a>Log Out</a>
          </button>
        ) : */(
          <Link to="/login">
            <button className="ml-8 bg-blue-600 py-1 px-6 rounded-md">
              <p>Login</p>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;