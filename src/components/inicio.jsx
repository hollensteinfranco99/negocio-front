import React, { Fragment, useEffect, useRef, useState } from 'react';
import ModalCaja from './Caja/ModalCaja';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import 'moment/locale/es';
import 'chart.js/auto';
import '../css/inicio.css';
import { Ticks, Tooltip } from 'chart.js/auto';

const Inicio = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [estadoCaja, setEstadoCaja] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cajaEditar, setCajaEditar] = useState(null);
    const [abrirCajaState, setAbrirCajaState] = useState('');
    const [montoTotal, setMontoTotal] = useState('');
    const navigate = useNavigate();
    const montoTotalMesRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [ventas, setVentasGrafico] = useState(null);

    useEffect(() => {
        consultarEstadoCaja();
    }, [showModal]);
    useEffect(() => {

        consultarVentaMes();
        consultarVentaGrafico();
    }, []);
    // DATOS GRAFICO LINEAL
    // Convertir la fecha al formato adecuado y filtrar los datos de los últimos 6 meses
    const obtenerVentasUltimos6Meses = () => {
        moment.locale('es');

        const today = moment();
        const sixMonthsAgo = moment().subtract(6, 'months');

        const ventasTotalesUltimos6Meses = ventas
            ? ventas
                .filter((venta) => {
                    const fechaVenta = moment(venta.fecha_registro, 'DD/MM/YY HH:mm');
                    return fechaVenta.isBetween(sixMonthsAgo, today, null, '[]');
                })
                .reduce((acumulador, venta) => {
                    const fechaVenta = moment(venta.fecha_registro, 'DD/MM/YY HH:mm');
                    const mes = fechaVenta.format('MMMM YYYY');

                    if (!acumulador[mes]) {
                        acumulador[mes] = 0;
                    }

                    acumulador[mes] += venta.total;

                    return acumulador;
                }, {})
            : {};

        // Ordenar las ventas por mes de manera ascendente
        const ventasOrdenadas = Object.keys(ventasTotalesUltimos6Meses)
            .sort((a, b) => moment(a, 'MMMM YYYY').valueOf() - moment(b, 'MMMM YYYY').valueOf())
            .reduce((acumulador, key) => {
                acumulador[key] = ventasTotalesUltimos6Meses[key];
                return acumulador;
            }, {});

        return ventasOrdenadas;
    };
    const ventasTotalesUltimos6Meses = obtenerVentasUltimos6Meses();

    // Crear arrays separados para etiquetas y datos
    const etiquetas = Object.keys(ventasTotalesUltimos6Meses);
    const datos = Object.values(ventasTotalesUltimos6Meses);


    const data = {
        labels: etiquetas,
        datasets: [
            {
                label: 'Total de Ventas',
                data: datos,
                fill: false,
                borderColor: '#DE4352',
                backgroundColor: 'transparent',
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                titleColor: 'white',
                bodyColor: 'white',
                footerColor: 'white',
                caretSize: 10,
                cornerRadius: 8,
                borderColor: '#DE4352',
                borderWidth: 1,
                callbacks: {
                    beforeBody: function (context) {
                        return '            ';
                    },
                },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#6f6f6f'
                },
                ticks: {
                    color: 'white'
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'white'
                }
            },
        },
    };


    const handleClose = () => setShowModal(false);
    const hacerPedido = () => { navigate('/compra-pedido') }
    const abrirCaja = () => {
        setAbrirCajaState(estadoCaja === false ? 'abrir' : 'cerrar');
        setShowModal(true);
    };
    const consultarEstadoCaja = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${URL}/caja`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                const cajasAbiertas = data.filter(caja => caja.estado_caja === 'ABIERTA');

                // Verificar si hay al menos una caja abierta
                if (cajasAbiertas.length > 0) {

                    setEstadoCaja(true);
                    setCajaEditar(cajasAbiertas[0]);
                    setMontoTotal(cajasAbiertas[0].monto_total);
                } else {

                    setEstadoCaja(false);
                }
                setLoading(false);
            } else {
                console.log('Error al obtener el estado de la caja');
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
        }
    }
    const consultarVentaMes = async () => {
        try {
            const response = await fetch(`${URL}/venta`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const ventas = await response.json();

                // Obtén la fecha actual
                const fechaActual = moment();

                // Filtra las ventas del mes actual
                const ventasMesActual = ventas.filter(venta => {
                    const fechaVenta = moment(venta.fecha_registro, 'DD/MM/YY HH:mm');
                    return (venta.estado === 'FINALIZADO' &&
                        fechaVenta.month() === fechaActual.month() &&
                        fechaVenta.year() === fechaActual.year()
                    );
                });
                // Suma los totales de las ventas filtradas
                const totalVentasMesActual = ventasMesActual.reduce((total, venta) => total + venta.total, 0);
                montoTotalMesRef.current.innerText = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalVentasMesActual);
            } else {
                console.log('Error en la consulta');
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
        }
    }
    const consultarVentaGrafico = async () => {
        try {
            const response = await fetch(`${URL}/venta`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const ventas = await response.json();

                setVentasGrafico(ventas);
            } else {
                console.log('Error en la consulta');
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
        }
    }
    return (
        <Fragment>
            <section className='contenedor-inicio'>
                <section className='container row' aria-label='vista-rapida'>
                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className={`${estadoCaja === false ? 'caja-cerrada' : 'caja-abierta'} tarjeta text-white d-flex flex-column`}>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>{estadoCaja === false ? "Caja Cerrada" : "Caja abierta"}</h2>
                            </div>
                            <div className='mt-auto d-flex justify-content-center align-items-center'>
                                <p className='me-2'>Total: </p>
                                <p>{estadoCaja === false ? "$0.00" : `${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(montoTotal))}`}</p>
                            </div>

                            <div className='mt-auto mb-2 d-flex justify-content-center'>
                                <button disabled={loading} onClick={() => { abrirCaja() }} className='btn btn-dark'>{estadoCaja == false ? "Abrir caja" : "Cerrar caja"}</button>
                            </div>
                        </div>
                    </article>



                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className='text-white d-flex flex-column tarjeta tarj-2'>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>Hacer pedido</h2>
                            </div>
                            <div className='mt-auto mb-2 d-flex justify-content-center'>
                                <button onClick={() => { hacerPedido() }} className='btn btn-dark'>Ver mas</button>
                            </div>
                        </div>
                    </article>
                    {/* ==================== */}
                    <article className='col-lg-4 col-md-6 col-sm-6 m-0 p-0'>
                        <div className='tarjeta tarj-3 text-white d-flex flex-column'>
                            <div className='mt-3 text-center' aria-label='titulo'>
                                <h2>Ventas del mes</h2>
                            </div>
                            <div className='mt-auto d-flex justify-content-center align-items-center'>
                                <p className='me-2'>Total: </p>
                                <p ref={montoTotalMesRef}></p>
                            </div>
                        </div>
                    </article>
                    {/* =============================== */}
                    <article className='w-100 d-flex flex-wrap p-2'>

                        <section className='app-contenedor'>
                            <article className='contenedor-grafico'>
                                <Line width='auto' className='grafico' data={data} options={options} />
                            </article>
                        </section>
                    </article>
                </section>
            </section>
            <ModalCaja
                setEstadoCaja={setEstadoCaja}
                abrirCajaState={abrirCajaState}
                showModal={showModal}
                setMontoTotal={setMontoTotal}
                cajaEditar={cajaEditar}
                handleClose={handleClose}></ModalCaja>

        </Fragment>
    );
};

export default Inicio;