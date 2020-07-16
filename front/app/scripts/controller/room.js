(function(){
	'use strict';

	var app = angular.module('JamRoom',['services']);

	app.constant('BaseUrl', 'http://bandmeter.com:3000/api/');

  app.controller('RoomCtrl', function(BaseUrl,$http,$routeParams,$rootScope,$cookies,SweetAlert,Socket,$timeout,$location, Session){
	if(Session.id == 'undefined' || typeof(Session.id) == 'undefined'){
		$location.path('/');			
	}

	this.activeBox = -1;  // nothing selected
	this.aspectRatio = 16/9;  // standard definition video aspect ratio
	this.maxCALLERS = 4;
	this.numVideoOBJS = this.maxCALLERS+1;
	this.layout;
	this.sala = {};
	this.thisUsername = $cookies.nickname;
	this.owner = false;
	this.sendInv = false;
	this.message = '';
	this.roomSlug = $routeParams.room;
	this.roomData = {};
	this.roomTitle = '';
	var room = this;

	this.keyDownTextField = function(e) {
		if(e.keyCode === 13) {
		    room.sendMessage($('#chatInput').val());
		}
	}

	document.getElementById('chatInput').addEventListener("keydown", room.keyDownTextField, false);

	var sockJamroom = {username:$cookies.username,room:room.roomSlug}

	Socket.emit('newUserJamroom',sockJamroom);

	Socket.on('updatechat', function(data){
		console.log("Entra");
		var text = '<p><strong>'+data.user+'</strong> has wrote: '+data.message+'</p>';
		$('#chatconv').append(text);
		$('#chatconv').animate({top:+20});
	});

	room.sendMessage = function(message){
		var data = {user:$cookies.username, message: message};
		Socket.emit('chatMessage',data);
		room.message = '';
		$('#chatInput').attr('value','');
	};

	room.sendInvitations = function(users){
		var errors = 0;
		var sent = 0;
		angular.forEach(users, function(user, value){
			if(user !== ''){
				$http.get(BaseUrl+'sendinvitation/'+room.sala.code+'/'+user)
					 .success(function(data){
					 	if(data.response === 'ko'){
					 		errors++;
					 	}else if(data.response === 'ok'){
					 		sent++;
					 	}
					 });
					}else{
						sent++;
					}
		});
		if(sent === 4){
			SweetAlert.swal("Invitations sent","You have sent all of invitations success","success");
		}
		room.sendInv = false;
	};
	$http.get(BaseUrl+'jamroom/'+room.roomSlug)
		 .success(function(data){
			 console.log(data);
		 	$.each(data, function(index, value){
			 	if(value.owner === $cookies.username){
			 		room.owner = true;
			 	}
			 	if($cookies.user !== data.owner && (value.members.length > 0 && value.members.indexOf({id:$cookies.user})) < 0){
					$location.path('/jamrooms');
				}
	  			$rootScope.$broadcast('inroom',data.name);
	  			room.sala = value;
	  			$rootScope.titulo = "Jamroom: "+value.name+" Code: "+value.token;
		 	});
		 })
		 .error(function(err){
		 	console.log(err);
		 });
	
	this.getIdOfBox = function(boxNum) {
	    return "box" + boxNum;
	};

	this.reshapeFull = function(parentw, parenth) {
	    return {
	        left:0,
	        top:0,
	        width:parentw,
	        height:parenth
	    };
	};

	this.reshapeTextEntryBox = function(parentw, parenth) {
	    return {
	        left:parentw/4,
	        top:parenth/4,
	        width:parentw/2,
	        height: parenth/4
	    };
	};

	this.reshapeTextEntryField = function(parentw, parenth) {
	    return {
	        width:parentw -40
	    };
	};

	this.margin = 20;

	this.reshapeToFullSize = function(parentw, parenth) {
	    var left, top, width, height;
	    var margin= 20;
	    if( parentw < parenth*room.aspectRatio){
	        width = parentw -margin;
	        height = width/room.aspectRatio;
	    }
	    else {
	        height = parenth-margin;
	        width = height*room.aspectRatio;
	    }
	    left = (parentw - width)/2;
	    top = (parenth - height)/2;
	    return {
	        left:left,
	        top:top,
	        width:width,
	        height:height
	    };
	};

	//
	// a negative percentLeft is interpreted as setting the right edge of the object
	// that distance from the right edge of the parent.
	// Similar for percentTop.
	//
	this.setThumbSizeAspect = function(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {
	    var width, height;
	    if( parentw < parenth*room.aspectRatio){
	        width = parentw * percentSize;
	        height = width/aspect;
	    }
	    else {
	        height = parenth * percentSize;
	        width = height*aspect;
	    }
	    var left;
	    if( percentLeft < 0) {
	        left = parentw - width;
	    }
	    else {
	        left = 0;
	    }
	    left += Math.floor(percentLeft*parentw);
	    var top = 0;
	    if( percentTop < 0) {
	        top = parenth - height;
	    }
	    else {
	        top = 0;
	    }
	    top += Math.floor(percentTop*parenth);
	    return {
	        left:left,
	        top:top,
	        width:width,
	        height:height
	    };
	};


	this.setThumbSize = function(percentSize, percentLeft, percentTop, parentw, parenth) {
	    return room.setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, room.aspectRatio);
	};

	this.setThumbSizeButton = function(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
	    return room.setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
	};


	this.sharedVideoWidth  = 1;
	this.sharedVideoHeight = 1;

	this.reshape1of2 = function(parentw, parenth) {
        return{
            left: (parentw - room.sharedVideoWidth)/2 - (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };
	};



	this.reshape2of2 = function(parentw, parenth){
        return{
            left: ((parentw - room.sharedVideoWidth)/2) + (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };
	};

	this.reshape1of3 = function(parentw, parenth) {
        return{
            left: (parentw - room.sharedVideoWidth)/2 - (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2 - room.sharedVideoHeight/1.8,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };
	};

	this.reshape2of3 = function(parentw, parenth){
        return{
            left: ((parentw - room.sharedVideoWidth)/2) + (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2 - room.sharedVideoHeight/1.8,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };

	};

	this.reshape3of3 = function(parentw, parenth) {
        return{
            left: (parentw - room.sharedVideoWidth)/2,
           	top:  (parenth - room.sharedVideoHeight)/2 + room.sharedVideoHeight/1.8,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };
    }

	this.reshape1of4 = function(parentw, parenth) {
        return {
            left: (parentw - room.sharedVideoWidth)/2 - (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2 - room.sharedVideoHeight/1.8,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };
	}

	this.reshape2of4 = function(parentw, parenth) {
	    return {
            left: ((parentw - room.sharedVideoWidth)/2) + (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2 - room.sharedVideoHeight/1.8,
	        width: room.sharedVideoWidth,
	        height: room.sharedVideoHeight
	    };
	};

	this.reshape3of4 = function(parentw, parenth) {
        return {
            left: (parentw - room.sharedVideoWidth)/2 - (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2 + room.sharedVideoHeight/1.8,
            width: room.sharedVideoWidth,
            height: room.sharedVideoHeight
        };
	};

	this.reshape4of4 = function(parentw, parenth) {
	    return {
            left: ((parentw - room.sharedVideoWidth)/2) + (room.sharedVideoWidth/1.8),
            top:  (parenth - room.sharedVideoHeight)/2 + room.sharedVideoHeight/1.8,
	        width: room.sharedVideoWidth,
	        height: room.sharedVideoHeight
	    };
	};

	this.boxUsed = [true, false, false, false,false];
	this.connectCount = 0;


	this.setSharedVideoSize = function(parentw, parenth) {
	    room.layout = ((parentw / room.aspectRatio) < parenth)?'p':'l';
	    var w, h;
	    function sizeBy(fullsize, numVideos) {
	        return (fullsize - room.margin*(numVideos+1) )/numVideos;
	    }
	    switch(room.layout+(room.connectCount+1)) {
	        case 'p1':
	        case 'l1':
	            w = sizeBy(parentw, 1);
	            h = sizeBy(parenth, 1);
	            break;
	        case 'l2':
	            w = sizeBy(parentw, 2);
	            h = sizeBy(parenth, 1);
	            break;
	        case 'p2':
	            w = sizeBy(parentw, 1);
	            h = sizeBy(parenth, 2);
	            break;
	        case 'p4':
	        case 'l4':
	        case 'l3':
	            w = sizeBy(parentw, 2);
	            h = sizeBy(parenth, 2);
	            break;
	        case 'p3':
	            w = sizeBy(parentw, 1);
	            h = sizeBy(parenth, 3);
	            break;
	    }
	    room.sharedVideoWidth = Math.min(w, h * room.aspectRatio);
	    room.sharedVideoHeight = Math.min(h, w/room.aspectRatio);
	};

	this.reshapeThumbs = [
	    function(parentw, parenth) {
	        if( room.activeBox > 0 ) {
	            return room.setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
	        }
	        else {
	            room.setSharedVideoSize(parentw, parenth);
	            switch(room.connectCount) {
	                case 0:return room.reshapeToFullSize(parentw, parenth);
	                case 1:return room.reshape1of2(parentw, parenth);
	                case 2:return room.reshape1of3(parentw, parenth);
	                case 3:return room.reshape1of4(parentw, parenth);
	            }
	        }
	    },
	    function(parentw, parenth) {
	        if( room.activeBox >= 0 || !room.boxUsed[1]) {
	            return room.setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
	        }
	        else{
	            switch(room.connectCount) {
	                case 1:
	                    return room.reshape2of2(parentw, parenth);
	                case 2:
	                    return room.reshape2of3(parentw, parenth);
	                case 3:
	                    return room.reshape2of4(parentw, parenth);
	            }
	        }
	    },
	    function(parentw, parenth) {
	        if( room.activeBox >= 0 || !room.boxUsed[2] ) {
	            return room.setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
	        }
	        else  {
	            switch(room.connectCount){
	                case 1:
	                    return room.reshape2of2(parentw, parenth);
	                case 2:
	                    if( !room.boxUsed[1]) {
	                        return room.reshape2of3(parentw, parenth);
	                    }
	                    else {
	                        return room.reshape3of3(parentw, parenth);
	                    }
	                case 3:
	                    return room.reshape3of4(parentw, parenth);
	            }
	        }
	    },
	    function(parentw, parenth) {
	        if( room.activeBox >= 0 || !room.boxUsed[3]) {
	            return room.setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
	        }
	        else{
	            switch(connectCount){
	                case 1:
	                    return room.reshape2of2(parentw, parenth);
	                case 2:
	                    return room.reshape3of3(parentw, parenth);
	                case 3:
	                    return room.reshape4of4(parentw, parenth);
	            }
	        }
	    }

	];


	this.killButtonReshaper = function(parentw, parenth) {
	    var imagew = 128;
	    var imageh = 128;
	    if( parentw < parenth) {
	        return room.setThumbSizeButton(0.1, -.51, -0.01, parentw, parenth, imagew, imageh);
	    }
	    else {
	        return room.setThumbSizeButton(0.1, -.01, -.51, parentw, parenth, imagew, imageh);
	    }
	};

	this.muteButtonReshaper = function(parentw, parenth) {
	    var imagew = 32;
	    var imageh = 32;
	    if( parentw < parenth) {
	        return room.setThumbSizeButton(0.10, -.51, 0.01, parentw, parenth, imagew, imageh);
	    }
	    else {
	        return room.setThumbSizeButton(0.10, 0.01, -.51, parentw, parenth, imagew, imageh);
	    }
	};

	this.reshapeTextEntryButton = function(parentw, parenth) {
	    var imagew = 32;
	    var imageh = 32;
	    if( parentw < parenth) {
	        return room.setThumbSizeButton(0.10, .51, 0.01, parentw, parenth, imagew, imageh);
	    }
	    else {
	        return room.setThumbSizeButton(0.10, 0.01, .51, parentw, parenth, imagew, imageh);
	    }
	}


	this.handleWindowResize = function() {
	    room.connectCount = easyrtc.getConnectionCount();
	};

	this.collapseToThumbHelper = function() {
	    if( room.activeBox >= 0) {
	        var id = room.getIdOfBox(room.activeBox);
	        document.getElementById(id).style.zIndex = 2;
	        room.activeBox = -1;
	    }
	};

	this.collapseToThumb = function() {
	    room.collapseToThumbHelper();
	    room.activeBox = -1;
	    room.updateMuteImage(false);
	    room.handleWindowResize();
	};

	this.updateMuteImage = function(toggle) {
	    var muteButton = document.getElementById('muteButton');
	    if( room.activeBox > 0) { // no kill button for self video
	        muteButton.style.display = "block";
	        var videoObject = document.getElementById( room.getIdOfBox(activeBox));
	        var isMuted = videoObject.muted?true:false;
	        if( toggle) {
	            isMuted = !isMuted;
	            videoObject.muted = isMuted;
	        }
	        muteButton.src = isMuted?"/images/button_unmute.png":"/images/button_mute.png";
	    }
	};


	this.expandThumb = function(whichBox) {
	    var lastActiveBox = room.activeBox;
	    if( room.activeBox >= 0 ) {
	        room.collapseToThumbHelper();
	    }
	    if( lastActiveBox !== whichBox) {
	        var id = room.getIdOfBox(whichBox);
	        room.activeBox = whichBox;
	        document.getElementById(id).style.zIndex = 1;
	        if( whichBox > 0) {
	            document.getElementById('muteButton').style.display = "block";
	            room.updateMuteImage();
	            document.getElementById('killButton').style.display = "block";
	        }
	    }
	    room.updateMuteImage(false);
	    room.handleWindowResize();
	};

	this.prepVideoBox = function(whichBox) {
	    var id = room.getIdOfBox(whichBox);
	    document.getElementById(id).onclick = function() {
	        room.expandThumb(whichBox);
	    };
	}


	this.killActiveBox = function() {
	    if( room.activeBox > 0) {
	        var easyrtcid = easyrtc.getIthCaller(activeBox-1);
	        room.collapseToThumb();
	        setTimeout( function() {
	            easyrtc.hangup(easyrtcid);
				Socket.emit('leaveChat',sockJamroom);
	            $location.path('/home');
	        }, 400);
	    }else{
			$location.path('/home');
	    }
	}


	this.muteActiveBox = function() {
		alert('Entro en mute');
	}

	this.callEverybodyElse = function(roomName, otherPeople) {

	    easyrtc.setRoomOccupantListener(null, null); // so we're only called once.

	    room.list = [];
	    room.connectCount = 0;

	    for(var i in otherPeople ) {
	        room.list.push(i);
	    }

	    //
	    // Connect in reverse order. Latter arriving people are more likely to have
	    // empty slots.
	    //
	    function establishConnection(position) {
	        function callSuccess() {
	            room.connectCount++;
	            if( room.connectCount < room.maxCALLERS && position > 0) {
	                establishConnection(position-1);
	            }
	        }
	        function callFailure(errorCode, errorText) {
	            easyrtc.showError(errorCode, errorText);
	            if( room.connectCount < room.maxCALLERS && position > 0) {
	                establishConnection(position-1);
	            }
	        }
	        easyrtc.call(room.list[position], callSuccess, callFailure);

	    }
	    if( room.list.length > 0) {
	        establishConnection(room.list.length-1);
	    }
	};


	this.loginSuccess = function() {
	    console.log("Successfully connected");
	    room.expandThumb(0);  // expand the mirror image initially.
	};

	this.loginFailure = function(errorCode, errorText ) {
	    easyrtc.showError(errorCode, errorText);
	};


	this.cancelText = function() {
	    document.getElementById('textentryBox').style.display = "none";
	    document.getElementById('textEntryButton').style.display = "block";
	};


	this.sendText = function(e) {
	    document.getElementById('textentryBox').style.display = "none";
	    document.getElementById('textEntryButton').style.display = "block";
	    var stringToSend = document.getElementById('textentryField').value;
	    if( stringToSend && stringToSend !== "") {
	        for(var i = 0; i < room.maxCALLERS; i++ ) {
	            var easyrtcid = easyrtc.getIthCaller(i);
	            if( easyrtcid && easyrtcid !== "") {
	                easyrtc.sendPeerMessage(easyrtcid, "img", stringToSend);
	            }
	        }
	    }
	    return false;
	};


	this.showTextEntry = function() {
	    document.getElementById('textentryField').value = "";
	    document.getElementById('textentryBox').style.display = "block";
	    document.getElementById('textEntryButton').style.display = "none";
	    document.getElementById('textentryField').focus();
	}


	this.showMessage = function(startX, startY, content) {
	    var fullPage = document.getElementById('fullpage');
	    var fullW = parseInt(fullPage.offsetWidth);
	    var fullH = parseInt(fullPage.offsetHeight);
	    var centerEndX = .2*startX + .8*fullW/2;
	    var centerEndY = .2*startY + .8*fullH/2;

	    var cloudObject = document.createElement("img");
	    cloudObject.src = "/images/cloud.png";
	    cloudObject.onload = function() {
	        cloudObject.style.left = startX + "px";
	        cloudObject.style.top = startY + "px";
	        cloudObject.style.width = "4px";
	        cloudObject.style.height = "4px";
	        cloudObject.style.opacity = 0.7;
	        cloudObject.style.zIndex = 5;
	        cloudObject.className = "transit boxCommon";
	        fullPage.appendChild(cloudObject);
	        var textObject;
	        function removeCloud() {
	            if( textObject) {
	                fullPage.removeChild(textObject);
	                fullPage.removeChild(cloudObject);
	            }
	        }
	        setTimeout(function() {
	            cloudObject.style.left = centerEndX - fullW/4 + "px";
	            cloudObject.style.top = centerEndY - fullH/4+ "px";
	            cloudObject.style.width = (fullW/2) + "px";
	            cloudObject.style.height = (fullH/2) + "px";
	        }, 10);
	        setTimeout(function() {
	            textObject = document.createElement('div');
	            textObject.className = "boxCommon";
	            textObject.style.left = Math.floor(centerEndX-fullW/8) + "px";
	            textObject.style.top = Math.floor(centerEndY) + "px";
	            textObject.style.fontSize = "36pt";
	            textObject.style.width = (fullW*.4) + "px";
	            textObject.style.height = (fullH*.4) + "px";
	            textObject.style.zIndex = 6;
	            textObject.appendChild( document.createTextNode(content));
	            fullPage.appendChild(textObject);
	            textObject.onclick = removeCloud;
	            cloudObject.onclick = removeCloud;
	        }, 1000);
	        setTimeout(function() {
	            cloudObject.style.left = startX + "px";
	            cloudObject.style.top = startY + "px";
	            cloudObject.style.width = "4px";
	            cloudObject.style.height = "4px";
	            fullPage.removeChild(textObject);
	        }, 9000);
	        setTimeout(function(){
	            fullPage.removeChild(cloudObject);
	        }, 10000);
	    };
	};

	this.messageListener = function(easyrtcid, msgType, content) {
	    for(var i = 0; i < room.maxCALLERS; i++) {
	        if( easyrtc.getIthCaller(i) === easyrtcid) {
	            var startArea = document.getElementById(getIdOfBox(i+1));
	            var startX = parseInt(startArea.offsetLeft) + parseInt(startArea.offsetWidth)/2;
	            var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;
	            room.showMessage(startX, startY, content);
	        }
	    }
	}


	this.appInit = function() {
	    // Prep for the top-down layout manager
	    for(var i = 0; i < room.numVideoOBJS; i++) {
	        room.prepVideoBox(i);
	    }

	    room.updateMuteImage(false);
	    window.onresize = room.handleWindowResize;
	    room.handleWindowResize(); //initial call of the top-down layout manager

	    // easyrtc.setVideoBandwidth(20);
	    easyrtc.setSocketUrl('http://bandmeter.com:8080');
	    easyrtc.setRoomOccupantListener(room.callEverybodyElse);
	    easyrtc.easyApp("easyrtc.room", "box0", ["box1", "box2", "box3","box4"], room.loginSuccess, room.loginFailure);
	    easyrtc.setPeerListener(room.messageListener);
	    easyrtc.setDisconnectListener( function() {
	        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
	    });
	    easyrtc.setOnCall( function(easyrtcid, slot) {
	        room.boxUsed[slot+1] = true;
	        if(room.activeBox === 0 &&  easyrtc.getConnectionCount() === 1) { // first connection
	            room.collapseToThumb();
	        }
	        room.handleWindowResize();
	    });


	    easyrtc.setOnHangup(function(easyrtcid, slot) {
	    	alert("Ha colgado alguien la llamada");
	        room.boxUsed[slot+1] = false;
	        console.log("hanging up on " + easyrtcid);
	        if(room.activeBox > 0 && slot+1 === room.activeBox) {
	            room.collapseToThumb();
	        }
	        setTimeout(function() {
	            document.getElementById(room.getIdOfBox(slot+1)).style.visibility = "hidden";

	            if( easyrtc.getConnectionCount() === 0 ) { // no more connections
	                room.expandThumb(0);
	                document.getElementById('textEntryButton').style.display = 'none';
	                document.getElementById('textentryBox').style.display = 'none';
	            }
	            room.handleWindowResize();
	        },20);
	    });
	};
	room.appInit();
  });
})();