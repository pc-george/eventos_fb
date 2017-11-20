//Autor: Jorge Luis Pérez Canto.
//Fecha de creación: 30/10/2017
//Ultima modificación: 20/11/2017

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

var deferred = new $.Deferred(); 
var contadorGeneral=0, contadorOk=0;
var token, search, searchSinToken, ubicacion;
var datos = [];
var lista_eventos = [];
var eventoIndividual = [];
var event1 = [];
var debug="all", limit="500";
var evento_temp = [];


ubicacion="";
var id="", nameEvent="", description="", start_time="", end_time="", type="", category="", timezone="", ticket_uri="", is_canceled="", idPlace="", placeName="", city="", country="", latitude="", longitude="", street="", zip="", coverSource="", coverId="", pictureUrl="",  ownerName="", ownerId="", is_page_owned="", adminName="", adminID="", direccion="";


this.search = null;
this.searchSinToken = null;
this.searchPlaceName = null;
this.ubicacion = null;
this.token = "400698847015397|1be29b28adaeba46e8bfdbe0b81e4685";

function setSearchPlaceName(query)  {
	this.searchPlaceName = query + "&debug="+debug+"&limit="+limit+"&access_token="+getToken();
}
function getSearchPlaceName(){
	return this.searchPlaceName;
}

function setSearch(query)  {
	this.search = query + "&debug="+debug+"&limit="+limit+"&access_token="+getToken();
	this.searchSinToken = query;
}
function getSearch(){
	return this.search;
}

function setSearchEvent(palabraClave) {
	if ((palabraClave == "") || (palabraClave == null) || (palabraClave == undefined) ) {
		palabraClave = "*";
	}
	this.search = "https://graph.facebook.com/search?q="+palabraClave+"&type=event&debug="+debug+"&limit="+limit+"&access_token="+getToken();
	this.searchSinToken = "https://graph.facebook.com/search?q="+palabraClave+"&type=event";
}
function getSearchEvent(){
	return this.search;
}

function getSearchSinToken(){
	return this.searchSinToken;
}

function setUbicacion(param_ubicacion) { 
	ubicacion = param_ubicacion;
	this.ubicacion = param_ubicacion; 
}
function getUbicacion() { 
	return ubicacion; 
}
function setToken(token) { 
	this.token = token;
}
function getToken() { 
	return this.token;
}

function statusChangeCallback(response) {
	var User = document.getElementById("User");

	//Si el usuario está conectado correctamente a nuestra aplicación
	if (response.status === 'connected') {
		//console.log('¡Bienvenido! Obteniendo tu información ...');
		setToken(response.authResponse.accessToken);
		FB.api('/me', function(response) {
			console.log('Inicio de sesión exitoso para: ' + response.name);
			name = response.name;
			email = response.email;
			id = response.id;
			/*
			"http://graph.facebook.com/$id/picture?type=square"
			"http://graph.facebook.com/$id/picture?type=small"
			"http://graph.facebook.com/$id/picture?type=normal"
			"http://graph.facebook.com/$id/picture?type=large"
			*/

			// Incluimos un mensaje y la imagen del usuario
			User.innerHTML = "<center> <img src='//graph.facebook.com/" + id + "/picture?type=square'> " + name + " <br/> <small></small> </center>";
			//<img src='//graph.facebook.com/" + id + "/picture?type=normal'>"
			
		});
	}
	//No autorizado para acceder a la aplicación
	else if (response.status === 'not_authorized') {
		status.innerHTML = "Por favor, tienes que autenticarte con Facebook";
	}
	//No tiene sesión abierta en Facebook
	else {
		status.innerHTML = "No has iniciado sesión en Facebook";
	}
}

function obtenerDatosEventos(arregloDeEventos, xhrResp) {
	var deferredME = jQuery.Deferred();
	deferred.promise();

	for (i = 0; i < arregloDeEventos.data.length; i++) {
		contadorGeneral += 1; 
		try {
			var rId = "", rNameEvent="", rDescription="",rCountry="", rCity="", rLatitude=0, rLongitude=0, rNamePlace="", rStreet="", rStart_time="", rEnd_time="";

			try {rId = arregloDeEventos.data[i].id;} catch(err) {}
			try {rNameEvent = arregloDeEventos.data[i].name;} catch(err) {}
			try {rDescription = arregloDeEventos.data[i].description;} catch(err) {}
			try {rNamePlace = arregloDeEventos.data[i].place.name;} catch(err) {}
			try {rCountry = arregloDeEventos.data[i].place.location.country;} catch(err) {}
			try {rCity = arregloDeEventos.data[i].place.location.city;} catch(err) {}
			try {rLatitude = arregloDeEventos.data[i].place.location.latitude;} catch(err) {}
			try {rLongitude = arregloDeEventos.data[i].place.location.longitude;} catch(err) {}
			try {rStreet = arregloDeEventos.data[i].place.location.street;} catch(err) {}
			try {rStart_time = arregloDeEventos.data[i].start_time} catch(err) {}
			try {rEnd_time = arregloDeEventos.data[i].end_time} catch(err) {}
			
			var nameEvent = false, description = false, namePlace = false, country = false, city = false, street = false, lat = false, long = false;

			country = (rCountry === getUbicacion());
			city = (rCity === getUbicacion()+" City");

			try {country = rCountry.includes(getUbicacion());} catch(err) {}
			try {city = rCity.includes(getUbicacion());} catch(err) {}

			try {namePlace = rNamePlace.includes(getUbicacion());} catch(err) {}
			try {nameEvent = rNameEvent.includes(getUbicacion());} catch(err) {}
			//try {street = rStreet.includes(getUbicacion());} catch(err) {}
			//try {description = rDescription.includes(getUbicacion());} catch(err) {}

			if ( (getUbicacion()=="Guatemala") && (rCity=="" || rCity==undefined) && (rCountry=="" || rCountry==undefined) )  {
				lat = ((rLatitude >= 13) && (rLatitude <= 18));
				long =  ((rLongitude >= -92) && (rLongitude <= -88));
				//console.log("Lat.:"+rLatitude+" Long.:"+rLongitude+" +/- Guatemala");
			}

			//console.log(arregloDeEventos.data[i]);

			if ( (country || city || namePlace || nameEvent || street || description) || ((lat) && (long)) ) {
				
				console.log("Ind. Cumple critero. " + rId + "=" + rNameEvent);
				console.log(arregloDeEventos.data[i]);
				
				contadorOk += 1;
				evento_temp = {id:rId};
				var a = datos.indexOf(rId);
				if (a == -1) {
					datos.push(evento_temp);
				}

				console.log("Country["+country + "] City["+city + "] Name_Place[" + namePlace + "] Street["+street+"] lat["+lat+"] long["+long+"] Name_Event["+nameEvent+"] description["+description+"]");
				console.log(" ");
				deferredME.resolve();
			}

			
			/*
			if (country) {
				console.log(" Coincide country: "+country);
			}
			if (city) {
				console.log(" Coincide city: "+city);
			}
			if (namePlace) {
				console.log(" Coincide namePlace: "+namePlace);
			}
			if (street) {
				console.log(" Coincide street: "+street);
			}
			if (lat) {
				console.log(" Coincide lat: "+lat);
			}
			if (long) {
				console.log(" Coincide long: "+long);
			}
			if (nameEvent) {
				console.log(" Coincide nameEvent: "+nameEvent);
			}
			if (description) {
				console.log(" Coincide description: "+description);
			}
			console.log("");
			*/
		}
		catch(err) {
			console.log("ERROR: " + err);
			//console.log(JSON.stringify(arregloDeEventos.data[i]));
		}
	}
	return deferredME.resolve();
}

