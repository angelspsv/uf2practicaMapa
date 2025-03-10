//class PuntInteres
export class PuntInteres{
    //camps privats
    #id;            //numeric
    #esManual;      //boolean

    //propietat estatica per contabilitzar el total de les tasques
    // s'ha de inicialitzar abans de començar el autoincrement (++)
    static totalTasques = 0;

    //el constructor
    constructor(id, esManual, pais, ciutat, nom, direcció, tipus, latitud, longitud, puntuacio){
        this.#id = id;                  //number
        this.#esManual = esManual;      //boolean
        this.pais = pais;               //string
        this.ciutat = ciutat;           //string
        this.nom = nom;                 //string
        this.direcció = direcció;       //string
        this.tipus = tipus;             //string
        this.latitud = latitud;         //string
        this.longitud = longitud;       //string
        this.puntuacio = puntuacio;     //number

        PuntInteres.totalTasques++;     //number
    }

    //metodes
    //get/set id
    //get/set esManual
    //static obtenirTotalElements(): number
    getId(){
        return this.#id;
    }

    setId(id){
        this.#id = id;
    }

    getEsManual(){
        return this.#esManual;
    }

    setEsManual(esManual){
        this.#esManual = esManual;
    }

    //mètode static per obtenir el total de elements
    static obtenirTotalElements(){
        return PuntInteres.totalTasques;
    }
}