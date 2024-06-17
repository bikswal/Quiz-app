import React from 'react';
import Start from './components/Start';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { DataProvider } from './context/dataContest';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Start/>
      <Quiz/>
      <Result/>
    </DataProvider>
  );
}

export default App;
