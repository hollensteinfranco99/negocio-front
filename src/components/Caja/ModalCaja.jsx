import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import moment from 'moment';
import { ClipLoader } from 'react-spinners';

const ModalCaja = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [monto_apertura, setMontoApertura] = useState('');
    const [monto_cierre, setMontoCierre] = useState('');
    const [monto_total, setMontoTotal] = useState('');
    const [nro_caja, setNroCaja] = useState('');
    const [estado_caja, setEstadoCaja] = useState('');
    const [fecha_apertura, setFechaApertura] = useState('');
    const [fecha_cierre, setFechaCierre] = useState('');
    const [diferencia, setDiferencia] = useState('');
    const [diferenciaTxt, setDiferenciaTxt] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        cargarDatos();
    }, [props.showModal]);

    const consultarCajas = async () => {
        try {
            const url = `${URL}/caja`;
            const res = await fetch(url);

            if (res.status === 200) {
                const listarcaja = await res.json();
                generarCodigoUnico(listarcaja);

            }
        } catch (error) {
            console.log(error);
        }
    }
    const cargarDatos = () => {

        if (props.abrirCajaState === 'abrir') {
            // si estas por abrir la caja
            consultarCajas();
            setFechaApertura(moment().format('DD/MM/YY HH:mm'));
            setMontoApertura("");
        } else if (props.abrirCajaState === 'cerrar' && props.cajaEditar) {
            // si estas por cerrar la caja
            setFechaApertura(props.cajaEditar.fecha_apertura);
            setFechaCierre(props.cajaEditar.fecha_cierre);
            setNroCaja(props.cajaEditar.nro_caja);
            setMontoApertura(props.cajaEditar.monto_apertura);

            // diferencia
            let resultado_diferencia = props.cajaEditar.monto_cierre - props.cajaEditar.monto_apertura;
            const etiquetaResultado = resultado_diferencia > 0
                ? 'SOBRANTE'
                : resultado_diferencia < 0
                    ? 'FALTANTE'
                    : 'COINCIDE';

            setDiferencia(resultado_diferencia);
        }
        if (props.cajaEditar) {
            setEstadoCaja(props.abrirCajaState === 'cerrar' ? "ABIERTA" : "CERRADA");
            setMontoCierre(props.cajaEditar.monto_cierre);
            setMontoTotal(props.cajaEditar.monto_total);
        }
    }

    const generarCodigoUnico = (cajasLista) => {
        if (cajasLista) {
            // Si hay productos en la lista, obtener el último código y agregar +1
            const nuevoCodigo = (cajasLista.length + 1).toString().padStart(7, '0');
            setNroCaja(nuevoCodigo);
        } else {
            // Si la lista está vacía, generar el primer código
            setNroCaja('0000001');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            let resultado_diferencia;
            resultado_diferencia = parseFloat(monto_cierre) - parseFloat(monto_total);
            const etiquetaResultado = resultado_diferencia > 0
                ? 'SOBRANTE'
                : resultado_diferencia < 0
                    ? 'FALTANTE'
                    : 'COINCIDE';

            const cajaAbrirData = {
                fecha_apertura: fecha_apertura,
                monto_apertura: monto_apertura || 0,
                nro_caja: nro_caja,
                estado_caja: 'ABIERTA',
                monto_cierre: 0,
                monto_total: monto_apertura || 0,
                diferencia: resultado_diferencia
            };
            props.setMontoTotal(monto_apertura);
            let respuesta;

            if (props.abrirCajaState === 'abrir') {
                // AGREGAR
                respuesta = await fetch(`${URL}/caja`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cajaAbrirData)
                });

                if (respuesta.status === 201) {
                    Swal.fire({
                        title: "Caja abierta",
                        text: "Se abrio la caja correctamente",
                        icon: "success"
                    });
                    props.setEstadoCaja(true);
                    props.handleClose();
                }
            } else {

                const cajaCerrarData = {
                    fecha_apertura: props.cajaEditar.fecha_apertura,
                    fecha_cierre: moment().format('DD/MM/YY HH:mm'),
                    monto_cierre: monto_cierre,
                    monto_apertura: monto_apertura,
                    monto_total: monto_total, // apertura + venta
                    diferencia: resultado_diferencia,
                    nro_caja: nro_caja,
                    estado_caja: 'CERRADA',
                };
                props.setMontoTotal(resultado_diferencia);
                // EDITAR
                respuesta = await fetch(`${URL}/caja/${props.cajaEditar._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cajaCerrarData)
                });

                if (respuesta.status === 200) {
                    Swal.fire({
                        title: "Caja cerrada",
                        text: "Se realizó correctamente su solicitud",
                        icon: "success",
                        confirmButtonColor: "#14A44D",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Aquí colocas el código para la segunda alerta
                            Swal.fire({
                                title: "Datos de Caja : " + nro_caja,
                                html:
                                    "Fecha de inicio de caja : " + fecha_apertura + "<br>" +
                                    "Monto apertura : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto_apertura)) + "<br>" +
                                    "Monto caja fisica : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto_cierre)) + "<br>" +
                                    "Monto total registrado : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto_total)) + "<br>" +
                                    "Diferencia : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(resultado_diferencia)) + "<br>" +
                                    etiquetaResultado
                            });
                        }
                    })
                    props.setEstadoCaja(false);
                    props.handleClose();
                }
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error al completar su solicitud",
                text: "Por favor, vuelva a intentarlo en unos minutos",
                icon: "error",
                confirmButtonColor: "#14A44D",
            });
        }
    }
    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    {
                        props.abrirCajaState === 'abrir' ? <h2>Abrir Caja</h2> :
                            <h2>Cerrar Caja</h2>
                    }
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label className='mt-1'>Numero de caja</label>
                            <input value={nro_caja} className='mt-2 form-control' type='number' disabled placeholder='1' />
                        </div>
                        <article className='row'>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Monto de apertura</label>
                                <input value={monto_apertura} onChange={(e) => setMontoApertura(e.target.value)} className='mt-2 form-control' disabled={props.abrirCajaState === 'abrir' ? false : true} type='number' placeholder='0.00' />
                            </div>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Monto de cierre</label>
                                <input value={monto_cierre} onChange={(e) => setMontoCierre(e.target.value)} className='mt-2 form-control' disabled={props.abrirCajaState === 'abrir' ? true : false} type='number' placeholder='0.00' />
                            </div>
                            <button disabled={loading} type="submit" className='mt-4 d-flex justify-content-center btn btn-success'>
                                {
                                    loading ? <div className='d-flex align-items-center'>
                                        <ClipLoader className='bg-transparent me-2' size={17} color="white" />
                                        <span className='pe-4'>Guardar</span>
                                    </div>
                                        : <div className='d-flex align-items-center'>
                                            <span className='px-4'>Guardar</span>
                                        </div>
                                }
                            </button>
                        </article>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalCaja;