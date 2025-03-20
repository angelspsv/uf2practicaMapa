import { Mapa } from "./Mapa.js";
import { PuntInteres } from "./PuntInteres.js";
import { Museu } from "./Museu.js";
import { Atraccio } from "./Atraccio.js";

//declarem el mapa
const mapa = new Mapa();


//aqui es veuran les instancies d'espai, atraccio i/o museu
const contenidorPunts = document.getElementById('ver_notas');

//array per emmagatzemar els objetes creats a partir del csv processat
const objectesCreats = [];

//llista SET desplegable pels valors TIPUS
const tipusOpcions = new Set();
//seleccionem el select pel seu id
const selectTipus = document.getElementById('tipus');

//variables per mostrar bandera i ciutat
const paraPais = document.querySelector('.pais');
const paraBandera = document.querySelector('.bandera');
const paraParentesis = document.querySelector('.parentesis');
const paraCiutat = document.querySelector('.ciutat');
let pais_codi = "";
let pais_ciutat = "";

//coordenades extretes del fitxer csv per situar la ciutat
const latitud = "";
const longitud = "";

//variable global per assignar ID a les instancies
let nextId = 1;

//numero total de punts turistics carregats a la llista
const totalPunts = document.getElementById('total');

//obtenim referencia del select de l'ordenacio
const selectOrdenacio = document.getElementById("ordenacio");

//obtenim la referencia del input des del html
const inputText = document.getElementById('filtrar');


//funcionalitat Netejar tot
//faig la varaible del boto per esborrar-ho tot (punts d'interes i el contador)
const btnNetejar = document.getElementById("netejar");
btnNetejar.addEventListener("click", function () {
    console.log("S'ha fet clic en el botó Netejar!");
    //buidem l'array per posar-ho tot a zero
    objectesCreats.length = 0;
    //netegem els elements de pais, bandera i ciutat carregats des del fitxer csv
    paraPais.textContent = "";
    paraBandera.src = "";  
    paraParentesis.textContent = "";
    paraCiutat.textContent = "";

    //tornem a carregar les dades actuals per la llista de punts turistics i el número de punts
    mostraPuntsTuristicsLlista(objectesCreats);
    numPunts(objectesCreats);
    //esborrem punts del mapa
    mapa.borrarPunt();
    //tornem a mostrar el punt actual
    mapa.mostrarPuntInicial();
});



//faig un punt de prova
//mapa.mostrarPunt(39.96, 4.08, "El paradis!");   //Menorca

//funcionalitat de DRAG AND DROP
const dropZoneObj = document.querySelector('.dropZone');

//evitar que el navegador faci events de drag & drop en tota la pagina
document.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.stopPropagation();
});
//s'executa quan deixem un fitxer en qualsevol lloc de la web
//aixi evitem que el fitxer csv s'obris en una pestanya del nav
document.addEventListener("drop", function (event) {
    event.preventDefault();
    event.stopPropagation();
});
//efecte visual quan un fitxer arriba a la zona de carga
dropZoneObj.addEventListener("dragenter", function () {
    dropZoneObj.classList.add("drag-over");
});
//treu el efecte visual activat quan el fitxer surt de la zona de carga
dropZoneObj.addEventListener("dragleave", function () {
    dropZoneObj.classList.remove("drag-over");
});
//s'executa quan deixem caure un fitxer a la zona de carga
dropZoneObj.addEventListener("drop", function (event) {
    event.preventDefault();
    //eliminem el efecte visial ja que l'usuari ja ha deixat caure el fitxer
    dropZoneObj.classList.remove("drag-over");
    //obtenim la llista de fitxers que l'usuari va deixar caure
    const files = event.dataTransfer.files;
    //mostrem els fitxers a la consola
    console.log(files);
    //cridem la funcio que procesara els fitxers
    loadFile(files);
});




