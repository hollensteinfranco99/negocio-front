import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/consulta.css';
import ModalMovimiento from '../Movimiento/ModalMovimiento';
import Swal from 'sweetalert2';

const Movimiento = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [movimiento, setMovimiento] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [movimientoEditar, setMovimientoEditar] = useState(null);
    const [agregarOeditar, setAgregarOeditar] = useState('');
    const [pedidoId, setPedidoId] = useState(null);

    const opciones = [
        { value: '', label: 'Selecciona un movimiento' },
        { value: 'CompraMercaderia', label: 'Compra de mercancía para el stock del kiosko' },
        { value: 'PagoServicio', label: 'Pagos de servicios públicos (electricidad, agua, etc.)' },
        { value: 'GastoLimpieza', label: 'Gastos de limpieza y mantenimiento' },
        { value: 'PagoSalario', label: 'Pago de salarios a empleados' },
        { value: 'Venta', label: 'VENTA' },
    ];
    const rdbTodoRef = useRef(null);
    const pedidoParametro = useLocation();

    useEffect(() => {
        if (pedidoParametro.state) {
            setPedidoId(pedidoParametro.state.id);
            abrirAgregar();
        }
    }, [pedidoParametro.state]);


    useEffect(() => {
        consultarMovimientos();
    }, []);

    const consultarMovimientos = async (searchInput) => {
        try {
            let url;
            if (searchInput === "Todos" || searchInput === undefined || searchInput === '') {
                url = `${URL}/movimiento`;
            } else {
                url = `${URL}/movimientoDescripcion?descripcion_like=${searchInput}`;
            }
            const res = await fetch(url);

            if (res.status === 200) {
                const listarMov = await res.json();
                setMovimiento(listarMov);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const consultarPorRadioBtn = async (searchInput) => {
        try {
            let url;

            if (searchInput === "todos") {
                url = `${URL}/movimiento`;
            } else {
                url = `${URL}/movimientoTipo?tipoMovimiento_like=${searchInput}`;
                setSelectedOption('Todos');
            }
            const res = await fetch(url);

            if (res.status === 200) {
                const listarMov = await res.json();
                setMovimiento(listarMov);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSelectChange = (e) => {
        e.preventDefault();
        rdbTodoRef.current.click();
        setSelectedOption(e.target.value);
        consultarMovimientos(e.target.value);

    };
    const verificarCajaAbierta = async () => {
        try {
            const response = await fetch(`${URL}/caja`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                const cajasAbiertas = data.filter(caja => caja.estado_caja === 'ABIERTA');

                // Verificar si hay al menos una caja abierta
                if (cajasAbiertas.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                console.log('Error al obtener el estado de la caja');
                return false;
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
            return false;
        }
    }
    const abrirAgregar = async () => {
        if (await verificarCajaAbierta() === true) {
            setAgregarOeditar('agregar');
            setShowModal(true)
        } else {
            Swal.fire({
                title: 'La caja no se encuentra abierta',
                text: 'Para poder realizar su solicitud necesita que la caja se encuentre abierta',
                icon: 'error',
            })
        }
    };
    const obtenerPorIdEliminar = async (id) => {
        try {
            const urlEditar = `${URL}/movimiento/${id}`;

            const res = await fetch(urlEditar);

            if (res.status === 200) {
                const mov = await res.json();
                setMovimientoEditar(() => {
                    setAgregarOeditar('editar');
                    setShowModal(true);
                    return mov;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleClose = () => setShowModal(false);

    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Movimientos</h1>
            </div>
            <div className='contenedor-buscar'>
                <section>
                    <article className=' mt-5 d-flex justify-content-center align-items-end'>
                        <form>
                            <div className='form-group d-flex me-1 row'>
                                <div className='form-group col-12'>
                                    <label className='mt-1'>Movimiento</label>
                                    <select className='form-select' value={selectedOption} onChange={handleSelectChange}>
                                        <option value="Todos">Todos</option>
                                        <option value="CompraMercaderia">Compra de mercancía para el stock</option>
                                        <option value="PagoServicio">Pagos de servicios públicos (electricidad, agua, etc.)</option>
                                        <option value="GastoLimpieza">Gastos de limpieza y mantenimiento</option>
                                        <option value="PagoSalario">Pago de salarios a empleados</option>
                                        <option value="Venta">Venta</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                        <div>
                            <button className='btn btn-success mt-2' onClick={abrirAgregar}>Agregar</button>
                        </div>
                    </article>
                    <div className='w-100 d-flex'>
                        <div className="form-check me-2 mt-3">
                            <input ref={rdbTodoRef} defaultChecked name='rdb-mov' onClick={(e) => consultarPorRadioBtn(e.target.value)} className="form-check-input" type="radio" value="todos" />
                            <label className="form-check-label">
                                Todos
                            </label>
                        </div>
                        <div className="form-check me-2 mt-3">
                            <input name='rdb-mov'
                                onClick={(e) => consultarPorRadioBtn(e.target.value)}
                                className="form-check-input" type="radio" value="egreso" />
                            <label className="form-check-label">
                                Egreso
                            </label>
                        </div>
                        <div className="form-check me-2 mt-3">
                            <input name='rdb-mov'
                                onClick={(e) => consultarPorRadioBtn(e.target.value)}
                                className="form-check-input" type="radio" value="ingreso" />
                            <label className="form-check-label">
                                Ingreso
                            </label>
                        </div>
                    </div>
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
                                <th>Eliminar</th>
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
                                            <td>
                                                <button onClick={() => obtenerPorIdEliminar(mov._id)} className={`${mov.descripcion.includes('VENTA REALIZADA') || mov.estado === 'CANCELADO' ? 'd-none' : ''} btn btn-danger`}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </div>

            <ModalMovimiento
                pedidoId={pedidoId}
                setPedidoId={setPedidoId}
                movimientoEditar={movimientoEditar}
                agregarOeditar={agregarOeditar}
                consultarMovimientos={consultarMovimientos}
                showModal={showModal}
                handleClose={handleClose}>
            </ModalMovimiento>

        </section>
    );
};


export default Movimiento;