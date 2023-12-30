import React, { useState } from 'react';
import '../../css/consulta.css';

const DetalleComprobante = () => {

    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article>
                    <form className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                            <div className='form-group col-6 mt-2'>
                                <label className='mt-1'>Nro Factura</label>
                                <input disabled value={'0001-000058'} className='form-control' type="text" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                    <label className='mt-1'>Tipo de comprobante</label>
                                    <input className='form-control' type="text" disabled value={'X'} />
                                </div>
                        </article>
                        {/* Tabla */}
                        <article className='mt-4 mb-2 contenedor-tabla'>
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Codigo</th>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>1</th>
                                        <th>Pepsi</th>
                                        <th>$800.00</th>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <th>Coca-cola</th>
                                        <th>$1800.00</th>
                                    </tr>
                                </tbody>
                            </table>
                        </article>
                        {/* Subtotal */}
                        <article className='row'>
                            <div className='col-6 ms-auto' aria-label='subtotal'>
                                <input className='mt-1 form-control text-end' placeholder='$0.00' disabled type='number'></input>
                                <input className='mt-1 form-control text-end' placeholder='$0.00' disabled type='number'></input>
                                <input className='mt-1 form-control text-end' placeholder='$0.00' disabled type='number'></input>
                            </div>
                        </article>
                    </form>
                </article>
            </section>
        </section>
    );
};

export default DetalleComprobante;