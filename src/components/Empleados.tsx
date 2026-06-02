import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Empleado, Departamento } from '../types'

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [nombre, setNombre] = useState('')
  const [puesto, setPuesto] = useState('')
  const [salario, setSalario] = useState('')
  const [departamentoId, setDepartamentoId] = useState('')
  const [editando, setEditando] = useState<Empleado | null>(null)

  useEffect(() => {
    fetchEmpleados()
    fetchDepartamentos()
  }, [])

  async function fetchEmpleados() {
    const { data } = await supabase.from('empleados').select('*')
    if (data) setEmpleados(data)
  }

  async function fetchDepartamentos() {
    const { data } = await supabase.from('departamentos').select('*')
    if (data) setDepartamentos(data)
  }

  async function agregarEmpleado() {
    if (!nombre.trim() || !puesto.trim() || !salario || !departamentoId) {
      return alert('Todos los campos son requeridos')
    }
    await supabase.from('empleados').insert([{
      nombre,
      puesto,
      salario: Number(salario),
      departamento_id: departamentoId
    }])
    setNombre('')
    setPuesto('')
    setSalario('')
    setDepartamentoId('')
    fetchEmpleados()
  }

  async function eliminarEmpleado(id: string) {
    await supabase.from('empleados').delete().eq('id', id)
    fetchEmpleados()
  }

  async function guardarEdicion() {
    if (!editando || !editando.nombre.trim() || !editando.puesto.trim()) {
      return alert('Todos los campos son requeridos')
    }
    await supabase
      .from('empleados')
      .update({
        nombre: editando.nombre,
        puesto: editando.puesto,
        salario: editando.salario,
        departamento_id: editando.departamento_id
      })
      .eq('id', editando.id)
    setEditando(null)
    fetchEmpleados()
  }

  function getNombreDepartamento(id: string) {
    return departamentos.find((d) => d.id === id)?.nombre || 'Sin departamento'
  }

  return (
    <div>
      <h2>Gestión de Empleados</h2>

      <div className="form-card">
        <h3>Añadir Nuevo Empleado</h3>
        <div className="form-row">
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input placeholder="Puesto (Ej: Desarrollador)" value={puesto} onChange={(e) => setPuesto(e.target.value)} />
          <input placeholder="Salario" type="number" value={salario} onChange={(e) => setSalario(e.target.value)} />
          <select value={departamentoId} onChange={(e) => setDepartamentoId(e.target.value)}>
            <option value="">Seleccionar Departamento</option>
            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>{dep.nombre}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={agregarEmpleado}>Añadir Empleado</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Departamento</th>
            <th>Salario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id}>
              {editando?.id === emp.id ? (
                <>
                  <td><input value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} /></td>
                  <td><input value={editando.puesto} onChange={(e) => setEditando({ ...editando, puesto: e.target.value })} /></td>
                  <td>
                    <select value={editando.departamento_id} onChange={(e) => setEditando({ ...editando, departamento_id: e.target.value })}>
                      {departamentos.map((dep) => (
                        <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" value={editando.salario} onChange={(e) => setEditando({ ...editando, salario: Number(e.target.value) })} /></td>
                  <td>
                    <button className="btn-edit" onClick={guardarEdicion}>Guardar</button>
                    <button className="btn-delete" onClick={() => setEditando(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{emp.nombre}</td>
                  <td>{emp.puesto}</td>
                  <td>{getNombreDepartamento(emp.departamento_id)}</td>
                  <td>${emp.salario.toLocaleString()}</td>
                  <td>
                    <button className="btn-edit" onClick={() => setEditando(emp)}>Editar</button>
                    <button className="btn-delete" onClick={() => eliminarEmpleado(emp.id)}>Eliminar</button>
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