// For discussion and comments, see: http://remysharp.com/2009/01/07/html5-enabling-script/
/*@cc_on'abbr article aside audio canvas details figcaption figure footer header hgroup mark menu meter nav output progress section summary time video'.replace(/\w+/g,function(n){document.createElement(n)})@*/

var addEvent = (function() {
	if (document.addEventListener) {
		return function(el, type, fn) {
			if (el && el.nodeName || el === window) {
				el.addEventListener(type, fn, false);
			} else if (el && el.length) {
				for ( var i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	} else {
		return function(el, type, fn) {
			if (el && el.nodeName || el === window) {
				el.attachEvent('on' + type, function() {
					return fn.call(el, window.event);
				});
			} else if (el && el.length) {
				for ( var i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	}
})();
/*******************************************************************************
 * Generar Capa / Ventana
 ******************************************************************************/

/**
 * Crea el HTML que conforma la capa que va a formar la ventana de seleccion de
 * clima
 * 
 * @param _idCapa
 *            referencia a la capa que se va a superponer
 * @return Nodo padre de la ventana
 */
function createCapa(_idCapa) {

	var divCapa = document.createElement('div');
	divCapa.setAttribute('id', _idCapa);
	divCapa.style.position = "absolute";
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
function mostrarCapa(_mostrar, _idCapa, _idElementoPadre) {
	try {
		var idCapa = _idCapa;
		var myCapa = document.getElementById(idCapa);
		if (myCapa == null || myCapa == 'undefined') {
			myCapa = createCapa(_idCapa);
			document.getElementById(_idElementoPadre).appendChild(myCapa);
		}

		if (!_mostrar) {
			myCapa.style.visibility = "hidden";
		} else if (myCapa.style.visibility != "visible") {
			fillParent(_idElementoPadre, idCapa);
			myCapa.style.visibility = "visible";
		}
	} catch (error) {
		mostrarMensaje('Error mostrar capa (' + _mostrar + ', ' + _idCapa
				+ ', ' + _idElementoPadre + '): ' + error, 'error');
	}
};

/**
 * Aumenta y coloca el elemento <em>_inner</em> para que ocupe totalmente el
 * mismo espacio y posición que el elemento <em>_parent</em>
 * 
 * @param _parent
 *            Identificador del elemento padre
 * @param _inner
 *            Identificador del elemento que ocupará todo el espacio del
 *            elemento padre
 */
function fillParent(_parent, _inner) {
	var element = document.getElementById(_parent);
	var absolute_offset = get_element_absolute_offset(element);
	var new_div = document.getElementById(_inner);
	new_div.style.left = absolute_offset.left + 'px';
	new_div.style.top = absolute_offset.top + 'px';
	new_div.style.width = element.offsetWidth + 'px';
	new_div.style.height = element.offsetHeight + 'px';
};

/**
 * Centra el elemento <em>_inner</em> dentro del elemento <em>_parent</em>
 * 
 * @param _parent
 *            Identificador del elemento padre
 * @param _inner
 *            Identificador del elemento que se centrará dentro del elemento
 *            padre
 */
function centerIntoParent(_parent, _inner) {
	var element = document.getElementById(_parent);
	var new_div = document.getElementById(_inner);
	new_div.style.left = (element.offsetWidth / 2) - (new_div.offsetWidth / 2)
			+ 'px';
	new_div.style.top = (element.offsetHeight / 2) - (new_div.offsetHeight / 2)
			+ 'px';
};

/**
 * Recupera el tamaño del margen superior e izquierdo del elemento
 * proporcionado
 * 
 * @param element
 *            Elemento a calcular
 * @return Concepto con el margen superior (x.top) e izquierdo (x.left)
 */
function get_element_absolute_offset(element) {
	var rv = {
		"top" : element.offsetTop,
		"left" : element.offsetLeft
	};
	if (element.offsetParent) {
		var parent_rv = get_element_absolute_offset(element.offsetParent);
		rv.top += parent_rv.top;
		rv.left += parent_rv.left;
	}
	return rv;
};

/**
 * Genera el panel para la seleccion de climas
 * 
 */
function generarPanel() {
	mostrarCapa(true, 'base', 'pagina');
	mostrarCapa(true, 'ventanaClima', 'juego');
	var contenedorPadre = document.getElementById('ventanaClima');
	var contenedor = document.createElement('div');
	contenedor.id = "climas";
	var capa = document.querySelector('#capaSol');
	if (capa == null) {
		var capaCerrar = document.createElement('div');
		capaCerrar.id = "cerrar";
		var imagenCerrar = document.createElement('img');
		imagenCerrar.title = "Cerrar panel Cambio Clima";
		imagenCerrar.alt = "Cerrar panel Cambio Clima";
		imagenCerrar.id = "imagenCerrar";
		imagenCerrar.src = "./images/close.png";
		addEvent(imagenCerrar, 'click', this.cerrarPanel);
		capaCerrar.appendChild(imagenCerrar);

		var capaSol = generarImagen('Calido', 'Sol', 'iconoSol.jpg');
		var capaLluvia = generarImagen('Lluvioso', 'Lluvia', 'iconoLluvia.jpg');
		var capaNublado = generarImagen('Nublado', 'Nublado',
				'iconoNublado.jpg');
		var capaNieve = generarImagen('Nevado', 'Nevado', 'iconoNevado.jpg');
		var capaOscuro = generarImagen('Noche', 'Noche', 'iconoNoche.jpg');
		var capaInterior = generarImagen('Interior', 'Interior',
				'iconoInterior.jpg');

		contenedor.appendChild(capaCerrar);
		contenedor.appendChild(capaSol);
		contenedor.appendChild(capaLluvia);
		contenedor.appendChild(capaNublado);
		contenedor.appendChild(capaNieve);
		contenedor.appendChild(capaOscuro);
		contenedor.appendChild(capaInterior);
		contenedorPadre.appendChild(contenedor);

		fillParent('ventanaClima', 'climas');
		centerIntoParent('ventanaClima', 'climas');
	}

};

/**
 * Genera la capa y la imagen que representa los iconos de la climatologia
 * 
 * @param _clima
 *            clima que representa
 * @param _icono
 *            nombre para el icono y la climatologia
 * @param _nombreIcono
 *            imagen con la que vamos a representar el icono
 * @return Capa que devuelve la imagen
 */
function generarImagen(_clima, _icono, _nombreIcono) {
	var imagen = document.createElement('img');
	imagen.title = "Cambia el clima a " + _clima;
	imagen.alt = "Cambia el clima a " + _clima;
	imagen.id = "imagen" + _icono;
	imagen.src = "./images/" + _nombreIcono;
	addEvent(imagen, 'click', this.cambiarClima);
	var capa = document.createElement('DIV');
	capa.id = "capa" + _icono;
	capa.className = "capaIconosClima";
	capa.appendChild(imagen);
	var texto = document.createElement('p');
	texto.id = 'texto' + _icono;
	texto.innerHTML = "Cambia el clima a " + _clima;
	texto.className = "textoCapaClima";
	addEvent(texto, 'click', this.cambiarClima);
	capa.appendChild(texto);
	return capa;
}

/**
 * Evento sobre la imagen que cambia el clima al indicado por el icono
 * 
 * @param _clima
 *            clima que representa
 * @return
 */
function cambiarClima() {
	mostrarCapa(false, 'base', 'pagina');
	mostrarCapa(false, 'ventanaClima', 'juego');
	var clima = null;
	if (this.nodeName == "P") {
		clima = this.id.replace('texto', '');
	}
	if (this.nodeName == "IMG") {
		clima = this.id.replace('imagen', '');
	}
	var fondo = document.querySelector('#fondo');
	// PrimeroVaciamos
	fondo.className = '';
	fondo.className = 'fondo' + clima;
	snowStorm.toggleSnow();
	if (clima == 'Interior') {
		interior = 1;
		snowStorm.stop();
		fondo.className = 'fondoInterior';
	} else if (clima == 'Nevado') {
		snowStorm.stop();
		snowStorm.snowColor = '#fff';
		snowStorm.snowCharacter = '&bull;';
		snowStorm.flakes = new Array();
		snowStorm.createSnow(snowStorm.flakesMax);
		snowStorm.resume();
		interior = 0;
	} else if (clima == 'Lluvia') {
		snowStorm.stop();
		snowStorm.snowColor = 'blue;';
		snowStorm.snowCharacter = '|';
		snowStorm.flakes = new Array();
		snowStorm.createSnow(snowStorm.flakesMax);
		snowStorm.resume();
		interior = 0;
	} else {
		snowStorm.stop();
		interior = 0;
	}

	actualizarNiveles()
	mostrarMensaje(
			"Ha seleccionado un cambio de escenario a través de la seleccion del clima "
					+ clima, 'info');
	// Aplicamos el nuevo Clima a los parametros de la aplicacion
	switch (clima) {
	case 'Interior':
		CambioClima(climaInterior);
		break;
	case 'Lluvia':
		CambioClima(climaLluvioso);
		break;
	case 'Nevado':
		CambioClima(climaNieve);
		break;
	case 'Noche':
		CambioClima(climaNoche);
		break;
	case 'Nublado':
		CambioClima(climaNublado);
		break;
	default:
		CambioClima(climaBasico);
		break;
	}

	mostrarMensaje("El clima se ha cambiado a clima  " + clima, 'info');
}

/**
 * Evento sobre la imagen que cierra el panel
 * 
 * @param _clima
 *            clima que representa
 * @return
 */
function cerrarPanel() {
	mostrarCapa(false, 'base', 'pagina');
	mostrarCapa(false, 'ventanaClima', 'juego');
}