// FUNCIONS
//funcionalitat que carga el fitxer
const loadFile = function(files){
    //si files no esta buit i esta major a 0
    if(files && files.length > 0){
        //bucle per recorrer tots els fitxers arrosegats
        Array.from(files).forEach(function(file){
            console.log(file);
            //mirem quina es la extensio del fitxer
            const extensio = file.name.split(".")[1];
            if(extensio.toLowerCase() === "csv"){
                console.log('Extensió correta');
            }else{
                alert('El fitxer no té la extensió correcta');
                return;
            }
            //aqui fem servir la funcio FileReader() per llegir el fitxer csv entrat
            //fem una instancia de la API de FileReader
            const reader = new FileReader();
            //definim un esdeveniment que s'executa quan el fitxer s'ha llegit completament
            reader.onload = function(){
                //obtenim el contingut del fitxer
                const text = reader.result;
                console.log(`Contingut del fitxer: ${text}`);
                
                //per eliminar espais i les linies buides 
                //dividim el text linia per linia
                const liniesBrutes = text.split("\n");
                const liniesNetes = liniesBrutes.map(function(lin) {
                    return lin.trim();
                });
                //filtrem les linies buides
                const linies = liniesNetes.filter(function(lin) {
                    return lin !== ""; 
                });

                //analitzem el fitxer per esbrinar quin tipus de separador fa servir
                if (linies.length > 0 && linies[0]) {
                    let delimitador = linies[0].includes(";") ? ";" : 
                                      linies[0].includes("\t") ? "\t" : 
                                      linies[0].includes("|") ? "|" : ",";
                
                    const headers = linies[0].split(delimitador).map(function(h) {
                        return h.trim();
                    });
                
                    console.log("Noms de les columnes:", headers);

                    //processem el contingut del fitxer csv
                    //fem un array
                    for (let i = 1; i < linies.length; i++) {
                        let valores = linies[i].split(delimitador).map(function(v) {
                            return v.trim();
                        });

                        //creacio del objete dinamicament
                        let fila = {};
                        headers.forEach(function (header, index) {
                            fila[header] = valores[index] || "";
                        });

                        //mirem que conte cada fila i les variables pais_codi i pais_ciutat
                        console.log(fila);
                        pais_codi = fila.codi;
                        pais_ciutat = fila.ciutat;
                        console.log(pais_codi);
                        console.log(pais_ciutat);

                        //processem les dades i fem la instancia corresponent
                        const objCreat = processObject(fila);
                        if (objCreat) {
                            objectesCreats.push(objCreat);
                        }
                    }
                    console.log("Objectes processats:", objectesCreats);

                    //cridem la funcio per afegir els tipus al select desplegable
                    tipusDeOpcions(objectesCreats);

                    //afegim la bandera del pais i nom de la ciutat dels llocs turistics
                    console.log("Código del país:", pais_codi);
                    console.log("Ciudad del país:", pais_ciutat);

                    //si estan buits, exit!
                    if(!pais_ciutat || !pais_codi){
                        console.log('codi_pais o ciutat_pais estan buits!');
                        return;
                    }
                    //cridem la funcio asincrona per mostrar la bandera i ciutat dels monuments del fitxer csv processat
                    (async function() {
                        await banderaPais(pais_codi, pais_ciutat);
                    })();

                    console.log(`Els objectes que rebra puntsAlMapa; ${objectesCreats}`);
                    //aqui cridarem la funcio mostraPuntsTuristics
                    mostraPuntsTuristicsLlista(objectesCreats);

                    //cridem funcio per mostrar els punts turistics en el mapa
                    puntsAlMapa(objectesCreats);
                }
            };
            reader.onerror = function(){
                showMessage("Error al llegir el fitxer.", "error");
            }
            //comença lectura del fitxer com a text
            reader.readAsText(file);
        });
    }
}


//funcio per situar els punts turistics al mapa
function puntsAlMapa(objsTuristics){
    mapa.borrarPunt();
    //fer un forEach per recorre tots els objectes i crear els punts turistics en el Mapa
    objsTuristics.forEach(function(objTuristic){
        //preparem els arguments
        let lati = objTuristic.latitud;
        let longi = objTuristic.longitud;
        let descri = `<h2>${objTuristic.nom}</h2>
        <h4>${objTuristic.direcció}</h4>
        Puntuació: ${objTuristic.puntuacio}`;
        mapa.mostrarPunt(lati, longi, descri);
    });
    //aixi el punt on ens trobem quedara assenyalat quan es carrega el mapa
    mapa.mostrarPuntInicial();
}


