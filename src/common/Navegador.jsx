import React from 'react';
import '../css/navegador.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navegador = () => {

    const desplegarMenu = () => {
        let navegador = document.getElementById("menu-nav");
        let contenedorNav = document.getElementById("contenedor-nav");

        if (navegador.classList.contains("visible")) {
            navegador.classList.remove("visible");
            contenedorNav.classList.remove("visible");
        } else {
            navegador.classList.add("visible");
            contenedorNav.classList.add("visible");
        }
    };


    return (
        <section id='contenedor-nav' className='contenedor-navegador bg-dark'>
            <section id='menu-nav' className='nav-list'>
                <article>
                    <button onClick={() => desplegarMenu()} className='btn-cerrar-menu'>
                        <FontAwesomeIcon className='me-1' icon={faXmark} />
                    </button>
                </article>
                <article aria-label='logo'>
                    <h1>Punto de Venta</h1>
                </article>
                <article className='administrador-lista'>
                    <ul aria-label='Administrador'>
                        <li className='adm-txt'><h3>Administrador</h3></li>
                        <hr />
                        <li><Link onClick={()=> desplegarMenu()} to="/"> Inicio</Link></li>
                        <li><Link onClick={()=> desplegarMenu()} to="/producto"> Productos</Link></li>
                        <li><Link onClick={()=> desplegarMenu()} to="/pedido"> Pedidos</Link></li>
                        <li><Link onClick={()=> desplegarMenu()} to="/movimiento"> Movimientos</Link></li>
                        <li><Link onClick={()=> desplegarMenu()} to="/caja"> Cajas</Link></li>
                        <li><Link onClick={()=> desplegarMenu()} to="/venta-realizada"> Ventas realizadas</Link></li>
                    </ul>
                </article>
            </section>

        </section>
    );
};

export default Navegador;