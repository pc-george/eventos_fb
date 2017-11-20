id="", nameEvent="", description="", start_time="", end_time="", type="", category="", timezone="", ticket_uri="", is_canceled="", idPlace="", city="", country="", latitude="", longitude="", street="", zip="", coverSource="", coverId="", pictureUrl="",  ownerName="", ownerId="", is_page_owned="", adminName="", adminID="", direccion="";

eventoIndividual = [];
console.log("obtenerDatosEventoPorId. "+ arregloDeEvento.id);

console.log(arregloDeEvento);
console.log(" ");

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
try { idPlace = ""} catch(err) {}
try { placeName = arregloDeEvento.place.name} catch(err) {}
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
fecha = start_time.substring(0,10);
hora_inicio = start_time.substring(11,16);
hora_fin = end_time.substring(11,16);
zona_horaria = timezone.split("/")[1];

var nuevaFecha="", dia="", mes="", year="";
nuevaFecha = getFecha(fecha);
dia = nuevaFecha.dia;
mes = nuevaFecha.mes;
year = nuevaFecha.year;

if (  (sinCountry) && (sinCity) )  {
	country = zona_horaria;
	if (ubicacion == "Guatemala") {
		lat = ((latitude >= 13) && (longitude <= 18));
		long =  ((latitude >= -92) && (longitude <= -88));
		if ( (lat) && (long) ) {
			country = "lat:"+latitude+" long:"+longitude+" +/- Guatemala";
		}
	} else {
		if ((latitude == "".trim()) || (latitude == undefined) || (latitude == 0)) {
			country = zona_horaria;
		} else {
			country = "lat:"+latitude+" long:"+longitude+"  timezone: "+zona_horaria;
		}
	}
}

direccion = placeName + " " + street + " " + city + " " + country;
direccion = direccion.replace("undefined", "").replace("undefined", "").replace("undefined", "");


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
//console.log(" ");
//console.log("llenarVector");
//console.log("eventoIndividual:.:.:.:.:.: " + arregloDeEvento.id);
console.log(eventoIndividual);
lista_eventos.push(eventoIndividual);

console.log("lista_eventos::::::::::::::");
console.log(lista_eventos);
//console.log(" ");

ListarEventos();
//setSearch(null);