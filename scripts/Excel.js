export class Excel{
    constructor(file){
        this.file = file;   //desem el nom del fitxer
        this.data = [];     //array per desar les dades processades 
    }

    //metodes async i han de retornar una promise
    async readCSV(){
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = () => {
                //tindre la informacio csv
                const fitxer = reader.result.trim().split("\n").slice(1);
                resolve(fitxer);
            };
            reader.onerror = () =>{
                showMessage("Error en llegir el fitxer. Prova-ho un altre cop.", "error");
                reject("Error en llegir el fitxer. Prova-ho un altre cop.");
            };
            console.log("El fitxer ha començat a carregar-se");
            reader.readAsText(this.file, "UTF-8");
        });
    }


    async getInfoCountry(codi, city){
    //ha de retornar un objecte amb la informacio: city, flag, lat i long (capital info des de l'api)
        return new Promise(async (resolve, reject) => {
            try {
                const url = `https://restcountries.com/v3.1/alpha/${codi}`;
                const response = await fetch(url);
                if(response.ok){
                    console.log('Consulta fetch correcta!');
                }else{
                    console.log('Consulta fetch incorrecta!');
                    throw new Error(`Error ${response.status} : ${response.statusText}`);
                }
                const data = await response.json();
                console.log(`Mostrem les dades que retorna el fetch sobre el pais: ${data}`);
                const dadesPais = {
                    ciutat : city,
                    bandera : data[0].flags.png,
                    lat : data[0].latlng[0],
                    lon : data[0].latlng[1]
                }
                resolve(dadesPais);
            } catch (error) {
                console.error("Error obtenint l'informació del país:", error);
                reject(error);
            }
        });
    }
}