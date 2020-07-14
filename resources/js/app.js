window._ = require('lodash');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Index from './components/Index';
import TodoAppIndex from './components/TodoApp/Index';
import Nav from './elements/Aside';

const App = () => (
  <Router>
    <div className="container">
        <Nav />
        <main>
            <Route exact path="/" component={Index}/>
            <Route exact path="/todoapp" component={TodoAppIndex}/>
        </main>
    </div>
  </Router>
);
export default App;

ReactDOM.render(<App />, document.getElementById('root'));