//Definimos la clase planta
const
VALOR_MINIMO = -10;
const
VALOR_MAXIMO = 10;

function Planta(estado, agua, abono, tierra, aire, luz, clima) {
	this.estado = estado;
	this.agua = agua;
	this.abono = abono;
	this.tierra = tierra;
	this.aire = aire;
	this.luz = luz;
	this.estilo = '';
	this.plantada = 0;
	this.maceta = 0;
	this.ratioCrecimiento = 1;
	this.ratioDescensoAgua = 1;
	this.mensaje = 'La planta ha crecido ';
}

// ESTADO, AGUA, ABONO, TIERRA, ï¿½LUZ?
var estado0 = new Array(0, 1, 2, 1, 0);
var estado1 = new Array(1, 3, 2, 1, 0);
var estado2 = new Array(2, 2, 4, 1, 0);
var estado3 = new Array(3, 5, 2, 6, 0);
const ESTADO_FINAL = 4;
var estados = new Array(estado0, estado1, estado2, estado3);
var estadoSiguiente = estado0;

// Ratios para el mayor o menor avance del agua
var ratioDescensoAgua;
var ratioCrecimiento;

Planta.prototype.crecer = function() {
	for ( var i = 0; i < estados.length; i++) {
		if (this.estado == estados[i][0]) {
			var porcentajeAgua = (Math.min(this.agua, estados[i][1]))
					/ (estados[i][1]);
			var porcentajeAbono = (Math.min(this.abono, estados[i][2]))
					/ (estados[i][2]);
			var porcentajeTierra = (Math.min(this.tierra, estados[i][3]))
					/ (estados[i][3]);
			var porcentajeEstado = (porcentajeTierra + porcentajeAbono + porcentajeAgua) / 3;
			// porcentajeEstado = porcentajeEstado*planta.ratioCrecimiento;
			var valor = 0;
			if (porcentajeEstado == 1) {
				var estadosAnterior = new Array(this.agua, this.abono,
						this.tierra);
				commandsEstado.push(estadosAnterior);
				commands.push(this);
				this.estado++;
				if (estados.length >= i + 1) {
					estadoSiguiente = estados[i + 1];
				}
				this.tierra = 0;
				this.abono = 0;
				this.agua = 0;
				valor = 0;
			} else if (porcentajeEstado > 0.25 && porcentajeEstado <= 0.5) {
				valor = 25;
			} else if (porcentajeEstado > 0.5 && porcentajeEstado <= 0.75) {
				valor = 50;
			} else if (porcentajeEstado > 0.75 && porcentajeEstado <= 1) {
				valor = 75;
			}
			planta.estilo = 'planta' + (this.estado) + valor;
			plantaObjeto.className = planta.estilo;
			if (porcentajeEstado == 1 && planta.estado == ESTADO_FINAL) {
				victoria = 1;
				localStorage["victoria"] = localStorage["victoria"] +  new Date().toLocaleString();
				return "Enhorabuena, HAS GANADO! Registramos tu tiempo y puntuación... ";
			} else if (porcentajeEstado == 1) {
				generarInfo();
				return "Enhorabuena, la planta ha crecido ";
			}

			break;
		}
		if (this.estado == ESTADO_FINAL) {
			victoria = 1;
			return "Enhorabuena, HAS GANADO! ";
		}
	}

}

Planta.prototype.consumirAbono = function() {
	if (planta.abono > VALOR_MINIMO && this.estado > 0) {
		planta.abono--;
	}
}

Planta.prototype.consumirTierra = function() {
	if (planta.tierra > VALOR_MINIMO && this.estado > 0) {
		planta.tierra--;
	}
}

Planta.prototype.perderAgua = function() {
	if (planta.agua > VALOR_MINIMO && this.estado > 0) {
		planta.agua = planta.agua - (1 * planta.ratioDescensoAgua);
	}
}

Planta.prototype.deshacer = function(planta) {
	this.estado--;

	var estadosAnterior = commandsEstado.pop();
	this.agua = estadosAnterior[0];
	this.abono = estadosAnterior[1];
	this.tierra = estadosAnterior[2];
	estadoSiguiente = estados[estadoSiguiente[0] - 1];
	valor = 0;
	planta.estilo = 'planta' + (this.estado) + valor;
	plantaObjeto.className = planta.estilo;
}

function Abono(id) {
	this.id = id;
	this.targets = new Array("planta");
	this.mensaje = "Acabas de abonar la planta ";
}

Abono.prototype.abonar = function(planta) {
	if (planta.abono < VALOR_MAXIMO) {
		planta.abono++;
	}
}

Abono.prototype.actuar = function(planta) {
	commands.push(this);
	actualizarDeshacer();
	this.abonar(planta);
}

Abono.prototype.deshacer = function(planta) {
	planta.abono--;
}

function Tierra(id) {
	this.id = id;
	this.targets = new Array("planta");
	this.mensaje = "Acabas de echar tierra a la planta "
}

Tierra.prototype.sustentar = function(planta) {
	if (planta.tierra < VALOR_MAXIMO) {
		planta.tierra++;
	}
}

Tierra.prototype.deshacer = function(planta) {
	planta.tierra--;
}

Tierra.prototype.actuar = function(planta) {
	commands.push(this);
	actualizarDeshacer();
	this.sustentar(planta);
}

function Regadera(capacidad) {
	this.mensaje = "Acabas de regar la planta ";
	this.agua = 0;
	this.targets = new Array("planta", "grifo");
	this.capacidad = capacidad;
	this.intervalo = 1;
}

Regadera.prototype.rellenar = function() {
	this.agua = this.capacidad;
	this.mensaje = "Acabas de rellenar la regadera";
}

Regadera.prototype.regar = function(planta) {
	planta.agua = planta.agua + this.intervalo;
	this.agua = this.agua - this.intervalo;
	if (this.agua == 0) {
		var regaderaObjeto = document.querySelector('#regadera');
		regaderaObjeto.className = 'vacia';
	}
	this.mensaje = "Acabas de regar la planta.";
}

Regadera.prototype.deshacer = function(planta) {
	planta.agua = planta.agua - this.intervalo;
	this.agua = this.agua + this.intervalo;
	if (this.agua == 0) {
		var regaderaObjeto = document.querySelector('#regadera');
		regaderaObjeto.className = 'vacia';
	}
}

Regadera.prototype.actuar = function(planta) {
	if (this.agua >= this.intervalo) {
		commands.push(this);
		actualizarDeshacer();
		this.regar(planta);
	} else {
		throw "La regadera no tiene agua suficiente";
	}
}

// temperatura, aire, lluvia, nieve y luz (factores) (mÃ¡ximo 1, minimo 0)
var climaBasico = new Array(1.00, 0.05, 0.00, 0.00, 1.00); // clima 0 temp =
// 1.00 - 0.05 -
// 0.00
var climaLluvioso = new Array(0.68, 0.50, 1.00, 0.00, 0.40); // clima 1 temp
// = 0.68 - 0.00
// - 1.00
var climaInterior = new Array(0.82, 0.10, 0.00, 0.00, 0.30); // clima 2
var climaNieve = new Array(0.05, 0.10, 0.00, 0.6, 0.99); // clima 3 //el
// reflejo es mucho
// peor que un dia
// soleado ;)
var climaNublado = new Array(0.66, 0.20, 0.50, 0.10, 0.40);// clima 4
var climaNoche = new Array(0.55, 0.01, 0.20, 0.10, 0.20); // clima 5

function Clima(valores) {
	this.temperatura = valores[0];
	this.aire = valores[1];
	this.lluvia = valores[2];
	this.nieve = valores[3];
	this.luz = valores[4];
	// Relacion temperatura con el resto de elementos
	this.temperatura = this.temperatura - this.aire - this.nieve;
	planta.ratioDescensoAgua = this.temperatura - this.lluvia - this.nieve;
	planta.ratioCrecimiento = this.luz - this.nieve - this.aire;
}

function CambioClima(_valores) {
	Clima(_valores);
}

// agua, abono, tierra, aire, luz
var nivelBasico = new Array(5000, 100000, 100000, 0, 1);
var nivelMedio = new Array(10000, 10000, 10000, 0, 0.8);
var nivelAlto = new Array(5000, 5000, 5000, 0, 0.4);

function Nivel(nivel) {
	this.decayAgua = nivel[0];
	this.decayAbono = nivel[1];
	this.decayTierra = nivel[2];
	this.decayAire = nivel[3];
	this.decayLuz = nivel[4];
}

function Pala(id) {
	this.id = id;
	this.targets = new Array("planta");
	this.mensaje = "Cavando para plantar ";
}

Pala.prototype.cavar = function(planta) {
	if (planta.plantada == 0) {
		planta.plantada = 1;
		planta.maceta = 1;
	}
}

Pala.prototype.actuar = function(planta) {
	commands.push(this);
	actualizarDeshacer();
	this.cavar(planta);
}

Pala.prototype.deshacer = function(planta) {
	planta.plantada = 0;
}

function Semilla(id) {
	this.id = id;
	this.targets = new Array("planta");
	this.mensaje = "Acabas de plantar la semilla ";
}

Semilla.prototype.plantar = function(planta) {
	if (planta.plantada == 1 && planta.estado < 0 && interior == 0) {
		planta.estado = 0;
		commands.push(this);
		actualizarDeshacer();
		generarInfo();
	} else if (planta.plantada == 0 && interior == 0) {
		throw "Debes preparar el terreno antes de plantar ";
	} else if (planta.maceta == 0 && interior == 1) {
		throw "Debes colocar la maceta antes de plantar ";
	} else if (planta.maceta == 1 && planta.abono > 0 && planta.tierra > 0
			&& interior == 1) {
		planta.estado = 0;
		commands.push(this);
		actualizarDeshacer();
		generarInfo();
	} else if (planta.maceta == 1) {
		throw "Debes a&ntilde;adir tierra y abono en la maceta antes de plantar ";
	}
}

Semilla.prototype.actuar = function(planta) {
	this.plantar(planta);
}

Semilla.prototype.deshacer = function(planta) {
	planta.estado = -1;
}

function Maceta(id) {
	this.id = id;
	this.targets = new Array("planta");
	this.mensaje = "Colocando la maceta ";
}

Maceta.prototype.colocar = function(planta) {
	if (planta.maceta == 0) {
		planta.maceta = 1;
		planta.plantada = 1;
	}
}

Maceta.prototype.actuar = function(planta) {
	commands.push(this);
	actualizarDeshacer();
	this.colocar(planta);
}

Maceta.prototype.deshacer = function(planta) {
	planta.maceta = 0;
}
