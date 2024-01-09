import React, { useEffect, useState } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';

const VentaRealizada = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [nroFactura, setNroFactura] = useState('');
    const [ventas, setVentas] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        consultarVentas();
    }, [])


    const verDetalle = (id) => {
        navigate('/detalle-comprobante-venta/' + id);
    }
    const consultarVentas = async (searchInput) => {
        try {
            let url = searchInput ? `${URL}/venta?nro_factura_like=${searchInput}` :
                `${URL}/venta`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setVentas(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleChange = (e) => {
        setNroFactura(e.target.value);
        consultarVentas(e.target.value);
    }

    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article className='text-center'>
                    <h1>Ventas realizadas</h1>
                </article>
                <article>
                    <form className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                            <div className='form-group col-6 mt-2'>
                                <label>Nro Factura</label>
                                <input value={nroFactura} onChange={(e) => handleChange(e)} className='form-control' type="number" />
                            </div>
                        </article>
                    </form>

                    {/* Tabla */}
                    <article className='mt-4 mb-2 contenedor-tabla'>
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Nro-Factura</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas?.map((ven, index) => (
                                    <tr key={index}>
                                        <td>{ven.fecha_registro}</td>
                                        <td>{ven.nro_factura}</td>
                                        <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(ven.total))}</td>
                                        <td>{ven.estado}</td>
                                        <td><button onClick={() => verDetalle(ven.id)} className='btn btn-warning'>Ver</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>
                </article>
            </section>
        </section>
    );
};

export default VentaRealizada;