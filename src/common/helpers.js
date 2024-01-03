const campoRequerido = (valor) =>{
    if(valor.trim() === ''){
        return false;
    }else{
        return true;
    }
}

const rangoPrecio = (valor) =>{
    if(valor > 0 && valor <= 999999){
        return true;
    }else{
        return false;
    }
}

export {campoRequerido,rangoPrecio};