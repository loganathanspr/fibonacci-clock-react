import React from 'react';
import ReactDOM from 'react-dom';
import FibonacciClockApp from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<FibonacciClockApp />, document.getElementById("root"));
registerServiceWorker();
