/**
 * Evento sobre la imagen que cierra el panel
 * 
 * @param _clima
 *            clima que representa
 * @return
 */
function cerrarPanelInfo() {
	mostrarCapaInfo(false, this.parentNode.parentNode.id, 'pagina');
}

/**
 * Crea el HTML que conforma la capa que va a formar la ventana de seleccion de
 * clima
 * 
 * @param _idCapa
 *            referencia a la capa que se va a superponer
 * @return Nodo padre de la ventana
 */
function createCapaInfo(_idCapa) {
	var divCapa = document.createElement('div');
	divCapa.setAttribute('id', _idCapa);
	divCapa.style.position = "absolute";
	divCapa.className = "capaInfo";
	return divCapa;
};

/**
 * Muestra u oculta la ventana <em>_idCapa</em>.<br>
 * Si se debe mostrar, pero la ventana no existe, se crea una dentro del
 * elemento cuyo identificador se proporciona en <em>_idElementoPadre</em>
 * 
 * @param _mostrar
 *            <em>true</em> Si se debe mostrar la ventana. <em>false</em> si
 *            se debe ocultar.
 * @param _idCapa
 *            Identificador de la ventana
 * @param _idElementoPadre
 *            Identificador del elemento en donde se anidará la capa
 */
function mostrarCapaInfo(_mostrar, _idCapa, _idElementoPadre) {
	try {
		var idCapa = _idCapa;
		var myCapa = document.getElementById(idCapa);
		if (myCapa == null || myCapa == 'undefined') {
			myCapa = createCapaInfo(_idCapa);
			document.getElementById(_idElementoPadre).appendChild(myCapa);
		}

		if (!_mostrar) {
			myCapa.style.visibility = "hidden";
		} else if (myCapa.style.visibility != "visible") {
			myCapa.style.visibility = "visible";
			myCapa.className = 'capaInfo';
		}
	} catch (error) {
		alert(error);
		mostrarMensaje('Error mostrar capa (' + _mostrar + ', ' + _idCapa
				+ ', ' + _idElementoPadre + '): ' + error, 'error');
	}
};

var info = new Array(
		"La fotosíntesis se realiza en los cloroplastos, donde se encuentran los pigmentos capaces de captar y absorber la energía luminosa procedente del sol.",
		"Se trata de uno de los procesos anabólicos más importantes de la naturaleza",
		"Se transforma materia inorgánica en orgánica: a partir de la fuente de carbono del dióxido de carbono del aire.",
		"Se transforma la energía luminosa en química: que es usada por todos los seres vivos. Los vegetales son el primer y único eslabón productor de la cadena trófica.",
		"Los principales condicionantes de la fotosíntesis son: la concentración de dióxido de carbono, la concentración de oxígeno, la intensidad luminosa...",
		"La actividad fotosintética crece al aumentar la cantidad de CO2, hasta llegar a un límite a partir del cual el rendimiento se estabiliza. Para ello la intensidad luminosa debe ser constante y elevada",
		"Cuanto mayor es la cantidad de oxígeno del ambiente, menor es la cantidad de dióxido de carbono fijado en forma de moléculas orgánicas. ",
		"Las plantas poseen un pigmento de color verde, la clorofila, encargado de absorber la luz necesaria para realizar este proceso.",
		"La clorofila es una compleja molécula orgánica de color verde ubicada dentro de los cloroplastos de las células vegetales.",
		"El proceso de la fotosíntesis consta de dos etapas o fases: la fase inicial o lumínica y la fase secundaria u oscura",
		"La presencia de oxígeno disminuye la cantidad de una enzima imprescindible para fijar el CO2.");

function generarInfo() {
	var numero = Math.floor(Math.random() * 11);
	var id = 'info' + numero;
	mostrarCapaInfo(true, id, 'pagina');
	var capa = document.getElementById(id);
	var capaCerrar = document.createElement('div');
	capaCerrar.id = "cerrar";
	var imagenCerrar = document.createElement('img');
	imagenCerrar.title = "Cerrar panel Info";
	imagenCerrar.alt = "Cerrar panel Info";
	imagenCerrar.id = "imagenCerrar";
	imagenCerrar.src = "./images/close.png";
	addEvent(imagenCerrar, 'click', this.cerrarPanelInfo);
	capaCerrar.appendChild(imagenCerrar);
	capa.appendChild(capaCerrar);
	var texto = document.createElement('p');
	texto.innerHTML = info[numero];
	texto.className = "textoInfo";
	capa.appendChild(texto);

}
