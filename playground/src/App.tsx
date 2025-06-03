import React from 'react';

function App() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      Hello World
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default App;
