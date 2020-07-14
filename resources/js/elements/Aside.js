import React from 'react';
import { Link } from 'react-router-dom';

const Aside = () => (
  <aside className="Nav">
        <ul className="navi">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/todoapp">TodoApp</Link></li>
    </ul>
  </aside>
);

export default Aside;