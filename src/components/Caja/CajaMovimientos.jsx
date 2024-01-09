import React, { useEffect, useRef, useState } from 'react';
import ModalCaja from './ModalCaja';
import '../../css/consulta.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CajaMovimientos = () => {
    const URL = process.env.REACT_APP_API_URL;
    // fecha para buscar
    const fechaDesdeRef = useRef(null);
    const fechaHastaRef = useRef(null);
    // datos mostrar
    const fechaAperturaRef = useRef(null);
    const fechaCierreRef = useRef(null);
    const nroCajaRef = useRef(null);
    const montoAperturaRef = useRef(null);
    const montoCierreRef = useRef(null);
    const diferenciaRef = useRef(null);
    const montoDiferenciaRef = useRef(null);
    const totalRef = useRef(null);
    const estadoRef = useRef(null);

    const navigate = useNavigate();
    // ================== //
    const [movimiento, setMovimiento] = useState([]);
    const CajaId = useParams();
    const opciones = [
        { value: '', label: 'Selecciona un movimiento' },
        { value: 'CompraMercaderia', label: 'Compra de mercancía para el stock del kiosko' },
        { value: 'PagoServicio', label: 'Pagos de servicios públicos (electricidad, agua, etc.)' },
        { value: 'GastoLimpieza', label: 'Gastos de limpieza y mantenimiento' },
        { value: 'PagoSalario', label: 'Pago de salarios a empleados' },
        { value: 'Venta', label: 'VENTA' },
    ];

    useEffect(() => {
        if (CajaId) {
            consultarMovimientos();
            consultarCaja();
        }
    }, []);
    const volverParaAtras = () => {
        navigate(-1);
    }
    const consultarCaja = async () => {
        try {
            const urlEditar = `${URL}/caja/${CajaId.id}`;

            const res = await fetch(urlEditar);

            if (res.status === 200) {
                const caja = await res.json();
                // Cargar datos
                // diferencia
                const diferencia_texto = caja.diferencia > 0 ? 'SOBRANTE' : caja.diferencia < 0 ? 'FALTANTE'
                    : 'COINCIDE';

                fechaAperturaRef.current.value = caja.fecha_apertura;
                fechaCierreRef.current.value = caja.fecha_cierre;
                nroCajaRef.current.value = caja.nro_caja;
                montoAperturaRef.current.value = caja.monto_apertura;
                montoCierreRef.current.value = caja.monto_cierre;
                diferenciaRef.current.value = diferencia_texto;
                montoDiferenciaRef.current.value = caja.diferencia || 0;
                totalRef.current.value = caja.monto_total;
                estadoRef.current.value = caja.estado_caja;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const consultarMovimientos = async () => {
        try {
            let url = `${URL}/movimiento?caja_id=${CajaId.id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listarMov = await res.json();
                setMovimiento(listarMov);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className='w-100 mt-3'>
            <article className='d-flex justify-content-around align-items-center'>
                <div className='my-5 ms-4'>
                    <button onClick={() => volverParaAtras()} className='btn-volver'>
                        <FontAwesomeIcon className='fa-xl' icon={faCircleArrowLeft} />
                    </button>
                </div>
                <div className='m-auto my-5'>
                    <h1>Historial de movimientos</h1>
                </div>
            </article>

            <div className='contenedor-buscar'>
                <section className=' mt-5 d-flex justify-content-center align-items-center'>
                    <form>
                        <article className='row'>
                            <div className='col-lg-4 col-md-4 col-sm-12 form-group'>
                                <label>Numero de caja</label>
                                <input disabled ref={nroCajaRef} className='form-control' type="text" />
                            </div>
                            <article className='row col-12 my-2'>
                                <div className='col-6 form-group'>
                                    <label>Fecha Apertura</label>
                                    <input disabled ref={fechaAperturaRef} className='form-control' type="text" />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Fecha Cierre</label>
                                    <input disabled ref={fechaCierreRef} className='form-control' type="text" />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Monto Apertura</label>
                                    <input disabled ref={montoAperturaRef} className='form-control' type="text" />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Monto Cierre</label>
                                    <input disabled ref={montoCierreRef} className='form-control' type="text" />
                                </div>

                            </article>
                            <div className='col-lg-4 col-md-4 col-sm-12 form-group'>
                                <label>Monto Total Registrado</label>
                                <input disabled ref={totalRef} className='form-control' type="text" />
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 form-group'>
                                <label>Monto Diferencia</label>
                                <input disabled ref={montoDiferenciaRef} className='form-control' type="text" />
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 form-group'>
                                <label>Diferencia</label>
                                <input disabled ref={diferenciaRef} className='form-control' type="text" />
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-12 form-group'>
                                <label>Estado</label>
                                <input disabled ref={estadoRef} className='form-control' type="text" />
                            </div>
                        </article>
                        <hr />
                        <div className='form-group d-flex justify-content-end align-items-end'>
                            <article className='d-flex flex-wrap'>
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
                                <th>Nro</th>
                                <th>Fecha</th>
                                <th>Detalle</th>
                                <th>Movimiento</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimiento.map((mov, index) => {
                                const opcionEncontrada = opciones.find((opcion) => opcion.value === mov.descripcion);

                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td>{mov.nro_movimiento}</td>
                                            <td>{mov.fechaRegistro}</td>
                                            <td>{opcionEncontrada ? opcionEncontrada.label : mov.descripcion}</td>
                                            <td className={mov.tipoMovimiento === 'INGRESO' ? 'ingreso' : 'egreso'}>{mov.tipoMovimiento}</td>
                                            <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(mov.monto))}</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </div>
        </section >
    );
};

export default CajaMovimientos;
