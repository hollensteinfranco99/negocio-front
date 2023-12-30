import React, { useState } from 'react';
import '../../css/consulta.css';

const Venta = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);

    };

    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article className='text-center'>
                    <h1>Realizar venta</h1>
                </article>
                <article>
                    <form className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                            <div className='form-group col-6 mt-2'>
                                <label className='mt-1'>Nro Factura</label>
                                <input disabled className='form-control' type="text" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                    <label className='mt-1'>Tipo de comprobante</label>
                                    <select className='form-select' value={selectedOption} onChange={handleSelectChange}>
                                        <option value="option1">X</option>
                                        <option value="option2">A</option>
                                        <option value="option3">C</option>
                                    </select>
                                </div>
                        </article>
                        {/* Segunda fila */}
                        <article className='row'>
                            <div className='form-group col-3 mt-2'>
                                <label>Codigo</label>
                                <input className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                <label>Producto</label>
                                <input disabled className='form-control' type="text" />
                            </div>
                            <div className='col-3 d-flex align-items-end'>
                                <button className='btn btn-dark'>Buscar</button>
                            </div>
                        </article>
                        {/* Tercera fila */}
                        <article className='row'>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Cantidad</label>
                                <input placeholder='0' className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Precio unitario</label>
                                <input placeholder='0.00' step='0.1' className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Descuento</label>
                                <input placeholder='0.00' step='0.1' className='form-control' type="number" />
                            </div>
                            <div className='d-flex align-items-end col-6 col-lg-3 mt-2'>
                                <button className='btn btn-dark'>+ Descuento</button>
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
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>1</th>
                                        <th>Pepsi</th>
                                        <th>$800.00</th>
                                        <th><button className='btn btn-danger'>Eliminar</button></th>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <th>Coca-cola</th>
                                        <th>$1800.00</th>
                                        <th><button className='btn btn-danger'>Eliminar</button></th>
                                    </tr>
                                </tbody>
                            </table>
                        </article>
                        {/* Subtotal */}
                        <article className='row'>
                            <div className='col-6' aria-label='btn-venta'>
                                <button className='btn btn-lg btn-success'>Realizar venta</button>
                            </div>
                            <div className='col-6' aria-label='subtotal'>
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

export default Venta;