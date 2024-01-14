import React, { useEffect, useRef, useState } from 'react';
import { campoRequerido, rangoPrecio } from '../../common/helpers'
import Swal from 'sweetalert2';
import { Modal, Alert } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';

const ModalProducto = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [tipoProducto, setTipoProducto] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [marca, setMarca] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [stock, setStock] = useState('');
    const [stockNegativo,setStockNegativo] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);
    const myFormRef = useRef(null);

    useEffect(() => {
        generarCodigoUnico();
        if (props.agregarOeditar === 'editar') {
            cargarDatos();
        } else {
            limpiarForm();
        }
    }, [props.showModal]);

    const generarCodigoUnico = () => {
        const ultimoProd = props.productosLista[props.productosLista.length - 1];

        if (ultimoProd) {
            // Si hay productos en la lista, obtener el último código y agregar +1
            const ultimoCodigo = parseInt(ultimoProd.codigo, 10);
            const nuevoCodigo = (ultimoCodigo + 1).toString();
            setCodigo(nuevoCodigo);
        } else {
            // Si la lista está vacía, generar el primer código
            setCodigo('1');
        }
    };

    const cargarDatos = () => {
        localStorage.clear();
        setCodigo(() => props.productoEditar.codigo);
        setNombre(() => props.productoEditar.nombre);
        setMarca(() => props.productoEditar.marca);
        setTipoProducto(() => props.productoEditar.tipoProducto);
        setPrecioVenta(() => props.productoEditar.precioVenta);
        setStock(() => props.productoEditar.stock);
        setStockNegativo(() => props.productoEditar.permitirStockNegativo);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        // generar número de código

        // validar campos

        if (campoRequerido(nombre) === false || campoRequerido(marca) === false ||
            rangoPrecio(precioVenta) === false || rangoPrecio(stock) === false) {
            // alerta de error
            console.log("error");

            setError(true);
            return;
        } else {
            setError(false);
            // Enviar datos a la API
            
            try {
                setLoading(true);
                let respuesta;

                // DATOS
                const productoData = {
                    nombre: nombre,
                    codigo: codigo,
                    marca: marca,
                    tipoProducto: tipoProducto,
                    precioVenta: precioVenta,
                    stock: stock,
                    permitirStockNegativo: stockNegativo
                };
                if (props.agregarOeditar === 'agregar') {

                    // AGREGAR
                    respuesta = await fetch(`${URL}/producto`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(productoData)
                    });

                    if (respuesta.status === 201) {
                        Swal.fire({
                            title: "Producto agregado",
                            text: "Se registró un nuevo producto",
                            icon: "success"
                        });
                        props.consultarProducto();
                        limpiarForm();
                        props.handleClose();
                    }
                } else {
                    // EDITAR
                    respuesta = await fetch(`${URL}/producto/${props.productoEditar._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(productoData)
                    });

                    if (respuesta.status === 200) {
                        Swal.fire({
                            title: "Producto modificado",
                            text: "Se realizó correctamente su solicitud",
                            icon: "success",
                            confirmButtonColor: "#14A44D",
                        });
                        props.handleClose();
                        props.consultarProducto();
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
    };
    const limpiarForm = () => {
        myFormRef.current?.reset();

        setNombre('');
        setMarca('');
        setStock(0);
        setTipoProducto('');
        setPrecioVenta(0);
    };
    const verificarNumeric = (e) => {
        const numeroInput = e.target.value;
        const formatoNumero = /^\d+(\.\d{0,2})?$/;

        if (!formatoNumero.test(numeroInput) || parseFloat(numeroInput) <= 0 || parseFloat(numeroInput) >= 999999) {
            e.target.classList.add("is-invalid");
        } else {
            e.target.classList.remove("is-invalid");
            if (e.target.name === 'precio-venta') {
                setPrecioVenta(parseFloat(numeroInput));
            } else {
                setStock(parseFloat(numeroInput));
            }
        }
    };

    return (
        <div>
            <Modal show={props.showModal} onHide={() => { props.handleClose(); }}>
                <Modal.Header closeButton>
                    {
                        props.agregarOeditar === 'agregar' ? <h2>Agregar Producto</h2> :
                            <h2>Editar Producto</h2>
                    }
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form ref={myFormRef} onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label className='mt-1'>Codigo</label>
                            <input
                                value={codigo}
                                disabled
                                className='mt-2 form-control'
                                type='number' />
                        </div>
                        <div className='form-group'>
                            <label className='mt-1'>Nombre del producto *</label>
                            <input
                                value={nombre}
                                onChange={(e) => { setNombre(e.target.value) }}
                                className='mt-2 form-control'
                                type='text'
                                placeholder='Ingrese el nombre' />
                        </div>
                        <article className='row'>
                            <div className='form-group col-6'>
                                <label className='mt-1'>Marca *</label>
                                <input
                                    value={marca}
                                    onChange={(e) => { setMarca(e.target.value) }}
                                    className='mt-2 form-control'
                                    type='text'
                                    placeholder='Ingrese la marca' />
                            </div>
                            <div className='form-group col-6'>
                                <label htmlFor="selectOption" className='mt-1'>Tipo de producto *</label>
                                <select className='form-select mt-2' id="selectOption"
                                    value={tipoProducto} onChange={(e) => { setTipoProducto(e.target.value) }}>
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
                                <input name='precio-venta' value={precioVenta} onBlur={verificarNumeric} onChange={(e) => { setPrecioVenta(e.target.value) }} className='mt-2 form-control' type='text' placeholder='0.00' />
                                <div className='invalid-feedback'>
                                    Ingresar un numero mayor a "0" y menor a "999999"
                                </div>
                            </div>
                            <div className='form-group col-6'>
                                <label className='mt-1'>Stock *</label>
                                <input name='stock' value={stock} onBlur={verificarNumeric} onChange={(e) => { setStock(e.target.value) }} className='mt-2 form-control' type='text' placeholder='0' />
                                <div className='invalid-feedback'>
                                    Ingresar un numero mayor a "0" y menor a "999999"
                                </div>
                            </div>
                        </article>
                        <div className='form-group'>

                            <section className='d-flex'>
                            <article className='form-check mt-4'>
                                <label className='form-check-label'>Permitir stock negativo</label>
                                <input checked={stockNegativo} onChange={(e)=>setStockNegativo(e.target.checked)} className='form-check-input' type="checkbox" name="stock-negativo" id="" />
                            </article>
                            </section>
                        </div>
                        <button disabled={loading} type="submit" className='mt-4 btn btn-success'>
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
                        {error ? <Alert className='mt-1' variant='warning'>Todos los campos (*) son obligatorios</Alert> : null}
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalProducto;
