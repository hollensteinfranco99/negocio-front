import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const ModalMovimiento = (props) => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);

    };
    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <h2>Agregar Movimiento</h2>
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Movimiento</label>
                            <select className='form-select' value={selectedOption} onChange={handleSelectChange}>
                                <option value="option1">Otros</option>
                                <option value="option1">Compra de mercancía para el stock del kiosko</option>
                                <option value="option2">Pagos de servicios públicos (electricidad, agua, etc.)</option>
                                <option value="option3">Gastos de limpieza y mantenimiento</option>
                                <option value="option3">Pago de salarios a empleados</option>
                            </select>
                        </div>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Otro movimiento</label>
                            <input className='form-control' placeholder='Descripcion' disabled type="text" />
                        </div>
                        <div className='form-group mt-2'>
                            <label>Tipo de movimiento</label>
                            <div className='w-100 d-flex'>
                                <div className="form-check me-2 mt-2">
                                    <input className="form-check-input" type="radio" value="option1" />
                                    <label className="form-check-label">
                                        Egreso
                                    </label>
                                </div>
                                <div className="form-check me-2 mt-2">
                                    <input className="form-check-input" type="radio" value="option1" />
                                    <label className="form-check-label">
                                        Ingreso
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className='mt-4 btn btn-success'>Guardar</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalMovimiento;