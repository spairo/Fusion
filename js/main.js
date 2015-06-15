/*+++++++++++++++++++++++++++++++
		Fusion Project Agente
			  Atento Mexico
	 Developed By Ninja Developers
 ++++++++++++++++++++++++++++++++*/


window.ws = "http://172.18.149.21/Servicios/REST.svc/";
window.ctiurl = "http://172.18.149.21/WEB_Fusion/IGNACIO/HTMLPage.htm";
window.match = location.hash.match(/^#?(.*)$/)[1];
var path = window.location.pathname;

//Higher scope

var str;
var scope_url;
var scope_aux;

$(window).load(function(){
	$(".loader").fadeOut("slow");
});

function closeWindow(){
	window.open('','_self','');
	window.close();
}

//login Aux

function F_Load_Engine()
{
    document.getElementById('btnDisp').className = "Visible";
		$("#table_test .Visible").prop('disabled', true);
    Cambiar_Clase_Aux_Inactivo();

    var user = localStorage.getItem('user');
    var password = localStorage.getItem('password');

    if (user != "" & password != "")
    {
        //alert('F_Load_Engine');
        //alert(full_data_aux);
        //alert('F_Load_Engine - Entra LoginSuccess');

        F_Simular_Login(user, password);

    }
}

//login

$.login = function(user, password, extension){

  var url = ws+"rg_seguridadLogin";

  var Data = { User: user, Password: password, extension: extension };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(response){

			if(response != ""){

				var logResp = response[0].Informacion;

				if(typeof logResp === 'undefined'){

					$("#user").val('');
					$("#password").val('');

					$("#logdIn").slideUp(1000, function(){
						$(".loader").fadeIn("slow", function(){
							$(".loader").fadeOut("slow", function(){


									var dataM = response[0].menu;
									//var dataS = response[0].configuracion;
									var dataAux = response[0].auxiliares;



									$(document).trigger('configMain', response[0].configuracion);


									//LocalStorage
									localStorage.setItem("settings", JSON.stringify(response[0].configuracion));
									var settings = jQuery.parseJSON(localStorage.getItem("settings"));

									var acd = localStorage.setItem('acd', response[0].acd);
									var name = localStorage.setItem('name', response[0].usuario);
									var profile = localStorage.setItem('profile', response[0].perfil);
									var id = localStorage.setItem("id", response[0].usuariosId);

									localStorage.setItem("extension", extension);
									localStorage.setItem("UserLogin", user);

									$.main(id, name, profile);
									$.Menu(dataM);
									$.services(settings);
									$.skills(settings);
									//$.Auxiliares(dataAux);

									str = settings;
									scope_aux = dataAux;

									$('.logout').html('<a href="#" id="logout"><span class="glyphicon glyphicon-log-out"></span> LogOut</a>');
									$(".form-group").removeClass('has-error');
									$(".navbar-top").slideDown().show();
									$("#main").slideDown().show();

							});
						});
					});

				}else{

					if(logResp.indexOf("Error") > -1 == true){
						alert(response[0].Informacion);
						$("#logdIn #login").prop('disabled', false);
						return false;
					}

				}

			}else{
				alert("Usuario no Valido");
				$("#logdIn #login").prop('disabled', false);
				return false;
			}

		},error: function(response){
			alert("Error44: " + response.status + " " + response.statusText);
		}

  });

};

//main

$.main = function(id,	name, profile){

	var myid = localStorage.getItem('id');
	var name = localStorage.getItem('name');
	var profile = localStorage.getItem('profile');

	$(".name").empty().text(name);
	$(".profile").empty().text(profile);

};

//Search Get params

$.UrlDecode = function(){
	var vars = {};
       
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
			vars[key] = value;			 
	});
	return vars;
};

//Services

$.services = function(settings){

	$("#services").slideDown().show();

	var services_evals = settings;

	//$('.box-services').append('<select class="form-control input-lg servicechoice"></select><button class="btn service-choice btn-block"><span class="glyphicon glyphicon-ok"></span></button>');
	var select_service = '<select class="form-control input-lg servicechoice">';

	if(services_evals != null){

		for(var i = 0; i < services_evals.length; i++){

			var serviciosId = services_evals[i].serviciosId;
			var servicio = services_evals[i].servicio;

			//var content = '<option class="serviceoption" name="'+serviciosId+'" value="'+serviciosId+'">'+servicio+'</option>';
			//$('.box-services select.servicechoice').append(content);
			select_service = select_service + '<option class="serviceoption" name="'+serviciosId+'" value="'+serviciosId+'">'+servicio+'</option>';
		}
		select_service = select_service + '</select><button class="btn service-choice btn-block"><span class="glyphicon glyphicon-ok"></span></button>';

		$('.box-services').append(select_service);

	}else{

		alert("No tiene Servicios Configurados");
		$("#services .box-services .servicechoice").prop('disabled', true);
		$("#services .box-services .service-choice").prop('disabled', true);

	}

};

//Skills

$.skills = function(settings){

	//var skills_evals = Object.keys(data).length; //IE8 sucks
	var skills_evals = settings;

	$.serviceid = function(ID){

		//$('.box-skills').append('<select class="form-control input-lg skillchoice"></select><button class="btn choice-skill btn-block btn"><span class="glyphicon glyphicon-ok"></span></button>');

		var select_skill = '<select class="form-control input-lg skillchoice">';

		for(var i = 0; i < skills_evals.length; i++){

			if(skills_evals[i].serviciosId == ID){

				var skills = skills_evals[i].skills;

				if(skills == null){

					alert("No tiene skills Configurados");
					$("#skills .box-skills .skillchoice").prop('disabled', true);
					$("#skills .box-skills .choice-skill").prop('disabled', true);

				}else{

					for(var i = 0; i < skills.length; i++){

						var skillsId = skills[i].skillsId;
						var skill = skills[i].skill;

						//var content = '<option class="skilloption" value="'+skillsId+'">'+skill+'</option>';
						//$('#skills .box-skills select.skillchoice').append(content);

						select_skill = select_skill + '<option class="skilloption" value="'+skillsId+'">'+skill+'</option>';

					}
					select_skill = select_skill + '</select><button class="btn choice-skill btn-block btn"><span class="glyphicon glyphicon-ok"></span></button>';

					$('#skills .box-skills').append(select_skill);

				}

			}

		}

	};

};

//Router

$.router = function(router){

	var serviciosid = localStorage.getItem('serviciosId');
	var SkillId = localStorage.getItem('SkillId');
	var extension = localStorage.getItem('extension');


	for(var i = 0; i < router.length; i++){

		if(serviciosid == router[i].serviciosId){

			var skillobjts = router[i].skills;

			for(var i = 0; i < skillobjts.length; i++){

				if(SkillId == skillobjts[i].skillsId){

					var interfaces = skillobjts[i].interfaces;

					if(interfaces == ""){

						$("#skills").slideUp("slow", function(){
							$("#search").slideDown().show();
						});

					}else{

						for(var i = 0; i < interfaces.length; i++){

							var url = interfaces[i].url;

							if(url == ""){

								$("#skills").slideUp("slow", function(){
									$("#search").slideDown().show();
								});

							}else{

								$("#skills .choice-skill").prop('disabled', true);
								$("#skills .skillchoice").prop('disabled', true);

								var CtiClientesId = $.UrlDecode()["clientesId"];
								var CtiVclave = $.UrlDecode()["vclave"];
								window.location.href=''+url+'?clientesId=&vclave='+extension+'';

							}

						}

					}

				}

			}

		}

	}

};

