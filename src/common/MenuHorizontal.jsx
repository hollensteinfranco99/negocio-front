import React, { useState } from 'react';
import '../css/navegador.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MenuHorizontal = () => {
    const [estadoCaja,setEstadoCaja] = useState(false);
    const navigate = useNavigate();

    const abrirVenta = () =>{
        // realizar consula a la API para saber si hay una caja abierta
        if(estadoCaja !== false){
            Swal.fire({
                title: "No es posible completar su solicitud",
                text: "Por favor, abra la caja para poder continuar",
                icon: "warning"
            });
        }else{
            navigate('/venta');
        }
    }
    return (
        <div className='position-fixed bg-dark w-100 d-flex justify-content-between menu-horizontal'>
            <article className='cont-btn-abrir'>
                    <button className='btn-abrir-menu'>
                        <FontAwesomeIcon className='me-1' icon={faBars} />
                    </button>
            </article>
            <article className='p-1'>
            <button onClick={()=>{abrirVenta()}} className='btn btn-success border-1 border-black'>
            <FontAwesomeIcon icon={faCartShopping} />
            </button>
            </article>
        </div>
    );
};

export default MenuHorizontal;