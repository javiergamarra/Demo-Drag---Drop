/**
 * Evento sobre la imagen que cierra el panel
 * 
 * @param _clima
 *            clima que representa
 * @return
 */
function cerrarPanelGuia() {
	mostrarCapaGuia(false, this.parentNode.parentNode.id, 'pagina');
}

/**
 * Crea el HTML que conforma la capa que va a formar la ventana de seleccion de
 * clima
 * 
 * @param _idCapa
 *            referencia a la capa que se va a superponer
 * @return Nodo padre de la ventana
 */
function createCapaGuia(_idCapa) {
	var divCapa = document.createElement('div');
	divCapa.setAttribute('id', _idCapa);
	divCapa.style.position = "absolute";
	divCapa.className = "capaGuia";
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
function mostrarCapaGuia(_mostrar, _idCapa, _idElementoPadre) {
	try {
		var idCapa = _idCapa;
		var myCapa = document.getElementById(idCapa);
		if (myCapa == null || myCapa == 'undefined') {
			myCapa = createCapaGuia(_idCapa);
			document.getElementById(_idElementoPadre).appendChild(myCapa);
		}

		if (!_mostrar) {
			myCapa.style.visibility = "hidden";
		} else if (myCapa.style.visibility != "visible") {
			myCapa.style.visibility = "visible";
			myCapa.className = 'capaGuia';
		}
	} catch (error) {
		alert(error);
		mostrarMensaje('Error mostrar capa (' + _mostrar + ', ' + _idCapa
				+ ', ' + _idElementoPadre + '): ' + error, 'error');
	}
};

function generarGuia() {
	var id = 'guia';
	mostrarCapaGuia(true, id, 'pagina');
	var capa = document.getElementById(id);
	var capaCerrar = document.createElement('div');
	capaCerrar.id = "cerrar";
	var imagenCerrar = document.createElement('img');
	imagenCerrar.title = "Cerrar panel Guía";
	imagenCerrar.alt = "Cerrar panel Guía";
	imagenCerrar.id = "imagenCerrar";
	imagenCerrar.src = "./images/close.png";
	addEvent(imagenCerrar, 'click', this.cerrarPanelGuia);
	capaCerrar.appendChild(imagenCerrar);
	capa.appendChild(capaCerrar);
	var texto = document.createElement('p');
	texto.innerHTML = "";
	texto.id = "texto1";
	capa.appendChild(texto);
	var img = document.createElement('img');
	img.src = "./images/Info.jpg";
	img.className = "imgGuia";
	img.id = "imagen1";
	texto.appendChild(img);
	var texto = document.createElement('p');
	texto.innerHTML = "";
	capa.appendChild(texto);
	texto1 = document.createElement('input');
	texto1.setAttribute('type', 'button');
	texto1.setAttribute('name', 'sal');
	texto1.setAttribute('value', 'Seguir con la introduccion');
	texto1.onclick =hi;
	texto1.className = "textoGuia";
	texto.appendChild(texto1);
	texto1 = document.createElement('input');
	texto1.setAttribute('type', 'button');
	texto1.setAttribute('name', 'sal');
	texto1.setAttribute('value', 'Salir');
	texto1.className = "textoGuiaSalir";
	texto1.onclick = close;
	texto.appendChild(texto1);
}

function hi() {
	var img = document.getElementById("imagen1");
	img.src = "./images/Info2.jpg";
	img.className = "imgGuia";
	var texto = document.getElementById("texto1");
	texto.appendChild(img);
	var myCapa = document.getElementById('guia');
	
};

function close() {
	var myCapa = document.getElementById('guia');
	myCapa.style.visibility = "hidden";
	
};