//Search Url Params

$.searchGet = function(){

	if ($("#BarraInterfaces").length > 0){
		$(".navbar-top").hide();
	}
	else{
		$(".navbar-top").show();
	}

	$("#main").hide();

	$("#search-result-get").slideDown();

	var CtiClientesId = $.UrlDecode()["clientesId"];
	var CtiVclave = $.UrlDecode()["vclave"];

	var myid = localStorage.getItem('id');
	var skillid = localStorage.getItem('SkillId');
	var servicioid = localStorage.getItem('serviciosId');

	var url = ws+"rg_MuestraCliente";

	var Data = {
		serviciosId: servicioid,
		skillId: skillid,
		clientesId: CtiClientesId,
		usuarioId: myid,
		valorClave: CtiVclave
	};

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			//console.log("resultado de search get", data);

			if(data != ""){

				//console.log(data);

				if(data.length > 1){

					//console.log("despliega la busqueda completa tengo mas de 1");

					$('#search-result-get .result').empty().fadeIn("slow").append('<h1>Clientes</h1><table class="search_evals table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');


					for(var i = 0; i < data.length; i++){

							var id = data[i].clientesId;
							var clientesClaveId = data[i].clientesClaveId;
							var name = data[i].nombre1;
							var second_name = data[i].nombre2;
							var pat_name = data[i].apellido1;
							var mat_name = data[i].apellido2;
							var clave = data[i].valorClave;
							var lada = data[i].lada;
							var extension = data[i].extension;

							var content = '<tr><th class="nr">'+id+'</th><th class="Clientnames">'+name+' '+second_name+'</th><th class="Clientpat">'+pat_name+'</th><th class="Clientmat">'+mat_name+'</th><th class="Clientclave">'+clave+'</th><th class="ClientLada">'+lada+'</th><th class="Clientext">'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
							$('.result table.search_evals').append(content);

					}

				}else{

					$('#search-result-get .result').empty().slideDown("slow").append('<h1>Cliente</h1><table class="search_evals table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');

					for(var i = 0; i < data.length; i++){

							var id = data[i].clientesId;
							var clientesClaveId = data[i].clientesClaveId;
							var name = data[i].nombre1;
							var second_name = data[i].nombre2;
							var pat_name = data[i].apellido1;
							var mat_name = data[i].apellido2;
							var clave = data[i].valorClave;
							var lada = data[i].lada;
							var extension = data[i].extension;

							var content = '<tr><th class="nr">'+id+'</th><th class="Clientnames">'+name+' '+second_name+'</th><th class="Clientpat">'+pat_name+'</th><th class="Clientmat">'+mat_name+'</th><th class="Clientclave">'+clave+'</th><th class="ClientLada">'+lada+'</th><th class="Clientext">'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
							$('.result table.search_evals').append(content);
					}
				}

			}else{
				//console.log("vasio, voy a agregar boton de crear");
				$('#search-result-get').empty().slideDown("slow").append('<div class="btn-group btn-group-lg pull-left" role="group" aria-label="config"><button class="btn btn-search add-client">Crear Cliente <span class="glyphicon glyphicon-plus"></button></div><div class="result"></div>');
				$(".result").empty().slideDown("slow").append('<span class="not-found">No hay resultados</span>');
			}

		},error: function(data){
			//console.log("algo salio mal en search get");
		}

	});

};

//Search

$.search = function(name, pat, mat, phone){

	var url = ws+"rg_ListClientes";

	var myid = localStorage.getItem('id');
	var skillID = localStorage.getItem('SkillId');
	var serviciosID = localStorage.getItem('serviciosId');

  var Data = {
		nombre1: name,
		nombre2: "",
		apellido1: pat,
		apellido2: mat,
		valorClave: phone,
		usuarioId: myid,
		skillid: skillID,
		serviciosId: serviciosID
	};

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: SearchOnSuccess,
    error: SearchOnError
  });

};

function SearchOnSuccess(data){

	var search_clients = data;

	if(search_clients != ""){

			$('.result').empty().append('<table class="search_clients table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');

			for(var i = 0; i < search_clients.length; i++){

					var id = search_clients[i].clientesId;
					var clientesClaveId = search_clients[i].clientesClaveId;
					var name = search_clients[i].nombre1;
					var second_name = search_clients[i].nombre2;
					var pat_name = search_clients[i].apellido1;
					var mat_name = search_clients[i].apellido2;
					var clave = search_clients[i].valorClave;
					var lada = search_clients[i].lada;
					var extension = search_clients[i].extension;

					var content = '<tr><th class="nr">'+id+'</th><th>'+name+' '+second_name+'</th><th>'+pat_name+'</th><th>'+mat_name+'</th><th>'+clave+'</th><th>'+lada+'</th><th>'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
					$('.result table.search_clients').append(content);
			}

	}else{
		$('#search-result').empty().append('<div class="btn-group btn-group-lg pull-left" role="group" aria-label="config"><button class="btn btn-search search-back">Nueva Busqueda <span class="glyphicon glyphicon-search"></button></div><div class="btn-group btn-group-lg pull-right" role="group" aria-label="config"><button class="btn btn-search add-client">Crear Cliente <span class="glyphicon glyphicon-plus"></button></div><div class="result"></div>');
		$(".result").empty().append('<span class="not-found">No hay resultados</span>');
	}

}

function SearchOnError(data){
	alert("Error44: " + data.status + " " + data.statusText);
}

$.updateSession = function(skillID){

	var url = ws+"rg_ActualizaSesion";

	var myid = localStorage.getItem('id');
	var serviciosID = localStorage.getItem('serviciosId')

	var Data = {
		serviciosId: serviciosID,
		skillsId: skillID,
		usuariosId: myid,
		disponible: "0"
	}

	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			//console.info("U P D A T E session: success", data);
		},error: function(data){
			//console.log("Fallo" + url);
		}

	});

};

$.addclient = function(name, name2, pat, mat, phone){

	var url = ws+"rg_GuardaCliente";

	var myid = localStorage.getItem('id');
	var skillID = localStorage.getItem('SkillId');
	var serviciosID = localStorage.getItem('serviciosId');

	var Data = {
		skillsId: skillID,
		serviciosId: serviciosID,
		nombre1: name,
		nombre2: name2,
		apellido1: pat,
		apellido2: mat,
	  valorClave: phone,
		usuariosId: myid
	}

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(data){

			$("#add-client .add-result").empty().append('<h3>Cliente Creado con exito <span class="glyphicon glyphicon-ok"></span></h3>').fadeIn('slow').delay(10000);

			$('.result').empty();
			$(".form-group").removeClass('has-error');
		  $("#add-name").val("");
			$("#add-2name").val("");
		  $("#add-pat").val("");
		  $("#add-mat").val("");
		  $("#add-phone").val("");

			$("#add-client").slideUp("slow", function(){
				$("#search").slideDown("slow");
			});

		},error: function(data){

		}

  });

};

