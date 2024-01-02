import React, { useState } from 'react';
import imagen from '../../img/imagenNoDisponible.png';
import { Modal } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import '../../css/consulta.css';
import Swal from 'sweetalert2';

const ModalProducto = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [tipoProducto, setTipoProducto] = useState('');
    const [codigo, setCodigo] = useState(0);
    const [nombre, setNombre] = useState('');
    const [marca, setMarca] = useState('');
    const [precioVenta, setPrecioVenta] = useState(0);
    const [imageSrc, setImageSrc] = useState('');
    const [error, setError] = useState(false);
    const myFormRef = React.createRef();



    const obtenerImagen = (event) => {
        const file = event.target.files[0];

        if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setImageSrc(reader.result);
                };
                reader.readAsDataURL(file);
        } else {
            setImageSrc('');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // generar numero de codigo

        // validar campos 
        if (nombre.trim() === '' || marca.trim() === '' || precioVenta <= 0 || precioVenta >= 999999) {
            // alert error
            setError(true);
            return;
        } else {
            setError(false);
            // enviar datos a la API
            const nuevoProducto = {
                nombre: nombre,
                codigo: codigo,
                marca: marca,
                tipoProducto: tipoProducto,
                precioVenta: precioVenta,
                imagen: imageSrc
            }
            try {
                const datosEnviar = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(nuevoProducto)
                }
                const respuesta = await fetch( `${URL}/producto`, datosEnviar);

                if(respuesta.status === 201){
                    Swal.fire({
                        title: "Producto agregado",
                        text: "Se registro un nuevo producto",
                        icon: "success"
                    });
                    props.consultarProductos();
                    limpiarForm();
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
    }
    const limpiarForm = () =>{
        myFormRef.current.reset();
        setTipoProducto('');
        setCodigo(0);
        setNombre('');
        setMarca('');
        setPrecioVenta(0);
        setImageSrc('');
    }
    const verificarPrecio = (e) => {
        const precioInput = e.target.value;
        const formatoNumero = /^\d+(\.\d{0,2})?$/;
    
        if (!formatoNumero.test(precioInput) || parseFloat(precioInput) <= 0 || parseFloat(precioInput) >= 999999) {
            e.target.classList.add("is-invalid");
        } else {
            e.target.classList.remove("is-invalid");
            setPrecioVenta(parseFloat(precioInput));
        }
    };

    return (
        <div>
            <Modal show={props.showModal} onHide={()=>{props.handleClose();limpiarForm();}}>
                <Modal.Header closeButton>
                    <h2>Agregar Producto</h2>
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form ref={myFormRef} onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label className='mt-1'>Codigo</label>
                            <input value={codigo} onChange={(e) => { setCodigo(parseInt(e.target.value)) }} className='mt-2 form-control' type='number' />
                        </div>
                        <div className='form-group'>
                            <label className='mt-1'>Nombre del producto *</label>
                            <input value={nombre} onChange={(e) => { setNombre(e.target.value) }} className='mt-2 form-control' type='text' placeholder='Ingrese el nombre' />
                        </div>
                        <article className='row'>
                            <div className='form-group col-6'>
                                <label className='mt-1'>Marca *</label>
                                <input value={marca} onChange={(e) => { setMarca(e.target.value) }} className='mt-2 form-control' type='text' placeholder='Ingrese la marca' />
                            </div>
                            <div className='form-group col-6'>
                                <label htmlFor="selectOption" className='mt-1'>Tipo de producto *</label>
                                <select className='form-select mt-2' id="selectOption" value={tipoProducto} onChange={(e) => { setTipoProducto(e.target.value) }}>
                                    <option value="Otros">Otros</option>
                                    <option value="Bebidas">Bebidas</option>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Panaderia">Panaderia</option>
                                    <option value="Cigarrillos">Cigarrillos</option>
                                    <option value="CuidadoPersonalLimpieza">Cuidado Personal y Limpieza</option>
                                    <option value="ComidaNoPerecedera">Comida no Perecedera</option>
                                    <option value="Papeleria">Papeleria</option>
                                    <option value="ElectronicoAccesorios">Electronico y Accesorios</option>
                                </select>
                            </div>
                        </article>
                        <article className='row'>
                            <div className='form-group col-6'>
                                <label className='mt-1'>Precio venta *</label>
                                <input value={precioVenta} onBlur={verificarPrecio} onChange={(e) => { setPrecioVenta(parseFloat(e.target.value)) }} className='mt-2 form-control' type='text' placeholder='0.00' />
                                <div className='invalid-feedback'>
                                    Ingresar un numero mayor a "0" y menor a "999999"
                                </div>
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
                        {error ? <Alert className='mt-1' variant='warning'>Todos los campos (*) son obligatorios</Alert> : null}
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalProducto;