import { useState } from 'react'
import Empleados from './components/Empleados'
import Departamentos from './components/Departamentos'
import './App.css'

export default function App() {
  const [vista, setVista] = useState<'empleados' | 'departamentos'>('empleados')

  return (
    <div>
      <nav>
        <h1>Gestión Empresarial</h1>
        <div>
          <button onClick={() => setVista('departamentos')}>Departamentos</button>
          <button onClick={() => setVista('empleados')}>Empleados</button>
        </div>
      </nav>

      <main>
        {vista === 'empleados' ? <Empleados /> : <Departamentos />}
      </main>
    </div>
  )
}