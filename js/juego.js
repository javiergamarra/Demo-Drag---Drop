var mensajesInformacion = document.querySelector('#textomensajes');
var msie = /* @cc_on!@ */0;
mensajesInformacion.style.opacity = 1;
var elementos = new Array();
var interior = 0;
var victoria = 0;
var abono = new Abono();
var tag = document.getElementById('abono');
inicializarDrag(tag, abono);

var tierra = new Tierra();
tag = document.getElementById('tierra');
inicializarDrag(tag, tierra);

var regadera = new Regadera(5);
tag = document.getElementById('regadera');
inicializarDrag(tag, regadera);

var semilla = new Semilla();
tag = document.getElementById('semilla');
inicializarDrag(tag, semilla);

var pala = new Pala();
tag = document.getElementById('pala');
inicializarDrag(tag, pala);

var maceta = new Maceta();
tag = document.getElementById('maceta');
inicializarDrag(tag, maceta);

var nivel = new Nivel(nivelBasico);

var plantaObjeto = document.querySelector('#planta');
var planta = new Planta(-1, 0, 0, 0, 0);
var clima = new Clima(climaBasico);
var commands = new Array();
var commandsEstado = new Array();

addEvent(plantaObjeto, 'dragover', function(e) {
	
	if (e.preventDefault) {
		e.preventDefault();
	}// allows us to drop
		// this.className = 'over';
		e.dataTransfer.dropEffect = 'copy';
		return false;
	});

// to get IE to work
addEvent(plantaObjeto, 'dragenter', function(e) {
	// this.className = 'over';
		return false;
	});

addEvent(plantaObjeto, 'dragleave', function() {
	this.className = planta.estilo;
});

addEvent(plantaObjeto, 'drop', function(e) {
	if (e.stopPropagation) {
		e.stopPropagation();
	}// stops the browser from redirecting...why???
		var objeto = JSON.parse(e.dataTransfer.getData('Text'), null);
		try {
			elementos[objeto.id].actuar(planta);
			mostrarMensaje(objeto.mensaje, 'info');
		} catch (error) {
			mostrarMensaje('Error: ' + error, 'error');
		}
		var mensaje = planta.crecer();
		if (mensaje != null) {
			mostrarMensaje(mensaje, 'avance');
		}
		actualizarNiveles();
	});

// GRIFO

var grifoObjeto = document.querySelector('#grifo');
actualizarNiveles();

addEvent(grifoObjeto, 'dragover', function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	} // allows us to drop
//		this.className = 'over';
		e.dataTransfer.dropEffect = 'copy';
		return false;
	});

addEvent(grifoObjeto, 'drop', function(e) {
	if (e.stopPropagation)
		e.stopPropagation(); // stops the browser from redirecting...why???
	var objeto = JSON.parse(e.dataTransfer.getData('Text'), null);
	if (elementos[objeto.id] instanceof Regadera) {
		var regaderaObjeto = document.querySelector('#regadera');
		regaderaObjeto.className = '';
		elementos[objeto.id].rellenar();
		mostrarMensaje(elementos[objeto.id].mensaje, 'info');
	}
});

setInterval(function() {
	planta.consumirTierra();
	planta.crecer();
	actualizarNiveles()
}, nivel.decayTierra);

setInterval(function() {
	planta.perderAgua();
	planta.crecer();
	actualizarNiveles()
}, nivel.decayAgua);

setInterval(function() {
	planta.consumirAbono();
	planta.crecer();
	actualizarNiveles()
}, nivel.decayAbono);

function calcularPosicion(valorActual, valorDeseado) {
	var valorTemporal = (3 + (valorActual * 10) - (10 * valorDeseado))
	if (valorTemporal > 83) {
		valorTemporal = 83;
	} else if (valorTemporal < -74) {
		valorTemporal = -74;
	}
	return valorTemporal + 'px';
}