//Build  Menu

$.Menu = function(data){

	var data = data;

	var builddata = function(){
	    var source = [];
	    var items = [];
	    for (i = 0; i < data.length; i++) {
	        var item = data[i];
	        var label = item["menu"];
	        var parentid = item["menusSupId"];
	        var id = item["menusId"];
	        var url = item["forma"];

	        if (items[parentid]) {
	            var item = { parentid: parentid, label: label, url: url, item: item };
	            if (!items[parentid].items) {
	                items[parentid].items = [];
	            }
	            items[parentid].items[items[parentid].items.length] = item;
	            items[id] = item;
	        }
	        else {
	            items[id] = { parentid: parentid, label: label, url: url, item: item };
	            source[id] = items[id];
	        }
	    }
	    return source;
	}

	var buildUL = function(parent, items){
	    $.each(items, function(){
	        if (this.label) {
	            var li = $("<li class='js-menu'>" + "<a href='"+ this.url +"'>" + this.label + "</a></li>");
	            li.appendTo(parent);
	            if (this.items && this.items.length > 0) {
	                var ul = $("<ul class='dropdown-submenu'></ul>");
	                ul.appendTo(li);
	                buildUL(ul, this.items);
	            }
	        }
	    });
	}

	var source = builddata();

	var ul = $(".json-menu");

	ul.appendTo(".json-menu");

	buildUL(ul, source);

	//bootstrap classes

	if ($(".json-menu>li:has(ul.js-menu)")){
	  $(".json-menu>li.js-menu").addClass('dropdown-submenu');
	}
	if ($(".json-menu>li>ul.js-menu>li:has(> ul.js-menu)")){
		$(".json-menu>li>ul.js-menu li ").addClass('dropdown-submenu');
	}

	//.removeClass
	$("ul.js-menu").find("li:not(:has(> ul.js-menu))").removeClass("dropdown-submenu");

};

/* Aux */

$.Aux = function(){

		var skillidx = localStorage.getItem('SkillId');
		var serviciosidx = localStorage.getItem('serviciosId');

		var settings = jQuery.parseJSON(localStorage.getItem("settings"));

		for(var i = 0; i < settings.length; i++){

			if(serviciosidx == settings[i].serviciosId){

				var skills = settings[i].skills;

					for(var i = 0; i < skills.length; i++){

						if(skillidx == skills[i].skillsId){

							//var auxiliares = skills[i].auxiliares;

							var aux_data = skills[i].auxiliares;

			        $("#div_aux").slideDown().show();
			        var content1, content2;

			        content1 = '<table id="table_test">' +
			          '<tr>';

			        for (var i = 0; i < aux_data.length; i++)
			        {
								var Auxiliar = aux_data[i].auxiliar;
								var AuxiliarId = aux_data[i].skillsAuxiliaresId;
								var urlImg = aux_data[i].imagen;
								var codigoAuxiliar = aux_data[i].codigoAuxiliar;

								var auxselected = localStorage.getItem("IdAux");

								if(auxselected == AuxiliarId){

									content1 += ' <td> <input class="Visible" type="image" onClick="buttomClick(this.id, this.name)" id="' + AuxiliarId + '" src="' + urlImg + '" Height="50" Width="50" name="'+codigoAuxiliar+'" title="' + Auxiliar + '"/> </td> ';

								}else{
									content1 += ' <td> <input class="Opaco" type="image" onClick="buttomClick(this.id, this.name)" id="' + AuxiliarId + '" src="' + urlImg + '" Height="50" Width="50" name="'+codigoAuxiliar+'" title="' + Auxiliar + '"/> </td> ';
								}

			        }

			        content1 += '</tr>' +
			                '</table>';

			        $('.box-aux').empty().append(content1);

						}

					}
			}

		}

};

function buttomClick(buttom_id, codeAux){

		var codigoAuxiliar = codeAux;
		parent.fMakeCall(codigoAuxiliar);

    var IdAux = localStorage.setItem('IdAux', buttom_id);
    var serviciosId = localStorage.getItem('serviciosId');
    var skillsId = localStorage.getItem('SkillId');

    //ip={IP}&auxiliaresId={AUXILIARESID}&usuariosId={USUARIOSID}
    //alert('Entra Click / ID_Buttom: ' + buttom_id);

    var url = ws + "rg_RegistraAuxiliares";

    var auxiliaresId = buttom_id;
    var usuariosId = localStorage.getItem('id');

    //alert(usuariosId);

    var Data = { auxiliaresId: auxiliaresId, usuariosId: usuariosId, serviciosId: serviciosId, skillsId: skillsId };

    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: url,
        crossDomain: true,
        data: Data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: SaveAuxSuccess(buttom_id),
        error: SaveAuxError
    });

}

function buttomClick_Disponible(buttom_id, codeAux){

		var codigoAuxiliar = codeAux;
		parent.fMakeCall(codigoAuxiliar);

    var url = ws + "rg_ActualizaSesion";

    var serviciosId = localStorage.getItem('serviciosId');
    var skillsId = localStorage.getItem('SkillId');
    var usuariosId = localStorage.getItem('id');

    var oData = { serviciosId: serviciosId, skillsId: skillsId, usuariosId: usuariosId, disponible: 1 };

    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: url,
        crossDomain: true,
        data: oData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: SaveDispSuccess,
        error: SaveDispError
    });

}

function Cambiar_Clase_Aux_Inactivo(){

    var data = [];
    var table = document.getElementById('table_test');

    if (table!=null) {

        var rows = table.getElementsByTagName('tr');

        for (var x = 0; x < rows.length; x++) {
            var td = rows[x].getElementsByTagName('td');
            for (var y = 0; y < td.length; y++) {
                var input = td[y].getElementsByTagName('input');
                for (var z = 0; z < input.length; z++) {
                    //data.push(input[z].id);
                    //alert(input[z].id);

                    document.getElementById(input[z].id).className = "Opaco";
										document.getElementById(input[z].id).disabled = false;
                }
            }
        }
    }
}

function Cambiar_Clase_Aux_Activo(Id_Buttom){
    try {
        document.getElementById(Id_Buttom).className = "Visible";
				document.getElementById(Id_Buttom).disabled = true;
    } catch (e) {
        //console.log("Error", e.message.toString())
    }

}


function SaveAuxError(response){
		alert('Error al guardar Auxiliar!');
}

function SaveDispError(response){
    alert('Error al guardar Disponible!');
}

function SaveAuxSuccess(buttom_id){

    //Cambiar Clase
    document.getElementById('btnDisp').className = "Opaco";

    Cambiar_Clase_Aux_Inactivo();
    Cambiar_Clase_Aux_Activo(buttom_id);

    //alert('Auxiliar guardado con Exito!');
}
function SaveDispSuccess(response){

    //otro color...

    document.getElementById('btnDisp').className = "Visible";

    localStorage.setItem('IdAux','');
    Cambiar_Clase_Aux_Inactivo();

    //alert('Auxiliar guardado con Exito!');
}


