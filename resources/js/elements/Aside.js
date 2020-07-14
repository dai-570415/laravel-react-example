import React from 'react';
import { Link } from 'react-router-dom';

const Aside = () => (
  <div className="Nav">
        <ul className="navi">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/todoapp">TodoApp</Link></li>
    </ul>
  </div>
);

export default Aside;