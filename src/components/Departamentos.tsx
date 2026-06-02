import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Departamento } from '../types'

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [editando, setEditando] = useState<Departamento | null>(null)

  useEffect(() => {
    fetchDepartamentos()
  }, [])

  async function fetchDepartamentos() {
    const { data } = await supabase.from('departamentos').select('*')
    if (data) setDepartamentos(data)
  }

  async function agregarDepartamento() {
    if (!nombre.trim()) return alert('El nombre es requerido')
    await supabase.from('departamentos').insert([{ nombre, ubicacion }])
    setNombre('')
    setUbicacion('')
    fetchDepartamentos()
  }

  async function eliminarDepartamento(id: string) {
    await supabase.from('departamentos').delete().eq('id', id)
    fetchDepartamentos()
  }

  async function guardarEdicion() {
    if (!editando || !editando.nombre.trim()) return alert('El nombre es requerido')
    await supabase
      .from('departamentos')
      .update({ nombre: editando.nombre, ubicacion: editando.ubicacion })
      .eq('id', editando.id)
    setEditando(null)
    fetchDepartamentos()
  }

  return (
    <div>
      <h2>Gestión de Departamentos</h2>

      <div>
        <h3>Añadir Nuevo Departamento</h3>
        <input
          placeholder="Nombre del Departamento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Ubicación (Ej: Piso 3)"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        />
        <button onClick={agregarDepartamento}>Añadir Departamento</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.map((dep) => (
            <tr key={dep.id}>
              {editando?.id === dep.id ? (
                <>
                  <td>
                    <input
                      value={editando.nombre}
                      onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={editando.ubicacion || ''}
                      onChange={(e) => setEditando({ ...editando, ubicacion: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={guardarEdicion}>Guardar</button>
                    <button onClick={() => setEditando(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{dep.nombre}</td>
                  <td>{dep.ubicacion}</td>
                  <td>
                    <button onClick={() => setEditando(dep)}>Editar</button>
                    <button onClick={() => eliminarDepartamento(dep.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}