/*Login*/

$(document).on('click', '#login', function(){

	$(".form-group").removeClass('has-error');
	$("#logdIn #login").prop('disabled', true);

	var user = $('#user').val();
	var password = $('#password').val();
	var extension = $("#extens").val();

	if($("#user").val() == '' || $("#password").val() == '' || $("#extens").val() == ''){

		alert("Los campos son obligatorios");
		$(".form-group").addClass('has-error');
		$("#logdIn #login").prop('disabled', false);
		return false;

	}else{
		$.login(user, password, extension);
	}

});

/*Logout*/

$(document).on('click', '#logout', function(){

	var url = ws+"rg_RegistraLogout";

	var myid = localStorage.getItem('id');

	var Data = { usuariosId: myid };

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			localStorage.removeItem('id');
			localStorage.removeItem('name');
			localStorage.removeItem('profile');
			localStorage.removeItem('UserLogin');
			localStorage.removeItem('SkillId');
			localStorage.removeItem('serviciosId');
			localStorage.removeItem('clientesId');
			localStorage.removeItem('clientesClaveId');
			localStorage.removeItem('extension');
			localStorage.removeItem('services');
			localStorage.removeItem('serviceId');
			localStorage.removeItem('vdnTransfiere');
			localStorage.removeItem('acd');
			localStorage.removeItem('IdAux');

			localStorage.clear();
			location.reload();

		},error: function(data){
			//console.log("algo salio mal");
		}

	});

});

/*Services Box*/

$(document).on('click', '#services .service-choice', function(){

	var serviciosID = $(".servicechoice").val();

	localStorage.setItem("serviciosId", serviciosID);

	$.serviceid(serviciosID);

	$("#services").slideUp("slow", function(){
		$("#skills").slideDown().show();
	});

});

/*Skills Box*/

$(document).on('click', '.choice-skill', function(){

	var skillID = $(".skillchoice").val();

	localStorage.setItem("SkillId", skillID);

	var iduser = localStorage.getItem('id');

	$.updateSession(skillID);

	//CtiRedirect In Out
	var sttings = jQuery.parseJSON(localStorage.getItem("settings"));
	$.router(sttings);

});

/*Search*/

$(document).on('click', '.search-case', function(){

	if($("#box-name").val() == '' &&  $("#box-pat").val() == '' &&  $("#box-mat").val() == '' && $("#box-phone").val() == ''){

			alert("Debe tener un campo a buscar minimo");
			$(".box-group").addClass('has-error');
			return;

	}else if($("#box-name").val().length < 3 && $("#box-pat").val().length < 3 && $("#box-mat").val().length < 3 && $("#box-phone").val().length < 3){

		alert("Debe ser mayor a 3 caracteres");
		return;

	}else{

		var name = $("#box-name").val();
		var pat = $("#box-pat").val();
		var mat = $("#box-mat").val();
		var phone = $("#box-phone").val();

		$("#search").hide("slow").fadeOut("slow");
		$("#search-result").show().fadeIn("slow");
		$.search(name, pat, mat, phone);

	}

});

$(document).on('click', '#search-result .search-back', function(){

  $('#search-result .result').empty();
	$(".form-group").removeClass('has-error');
  $(".box-search #box-name").val("");
  $(".box-search #box-pat").val("");
  $(".box-search #box-mat").val("");
  $(".box-search #box-phone").val("");

	$("#search-result").slideUp("slow", function(){
		$("#search").slideDown("slow");
	});

});

$(document).on('click', '.add-client', function(){

	$("#add-client .add-result").empty();

	$("#search-result, #search-result-get").slideUp("slow", function(){
		$("#add-client").slideDown("slow");
	});

});

$(document).on('click', '.box-add .btn-add', function(){

	if($("#add-name").val() == '' &&  $("#box-pat").val() == '' &&   $("#box-mat").val() == '' &&  $("#box-phone").val() == ''){

			alert("Los campos son obligatorios");
			$(".add-group").addClass('has-error');
			return;

	}
	else if($("#add-name").val().length < 3 && $("#add-pat").val().length < 3 && $("#add-mat").val().length < 3 && $("#add-phone").val().length < 3){

		alert("Debe ser mayor a 3 caracteres");
		return;

	}else{

		var name = $(".box-add #add-name").val();
		var name2 = $(".box-add #add-2name").val();
		var pat = $(".box-add #add-pat").val();
		var mat = $(".box-add #add-mat").val();
		var phone = $(".box-add #add-phone").val();

		$.addclient(name, name2, pat, mat, phone);

	}

});

$(document).on('click', '.box-add .search-back', function(){

  $('#search-result .result').empty();
	$(".box-add .form-group").removeClass('has-error');
  $(".box-add #add-name").val("");
	$(".box-add #add-2name").val("");
  $(".box-add #add-pat").val("");
  $(".box-add #add-mat").val("");
  $(".box-add #add-phone").val("");

	$("#add-client").slideUp("slow", function(){
		$("#search").slideDown("slow");
	});

});

$(document).on('click', '#logoutEngine', function(){

	var url = ws+"rg_RegistraLogout";

	var myid = localStorage.getItem('id');

	var Data = { usuariosId: myid };

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			localStorage.removeItem('id');
			localStorage.removeItem('name');
			localStorage.removeItem('profile');
			localStorage.removeItem('UserLogin');
			localStorage.removeItem('SkillId');
			localStorage.removeItem('serviciosId');
			localStorage.removeItem('clientesId');
			localStorage.removeItem('clientesClaveId');
			localStorage.removeItem('extension');
			localStorage.removeItem('services');
			localStorage.removeItem('serviceId');
			localStorage.removeItem('vdnTransfiere');
			localStorage.removeItem('acd');
			localStorage.removeItem('IdAux');

			localStorage.clear();

			flogout();

			window.location.href='/';

		},error: function(data){}

	});

});

$(document).on('click', '#logoutSettings', function(){

	var url = ws+"rg_RegistraLogout";

	var myid = localStorage.getItem('id');

	var Data = { usuariosId: myid };

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			localStorage.removeItem('id');
			localStorage.removeItem('name');
			localStorage.removeItem('profile');
			localStorage.removeItem('UserLogin');
			localStorage.removeItem('SkillId');
			localStorage.removeItem('serviciosId');
			localStorage.removeItem('clientesId');
			localStorage.removeItem('clientesClaveId');
			localStorage.removeItem('extension');
			localStorage.removeItem('services');
			localStorage.removeItem('serviceId');
			localStorage.removeItem('vdnTransfiere');
			localStorage.removeItem('acd');
			localStorage.removeItem('IdAux');

			localStorage.clear();

			window.location.href='/';

		},error: function(data){}

	});

});

/*+++++++++++++++++++++++++++++++
		Window/Document Object Model
 ++++++++++++++++++++++++++++++++*/

