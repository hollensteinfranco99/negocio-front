import React, { Fragment, useEffect, useState } from 'react';
import ModalCaja from './Caja/ModalCaja';
import { useNavigate } from 'react-router-dom';
import '../css/inicio.css';

const Inicio = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [estadoCaja, setEstadoCaja] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cajaEditar, setCajaEditar] = useState(null);
    const [abrirCajaState, setAbrirCajaState] = useState('');
    const [montoTotal,setMontoTotal] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        consultarEstadoCaja();
    }, [showModal]);

    const handleClose = () => setShowModal(false);
    const hacerPedido = () => {navigate('/compra-pedido')}
    
    const abrirCaja = () => {
        setAbrirCajaState(estadoCaja === false ? 'abrir' : 'cerrar');
        setShowModal(true);
    };
    const consultarEstadoCaja = async () => {
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
                    
                    setEstadoCaja(true);
                    setCajaEditar(cajasAbiertas[0]);
                    setMontoTotal(cajasAbiertas[0].monto_total);
                } else {
                    
                    setEstadoCaja(false);
                }
            } else {
                console.log('Error al obtener el estado de la caja');
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
        }
    }

    return (
        <Fragment>
            <section className='contenedor-inicio'>
                <section className='container row' aria-label='vista-rapida'>
                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className={`${estadoCaja === false ? 'caja-cerrada' : 'caja-abierta'} tarjeta text-white d-flex flex-column`}>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>{estadoCaja === false ? "Caja Cerrada" : "Caja abierta"}</h2>
                            </div>
                            <div className='mt-auto d-flex justify-content-center align-items-center'>
                                <p className='me-2'>Total: </p>
                                <p>{estadoCaja === false ? "$0.00" : `${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(montoTotal))}`}</p>
                            </div>
                            
                            <div className='mt-auto mb-2 d-flex justify-content-center'>
                                <button onClick={() => { abrirCaja() }} className='btn btn-dark'>{estadoCaja == false ? "Abrir caja" : "Cerrar caja"}</button>
                            </div>
                        </div>
                    </article>



                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className='text-white d-flex flex-column tarjeta tarj-2'>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>Hacer pedido</h2>
                            </div>
                            <div className='mt-auto mb-2 d-flex justify-content-center'>
                                <button onClick={() => { hacerPedido() }} className='btn btn-dark'>Ver mas</button>
                            </div>
                        </div>
                    </article>
                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className='tarjeta tarj-3 text-white d-flex flex-column'>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>Ventas del mes</h2>
                            </div>
                            <div className='mt-auto d-flex justify-content-center align-items-center'>
                                <p className='me-2'>Total: </p>
                                <p>$250.00</p>
                            </div>
                        </div>
                    </article>
                </section>
            </section>
            <ModalCaja
                setEstadoCaja={setEstadoCaja}
                abrirCajaState={abrirCajaState}
                showModal={showModal}
                setMontoTotal={setMontoTotal}
                cajaEditar={cajaEditar}
                handleClose={handleClose}></ModalCaja>

        </Fragment>
    );
};

export default Inicio;