async function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // defensive check
            if (typeof callback === "function") {
                // apply() sets the meaning of "this" in the callback
                callback.apply(xhr);
            }
        }
    };
    xhr.send();
}

function getFecha(date){
	var fecha = "", dd = "", mm = "", mes = 0, yy = "";
	var arrayFecha = [];

	fecha = date.split("-");
	yy = fecha[0];
	mm = fecha[1];
	dd = fecha[2];
	
	switch (parseInt(mm)) {
	    case 1:
	        mes = "Ene";
	        break;
	    case 2:
	        mes = "Feb";
	        break;
	    case 3:
	        mes = "Mar";
	        break;
	    case 4:
	        mes = "Abr";
	        break;
	    case 5:
	        mes = "May";
	        break;
	    case 6:
	        mes = "Jun";
	        break;
		case 7:
	        mes = "Jul";
	        break;
	    case 8:
	        mes = "Ago";
	        break;
		case 9:
	        mes = "Sep";
	        break;
		case 10:
	        mes = "Oct";
	        break;
	    case 11:
	        mes = "Nov";
	        break;
	    case 12:
	        mes = "Dic";
	        break;
    	default:
        	mes = "";	        
	}

	arrayFecha = {"dia":dd, "mes":mes, "year":yy};
	return arrayFecha;
}

function llenarVector(place, arregloDeEvento) {

	id="", nameEvent="", description="", start_time="", end_time="", type="", category="", timezone="", zona_horaria="", ticket_uri="", is_canceled="", idPlace="", city="", country="", latitude="", longitude="", street="", zip="", coverSource="", coverId="", pictureUrl="",  ownerName="", ownerId="", is_page_owned="", adminName="", adminID="", direccion="";

	eventoIndividual = [];
	//console.log("obtenerDatosEventoPorId. "+ arregloDeEvento.id);

	//console.log(arregloDeEvento);
	//console.log(" ");

	try { id = arregloDeEvento.id;} catch(err) {}
	try { nameEvent = arregloDeEvento.name} catch(err) {}
	try { description = arregloDeEvento.description} catch(err) {}
	try { start_time = arregloDeEvento.start_time} catch(err) {}
	try { end_time = arregloDeEvento.end_time} catch(err) {}
	try { type = arregloDeEvento.type} catch(err) {}
	try { category = arregloDeEvento.category} catch(err) {}
	try { timezone = arregloDeEvento.timezone} catch(err) {}
	try { ticket_uri = arregloDeEvento.ticket_uri} catch(err) {}
	try { is_canceled = arregloDeEvento.is_canceled} catch(err) {}
	try { is_page_owned = arregloDeEvento.is_page_owned} catch(err) {}

	if (place) {
		try { idPlace = arregloDeEvento.place.id} catch(err) {}
	} else {
		try { idPlace = ""} catch(err) {}
		try { placeName = arregloDeEvento.place.name} catch(err) {}	
	}

	try { city = arregloDeEvento.place.location.city} catch(err) {}
	try { country = arregloDeEvento.place.location.country} catch(err) {}
	try { latitude = arregloDeEvento.place.location.latitude} catch(err) {}
	try { longitude = arregloDeEvento.place.location.longitude} catch(err) {}
	try { street = arregloDeEvento.place.location.street} catch(err) {}
	try { zip = arregloDeEvento.place.location.zip} catch(err) {}
	try { coverSource = arregloDeEvento.cover.source} catch(err) {}
	try { coverId = arregloDeEvento.cover.id} catch(err) {}
	try { pictureUrl = arregloDeEvento.picture.data.url} catch(err) {}
	try { ownerName = arregloDeEvento.owner.name} catch(err) {}
	try { ownerId = arregloDeEvento.owner.id} catch(err) {}

	for (i = 0; i < arregloDeEvento.admins.data.length; i++) {
		try { adminName = arregloDeEvento.admins.data[i].name} catch(err) {}
		try { adminID = arregloDeEvento.admins.data[i].id} catch(err) {}			
	}

	var sinPlaceName = false, sinCountry = false, sinCity = false;

	sinPlaceName = ( (placeName == "".trim()) || (placeName == undefined) );
	sinCountry = ( (country == "".trim()) || (country == undefined) );
	sinCity = ( (city == "".trim()) || (city == undefined) );

	var fecha="", hora_inicio="", hora_fin="";
	try { fecha = start_time.substring(0,10);} catch(err) {}
	try { hora_inicio = start_time.substring(11,16);} catch(err) {}
	try { hora_fin = end_time.substring(11,16);} catch(err) {}
	try { zona_horaria = timezone.split("/")[1];} catch(err) {}

	var nuevaFecha="", dia="", mes="", year="";
	nuevaFecha = getFecha(fecha);
	dia = nuevaFecha.dia;
	mes = nuevaFecha.mes;
	year = nuevaFecha.year;

	if (  (sinCountry) && (sinCity) )  {
		country = zona_horaria;
		if (getUbicacion() == "Guatemala") {
			lat = ((latitude >= 13) && (longitude <= 18));
			long =  ((latitude >= -92) && (longitude <= -88));
			if ( (lat) && (long) ) {
				//country = "Lat.:"+latitude+" Long.:"+longitude+" +/- Guatemala";
				country = "+/- Guatemala";
			}
		} else {
			/*
			if ((latitude != "".trim()) && (latitude != undefined) && (latitude != 0)) {
				country = "lat:"+latitude+" long:"+longitude+"  timezone: "+zona_horaria;
			}
			*/
		}
	}

	//direccion = placeName + " " + street + " " + city + ", " + country;
	direccion = placeName + ", " + street;

	var repCity=false, repCountry=false;
	repCity = placeName.includes(city);
	//repCountry = placeName.includes(country);
	repCountry = placeName.trim() == country.trim();
	

	if (repCity) {
		//direccion = direccion.replace(city, "");
	} else {
		if (!sinCity) {
			direccion += ", " + city;
		}
		
	}

	if (repCountry) {
		//direccion = direccion.replace(country, "");
	} else {
		if (!sinCountry) {
			direccion += ", " + country;
		}
	}

	direccion = direccion.replace("undefined", "").replace("undefined", "").replace("undefined", "");
	direccion = direccion.replace("  ", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ");

	eventoIndividual = {
		"id":id,
		"name":nameEvent,
		"description":description,
		"start_time":start_time,
		"end_time":end_time,
		"type":type,
		"category":category,
		"timezone":timezone,
		"ticket_uri":ticket_uri,
		"is_canceled":is_canceled,
		"is_page_owned":is_page_owned,
		"idPlace":idPlace,
		"placeName":placeName,
		"city":city,
		"country":country,
		"latitude":latitude,
		"longitude":longitude,
		"street":street,
		"zip":zip,
		"coverSource":coverSource,
		"coverId":coverId,
		"pictureUrl":pictureUrl,
		"ownerName":ownerName,
		"ownerId":ownerId,
		"adminID":adminID,
		"adminName":adminName,
		"direccion":direccion,
		"fecha":fecha,
		"dia": dia,
		"mes": mes,
		"año": year,
		"hora_inicio":hora_inicio,
		"hora_fin":hora_fin,
		"zona_horaria":zona_horaria
	}

	//console.log(eventoIndividual);

	//console.log("id::: " + id);

	var b = lista_eventos.indexOf(id);
	//console.log("b:: " + b);

	if (b == -1) {
		//console.log("== push()");
		lista_eventos.push(eventoIndividual);
	}

	//lista_eventos.push(eventoIndividual);

	//console.log("lista_eventos::::::::::::::");
	//console.log(lista_eventos);
	ListarEventos(); /////////////////////////////////////////////////////
}

function obtenerDatosEventoPorId(arregloDeEvento) {
	var sinPlaceId = false, strSinPlaceId="";

	try {
		if (arregloDeEvento.place.id == undefined) {
			sinPlaceId = true;
		} else {
			sinPlaceId = false;
		}
	} catch(err) {
		sinPlaceId = true;
	}

	if (sinPlaceId == false) {
		setSearchPlaceName("https://graph.facebook.com/v2.11/"+arregloDeEvento.place.id+"/?fields=name");

		var xhr = new XMLHttpRequest();
	    xhr.open("GET",getSearchPlaceName(),true);
		xhr.send();
	    xhr.onreadystatechange = function(){
	        if(xhr.readyState == 4 && xhr.status == 200){
				var jsonResponse = JSON.parse(xhr.responseText);
				placeName="";
				placeName = jsonResponse.name;
				if (jsonResponse.name != "" ) {
					// Aqui 253 conPlaceId
					llenarVector(true, arregloDeEvento);
				}
	        }
	    }

	} else {
		// Aquí 259 sinPlaceId
		llenarVector(false, arregloDeEvento);
	}
}


function BuscarEventoPorId(idEvent) {

	setSearch("https://graph.facebook.com/v2.11/"+idEvent+"/?fields=id,name,description,start_time,end_time,place,cover,type,category,timezone,ticket_uri,picture,is_canceled,owner,is_page_owned,admins");

	//console.log(getSearchEvent());
	//console.log(getSearchSinToken());
	if (getSearchEvent() == null || getSearchEvent() == "" || getSearchEvent() == undefined) {
	    console.log("ERROR: Aún no ha establecido los parámetros de busqueda, por favor utilice la función setSearchEvent('palabraClave')");
	} else {
		var xhr = new XMLHttpRequest();
	    xhr.open("GET",getSearchEvent(),true);
		xhr.send();
	    xhr.onreadystatechange = function(){
	        if(xhr.readyState == 4 && xhr.status == 200){
				var jsonResponse = JSON.parse(xhr.responseText);
				obtenerDatosEventoPorId(jsonResponse);
	        }
	    }
	}
	return deferred.resolve();
}

function BuscarEventos() {

	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
	  	//console.log('Logged in.');

		deferred = jQuery.Deferred();
		deferred.promise();

	    if (getSearchEvent() == null || getSearchEvent() == "" || getSearchEvent() == undefined) {
	    	console.log("ERROR: Aún no ha establecido los parámetros de busqueda, por favor utilice la función setSearchEvent('palabraClave')");
	    } else {
	    	var xhr = new XMLHttpRequest();
		    xhr.open("GET",getSearchEvent(),true);

		    //console.log(getSearchEvent());
		    console.log(getSearchSinToken());
		    
			xhr.send();
		    xhr.onreadystatechange = function(){
		        if(xhr.readyState == 4 && xhr.status == 200){
					var jsonResponse = JSON.parse(xhr.responseText);
					$.when(obtenerDatosEventos(jsonResponse, xhr)).then(function(){
						if (!(jsonResponse.paging == undefined)) {
							//console.log("Next PAGING: "+getUbicacion());
							setSearch(jsonResponse.paging.next);
							BuscarEventos();
						} else {

							console.log(" ");
							console.log("for (i = 0; i < datos.length; i++){}");
							console.log(datos);
							//console.log(" ");

							for (i = 0; i < datos.length; i++) {
								//console.log("JSON: "+ JSON.stringify(datos[i]));
								var idEventTemp;
								idEventTemp = datos[i].id;
								BuscarEventoPorId(idEventTemp);
							}
							//ListarEventos(); /////////////////////////////////////////////////////
							lista_eventos = [];
							datos = [];
							console.log("Ya no hay más datos. BE");
							ListarEventos();
							deferred.resolve();
						}
						//ListarEventos();
					});
		        }
		    }
		}
	  } else {
	    //FB.login();
	    $( "#dialog" ).dialog( "open" );
	  }
	});
	//ListarEventos();
	return deferred.resolve();
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