//funcio que rep un array de instancies i mostrara cadascuna d'aquestes 
//en un contenidor amb les seves caracteristiques segons: espai, atraccio, museu
function mostraPuntsTuristicsLlista(objCreats){
    //netegem l'espai abans d'afegir els punts turistics 
    contenidorPunts.innerHTML = "";
    if(!objCreats || objCreats.length === 0) {
        //si no hi ha resultats mostrem missatge de 'no resultats'
        const noResultats = document.createElement('p');
        noResultats.textContent = "No hi ha informació per mostrar";
        noResultats.classList.add("no-resultats");
        contenidorPunts.appendChild(noResultats);
        return;
    }
    //mostrem els punts d'interes
    console.log(`Els objectes de punts turistics entrats son: ${objCreats}`);

    //per mostrar els punts turistics al DOM farem un div per cadascun
    objCreats.forEach(function(objCreat){
        //si la instancia no te ID li assignem un
        if (!objCreat.id) {
            nextId++;
            objCreat.setId(nextId);
        }
        
        //faig l'element div per cada punt turistic 
        const puntDiv = document.createElement('div');
        puntDiv.classList.add('punt-result');

        //titol del punt turistic
        const titolPunt = document.createElement('h4');
        titolPunt.textContent = objCreat.nom;
        titolPunt.classList.add('nom-punt');

        //segons de quin tipus es cada objecte mostrara diferent info
        const infoPunt = document.createElement('p');

        //si puntTuristic es ESPAI mostra: ciutat i tipus
        if(objCreat.tipus.toLowerCase() === 'espai'){
            infoPunt.textContent = `${objCreat.ciutat} | Tipus: ${objCreat.tipus}`;
            puntDiv.classList.add('punt-espai');
        }
        //si puntTuristic es ATRACCIO mostra: ciutat, tipus, horari, preu
        if(objCreat.tipus.toLowerCase() === 'atraccio'){
            infoPunt.textContent = `${objCreat.ciutat} | Tipus: ${objCreat.tipus} | Horaris: ${objCreat.horaris} | Preu: ${objCreat.getPreuIva()}`;
            puntDiv.classList.add('punt-atraccio');
        }
        //si puntTuristic es MUSEU mostra: ciutat, tipus, horari, descripcio
        if(objCreat.tipus.toLowerCase() === 'museu'){
            //faig un element span amb descripcio per dividir el contingut en dos linies
            const descripcio = document.createElement('span');
            descripcio.innerHTML = `Descripció: ${objCreat.descripcio}`;
            //preparem el text que es veura per el punt turistic de Museu
            infoPunt.textContent = `${objCreat.ciutat} | Tipus: ${objCreat.tipus} | Horaris: ${objCreat.horaris} | Preu: ${objCreat.getPreuIva()}`;
            
            //element de salt de linia
            infoPunt.appendChild(document.createElement('br'));
            infoPunt.appendChild(descripcio);
            puntDiv.classList.add('punt-museu');
        }
        infoPunt.classList.add('info-punt');
        
        //afegir boto eliminar amb la seva funcio
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'delete';
        btnDelete.classList.add('delete-btn');
        //desem el id del boto per despres afegir-ho com argument
        let id_boto = objCreat.getId();
        btnDelete.addEventListener('click', function(){
            deleteThisPuntTuristic(id_boto);
        });

        //afegim l'element js creat al contenidor de cada punt
        puntDiv.appendChild(titolPunt);
        puntDiv.appendChild(infoPunt);
        puntDiv.appendChild(btnDelete);

        //afegim el contenidor de punt turistic al contenidor html creat
        contenidorPunts.appendChild(puntDiv);
    });
    //cridem funcio per calcular quants punts turistics tenim a la llista
    numPunts(objCreats);
}


