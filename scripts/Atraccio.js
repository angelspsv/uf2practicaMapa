//classe Atraccio que hereta de PuntInteres
import { PuntInteres } from "./PuntInteres.js";

export class Atraccio extends PuntInteres{
    constructor(id, esManual, pais, ciutat, nom, direcció, tipus, latitud, longitud, puntuacio, horaris, preu, moneda){
        super(id, esManual, pais, ciutat, nom, direcció, tipus, latitud, longitud, puntuacio);
        this.horaris = horaris;         //string
        this.preu = preu;               //decimal
        this.moneda = moneda;           //string
    }

    //metodes
    getPreu(){
        return this.preu;
    }

    getPais(){
        return this.pais;
    }

    getPreuIva(){
        //el tipus d'IVA en alguns paisos a mode d'exemple
        const tiposIVA = {
            "Espanya" : 21,
            "Alemanya" : 19,   
            "França" : 20,   
            "Italia" : 22,   
        }

        //obtenim el preu i ens asegurem que es de tipus NUMBER
        const preu = parseFloat(this.getPreu());
        console.log("Preu:", preu, "Tipo:", typeof preu);

        //si la entrada es gratis
        if(preu == 0){
            return `Entrada gratuïta`;
        }

        //mirem si el pais existeix a la llista d'objectes de paisos-iva
        //retorna preu amb o sense iva.
        //obtenim el valor del IVA del pais
        
        if (!Object.keys(tiposIVA).includes(this.getPais())){
            return `${preu}${this.moneda} (no IVA)`;
        }else{
            const valor_iva_pais = tiposIVA[this.getPais()]
            let ambIVA = (valor_iva_pais/100)+1;
            return `${(preu*ambIVA).toFixed(2)}${this.moneda} (IVA)`;
        }
    }
}