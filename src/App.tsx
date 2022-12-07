import React from 'react';

import './App.css'

function App() {
  // Entradas
  const riverWidth = 900;
  const factoryDistance = 3000;
  const cableCostByRiver = 5;
  const cableCostByGround = 4;

  // ---
  const criticalPoint = Math.sqrt(Math.pow(cableCostByGround, 2) * Math.pow(riverWidth, 2) / (Math.pow(cableCostByRiver, 2) - Math.pow(cableCostByGround, 2)));

  // Saidas
  const costFunction =
  cableCostByRiver * Math.sqrt(Math.pow(riverWidth, 2) + Math.pow(criticalPoint, 2)) +
  cableCostByGround * (3000 - criticalPoint);
  const shortestDistanceByRiver = Math.sqrt(Math.pow(criticalPoint, 2) + Math.pow(riverWidth, 2));
  const shortestDistanceByGround = factoryDistance - criticalPoint;

  return (
    <React.Fragment>
      <div style={{ display: 'flex' }}>
        <h1>{costFunction.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h1>
        <h1 style={{ padding: '0 20px'}}>{shortestDistanceByRiver}m</h1>
        <h1>{shortestDistanceByGround}m</h1>
      </div>
    </React.Fragment>
  )
}

export default App;
