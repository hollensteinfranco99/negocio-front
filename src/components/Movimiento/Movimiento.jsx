import React, { useState } from 'react';
import '../../css/consulta.css';
import ModalMovimiento from '../Movimiento/ModalMovimiento';

const Movimiento = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);

    };
    const handleShow = () => setShowModal(true);
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
                                <div className='form-group col-9'>
                                    <label className='mt-1'>Movimiento</label>
                                    <select className='form-select' value={selectedOption} onChange={handleSelectChange}>
                                        <option value="option1">Todos</option>
                                        <option value="option1">Compra de mercancía para el stock del kiosko</option>
                                        <option value="option2">Pagos de servicios públicos (electricidad, agua, etc.)</option>
                                        <option value="option3">Gastos de limpieza y mantenimiento</option>
                                        <option value="option3">Pago de salarios a empleados</option>
                                    </select>
                                </div>
                                <div className='col-3 d-flex align-items-end'>
                                    <button type='submit' className='btn btn-dark'>Buscar</button>
                                </div>
                            </div>
                        </form>
                        <div>
                            <button className='btn btn-success mt-2' onClick={handleShow}>Agregar</button>
                        </div>
                    </article>
                    <div className='w-100 d-flex'>
                        <div className="form-check me-2 mt-3">
                            <input className="form-check-input" type="radio" value="option1" />
                            <label className="form-check-label">
                                Todos
                            </label>
                        </div>
                        <div className="form-check me-2 mt-3">
                            <input className="form-check-input" type="radio" value="option1" />
                            <label className="form-check-label">
                                Egreso
                            </label>
                        </div>
                        <div className="form-check me-2 mt-3">
                            <input className="form-check-input" type="radio" value="option1" />
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
                                <th>Detalle</th>
                                <th>Movimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>VENTA - FACT-001-0000495</th>
                                <th>Ingreso</th>
                            </tr>
                            <tr>
                                <th>Compra de productos de limpieza</th>
                                <th>Egreso</th>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>

            <ModalMovimiento showModal={showModal} handleClose={handleClose}></ModalMovimiento>

        </section>
    );
};


export default Movimiento;