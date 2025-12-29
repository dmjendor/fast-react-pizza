import { useState } from 'react';
import './index.scss';

const App = () => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  function handleIncrementHours() {
    setHours((prev) => {
      const next = (Number(prev) + 1) % 24;
      return next.toString().padStart(2, '0');
    });
  }
  function handleDecrementHours() {
    if (hours === '00') {
      return setHours('23');
    }
    setHours((prev) => {
      const next = (Number(prev) - 1) % 24;
      return next.toString().padStart(2, '0');
    });
  }
  function handleIncrementMinutes() {
    setMinutes((prev) => {
      const next = (Number(prev) + 1) % 60;
      if (next > 59) {
        handleIncrementHours();
        return '00';
      }
      return next.toString().padStart(2, '0');
    });
  }
  function handleDecrementMinutes() {
    setMinutes((prev) => {
      const next = (Number(prev) - 1) % 60;
      if (next < 0) {
        return '59';
      }
      return next.toString().padStart(2, '0');
    });
  }

  return (
    <div id="ClockUpdater" className="container">
      <div className="row">
        <button
          id="hours-up-button"
          className="btn btn-outline-primary col"
          onClick={handleIncrementHours}
        >
          &uarr;
        </button>

        {/* Level 1: Add your code here */}
        <button
          id="minutes-up-button"
          className="btn btn-outline-primary col"
          onClick={handleIncrementMinutes}
        >
          &uarr;
        </button>
      </div>

      <div className="row">
        <div id="clock" className="badge badge-primary col">
          {`${hours}:${minutes}`}
        </div>
      </div>

      <div className="row">
        <button
          id="hours-down-button"
          className="btn btn-outline-primary col"
          onClick={handleDecrementHours}
        >
          &darr;
        </button>

        {/* Level 1: Add your code here */}
        <button
          id="minutes-down-button"
          className="btn btn-outline-primary col"
          onClick={handleDecrementMinutes}
        >
          &darr;
        </button>
      </div>
    </div>
  );
};

export default App;
