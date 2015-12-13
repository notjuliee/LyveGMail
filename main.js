var gmail;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (undefined === Gmail) ) {
	setTimeout('refresh(' + f + ')', 10);
  } else {
	f();
  }
}

function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
    	var canvas = document.createElement('CANVAS');
    	var ctx = canvas.getContext('2d');
    	canvas.height = this.height;
    	canvas.width = this.width;
    	ctx.drawImage(this,0,0);
    	var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    	callback(dataURL);
    	canvas = null;
    };
    img.src = url;
}

function authBrowser() {
	$.post('https://hermes.api.mylyve.com/v1/oauth?grant_type=password&username='+userEmail+'&password='+userPassword+'&client_id=JONATAN&redirect_uri=https://www.digitalfishfun.com:8124/re').done(function(data) {
		localStorage.setItem("authToken",data);
		unusedVar = data;
	});
}

function lyveWindow() {
	$("#dialog").dialog({ maxHeight: 500, width : 600 })
	canRe = true;
	cScroll = 0;
	callApi();
	$("#dialog").scroll(function() {
		if ($("#dialog").scrollTop()>cScroll+10) {
			limit = "10"
			cScroll = $("#dialog").scrollTop();
			callApi();
		}
	});
}

function callApi() {
	if (canRe) {
		canRe = false;
		url = 'https://hermes.api.mylyve.com/v1/media?';
		if (limit) {
			url += '&limit='+limit;
		}
		if (pt) {
			url += '&paging_token='+pt;
		}

		url += '&access_token='+localStorage.getItem("authToken");

		$.getJSON(url, function(data) {

			data.media.forEach(function(entry) {
				var tmpImg = '<div class="grid-item" style="float:left;">';

				var mo = false

				if (entry.small) {
					var mo = entry.small;
				}
				if (entry.medium) {
					var mo = entry.medium;
				}
				if (entry.large) {
					var mo = entry.large;
				}
				if (entry.extra_large) {
					var mo = entry.extra_large;
				}

				if (mo && mo.url) {
					tmpImg += '<img height="100" width="'+100*(mo.width_px/mo.height_px)+'" src="'+mo.url+"?access_token="+localStorage.getItem("authToken")+'" onClick="appendImage(\''+mo.url+'?access_token='+localStorage.getItem("authToken")+'\',\''+entry.id+'\');"/>';
					tmpImg += '</div>';

					$("#dialog").append(tmpImg);
				}
				else {
					console.log("Beeeg oppzy :(");
				}
			});
			if (data.paging_token) {
				canRe = true;
				pt = data.paging_token;
			}
		});
	}
}

function appendImage(url, id) {
	console.log(id);
	console.log(url);
	convertImgToBase64(url, function(data) {
		$.post('https://digitalfishfun.com:8124/ul', '{ "img" : "'+data+'", "id" : "'+id+'"}').done(function(pdata) {
			gmail.dom.composes()[0].body('<img src="'+pdata+'"></img>'+gmail.dom.composes()[0].body());
		});
	});
}

function logout() {
	localStorage.removeItem("authToken");
}

function lyveLogin() {
	$("#loginDialog").dialog("close");
	userEmail = document.getElementById("lyveGmail").value;
	userPassword = document.getElementById("lyvePass").value;
	authBrowser();
	return false;
}

var main = function() {
	gmail = new Gmail();
	$("body").append('<div id="loginDialog" style="overflow:hide;" title="Lyve Login"><form onSubmit="return lyveLogin()">Email:<br/><input type="email" id="lyveGmail" value="'+gmail.get.user_email()+'"/><br/>Password:<br/><input type="password" id="lyvePass"/><br/><input type="submit" value="Login"/></form></div>')
	stack = "dogfood";
	meshId = "FFB90C01-4357-4D02-9291-F80D24BFF536";
	partnerId = "dish";
	pt = null;
	limit = "50";
	isMore = true;
	cColor = 0;
	cday = 9042387523;
	cmon = 9481570131;
	cyea = 9087402143;
	useColors = ['Lime','Magenta','Yellow','Orange','Red','Steelblue'];
	lyveButton = '<img src="https://www.digitalfishfun.com/files/LyveLogo.jpeg" height=27 width=54 onClick="lyveWindow()" title="Insert from Lyve"></img>';
	console.log('Hello,', gmail.get.user_email());
	$("body").append('<div id="dialog" class="grid" style="overflow:scroll;" title="Image select"></div>');
	if (!localStorage.getItem("authToken")) {
		$("#loginDialog").dialog();
	}
	gmail.observe.on('compose', function() {
		var compose_ref = gmail.dom.composes()[0];
		gmail.tools.add_compose_button(compose_ref, lyveButton, function() {}, 'Custom Style Classes');
	});
	gmail.observe.on('send_message', function() {
		$("#dialog").dialog("close");
	})
}

refresh(main);