import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
  baseURL: 'https://life-is-sense-backend-production.up.railway.app/'
});

function App() {
  const [lifesenseData, setLifesenseData] = useState([]);
  const [newName, setNewName] = useState('');
  const [newLifeSense, setNewLifeSense] = useState('');

  useEffect(() => {
    api.get('/lifesense').then((res) => {
      console.log(res);
      setLifesenseData(res.data)
    })
  }, [])

  function addInformation() {
    const newLifeSenseData = {
      name: newName,
      lifeSense: newLifeSense,
      id: uuidv4(),
    };

    api.post('/lifesense', newLifeSenseData).then((res) => {
      setLifesenseData([...lifesenseData, newLifeSenseData]);
      console.log(res);
    });
  }

  return (
    <>
      <div className="container">
        <div className='centering'>
          <h1>Life Sense</h1>
          <h2>Help others find their purpose.</h2>
          <input placeholder='Name' onChange={event => setNewName(event.target.value)} />
          <input placeholder='LifeSense' onChange={event => setNewLifeSense(event.target.value)} />
          <button onClick={addInformation}>Add information</button>
        </div>
        <div>
          <h2>See the information below. Maybe you&apos;ll discover something about your purpouse.</h2>
          <ul>
            {lifesenseData.map(data => (
              <li key={data.id}> Name: {data.name} - LifeSense: {data.lifeSense}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App;
