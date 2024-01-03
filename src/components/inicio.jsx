import React, { Fragment, useState } from 'react';
import ModalCaja from './Caja/ModalCaja';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../css/inicio.css';

const Inicio = () => {
    const [estadoCaja,setEstadoCaja] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShowModal(false);

    const mostrarModal = () =>{
        setShowModal(true);
        setEstadoCaja(estadoCaja === true ? false : true);
    }
    const hacerPedido = () =>{
        if(estadoCaja === false){
            Swal.fire({
                title: "No es posible completar su solicitud",
                text: "Por favor, abra la caja para poder continuar",
                icon: "warning"
            });
        }else{
            navigate('/compra-pedido');
        }
    }
    return (
        <Fragment>
            <section className='contenedor-inicio'>
                <section className='container row' aria-label='vista-rapida'>
                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className={`${estadoCaja === false ? 'caja-cerrada':'caja-abierta'} tarjeta text-white d-flex flex-column`}>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>{estadoCaja === false ? "Caja Cerrada" : "Caja abierta"}</h2>
                            </div>
                            <div className='mt-auto d-flex justify-content-center align-items-center'>
                                <p className='me-2'>Total: </p>
                                <p>{estadoCaja === false ? "$0.00" : "$100.00"}</p>
                            </div>
                            <div className='mt-auto mb-2 d-flex justify-content-center'>
                                <button onClick={()=>{mostrarModal()}} className='btn btn-dark'>{estadoCaja == false ? "Abrir caja" : "Cerrar caja"}</button>
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
                                <button onClick={()=>{hacerPedido()}} className='btn btn-dark'>Ver mas</button>
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
            <ModalCaja estadoCaja={estadoCaja} showModal={showModal} handleClose={handleClose}></ModalCaja>

        </Fragment>
    );
};

export default Inicio;