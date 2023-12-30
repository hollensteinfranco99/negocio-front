import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import imagen from '../../img/imagenNoDisponible.png';
import '../../css/consulta.css';

const ModalProducto = (props) => {

    const [selectedOption, setSelectedOption] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    }
    const obtenerImagen = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }else{
            setImageSrc('');
        }
    };

    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <h2>Agregar Producto</h2>
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form>
                        <div className='form-group'>
                            <label className='mt-1'>Codigo</label>
                            <input className='mt-2 form-control' type='number' disabled placeholder='1' />
                        </div>
                        <div className='form-group'>
                            <label className='mt-1'>Nombre del producto</label>
                            <input className='mt-2 form-control' type='text' placeholder='Ingrese el nombre' />
                        </div>
                        <article className='row'>
                            <div className='form-group col-6'>
                                <label className='mt-1'>Marca</label>
                                <input className='mt-2 form-control' type='text' placeholder='Ingrese la marca' />
                            </div>
                            <div className='form-group col-6'>
                                <label htmlFor="selectOption" className='mt-1'>Tipo de producto</label>
                                <select className='form-select mt-2' id="selectOption" value={selectedOption} onChange={handleSelectChange}>
                                    <option value="option3">Otros</option>
                                    <option value="option1">Bebidas</option>
                                    <option value="option2">Snacks</option>
                                    <option value="option3">Panaderia</option>
                                    <option value="option3">Cigarrillos</option>
                                    <option value="option3">Cuidado Personal y Limpieza</option>
                                    <option value="option3">Comida no Perecedera</option>
                                    <option value="option3">Papeleria</option>
                                    <option value="option3">Electronico y Accesorios</option>
                                </select>
                            </div>
                        </article>
                        <article className='row'>
                            <div className='form-group col-6'>
                                <label className='mt-1'>Precio venta</label>
                                <input className='mt-2 form-control' type='number' placeholder='0.00' />
                            </div>
                        </article>
                        <div className='form-group'>
                            <label className='mt-1'>Añadir imagen</label>
                            <input onChange={obtenerImagen} className='mt-2 form-control' type="file" accept="image/*" />
                            <div className='cont-img mt-3'>
                                <img src={imageSrc || imagen} alt="imagen-producto" />
                                </div>
                        </div>
                        <button type="submit" className='mt-4 btn btn-success'>Guardar</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalProducto;