let timeZone = "";
let language = "";
$(document).ready(function(){

	// add name
	let name = getUrlParameter("name");
	$("#name").html(name);
	// add place and time
	addLocationAndTime();
	// add snow
  initLetItSnow();

	// set time update
	setInterval(updateTime, 1000);
});

// Init Christmas! \o/
let initLetItSnow = function(){

	(function() {
	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
	    function(callback) {
	        window.setTimeout(callback, 1000 / 60);
	    };
	    window.requestAnimationFrame = requestAnimationFrame;
	})();

	var flakes = [],
	    canvas = document.getElementById("christmas"),
	    ctx = canvas.getContext("2d"),
	    mX = -100,
	    mY = -100;

	    if( $(window).width() < 999 ){
	    	var flakeCount = 125;
	    } else {
	    	var flakeCount = 450;
	    }

	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;

	function snow() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);

	    for (var i = 0; i < flakeCount; i++) {
	        var flake = flakes[i],
	            x = mX,
	            y = mY,
	            minDist = 250,
	            x2 = flake.x,
	            y2 = flake.y;

	        var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
	            dx = x2 - x,
	            dy = y2 - y;

	        if (dist < minDist) {
	            var force = minDist / (dist * dist),
	                xcomp = (x - x2) / dist,
	                ycomp = (y - y2) / dist,
	                // deltaV = force / 2;
	                deltaV = force;

	            flake.velX -= deltaV * xcomp;
	            flake.velY -= deltaV * ycomp;

	        } else {
	            flake.velX *= .98;
	            if (flake.velY <= flake.speed) {
	                flake.velY = flake.speed
	            }
	            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
	        }

	        ctx.fillStyle = "rgba(163,134,189," + flake.opacity + ")";
	        flake.y += flake.velY;
	        flake.x += flake.velX;
	            
	        if (flake.y >= canvas.height || flake.y <= 0) {
	            reset(flake);
	        }

	        if (flake.x >= canvas.width || flake.x <= 0) {
	            reset(flake);
	        }

	        ctx.beginPath();
	        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
	        ctx.fill();
	    }
	    requestAnimationFrame(snow);
	};

	function reset(flake) {
	    flake.x = Math.floor(Math.random() * canvas.width);
	    flake.y = 0;
	    flake.size = (Math.random() * 3) + 2;
	    flake.speed = (Math.random() * 1) + 0.5;
	    flake.velY = flake.speed;
	    flake.velX = 0;
	    flake.opacity = (Math.random() * 0.5) + 0.3;
	}

	function init() {
	    for (var i = 0; i < flakeCount; i++) {
	        var x = Math.floor(Math.random() * canvas.width),
	            y = Math.floor(Math.random() * canvas.height),
	            size = (Math.random() * 3) + 4,
	            speed = (Math.random() * 1) + 0.5,
	            opacity = (Math.random() * 0.5) + 0.3;

	        flakes.push({
	            speed: speed,
	            velY: speed,
	            velX: 0,
	            x: x,
	            y: y,
	            size: size,
	            stepSize: (Math.random()) / 160,
	            step: 0,
	            opacity: opacity
	        });
	    }

	    snow();
	};

	canvas.addEventListener("mousemove", function(e) {
	    mX = e.clientX,
	    mY = e.clientY
	});

	window.addEventListener("resize",function(){
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	})

	init();
};

// Add name
let getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

	for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
	}
	return false;
};

let addLocationAndTime = function(){
	$.getJSON("https://ipapi.co/json", function(data){
		const placeString = [data.city, data.region, data.country_name].join(", ");

		timeZone = data.timezone;
		const languageString = data.languages;
		language = languageString.split(",")[0];
		const timeString = getTimeString(language, timeZone);

		const placeTimeAndGreetingString = "<div class='place-and-time'>It's <span id='time'>" + timeString +"</span> in <span id='place'>" + placeString + "</span></div><div class='greeting'>Hope you have a happy Christmas and New Year period wherever you are</div>";
		$(".place-time-and-greeting").html(placeTimeAndGreetingString);
	});
}

const getTimeString = function(language, timeZone){
	const today = new Date();
	const tzTime = today.toLocaleString(language, {timeZone});
	return(tzTime);
}

const updateTime = function(){
	const timeString = getTimeString(language, timeZone);
	$('#time').html(timeString);
}
