import React, { useEffect, useReducer, useRef, useState } from 'react';
import '../../css/consulta.css';
import ModalMovimiento from '../Movimiento/ModalMovimiento';
import Swal from 'sweetalert2';

const Movimiento = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [movimiento, setMovimiento] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [movimientoEditar, setMovimientoEditar] = useState(null);
    const [agregarOeditar, setAgregarOeditar] = useState('');
    const opciones = [
        { value: '', label: 'Selecciona un movimiento' },
        { value: 'CompraMercaderia', label: 'Compra de mercancía para el stock del kiosko' },
        { value: 'PagoServicio', label: 'Pagos de servicios públicos (electricidad, agua, etc.)' },
        { value: 'GastoLimpieza', label: 'Gastos de limpieza y mantenimiento' },
        { value: 'PagoSalario', label: 'Pago de salarios a empleados' },
        { value: 'Venta', label: 'VENTA' },
    ];
    const rdbTodoRef = useRef(null);

    useEffect(() => {
        consultarMovimientos();
    }, []);

    const consultarMovimientos = async (searchInput) => {
        try {
            let url;
            if (searchInput === "Todos" || searchInput === undefined || searchInput === '') {
                url = `${URL}/movimiento`;
            } else {
                url = `${URL}/movimiento?descripcion_like=${searchInput}`;
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
                url = `${URL}/movimiento?tipoMovimiento_like=${searchInput}`;
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
    const abrirAgregar = () => {
        setAgregarOeditar('agregar');
        setShowModal(true)
    };
    const obtenerPorIdEditar = async (id) => {
        try {
            const urlEditar = `${URL}/movimiento/${id}`;

            const res = await fetch(urlEditar);

            if (res.status === 200) {
                const producto = await res.json();
                setMovimientoEditar(() => {
                    setAgregarOeditar('editar');
                    setShowModal(true);
                    return producto;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const eliminar = (id) => {
        Swal.fire({
            title: "¿Estas seguro de eliminar el movimiento?",
            text: "Se eliminara de forma permanente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#14A44D",
            cancelButtonColor: "#DC4C64",
            confirmButtonText: "Si, estoy seguro",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Eliminar movimiento
                try {
                    const urlEliminar = `${URL}/movimiento/${id}`;
                    const respuesta = await fetch(urlEliminar, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (respuesta.status === 200) {
                        Swal.fire({
                            title: 'Eliminado',
                            text: 'El movimiento ha sido eliminado',
                            icon: 'success',
                            confirmButtonColor: "#14A44D",
                        })
                        consultarMovimientos();
                    }
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: "Error al completar su solicitud",
                        text: "Por favor, vuelva a intentarlo en unos minutos",
                        icon: "error"
                    });
                }
            }
        });
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
                                <th>Fecha</th>
                                <th>Detalle</th>
                                <th>Movimiento</th>
                                <th>Monto</th>
                                <th className='text-end'>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimiento.map((mov, index) => {
                                const opcionEncontrada = opciones.find((opcion) => opcion.value === mov.descripcion);

                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th>{mov.fechaRegistro}</th>
                                            <th>{opcionEncontrada ? opcionEncontrada.label : mov.descripcion}</th>
                                            <th className={mov.tipoMovimiento === 'INGRESO' ? 'ingreso' : 'egreso'}>{mov.tipoMovimiento}</th>
                                            <th>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(mov.monto))}</th>
                                            <th className='text-end'>
                                                <button onClick={() => { obtenerPorIdEditar(mov.id) }} className={`${mov.descripcion === 'Venta' ? 'd-none' : ''} btn btn-warning`}>Editar</button>
                                            </th>
                                            <th>
                                                <button onClick={() => eliminar(mov.id)} className={`${mov.descripcion === 'Venta' ? 'd-none' : ''} btn btn-danger`}>
                                                    Eliminar
                                                </button>
                                            </th>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </div>

            <ModalMovimiento
                movimientoEditar={movimientoEditar}
                agregarOeditar={agregarOeditar}
                consultarProducto={consultarMovimientos}
                showModal={showModal}
                handleClose={handleClose}>
            </ModalMovimiento>

        </section>
    );
};


export default Movimiento;