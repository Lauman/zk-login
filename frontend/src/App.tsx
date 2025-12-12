import { useState } from 'react'

import './App.css'
import { zkLogin } from './scripts/zkLogin';

export default function App() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");


  const handleLogin = async () => {
    setMsg("Generando prueba...");
    try {
      await zkLogin(password);
      setMsg("Login exitoso con ZK!");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>ZK Login Demo</h1>
      <input
        type="password"
        placeholder="Ingresa tu password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{msg}</p>
    </div>
  );
}
