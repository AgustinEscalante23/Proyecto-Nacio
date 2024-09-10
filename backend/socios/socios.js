import { useState, useEffect } from 'react';
import axios from 'axios';

const Socios = () => {
    const [socios, setSocios] = useState([]);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        dni: '',
        domicilio: '',
        telefono: '',
        meses: 0,
    });

    useEffect(() => {
        fetchSocios();
    }, []);

    const fetchSocios = async () => {
        const response = await axios.get('http://localhost:8000/api/socios/');
        setSocios(response.data);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/api/socios/', formData);
        fetchSocios();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/api/socios/${id}/`);
        fetchSocios();
    };

    const handleEdit = async (id) => {
        const socio = socios.find((socio) => socio.id === id);
        setFormData(socio);
    };

    return (
        <div>
            <h1>Gestión de Socios</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre_completo"
                    placeholder="Nombre Completo"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="domicilio"
                    placeholder="Domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="meses"
                    placeholder="Meses"
                    value={formData.meses}
                    onChange={handleChange}
                />
                <button type="submit">Registrar</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Domicilio</th>
                        <th>Teléfono</th>
                        <th>Meses</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {socios.map((socio) => (
                        <tr key={socio.id}>
                            <td>{socio.nombre_completo}</td>
                            <td>{socio.dni}</td>
                            <td>{socio.domicilio}</td>
                            <td>{socio.telefono}</td>
                            <td>{socio.meses}</td>
                            <td>
                                <button onClick={() => handleEdit(socio.id)}>Editar</button>
                                <button onClick={() => handleDelete(socio.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Socios;