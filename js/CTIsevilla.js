/*
usuariosId = Cookies.get('id');
extensionasesor = Cookies.get('extension');
acdtelefonico = Cookies.get("acd");
*/
usuariosId = localStorage.getItem('id');
extensionasesor = localStorage.getItem('extension');
acdtelefonico = localStorage.getItem("acd");

var BanderaConecting;
var BanderaStablished;
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
        websocket.onopen = function(){
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
                case 'connecting': fconnecting(jsonData);
                    break;
                case 'established': festablish(jsonData);
                    break;
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
window.onload = function () {
    try {
        websocket = null;
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
};

function flogin(){
      try {

          dataactivity = { menu: "flogin", usuariosId: usuariosId }
          RESTError(dataactivity, urlactivity);

          document.getElementById("txtStation").value = extensionasesor;
          txtExtension = document.getElementById("txtStation").value;
          if (txtExtension == 'undefined') {
              alert("Necesita ingresar una extension correcta");
          }
          else if (txtExtension.length < 4) {
              document.getElementById("txtStation").focus();
              alert("Necesita ingresar una extension correcta");
          }
          else {
              //document.getElementById("btnLogin").disabled = true;
              //document.getElementById("btnLogout").disabled = false;
              ctiSocket(txtExtension);

              if (acdtelefonico != '0'){

                //alert(acdtelefonico);

                  fMakeCallTelefonico(acdtelefonico);

                  //fMakeCallTelefonico(acdtelefonico);
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

}

function flogout(){
    try {
        dataactivity = { menu: "flogout", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);
        var acdTel = "*64";
        websocket.send(["makecall", acdTel]);


        //document.getElementById("btnLogin").disabled = false;
        //document.getElementById("btnLogout").disabled = true;
        websocket.close();
    }catch(e){
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
function fconnecting(data) {
    try {
        var sANI = data.ani;
        var sCallid = data.callid;
        var sUcid = data.ucid;
        BanderaConecting = 0;
        BanderaStablished = 0;
        if (sDNIS.length > 5)
            sDNIS = sDNIS.substring(1, sDNIS.length)
        if ($("#Builder_Engine .btn-engine-done").length > 0) {
            alert("no existe button");
        } else {
            document.getElementById('lblComment').innerHTML = "El numero marcado es: " + sDNIS;
            document.getElementById("iframedataset").src = "http://172.18.149.195/dataset.html?clientesId=&vclave=" + sDNIS;
        }
        //HISTORIAL.value = "<br>" + ("Extension " + txtExtension + " ...connecting...");
    } catch (e) {
        data = {
            metodo: "CTI fconnecting",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}
function festablish(data) {
    try {

        var sANI = data.ani;
        var sCallid = data.callid;
        var sUcid = data.ucid;

        if (BanderaConecting == 0 && BanderaStablished == 0) {
            BanderaConecting = 1; BanderaStablished == 1;
        }
        else {
            if ($("#Builder_Engine .btn-engine-done").length > 0) {

            } else {
                BanderaConecting = 1;

                document.getElementById('lblComment').innerHTML = "El numero entrante es: " + sANI;
                document.getElementById("iframedataset").src = "http://172.18.149.195/dataset.html?clientesId=&vclave=" + sANI;

            }
        }
        //HISTORIAL.value = "<br>" + ("established call at Extension " + txtExtension + ", ANI: " + sANI + " Callid: " + sCallid + " UCID: " + sUcid);
    } catch (e) {
        data = {
            metodo: "CTI festablish",
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
function ftransfered(data) {
    try {
        BanderaConecting = 0;
        BanderaStablished = 1;

        dataactivity = { menu: "ftransfered", usuariosId: usuariosId }
        RESTError(dataactivity, urlactivity);
        var sANI = data.ani;
        var sCallid = data.callid;
        var sUcid = data.ucid;
        //HISTORIAL.value = "<br>" + ("transfer call from: " + sANI + " Callid: " + sCallid + " UCID: " + sUcid);
    } catch (e) {
        data = {
            metodo: "CTI ftransfered",
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
        if (document.getElementById("txtStation").value == "") {
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

function fMakeCallTelefonico(acd){
    try {

        //dataactivity = { menu: "fMakeCallTelefonico", usuariosId: usuariosId }

        //RESTError(dataactivity, urlactivity);
        var acdTel = "*63" + acd;
        alert("Conectando...");
        //parent.websocket.send(["makecall", acdTel]);
        websocket.send(["makecall", acdTel]);
        //fDropCall();

        //setTimeout($.fdisponible(websocket), 5000);
        //setTimeout(fdisponible(websocket), 5000);
        $.fdisponible();


    }catch(e){
        data = {
            metodo: "CTI fMakeCall Telefonico",
            error: e
        }
        var datametodo = data.metodo;
        var dataerror = data.error;
        $.filldata(datametodo, dataerror);
        RESTError(data, url);
    }
}


$.fdisponible = function(){

    setTimeout(function(){
      alert("Agente Disponible");
      //var webs = web;
      var disponible = "*61";
      websocket.send(["makecall", disponible]);
    }, 7000);

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
function fTransferCall(VDN){
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
        success: function(datarest){
            //alert("ok");
            //console.info("U P D A T E session: success", data);
        },error: function(datarest){
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
