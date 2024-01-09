import React, { useEffect, useRef, useState } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';

const Caja = () => {
    const URL = process.env.REACT_APP_API_URL;
    // fecha para buscar
    const fechaDesdeRef = useRef(null);
    const fechaHastaRef = useRef(null);
    // ==================
    const [cajas, setCajas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        consultarCajas();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        consultarCajas(fechaDesdeRef.current.value, fechaHastaRef.current.value);
    }
    const consultarCajas = async (fechaDesde, fechaHasta) => {
        try {
            let url;
            if (fechaDesde && fechaHasta) {
                // Si se proporcionan ambas fechas, incluir en la URL
                url = `${URL}/caja?fecha_gte=${fechaDesde}&fecha_lte=${fechaHasta}`;
            } else {
                // Si no se proporcionan ambas fechas, obtener todas las cajas
                url = `${URL}/caja`;
            }
            const res = await fetch(url);

            if (res.status === 200) {
                const listarcaja = await res.json();
                setCajas(listarcaja);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const abrirDetalle = async (id) => {
        navigate('/historial-caja/' + id);
    }
    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Historial Cajas</h1>
            </div>
            <div className='contenedor-buscar'>
                <section className=' mt-5 d-flex justify-content-center align-items-center'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group d-flex justify-content-end align-items-end'>

                            <article className='d-flex flex-wrap justify-content-around'>
                                <div>
                                    <div className="form-group me-1 mt-3">
                                        <label>Fecha desde: </label>
                                        <input ref={fechaDesdeRef} className='form-control' type='date' />
                                    </div>
                                </div>
                                <div>
                                    <div className="form-group me-1 mt-3">
                                        <label>Fecha hasta: </label>
                                        <input ref={fechaHastaRef} className='form-control' type='date' />
                                    </div>
                                </div>
                            </article>

                            <button type='submit' className='btn btn-dark'>Buscar</button>
                        </div>
                    </form>
                </section>
                <section className='my-5 contenedor-tabla'>
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Fecha Apertura</th>
                                <th>Fecha Cierre</th>
                                <th>Nro Caja</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cajas.map((caj, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>{caj.fecha_apertura}</td>
                                        <td>{caj.fecha_cierre}</td>
                                        <td>{caj.nro_caja}</td>
                                        <td>
                                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(caj.monto_total)}
                                        </td>
                                        <td>{caj.estado_caja}</td>
                                        <td><button onClick={() => abrirDetalle(caj.id)} className='btn btn-warning'>Ver</button></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

        </section>
    );
};

export default Caja;