$(window).load(function(){

	if(path == "/engine.html"){

		var name = localStorage.getItem('name');
		var profile = localStorage.getItem('profile');

		$(".name").empty().text(name);
		$(".profile").empty().text(profile);

		//Aux
		$.Aux();
		$("#table_test .disabledAUX").attr("disabled", true);

	}
	if(path == "/setting.html"){

		//var transfiere = data;
		//var treeid = $('#Builder_Engine .trees .tags .tag').attr('id');
		//console.log(treeid);

		/*
		var idtransf = data;
		console.log(idtransf);
		for(var j = 0; j < idtransf.length; j++){

			if(treeid == idtransf[j].transfiere){
				console.log(idtransf[j].transfiere);
				$('#Builder_Engine .trees .tags .tag').attr('name', idtransf[j].transfiere);
			}

		}
		*/

	}

});

$(document).ready(function(){

	//var name = "master";
	//var passw = "master";

	if(path == "/" || path == "/index.html"){

		$.UrlDecode = function(){
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
					vars[key] = value;			 
			});
			return vars;
		};

		if((name == null || name == undefined) && (passw == null || passw == undefined)){


		}else{

			if($('#logdIn').is(':visible')){

				var CtiClientesId = $.UrlDecode()["clientesId"];
				var CtiVclave = $.UrlDecode()["vclave"];

				if(CtiVclave == undefined || CtiVclave == null || CtiClientesId == undefined || CtiClientesId == null){

				}else{
					//$(".navbar-top").slideUp("slow");
					//$("#main").slideUp("slow");
					//$("#logdIn").slideUp("slow");
					$(".navbar-top").hide();
					$("#main").hide();
					$("#logdIn").hide();
					$.searchGet();
				}

			}

		}

		//Extension validate
		$("#extens").keypress(function(e){
			if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
					//display error message
					$(".numbers").html("Solo Numeros").show().fadeOut("slow");
					return false;
			}
		});

		//Aux
		$("#table_test .disabledAUX").attr("disabled", true);

	}
	if(path == "/engine.html"){

		//Aux
		//$.Aux();
		//$("#table_test .disabledAUX").attr("disabled", true);

		$.UrlDecode = function(){
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
					vars[key] = value;			 
			});
			return vars;
		};


		if((name == null || name == undefined) && (passw == null || passw == undefined)){

			var CtiClientesId = $.UrlDecode()["clientesId"];
			var CtiVclave = $.UrlDecode()["vclave"];

			window.location.href='index.html?clientesId='+CtiClientesId+'&vclave='+CtiVclave+'';

		}else{

			if($('#logdIn').is(':visible')){

				var CtiClientesId = $.UrlDecode()["clientesId"];
				var CtiVclave = $.UrlDecode()["vclave"];
				var Ctiext = $.UrlDecode()["ext"];

				if(CtiVclave == undefined || CtiVclave == null || CtiClientesId == undefined || CtiClientesId == null || Ctiext == undefined || Ctiext == null){

				}else{
					$(".navbar-top").slideUp("slow");
					$("#main").slideUp("slow");
					$("#logdIn").slideUp("slow");
					$.searchGet();
				}

			}

			//$.onsetEngine(name, passw);

		}
		var example = localStorage.getItem("extension");

		$('#BarraInterfaces #txtStation').val(example).prop('disabled', true);

	}
	if(path == "/dataset.html"){

		var CtiClientesId = $.UrlDecode()["clientesId"];
		var CtiVclave = $.UrlDecode()["vclave"];

		if((CtiClientesId != null || CtiClientesId != undefined) || (CtiVclave == null || CtiVclave == undefined)){
			window.location.href='index.html?clientesId='+CtiClientesId+'&vclave='+CtiVclave+'';
		}else{


		}

	}

	if(path == "/setting.html"){

		if((name == null || name == undefined) && (passw == null || passw == undefined)){
			window.location.href='/';
		}else{

				var factory = jQuery.parseJSON(localStorage.getItem("settings"));

				$(".loader").slideDown("slow", function(){

					$.cssEngine(factory);
					$.customerInfo(factory);
					$.baselayoutEngine(factory);
					$.captureRenderEngine(factory);
					$.typificationsEngine(factory);
					$.productsEngine(factory);
					$.typiHistoryEngine(factory);
					$.vdn(factory);
					$(".loader").slideUp("slow", function(){
						$('.navbar-top .logoutEngine').html('<a href="#" id="logout-builder"><span class="glyphicon glyphicon-log-out"></span> LogOut</a>');
						$("#Builder_Engine .engine-config").html('<div class="col-md-4 col-md-offset-4 well-sm"><button class="btn btn-block btn-engine-done">Guardar Configuracion <span class="glyphicon glyphicon-cog"></span></button></div>');
					});

				});

		}

	}

});


/*+++++++++++++++++++++++++++++++
		Template Builder Engine
 ++++++++++++++++++++++++++++++++*/

$(document).on('click', '.build', function(){

	var $row = $(this).closest("tr");    // Find the row

	var $text = $row.find(".nr").text();
	var $textcid = $row.find(".cd").text();

	//Cookies.set('clientesId', $text);
	//Cookies.set('clientesClaveId', $textcid);

	localStorage.setItem("clientesId", $text);
	localStorage.setItem("clientesClaveId", $textcid);

	// Let's build it out

	window.location.href ='setting.html';
	/*
	$.ajax({
		url: "index.html",
		type: "POST",
		async: false,
		success: function(){
			window.open('engine.html', '_blank');
		}
	});
	*/

});

$(document).on('click', '#logout-builder', function(){

	$(".loader").fadeIn("slow", function(){
		$('#Builder_Engine').empty();
		//location.reload();
	});

});

$(document).on('click', '#Builder_Engine .btn-engine-done', function(){

		$(".btn-engine-done").prop("disabled", true);

		//AllData
		var AllData = jQuery.parseJSON(localStorage.getItem("settings"));

		// Get typing selected
		var treetagid = $('#Builder_Engine .trees .tags .tag').attr('id');
		var treecomment = "";

		// Get product selected
		var producttagid = $("#Builder_Engine .product .tags .tag").attr('id');

		//Get Inputs data Fields

		var inputarry = new Array();
		var labelarry = new Array();

		$("#box-phone").keypress(function(e){
			if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
					//display error message
					//$(".numbers").html("Solo Numeros").show().fadeOut("slow");
					return false;
			}
		});

		$('.form-dinamic .input-dinamic').each(function(){
			inputarry.push($(this).val());
			labelarry.push($(this).attr("name"));
		});

		// get Inputs data skilltipologias

		var inputarry2 = new Array();
		var labelarry2 = new Array();


		$('.form-dinamic2 .input-dinamic2').each(function(){
			inputarry2.push($(this).val());
			labelarry2.push($(this).attr("name"));
		});

		//validate

		if($('#Builder_Engine .advisory_capture').html().trim()){

			var fields = false;

			$('#Builder_Engine .fieldsIn .input-dinamic').each(function(){

				if(this.value.trim() == '' ){
						//alert("Requerido");
						this.focus();
						fields = false;
						$(".btn-engine-done").prop( "disabled", false );
						return fields;

				}
				else{
					fields  = true;
					return fields;
				}

			});

		}

		if($('#Builder_Engine .treefield').html().trim()) {

			var treefield = false;

			$('#Builder_Engine .treefield .required').each(function(){

				if(this.value.trim() == ''){
						//alert("Requerido");
						this.focus();
						treefield = false;
						$(".btn-engine-done").prop( "disabled", false );
						return treefield;
				}
				else{
					treefield  = true;
					return treefield;
				}

			});

  	}

		if($('#Builder_Engine .products').html().trim()){

			var pro = false;

			if(producttagid == null || producttagid == undefined){
				alert("Producto Requerido");
				pro = false;
				$(".btn-engine-done").prop( "disabled", false );
				pro = false;
				return pro;

			}else{
				pro = true;
				return pro;
			}

		}else{
			var pro = true;
		}


		if(fields == false){
			alert("Campo Captura Requerido");
			$(".btn-engine-done").prop( "disabled", false );
			return false;
		}
		if(treefield == false){
			alert("Campos tipificacion Requerido");
			$(".btn-engine-done").prop( "disabled", false );
			return false;
		}
		if(pro ==  false){

			alert("Producto Requerido");
			$(".btn-engine-done").prop( "disabled", false );
			return false;

		}
		else if(treetagid == null || treetagid == undefined){

			alert("tipificacion requerido");
			$(".btn-engine-done").prop( "disabled", false );
			return;

		}
		else{


			$.TypingsTransfer(AllData);
			$.onsaveProducts(producttagid);
			$.onsaveTyping(treetagid, treecomment);
			$.onSaveData(labelarry, inputarry);
			$.onSaveSkillTyping(labelarry2, inputarry2, treetagid);


			$(".loader").slideDown("slow");
			$("#iframedataset").attr('src', 'about:blank');


		}

});

