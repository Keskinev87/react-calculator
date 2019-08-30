import React from 'react';
import './App.css';
import Calculator from './components/Calculator';


const App: React.FC = () => {
  return (
    <div className="App">
      <header><span>ReactJS-based Calculator App</span></header>
      <Calculator />
      <footer></footer>
    </div>
  );
}

export default App;