// Configuramos la API
window.fbAsyncInit = function() {
	FB.init({
		appId: '400698847015397', //Incluye aquí tu clave pública
		autoLogAppEvents : true,
		cookie: true, // enable cookies to allow the server to access 
		// the session
		xfbml: true, // parse social plugins on this page
		status: true, //Extra
		version: 'v2.11' // use graph api version 2.8

	});
	FB.AppEvents.logPageView(); ////////////////////////

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

};

// Cargamos la API
// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.11&appId=400698847015397';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//Extras:
/* Función para el botón de iniciar sesión con Facebook */
function FBBtnLogin() {
	FB.login(function(response) {
		if (response.authResponse) {

		    $("#btnIniciarSesion").hide();
		    $("#btnIniciarSesion").css('visibility', 'hidden');

		    $("#btnCerrarSesion").show();
		    $("#btnCerrarSesion").css('visibility', 'visible');

			window.location.reload();
		}
	}, {
		/* Solicitamos poder acceder a estos permisos del perfil del usuario */
		scope: 'public_profile,email'
	});
}

/* Función para el botón de cierre de sesión en facebook, 
         lógicamente el usuario sale de nuestra aplicación */
function FBBtnLogout() {
	console.log("logout");
	FB.logout(function(response) {
	    $("#btnIniciarSesion").show();
	    $("#btnIniciarSesion").css('visibility', 'visible');

		$("#btnCerrarSesion").hide();
	    $("#btnCerrarSesion").css('visibility', 'hidden');
		window.location.reload();
		FB.logout();
	});
}

