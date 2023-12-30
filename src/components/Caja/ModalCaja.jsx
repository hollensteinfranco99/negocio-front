import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const ModalCaja = (props) => {
    
    const cajaModificar = () =>{
        // si esta por abrirla solo alerta que se hizo bien
        // Alertar que hay faltante y sobrante al guardar - solo si esta por cerrar la caja
    }
    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <h2>Caja</h2>
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form>
                        <div className='form-group'>
                            <label className='mt-1'>Numero de caja</label>
                            <input className='mt-2 form-control' type='number' disabled placeholder='1' />
                        </div>
                        <article className='row'>
                        <div className='form-group col-lg-6 col-md-6 col-12'>
                            <label className='mt-1'>Monto de apertura</label>
                            <input className='mt-2 form-control' disabled={props.estadoCaja === false ? true : false} type='number' placeholder='0.00' />
                        </div>
                        <div className='form-group col-lg-6 col-md-6 col-12'>
                            <label className='mt-1'>Monto cierre</label>
                            <input className='mt-2 form-control' disabled={props.estadoCaja === true ? true : false} type='number' placeholder='0.00' />
                        </div>
                        </article>
                        {props.verDetalle ? null : <button onClick={cajaModificar} type="submit" className='mt-4 btn btn-success'>Guardar</button>}
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalCaja;