import React, { useEffect, useRef, useState } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';

const Caja = () => {
    const URL = process.env.REACT_APP_API_URL;

    // ==================
    const [cajas, setCajas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        consultarCajas();
    }, []);


    const consultarCajas = async () => {
        try {
            let url = `${URL}/caja`;

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