//funcio que compta el nombre de punts turistics carregats a la llista
function numPunts(listaObj){
    if(!listaObj){
        totalPunts.textContent = `Número total: 0`;
        totalPunts.classList.add('total-punts');
        return;
    } 
    let num = listaObj.length;
    totalPunts.textContent = `Número total: ${num}`;
    totalPunts.classList.add('total-punts');
}


//funcio per processar una fila i retornar la instancia adequada: espai, museu o atraccio
const processObject = function (fila) {
    if (!fila.tipus) return null;
    let objCreat = null;

    if (fila.tipus.toLowerCase() === "espai") {
        objCreat = new PuntInteres(
            fila.id, fila.esManual, fila.pais, fila.ciutat, 
            fila.nom, fila.direcció, fila.tipus, fila.latitud, 
            fila.longitud, fila.puntuacio
        );
    } else if (fila.tipus.toLowerCase() === "atraccio") {
        objCreat = new Atraccio(
            fila.id, fila.esManual, fila.pais, fila.ciutat, 
            fila.nom, fila.direcció, fila.tipus, fila.latitud, 
            fila.longitud, fila.puntuacio, fila.horaris, 
            fila.preu, fila.moneda
        );
    } else if (fila.tipus.toLowerCase() === "museu") {
        objCreat = new Museu(
            fila.id, fila.esManual, fila.pais, fila.ciutat, 
            fila.nom, fila.direcció, fila.tipus, fila.latitud, 
            fila.longitud, fila.puntuacio, fila.horaris, 
            fila.preu, fila.moneda, fila.descripcio
        );
    }
    return objCreat;
};


//funcio que s'encarrega de la informació de menú desplegable tipus
function tipusDeOpcions(objectesCreats){
    //si argument es buit
    if(!objectesCreats) return;
    tipusOpcions.clear();   //netegem el set

    //afegim 'Tots' al començament del set
    tipusOpcions.add("Tots");

    //afegim els diferents tipus al set que nomes accepta valors unics
    for (let i = 0; i < objectesCreats.length; i++) {
        tipusOpcions.add(objectesCreats[i].tipus);
    }
    console.log("Tipus únics trobats:", tipusOpcions);
    
    //si no hi son els tres tipus de opcions: espai, museu, atraccio esborrem del set l'opcio: 'tots'
    if (tipusOpcions.size !== 4){
        tipusOpcions.delete('Tots');
    }
    console.log("Opcions finals:", tipusOpcions);
    //netegem el <select> abans d'afegir els nous valors
    selectTipus.innerHTML = "";

    //recorrer la llista i afegim els valors al select TIPUS
    tipusOpcions.forEach(function(tipus){
        let opcio = document.createElement('option');
        opcio.value = tipus.toLowerCase();
        opcio.textContent = tipus;
        //afegim cada opcio del set al select
        selectTipus.appendChild(opcio);
    });
}

//funcio per obtenir la bandera del pais i lat i lon des d'una API
async function banderaPais(codi_pais, pais_ciutat){
    try {
        const url = `https://restcountries.com/v3.1/alpha/${codi_pais}`;
        const response = await fetch(url);
        if(response.ok){
            console.log('Consulta fetch correcta!');
        }else{
            console.log('Consulta fetch incorrecta!');
            throw new Error(`Error ${response.status} : ${response.statusText}`);
        }
        const dataPais = await response.json();
        //mostrem tot l'objecte
        console.log('mostrem tot el objecte', dataPais);

        //mostrem pais, bandera i ciutat dalt de tot
        paraPais.textContent = 'País (';
        paraBandera.src = dataPais[0].flags.png;
        paraParentesis.textContent = ')';
        //s'ha d'agafar des del fitxer csv i arriba com parametre
        paraCiutat.textContent = pais_ciutat;
    
        //cercar les coordenades del pais
        //el camp latlng es un array de dos valors
        let tmp_lat = dataPais[0].latlng[0];
        let tmp_long = dataPais[0].latlng[1];
        console.log(`lat: ${tmp_lat} i lng: ${tmp_long}`);

        //actualitzem instancia del mapa segons les dades del fitxer csv
        mapa.actualizarPosInitMapa(tmp_lat, tmp_long);
        //mapa.mostrarPunt(tmp_lat, tmp_long, nom_del_pais);

    } catch (error) {
        console.error("Error al obtener la bandera:", error);
    }
}