function actualizarNiveles() {
	if (interior == 0) {
		display("posterior", "block");
		display("interior", "none");
		display("exterior", "block");
	} else if (planta.maceta != 1 && interior == 1) {
		display("posterior", "block");
		display("interior", "block");
		display("exterior", "none");
		document.getElementById("fondo").className = "fondoInterior";
	} else if (planta.maceta == 1 && interior == 1) {
		document.getElementById("fondo").className = "fondoInteriorMaceta";
	} 
	if (planta.estado < 0) {
		display("opcional", "none");
	} else {
		display("opcional", "block");
		display("noopcional", "block");
		display("posterior", "none");
		var nivel = document.getElementById("elementoAgua");
		nivel.style.left = calcularPosicion(planta.agua, estadoSiguiente[1]);
		nivel = document.getElementById("elementoAbono");
		nivel.style.left = calcularPosicion(planta.abono, estadoSiguiente[2]);
		nivel = document.getElementById("elementoTierra");
		nivel.style.left = calcularPosicion(planta.tierra, estadoSiguiente[3]);
	}
}

function mostrarMensaje(_mensaje, _tipo) {
	document.getElementById("mensaje").innerHTML = _mensaje;
	document.getElementById("mensaje").className = _tipo;
	mensajesInformacion.style.opacity = 1;
	setTimeout(function() {
		var t = setInterval(function() {
			if (mensajesInformacion.style.opacity <= 0) {
				if (msie) { // don't bother with the animation
					mensajesInformacion.style.display = 'none';
				}
				clearInterval(t);
			} else {
				mensajesInformacion.style.opacity -= 0.1;
			}
		}, 500);
	}, 1000);
}


setTimeout(function() {
	snowStorm.toggleSnow();
}, 100);


function display(clase, valor) {
	var elements = getElementsByClassName(document, clase);
	for ( var i = 0; i < elements.length; i++) {
		var e = elements[i];
		e.style.display = valor;
	}
}

function getElementsByClassName(node, classname) {
	if (node.getElementsByClassName) { // use native implementation if
		// available
		return node.getElementsByClassName(classname);
	} else {
		return (function getElementsByClass(searchClass, node) {
			if (node == null)
				node = document;
			var classElements = [], els = node.getElementsByTagName("*"), elsLen = els.length, pattern = new RegExp(
					"(^|\\s)" + searchClass + "(\\s|$)"), i, j;

			for (i = 0, j = 0; i < elsLen; i++) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		})(classname, node);
	}
}

function inicializarDrag(tag, objeto) {
	objeto.id = tag.id;
	elementos[objeto.id] = objeto;
	tag.setAttribute('draggable', 'true');
	tag.setAttribute('aria-grabbed','true');
	addEvent(tag, 'dragstart', function(e) {
		var objList, iCounter;
		for (iCounter = 0; iCounter < objeto.targets.length; iCounter++) {
			objList = document.getElementById(objeto.targets[iCounter]);
			objList.className = objList.className + ' highlight';
			objList.tabIndex = 0;
			objList.setAttribute('aria-dropeffect','copy');
		}
		e.dataTransfer.effectAllowed = 'copy';
		e.dataTransfer.setData('Text', JSON.stringify(objeto, null));
	});
	addEvent(tag, 'dragend', function(e) {
		var objList, iCounter;
		tag.setAttribute('aria-grabbed','true');
		for (iCounter = 0; iCounter < objeto.targets.length; iCounter++) {
			objList = document.getElementById(objeto.targets[iCounter]);
			objList.className =objList.className.replace(/highlight/g, ""); 
			objList.tabIndex = -1;
			objList.removeAttribute('aria-dropeffect');
		}
	});
}

function deshacer() {

	var commandObject = commands.pop();
	mensajesInformacion.style.opacity = 0;
	mensajesInformacion.firstChild.nodeValue = "";
	// execute the command
	commandObject.deshacer(planta);
	actualizarNiveles();
	actualizarDeshacer();
}

function actualizarDeshacer() {
	var capaDeshacer = document.getElementById("deshacer");
	if (commands.length > 0) {
		capaDeshacer.innerHTML = '¿Deshacer la acción?';
		capaDeshacer.style.display = "inline";
	} else {
		capaDeshacer.style.display = "none";
	}
}
generarGuia();