$( document ).ready(function() {
    console.log( "ready!" );
	home();
	setTimeout(function(){ 
		FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
		    console.log('Logged in.');

		    $("#btnIniciarSesion").hide();
		    $("#btnIniciarSesion").css('visibility', 'hidden');

		    $("#btnCerrarSesion").show();
		    $("#btnCerrarSesion").css('visibility', 'visible');		    
		  } else {
		    //FB.login();
		    //$( "#dialog" ).dialog( "open" );
		    $("#btnIniciarSesion").show();
		    $("#btnIniciarSesion").css('visibility', 'visible');

		    $("#btnCerrarSesion").hide();
		    $("#btnCerrarSesion").css('visibility', 'hidden');
		  }
		});
	}, 3000);

});

function home() {
    $("#home").show();
    $("#about").hide();
    $("#contact").hide();
    $("#home").addClass("active");
    $("#about").removeClass("active");
    $("#contact").removeClass("active");
    $("#home").css('visibility', 'visible');
    $("#about").css('visibility', 'hidden');
    $("#contact").css('visibility', 'hidden');    
}

function about() {
    $("#home").hide();
    $("#about").show();
    $("#contact").hide();
    $("#home").removeClass("active");
    $("#about").addClass("active");
    $("#contact").removeClass("active");
    $("#home").css('visibility', 'hidden');
    $("#about").css('visibility', 'visible');
    $("#contact").css('visibility', 'hidden');
}

function contact() {
    $("#home").hide();
    $("#about").hide();
    $("#contact").show();
    $("#home").removeClass("active");
    $("#about").removeClass("active");
    $("#contact").addClass("active");
    $("#home").css('visibility', 'hidden');
    $("#about").css('visibility', 'hidden');
    $("#contact").css('visibility', 'visible');    
}

$(function () {
    $("#searchTxt")
        .popover({ content: "Escribe lo que deseas buscar.", placement: "top" })
        .blur(function () {
            $(this).popover('hide');
        });
});

$(function () {
    $("#searchUbicacion")
        .popover({ content: "Lugar del evento, ej. Guatemala.", placement: "bottom" })
        .blur(function () {
            $(this).popover('hide');
        });
});