// Render Engine

$.onsetEngine = function(data){};

$.cssEngine = function(data){

	//var skillidx = "1";
	//var serviciosidx = "1";
	alert("onsetEngine");
	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var cssDinamic = skills[i].cssAgente;
						$("head").append("<!-- Dinamic Css --><style>" + cssDinamic + "</style><!-- //Dinamic Css -->");

					}

				}
		}

	}

};

$.baselayoutEngine = function(data){

	//var skillidx = "1";
	//var serviciosidx = "1";
	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var camposBase = skills[i].camposBase;

						if(camposBase != ""){

							$('.base_layout').append('<h4 class="text-center"><span class="glyphicon glyphicon-eye-open"></span> Datos Layout Base</h4><div class="fields"></div>');

							for(var i = 0; i < camposBase.length; i++){

								var nombreBase = camposBase[i].nombreBase;
								var title = camposBase[i].titulo;
								var name = camposBase[i].nombre;
								var typeD = camposBase[i].tipoDato;
								var form = camposBase[i].tipoCampo;
								var long = camposBase[i].longitud;
								var required = camposBase[i].requerido;
								var order = camposBase[i].orden;

								//HTML elements

								if(form == "input" || form == "Input"){

									var content = '<div class="form-group form-build"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-sm input-read" id="'+name+'" maxlength="'+long+'" placeholder=""></div>';
									$('.base_layout .fields').append(content);

									$(".base_layout .fields .input-read").prop('disabled', true);

								}

							}

						}else{
							$('.base_layout').append('<h4 class="text-center"><span class="glyphicon glyphicon-eye-open"></span> Datos Layout Base</h4>');
						}
					}

				}

		}

	}

};

$.captureRenderEngine = function(data){

	//var skillidx = "4";
  //var serviciosidx = "2";
	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	for(var t = 0; t < data.length; t++){

		if(serviciosidx == data[t].serviciosId){

			var skills = data[t].skills;

				for(var r = 0; r < skills.length; r++){

					if(skillidx == skills[r].skillsId){

						var fieldsIn = skills[r].camposCaptura;

							if(fieldsIn != ""){

								$('.advisory_capture').append('<h4 class="text-center"><span class="glyphicon glyphicon-edit"></span> Datos Captura</h4><div class="fieldsIn"></div>');

								for(var i = 0; i < fieldsIn.length; i++){

									var title = fieldsIn[i].titulo;
									var name = fieldsIn[i].nombre;
									var typeD = fieldsIn[i].tipoDato;
									var form = fieldsIn[i].tipoCampo;
									var long = fieldsIn[i].longitud;
									var defaultvalue = fieldsIn[i].valorDefault;
									var required = fieldsIn[i].requerido;
									var typ = fieldsIn[i].tipo;
									var order = fieldsIn[i].orden;

									//HTML elements

									if(form == "input" || form == "Input"){

										var content = '<div class="form-group form-dinamic"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-sm input-dinamic" id="'+name+'" name="'+title+'" value="'+defaultvalue+'"  maxlength="'+long+'" placeholder=""></div>';
										$('.advisory_capture .fieldsIn').append(content);
										/*
										if(required == "1"){
											$(".fields .input-dinamic").addClass('required');
										}
										*/
									}
									if(form == "combo" || form == "Combo"){

											console.log(defaultvalue);

											var arrayselect = defaultvalue.split(',');

											console.log(arrayselect);

											var selectDinamic = '<div class="form-group form-dinamic"><label class="control-label">'+name+'</label><select id="fill-select" name="'+name+'" class="form-control input-sm input-dinamic">';

											$.each(arrayselect, function(val, text){
												selectDinamic = selectDinamic + '<option val="'+text+'">'+text+'</option>';
											});

											selectDinamic = selectDinamic + '</select></div>';

											$('.advisory_capture .fieldsIn').append(selectDinamic);

									}
									if(form == "checkbox" || form == "Checkbox"){

											var arrycheckbox = defaultvalue.split(',');

											for(arry in arrycheckbox){
												var content = '<div class="checkbox"><label><input type="checkbox" value="">'+arrycheckbox[arry]+'</label></div>';
												$('.advisory_capture .fieldsIn').append(content);
											};

									}
									if(form == "radio" || form == "Radio"){

										var arryrdio = defaultvalue.split(',');

										for(arry in arryrdio){
											var content = '<div class="radio"><label><input type="radio" value="">'+arryrdio[arry]+'</label></div>';
											$('.advisory_capture .fieldsIn').append(content);
										};
										//if(required == "1"){
											//$(".fields .input-dinamic").addClass('required');
										//}
									}
									if(form == "date" || form == "Date"){
											var content = '<div class="form-group"><label for="Colonia">Fecha</label><div class="input-group date" id="datetimepicker1"><input type="text" class="form-control input-sm" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div></div>';
											$('.advisory_capture .fieldsIn').append(content);
									}
									if(form == "label" || form == "Label"){
											var content = '<div class="form-group form-dinamic"><label class="control-label">'+name+'</label></div>';
											$('.advisory_capture .fieldsIn').append(content);
									}

								}

							}else{
								//$('.advisory_capture').append('<h4 class="text-center"><span class="glyphicon glyphicon-edit"></span> Datos Captura</h4>');
							}

					}

				}

		 }

	}

};

