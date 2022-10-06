import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expend-lg bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">Ephermeral Secret Sharing Website</a>
        <a className="navbar-brand" href="/secret/:id">Retrieve Secret</a>
      </div>
    </nav>
  );
};

export default Navbar;
