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
    // get preuIva()
    getPreuIva(){
        if(this.preu == 0){
            return `Entrada gratuïta`;
        }else{
            //cal mira d'on agafar el tipus d'IVA correcte per cada cas
            return `${this.preu * 1.20}${this.moneda} (IVA)`;
        }
    }
}