$.typificationsEngine = function(data){

	//var skillidx = "1";
	//var serviciosidx = "1";

	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	$('#Builder_Engine .tree').append('<h4 class="text-center"><span class="glyphicon glyphicon-tags"></span> Tipificaciones</h4>');

	for(var e = 0; e < data.length; e++){

		if(serviciosidx == data[e].serviciosId){

			var skills = data[e].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var data = skills[i].tipologias;

						$('#Builder_Engine .tree').jstree({ 'core':{
							"data": data
							}
						});

						$('#Builder_Engine .tree').on('changed.jstree', function(e, data){

								var i, j, r = [], id = [];
								for(i = 0, j = data.selected.length; i < j; i++){
									id.push(data.instance.get_node(data.selected[i]).id);
									r.push(data.instance.get_node(data.selected[i]).text);
								}

								var nodetree = id.join(', ');
								var nodetreetext = r.join(', ');
								//console.log(nodetree);


								$.skillsTyping(nodetree);

								$('.trees .tags').empty().append('<span class="tag" id="'+id.join(', ')+'" name="">'+r.join(', ')+'</span>');

						}).jstree();


								//console.log("transfiere", transfiere);
								//$('.trees .tags').empty().append('<span class="tag" id="'+nodetree+'" name="">'+nodetreetext+'</span>');


					}
				}

		}

	}

};

$.productsEngine = function(data){

	//var skillidx = "1";
	//var serviciosidx = "1";

	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

							var data = skills[i].productos;

							if(!data){

							}else{

								$('#Builder_Engine .products').append('<h4 class="text-center"><span class="glyphicon glyphicon-tag"></span> Productos</h4>');
								$('#Builder_Engine .products').jstree({ 'core' : {
									"data": data
								}});

								$('#Builder_Engine .products').on('changed.jstree', function(e, data){
								    var i, j, r = [], id = [];
								    for(i = 0, j = data.selected.length; i < j; i++) {
											id.push(data.instance.get_node(data.selected[i]).id);
											r.push(data.instance.get_node(data.selected[i]).text);
								    }
										$('.product .tags').empty().append('<span class="tag" id="'+id.join(', ')+'">'+r.join(', ')+'</span>');
	  						}).jstree();
							}

					}

				}

		}

	}


};

$.customerInfo = function(data){

	var url = ws+"rg_MuestraCliente";

	var myid = localStorage.getItem('id');
	var skillsId = localStorage.getItem('SkillId');
	var serviciosId = localStorage.getItem('serviciosId');
	var clientesId = localStorage.getItem('clientesId');

	var CtiClientesId = $.UrlDecode()["clientesId"];

	if(CtiClientesId == null || CtiClientesId == undefined){

		var Data = {
			serviciosId: serviciosId,
			skillId: skillsId,
			clientesId: clientesId,
			usuarioId: myid,
			valorClave: ""
		}

	}else{

		var Data = {
			serviciosId: serviciosId,
			skillId: skillsId,
			clientesId: CtiClientesId,
			usuarioId: myid,
			valorClave: ""
		}

	}

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			var names = data[0].nombre1 + ' ' + data[0].nombre2;
			var pat = data[0].apellido1;
			var mat = data[0].apellido2;
			var Vclave = data[0].valorClave;
			var lada = data[0].lada;
			var ext = data[0].extension;

			var content = '<h4 class="text-center"><span class="glyphicon glyphicon-user"></span> Datos Generales</h4><div class="form-group"><label for="valorclave">Nombre</label><input type="text" class="form-control input-sm" id="names" val="'+names+'" placeholder=""></div><div class="form-group"><label for="valorclave">Apellido Paterno</label><input type="text" class="form-control input-sm" id="pat" val="'+pat+'" ></div><div class="form-group"><label for="valorclave">Apellido Materno</label><input type="text" class="form-control input-sm" id="mat" val="'+mat+'" placeholder="Apellido Materno"></div><div class="form-group"><label for="valorclave">Valor Clave</label><input type="text" class="form-control input-sm" id="vclave" val="'+Vclave+'"></div><div class="row"><div class="col-md-6"><div class="form-group"><label for="Lada">Lada</label><input type="text" class="form-control input-sm" id="lada" val="'+lada+'"></div></div><div class="col-md-6"><div class="form-group"><label for="valorclave">Extension</label><input type="text" class="form-control input-sm" id="ext" val="'+ext+'"></div></div></div>';
			$('#Builder_Engine .container-fluid .customerInfo').append(content);

			$('.customerInfo #names').val(names).prop('disabled', true);
			$('.customerInfo #pat').val(pat).prop('disabled', true);
			$('.customerInfo #mat').val(mat).prop('disabled', true);
			$('.customerInfo #vclave').val(Vclave).prop('disabled', true);
			$('.customerInfo #lada').val(lada).prop('disabled', true);
			$('.customerInfo #ext').val(ext).prop('disabled', true);

		},error: function(data){
			alert("ErrorWS: " + data.status + " " + data.statusText);
		}

	});

};

$.typiHistoryEngine = function(data){

	var url = ws+"rg_ListClienteHistorico";

	var myid = localStorage.getItem('id');
	var skillsId = localStorage.getItem('SkillId');
	var serviciosId = localStorage.getItem('serviciosId');
	var clientesId = localStorage.getItem('clientesId');
	var clientesClavesId = localStorage.getItem('clientesClaveId');

	var Data = {
		clientesId: clientesId,
		serviciosid: serviciosId,
		usuariosId: myid,
		skillsId: skillsId
	}

	$.support.cors = true;

  $.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(data){

			$('.historical').empty().append('<h4 class="text-center"><span class="glyphicon glyphicon-time"></span> Historico Tipificaciones</h4><ul class="list-group"></ul>');

			for(var i = 0; i < data.length; i++){

				var clientesHistoricoId = data[i].clientesHistoricoId;
				var fechaCreacion = data[i].fechaCreacion;
				var valorClave = data[i].valorClave;
				var tipologia = data[i].tipologia;
				var comentario = data[i].comentario;
				var skill = data[i].skill;

				var content = '<li class="list-group-item">#'+clientesHistoricoId+' '+tipologia+'  ValorClave: '+valorClave+'  Comentarios: '+comentario+'</li>';

				$('.historical ul.list-group').append(content);
			}

		},error: function(data){
			alert("ErrorWS: " + data.status + " " + data.statusText);
		}

  });

};

$.vdn = function(data){

	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

							var vdntransfiere = skills[i].vdnTransfiere;
							localStorage.setItem('vdnTransfiere', vdntransfiere)
					}
				}
		}
	}

};

