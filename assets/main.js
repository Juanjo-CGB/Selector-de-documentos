/**
 * @fileoverview Selector de documentos
 * @version 0.1
 * @author Juanjo Alonso Sánchez <jj.alonso@esla.com>
 * @copyright cgb@esla.com
 */
/**
 * Tipo de dato Colores
 * @typedef {Object} Colores
 * @property {string} imagen Color de archivos de imagen
 * @property {string} zip Color de archivos comprimidos
 * @property {string} pdf Color de pdf
 * @property {string} texto Color de editores de texto
 * @property {string} calculo Color de las hojas de estilo
 */
/**
  * Paleta de colores del formato de cada documento
  * @type {Colores}
  */
const paletaColores = {
    imagen: '#F1C40F',
    zip: '#9B59B6',
    pdf: '#CB4335',
    texto: '#3498DB',
    calculo: '#28B463'
}
/**
  * Array con los formatos permitidos
  * @type {Array}
  */
 const formatosPermitidos = ['zip', 'rar', 'txt', 'pdf', 'docx', 'doc', 'xls', 'xlsx', 'jpeg', 'jpg', 'gif', 'png'];
 /**
  * Establece el año en el footer
  * @returns {void}
  */
  function establecerYear(){ 
    const today = new Date();
    const nodoYear = document.querySelector(".footer__copy-year"); 
    nodoYear.innerHTML = today.getFullYear();
}
/**
  * Crea el nodo del documento seleccionado
  * @param {string} fileName Nombre del documento seleccionada
  * @param {string} fileType Formato del documento seleccionada
  * @param {Response} [fileResponse]: Documento seleccionado
  * @returns {void}
  */
 function createFile(fileName, fileType, fileResponse) {   
    //Creamos el nodo del documento
    let container = document.createElement('div');
    container.classList.add('selector__galeria-container');
    container.setAttribute("data-url", fileResponse.url);
    container.setAttribute("data-name", fileName);

    let options = document.createElement('div');
    options.classList.add('selector__galeria-options'); 

    let format = document.createElement('div');
    format.classList.add('selector__galeria-format'); 
    format.innerHTML = fileType;  
    
    let icons = document.createElement('div');
    icons.classList.add('selector__galeria-icons'); 
    let iconoPapelera = document.createElement('i');
    iconoPapelera.classList.add('fas', 'fa-trash', 'selector__galeria-icon'); 
    let iconoDescarga = document.createElement('i');
    iconoDescarga.classList.add('fas', 'fa-download', 'selector__galeria-icon'); 
    icons.append(iconoPapelera);
    icons.append(iconoDescarga);
    options.append(format);
    options.append(icons);

    let name = document.createElement('div');
    name.classList.add('selector__galeria-name'); 
    name.innerHTML = fileName;
    // Pintamos fondo y paleta de colores
    switch (fileType) {
        case 'zip':
        case 'rar':
            format.style.backgroundColor = paletaColores.zip;
            container.style.backgroundImage = "url('./assets/imgs/icono-" + fileType +".jpg";
            break;
        case 'pdf':
            format.style.backgroundColor = paletaColores.pdf;
            container.style.backgroundImage = "url('./assets/imgs/icono-" + fileType +".jpg";
            break;
        case 'doc':
        case 'docx':
        case 'txt':
            format.style.backgroundColor = paletaColores.texto;
            container.style.backgroundImage = "url('./assets/imgs/icono-" + fileType +".jpg";
            break;
        case 'xlsx':
        case 'xls':
            format.style.backgroundColor = paletaColores.calculo;
            container.style.backgroundImage = "url('./assets/imgs/icono-" + fileType +".jpg";
            break;
        default:
            format.style.backgroundColor = paletaColores.imagen;
            container.style.backgroundImage = "url('"+ fileResponse.url +"')"; 
            break;
    }
    container.append(options);
    container.append(name);    
    //Pintamos el documento
    contenedorFiles.appendChild(container);
}
//Pintar año
establecerYear();
const fileUpload = document.querySelector("#selector__input");
const contenedorFiles = document.querySelector(".selector__galeria");
//Subir documento
fileUpload.addEventListener("change", async (event) =>{
    let files = event.target.files;
    let fileName = '';
    let type = '';
    try {
        for (let file of files){
            let partsName = [];
            fileName = file.name;
            partsName = file.name.split(".");
            type = partsName.pop();
            // Validamos el formato
            if (formatosPermitidos.includes(type)) {
                const fileURL = await fetch(URL.createObjectURL(file));
                createFile(fileName, type, fileURL);
            }                        
        }
    } catch (error) {
        console.log(error);
    }
});
//Borrar y/o descargar documento
contenedorFiles.addEventListener("click", (event) =>{       
    if(event.target.classList.contains('fa-trash')){
        event.target.parentNode.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.parentNode);
    }
    if(event.target.classList.contains('fa-download')){
        let fileURL = event.target.parentNode.parentNode.parentNode.getAttribute("data-url");
        let fileName = event.target.parentNode.parentNode.parentNode.getAttribute("data-name");
        let a = document.createElement('a');
        a.download = fileName;
        a.target = '_blank';
        a.href= fileURL;
        a.click();
    }
});