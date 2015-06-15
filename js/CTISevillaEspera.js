/*
usuariosId = Cookies.get('id');
extensionasesor = Cookies.get('extension');
acdtelefonico = Cookies.get("acd");
*/
usuariosId = localStorage.getItem('id');
extensionasesor = localStorage.getItem('extension');
acdtelefonico = localStorage.getItem("acd");
window.BanderaLogin = 0;
window.BanderaLoop = 0;
var BanderaConecting;
var BanderaStablished;
window.ws = "http://172.18.149.21/Servicios/REST.svc/";
var urlRest = ws + "rg_SolicitaCliente";

sDNIS = "";
$.filldata = function (data1, data2) {
    data = {
        metodo: data1,
        navegador: get_browser_info().name,
        version: get_browser_info().version.toString(),
        so: retornarSO().toString(),
        usuariosId: usuariosId,
        error: data2
    }
};
//var websocket;
var websocket;

dataactivity = { menu: "", usuariosId: usuariosId }
url = "http://172.18.149.21/Servicios/REST.svc/rg_RegistraErrores?";
urlactivity = "http://172.18.149.21/Servicios/REST.svc/rg_RegistraActividad?";
function ctiSocket(station) {
    try {

        var wsURL = "ws://172.18.18.201:8080/webctisocket-sevilla/webmonitor/station/" + station;
        websocket = new WebSocket(wsURL);
        websocket.onopen = function () {
            //HISTORIAL.value = "<br>" + ("Connected to CtiEngine WebSocket with Extension: " + station);
        };
        websocket.onerror = function (event) {
            alert("oh error! " + event.data);

        };

        websocket.onmessage = function (event) {
            //console.log(event.data);
            var jsonData = JSON.parse(event.data);
            var eventType = jsonData.event;
            switch (eventType) {
                case 'hangup': fhangup(jsonData);
                    break;
                case 'transfered': ftransfered(jsonData);
                    break;
                default: break;
            }
        };
        websocket.onclose = function (event) {
            //console.log("disconnected Extension: " + station);
        };

    } catch (e) {

        data = {
            metodo: "CTI ctiSocket",
            error: e
        }

        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);

        RESTError(data, url);
    }
}
/*window.onload = function () {
try {
websocket = null;
$.Inicio();
} catch (e) {
data = {
metodo: "CTI onload",
error: e
}
var datametodo = data.metodo;
var dataerror = data.error;
$.filldata(datametodo, dataerror);

RESTError(data, url);
}
};*/
$(window).load(function () {
    // everything�s finished loaded code here�
    try {
        websocket = null;
        $.Inicio();
    } catch (e) {
        data = {
            metodo: "CTI onload",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);

        RESTError(data, url);
    }
});
$.Inicio = function () {
    $.flogin();
}
$.flogin = function () {
    try {

        var r1 = 0;

        dataactivity = { menu: "flogin", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);

        txtExtension = extensionasesor;
        document.getElementById("txtStation").value = extensionasesor;
        if (txtExtension == 'undefined') {
            alert("Necesita ingresar una extension correcta");
        }
        else if (txtExtension.length < 4) {
            alert("Necesita ingresar una extension correcta");
        }
        else {
            ctiSocket(txtExtension);

            if (acdtelefonico != '0') {
                setTimeout("$.fMakeCallTelefonico(acdtelefonico)", 1000);
            }
            else {

                $("#BarraInterfaces .error-cti").text("No existe acd telefonico, para loguearse");
                return false;
            }
        }
    } catch (e) {
        data = {
            metodo: "CTI flogin",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);

        RESTError(data, url);
    }
    return r1;
}
$.fMakeCallTelefonico = function (acd) {
    try {

        var acdTel = "*63" + acd;
        websocket.send(["makecall", acdTel]);
        $.fdisponible();
    } catch (e) {
        data = {
            metodo: "CTI fMakeCall Telefonico",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
    return acdTel;
}

$.fdisponible = function () {

    setTimeout(function () {
        var disponible = "*61";
        websocket.send(["makecall", disponible]);
    }, 7000);
    setTimeout(function () {
        var disponible = "*61";
        $.ValidatePage();
    }, 12000);

};
$.ValidatePage = function () {
    var v = 0;
    if (localStorage.getItem('serviciosId') == null || localStorage.getItem('serviciosId') == undefined || localStorage.getItem('SkillId') == null || localStorage.getItem('SkillId') == undefined || localStorage.getItem('id') == null || localStorage.getItem('id') == undefined) {

        alert("Datos Invalidos para operacion, validar con su Administrador");

    } else {

        dataRest = {
            serviciosId: localStorage.getItem('serviciosId'),
            skillsId: localStorage.getItem('SkillId'),
            usuariosId: localStorage.getItem('id')
        }

        $.ajax({
            type: "GET",
            url: urlRest,
            crossDomain: true,
            data: dataRest,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                if (data[0].telefono != undefined && data[0].clienteId != undefined) {
                    BanderaLoop = 1;
                    document.getElementById("iframedatasetCTIOUT").src = "http://172.18.149.195/dataset.html?clientesId=" + data[0].clienteId + "&vclave=" + data[0].telefono;
                    v = 1;
                    var numero = "9" + data[0].telefono;
                    $.MakeCallTelefono(numero);
                    return 1;
                }
                else {
                    BanderaLoop = 0;
                    setTimeout(function () {
                        var disponible = "*61";
                        $.ValidatePage();
                    }, 12000);
                    //alert("No hay resultados para el Marcado");
                }
            }, error: function (data) {
                alert("Error No Puedo Continuar");
            }
        });

    }
    return v;
}

$.MakeCallTelefono = function (numero) {
    websocket.send(['makecall', numero]);

}
function flogout() {
    try {
        dataactivity = { menu: "flogout", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);
        var acdTel = "*64";
        websocket.send(["makecall", acdTel]);


        //document.getElementById("btnLogin").disabled = false;
        //document.getElementById("btnLogout").disabled = true;
        websocket.close();
    } catch (e) {
        data = {
            metodo: "CTI flogout",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}
function fhangup(data) {
    try {
        BanderaConecting = 0;
        BanderaStablished = 1;

        dataactivity = { menu: "fhangup", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);

        //HISTORIAL.value = "<br>" + ("end call at Extension " + txtExtension);
    } catch (e) {
        data = {
            metodo: "CTI fhangup",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}
function fMakeCall(Number) {
    try {
        dataactivity = { menu: "fMakeCall", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);

        BanderaConecting = 1;
        BanderaStablished = 1;
        sDNIS = Number;
        if (extensionasesor == "") {
            alert("No puede transferir sin tener una extension firmada.");
        }
        else if (sDNIS == undefined || sDNIS == "") {
            alert("No puede marcar a un numero vacio, validelo por favor");
        }
        else {
            websocket.send(["makecall", sDNIS]);
        }

    } catch (e) {
        data = {
            metodo: "CTI fMakeCall",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}

$.fdisponibleLogin = function () {
    var r = setTimeout("flogin()", 5000);
    return r;
};


$.fdisponibleValidate = function () {
    var r = setTimeout("ValidatePage()", 5000);
    return r;
};






function fDropCall() {
    try {
        if (websocket != null) {
            websocket.send("dropcall");
            BanderaConecting = 0;
            BanderaStablished = 1;
        }
        else {
            alert("No tiene una llamada");
        }
    } catch (e) {
        data = {
            metodo: "CTI fDropCall",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}
function fTransferCall(VDN) {
    try {

        dataactivity = { menu: "fTransferCall", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);

        if (BanderaConecting == 0) {
            alert("No puede transferir sin tener una llamada activa.");
        }
        else if ($("#BarraInterfaces #txtStation").val() == "") {
            alert("No puede transferir sin tener una extension firmada.");
        }
        else if ("VDN" != "") {/*parent*/

            //console.log("VDN", VDN);

            websocket.send(["transfercall", VDN]);
            BanderaConecting = 0;
            BanderaStablished = 1;
        }
        else {
            alert("No puede transferir a este numero inexistente");
        }
    } catch (e) {
        data = {
            metodo: "CTI fTransferCall",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}

function RESTError(datarest, urlrest) {
    $.ajax({
        type: "GET",
        url: urlrest,
        crossDomain: true,
        data: datarest,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (datarest) {
            //alert("ok");
            //console.info("U P D A T E session: success", data);
        }, error: function (datarest) {
            //alert("error");
            //console.log("U P D A T E session: unsuccess");
        }

    });
}

function get_browser_info() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE ', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

var navInfo = window.navigator.appVersion.toLowerCase();
var so = '';

function retornarSO() {
    var os = navigator.platform;
    os = os.toLowerCase();
    if (os == "win32" || os == "win16" || os == "win64") {
        so = 'Windows';
    }
    else if (os.indexOf("linux") >= 0) {
        so = 'linux';
    }
    else if (os.indexOf("mac") >= 0) { so = 'Mac'; }
    return so
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
function delay(ms) {
    var cur_d = new Date();
    var cur_ticks = cur_d.getTime();
    var ms_passed = 0;
    while (ms_passed < ms) {
        var d = new Date();  // Possible memory leak?
        var ticks = d.getTime();
        ms_passed = ticks - cur_ticks;
        // d = null;  // Prevent memory leak?
    }
}