$.skillsTyping = function(node){

		$('#Builder_Engine .container-fluid .treefield').empty();

		var url = ws+"rg_ListSkillsTipologiasCampos";

		var myid = localStorage.getItem('id');

		var Data = {
			skill: "",
			tipologia: "",
			usuarioId: myid,
			skillsId: "",
			skillTipologiasId: node
		}

		$.support.cors = true;

		$.ajax({
			type: "GET",
			url: url,
			crossDomain: true,
			data: Data,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){

				var fieldsIn = data;

				if(fieldsIn == null || fieldsIn == ""){

				}else{

					var content = '<h4><span class="glyphicon glyphicon-edit"></span> Campos Captura Tipologia</h4>';
					$('#Builder_Engine .container-fluid .treefield').append(content);

					for(var i = 0; i < fieldsIn.length; i++){

						var title = fieldsIn[i].titulo;
						var name = fieldsIn[i].nombre;
						var typeD = fieldsIn[i].tipoDato;
						var form = fieldsIn[i].tipoCampo;
						var long = fieldsIn[i].longitud;
						var defaultvalue = fieldsIn[i].valorDefault;
						var required = fieldsIn[i].requerido;
						var typ = fieldsIn[i].tipo;
						var order = fieldsIn[i].orden;

						//HTML elements

						if(form == "input" || form == "Input"){

							var content = '<div class="form-group form-dinamic2"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-sm input-dinamic2" id="'+name+'" name="'+title+'" value="'+defaultvalue+'"  maxlength="'+long+'" placeholder=""></div>';
							$('#Builder_Engine .container-fluid .treefield').append(content);

							if(required == "1"){
								$(".treefield .input-dinamic2").addClass('required');
							}else{
								$(".treefield .input-dinamic2").removeClass('required');
							}

						}

						if(form == "combo" || form == "Combo"){

								var arrayselect = defaultvalue.split(',');

								var content = '<div class="form-group form-dinamic2"><label class="control-label">'+name+'</label><select id="fill-select" class="form-control input-sm"></select></div>';

								$('#Builder_Engine .container-fluid .treefield').append(content);

								var options = arrayselect;

								var select = document.getElementById('fill-select');

								for(option in options){
									select.add(new Option(options[option]));
								};

						}
						if(form == "checkbox" || form == "Checkbox"){

								var arrycheckbox = defaultvalue.split(',');

								for(arry in arrycheckbox){
									var content = '<div class="checkbox"><label><input type="checkbox" value="">'+arrycheckbox[arry]+'</label></div>';
									$('#Builder_Engine .container-fluid .treefield').append(content);
								};
								if(required == "1"){
									$(".treefield .checkbox").addClass('required');
								}

						}
						if(form == "radio" || form == "Radio"){

							var arryrdio = defaultvalue.split(',');

							for(arry in arryrdio){
								var content = '<div class="radio"><label><input type="radio" value="">'+arryrdio[arry]+'</label></div>';
								$('#Builder_Engine .container-fluid .treefield').append(content);
							}
							if(required == "1"){
								$(".treefield .radio").addClass('required');
							}

						}
						if(form == "date" || form == "Date"){
								var content = '<div class="form-group"><label for="Colonia">Fecha</label><div class="input-group date" id="datetimepicker1"><input type="text" class="form-control input-sm" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div></div>';
								$('#Builder_Engine .container-fluid .treefield').append(content);
						}
						if(form == "label" || form == "Label"){
								var content = '<div class="form-group form-dinamic2"><label class="control-label">'+name+'</label></div>';
								$('#Builder_Engine .container-fluid .treefield').append(content);
						}

					}

				}

			},error: function(data){
			}

		});

};

$.TypingsTransfer = function(data){

	alert("validando transfer");

	var nodeTy = $('#Builder_Engine .trees .tags .tag').attr('id');
	var skillidx = localStorage.getItem('SkillId');
	var serviciosidx = localStorage.getItem('serviciosId');

	for(var e = 0; e < data.length; e++){

		if(serviciosidx == data[e].serviciosId){

			var skills = data[e].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var subdata = skills[i].tipologias;

						for(var z = 0; z < subdata.length; z++){

							if(subdata[z].id == nodeTy){

								if(subdata[z].transfiere == 1){
									$.onTransfer();
								}

							}

						}

					}

				}

		}

	}

};

/*===========================
				  Saving
 ============================*/

$.onsaveCita = function(){

	//rg_CargaClientesCitas
	alert("listo para enviar");

};

$.onsaveTyping = function(id, comment){

	var url = ws+"rg_GuardaTipificacion";

	var myid = localStorage.getItem('id');
	var skillsId = localStorage.getItem('SkillId');
	var serviciosId = localStorage.getItem('serviciosId');
	var clientesId = localStorage.getItem('clientesId');
	var clientesClavesId = localStorage.getItem('clientesClaveId');
	var skillsTipologiasid = id;
	var comentario = comment;
	var vdnTransfirio = localStorage.getItem('vdnTransfiere');
	var extension = localStorage.getItem('extension');

	var Data = {
		skillsId: skillsId,
		serviciosId: serviciosId,
		clientesId: clientesId,
		clientesClavesId: clientesClavesId,
		skillsTipologiasId: skillsTipologiasid,
		comentario: comentario,
		usuariosId: myid,
		vdnTransfirio: vdnTransfirio,
		extension: extension
	};

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			$.typiHistoryEngine();
		},error: function(data){}
	});

};

$.onsaveProducts = function(spid){

	var url = ws+"rg_GuardaProductos";

	var myid = localStorage.getItem('id');
	var skillsId = localStorage.getItem('SkillId');
	var serviciosId = localStorage.getItem('serviciosId');
	var clientesId = localStorage.getItem('clientesId');
	var clientesClavesId = localStorage.getItem('clientesClaveId');
	var skillsProductosid = spid;

	var Data = {
		skillsId: skillsId,
		serviciosId: serviciosId,
		clientesId: clientesId,
		clientesClavesId: clientesClavesId,
		skillsProductosId: skillsProductosid,
		usuariosId: myid
	};

	$.support.cors = true;

	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
		},error: function(data){}

	});


};

$.onSaveData = function(labels, inputs){

	var url = ws+"rg_GuardaDatos";

	var myid = localStorage.getItem('id');
	var skillsId = localStorage.getItem('SkillId');
	var serviciosId = localStorage.getItem('serviciosId');
	var clientesId = localStorage.getItem('clientesId');
	var clientesClavesId = localStorage.getItem('clientesClaveId');
	var label = labels.toString();
	var input = inputs.toString();

	var Data = {
		skillsId: skillsId,
		serviciosId: serviciosId,
		clientesClaveId: clientesClavesId,
		campos: label,
		valores: input,
		usuariosId: myid,
		skillsTipologiasId: "0"
	};

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

		},error: function(data){
			//console.log("algo salio mal", data);
		}

	});

};

$.onSaveSkillTyping = function(labels, inputs, nodetree){

	var url = ws+"rg_GuardaDatos";

	var myid = localStorage.getItem('id');
	var skillsId = localStorage.getItem('SkillId');
	var serviciosId = localStorage.getItem('serviciosId');
	var clientesId = localStorage.getItem('clientesId');
	var clientesClavesId = localStorage.getItem('clientesClaveId');
	var label = labels.toString();
	var input = inputs.toString();

	var Data = {
		skillsId: skillsId,
		serviciosId: serviciosId,
		clientesClaveId: clientesClavesId,
		campos: label,
		valores: input,
		usuariosId: myid,
		skillsTipologiasId: nodetree
	};

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

		},error: function(data){
			//console.log("algo salio mal", data);
		}

	});

};

$.onTransfer = function(){
	alert("done");
	var vdnTransfirio = localStorage.getItem('vdnTransfiere');

	if(vdnTransfirio == null || vdnTransfirio == undefined){

	}else{
		parent.fTransferCall(vdnTransfirio);
	}

};