//funcio per esborrar un punt turistic des de la llista de punts
function deleteThisPuntTuristic(id_boto){
    if (!id_boto){
        console.log('Error: ID no definit');
        return;
    }

    //abans d'esborrar cal confirmar la decisio
    if(confirm("Estàs segur que vols eliminar el punt d'interès?")){
        //filtrem l' array per eliminar el objete amb ID entrat
        const index = objectesCreats.findIndex(obj => obj.getId() === id_boto);
        if (index !== -1) {
            objectesCreats.splice(index, 1);
            console.log(`Punt turístic amb ID ${id_boto} eliminat.`);
        } else {
            console.log(`No s'ha trobat cap punt turístic amb ID ${id_boto}.`);
        }
        console.log('Qué pasa con los objetos disponibles: ', objectesCreats);
        //despres d'esborrar caldra actualitzar la llista de punts i mapa
        //i el nombre total de punts disponibles en la llista de punts
        mostraPuntsTuristicsLlista(objectesCreats);
        puntsAlMapa(objectesCreats);
        numPunts(objectesCreats);
    }
}


//afegim un esdeveniment per detectar canvis en el select d'ordenacio
selectOrdenacio.addEventListener("change", function(){
    ordenarLlista(objectesCreats, this.value);
});


//funcio per ordenar la llista segons l'opcio seleccionada
function ordenarLlista(llista, ordre) {
    if (!llista || llista.length === 0) return;

    //ordena ascendent o descendent segons el nom
    llista.sort((a, b) => {
        if (ordre === "asc") {
            return a.nom.localeCompare(b.nom); // A-Z
        } else {
            return b.nom.localeCompare(a.nom); // Z-A
        }
    });
    //tornem a renderitzar la llista
    mostraPuntsTuristicsLlista(llista);
}


//afegim esdeveniment per detectar un canvi en el select/tipus/punt_turistic
selectTipus.addEventListener('change', function(){
    filtrarPerTipus(objectesCreats, this.value);
});


//funcio per filtrar els objectes de punts turistics segons el tipus triat
function filtrarPerTipus(objectes, tipusSeleccionat) {
    let objectesFiltrats;
    //filtrem els punts turistics segons l'opcio triada del select
    if (tipusSeleccionat === "tots") {
        objectesFiltrats = objectes;
    } else {
        objectesFiltrats = objectes.filter(obj => obj.tipus.toLowerCase() === tipusSeleccionat);
    }
    //cridem les funcions per actualitzar: llista, punts del mapa i nombre de items en la llista
    mostraPuntsTuristicsLlista(objectesFiltrats);
    puntsAlMapa(objectesFiltrats);
    numPunts(objectesFiltrats);
}


//afegim un esdeveniment al input de text
inputText.addEventListener('input', function(){
    buscarEnLlista(objectesCreats, this.value);
});


//funcio que filtra els noms del objectes segons el text entrat
function buscarEnLlista(objectes, text_entrat){
    let text_cerca = text_entrat.toLowerCase().trim();

    //si text entrat es major a 3 lletres
    if(text_cerca.length > 3){
        //obtenim el resultat de filtrar els objectes segons el nom i el text cercat
        let objsFiltrats = objectes.filter(function(obj){
            return obj.nom.toLowerCase().includes(text_cerca);
        });

        //cridem les funcions per actualitzar: llista, punts del mapa i nombre de items en la llista
        mostraPuntsTuristicsLlista(objsFiltrats);
        puntsAlMapa(objsFiltrats);
        numPunts(objsFiltrats);
    }else{
        //si text es menor o igual a 3 chars, mostrem tot igual que al començament
        mostraPuntsTuristicsLlista(objectes);
        puntsAlMapa(objectes);
        numPunts(objectes);
    }
}