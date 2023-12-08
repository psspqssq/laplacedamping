import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './damping.css';

const DampingDemo = () => {
  const [time, setTime] = useState([]);
  const [response, setResponse] = useState([]);
  const [dampingRatio, setDampingRatio] = useState(0.1);
  const [angularFrequency, setAngularFrequency] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);

  useEffect(() => {
    const calculateResponse = () => {
      const timeValues = [];
      const responseValues = [];

      const dt = 0.1; // Paso de tiempo
      const steps = 100; // Número de pasos

      for (let i = 0; i <= steps; i++) {
        const t = i * dt;
        timeValues.push(t);

        // Método numérico (método de Euler) para la transformada inversa de Laplace
        let sum = 0;
        for (let k = 0; k < steps; k++) {
          const s = k / dt;
          const num = angularFrequency ** 2;
          const den = s ** 2 + 2 * dampingRatio * angularFrequency * s + angularFrequency ** 2;
          sum += (num / den) * Math.exp(-s * t) * dt;
        }
        responseValues.push(sum);
      }

      setTime(timeValues);
      setResponse(responseValues);
    };

    calculateResponse();
  }, [dampingRatio, angularFrequency]);

  const visibleIndices = time
    .map((t, index) => (t >= startTime && t <= endTime ? index : null))
    .filter((index) => index !== null);

  const data = [
    {
      type: 'scatter',
      mode: 'lines',
      x: visibleIndices.map((index) => time[index]),
      y: visibleIndices.map((index) => response[index]),
      marker: { color: 'blue' },
    },
  ];

  const layout = {
    title: 'Respuesta en el Tiempo',
    xaxis: { title: 'Tiempo' },
    yaxis: { title: 'Amplitud' },
  };

  const tableData = time.map((t, index) => ({
    time: t.toFixed(2),
    amplitude: response[index].toFixed(4),
  }));

  return (
    <div>
      <h1>Simulación del Oscilador Armónico Amortiguado</h1>
      <p>
        En esta simulación, exploramos el comportamiento de un oscilador armónico amortiguado en el tiempo. El oscilador
        armónico amortiguado es un sistema clásico donde una masa unida a un resorte experimenta amortiguamiento debido
        a una fuerza externa. La respuesta de dicho sistema es fundamental en diversos campos, incluyendo la física y la
        ingeniería.
      </p>
      <p>
        La simulación utiliza métodos numéricos para calcular la respuesta basada en la transformada inversa de Laplace.
        Dos parámetros clave, el Coeficiente de Amortiguamiento (ζ) y la Frecuencia Angular (ω), influyen
        significativamente en el comportamiento del sistema.
      </p>
      <h2>Parámetros de la Simulación</h2>
      <div>
        <label>Coeficiente de Amortiguamiento (ζ):</label>
        <input
          type="number"
          step="0.1"
          value={dampingRatio}
          onChange={(e) => setDampingRatio(parseFloat(e.target.value))}
        />
        <p>
          El coeficiente de amortiguamiento (ζ) mide el nivel de amortiguamiento en el sistema. Un valor ζ más alto
          indica un amortiguamiento más fuerte, lo que resulta en una rápida disminución de las oscilaciones.
          Contrariamente, un valor ζ más bajo indica menos amortiguamiento, lo que lleva a una disminución más lenta.
        </p>
      </div>
      <div>
        <label>Frecuencia Angular (ω):</label>
        <input
          type="number"
          step="0.1"
          value={angularFrequency}
          onChange={(e) => setAngularFrequency(parseFloat(e.target.value))}
        />
        <p>
          La frecuencia angular (ω) determina la frecuencia de las oscilaciones en el sistema. Un valor ω más alto
          resulta en oscilaciones más rápidas, mientras que un valor ω más bajo lleva a oscilaciones más lentas.
          Ajustar ω le permite controlar la frecuencia de las oscilaciones amortiguadas.
        </p>
      </div>
      <div>
        <label>Tiempo de Inicio:</label>
        <input type="number" step="0.1" value={startTime} onChange={(e) => setStartTime(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Tiempo de Fin:</label>
        <input type="number" step="0.1" value={endTime} onChange={(e) => setEndTime(parseFloat(e.target.value))} />
      </div>
      <div>
        <Plot data={data} layout={layout} />
      </div>
      <h2>Resultados de la Simulación</h2>
      <table>
        <thead>
          <tr>
            <th>Tiempo</th>
            <th>Amplitud</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.time}</td>
              <td>{row.amplitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DampingDemo;