var BnsWeb = (function (W, $) {
	W.cookieEnabled = function () {
		return document.cookie.length > 0;
	};
	W.jsonp = function (url, method, params, callback){
		var data=params || {};
		data._=new Date().getTime();
		$.ajax({
			type:method, url:url, data:data, dataType:'jsonp', jsonpCallback:callback,
			beforeSend: function () {},
			complete: function (xhr, textStatus) {},
			success: function (response, textStatus, xhr) {},
			error: function (xhr, textStatus, errorThrown) {}
		});
	};
	return W;
}(BnsWeb || {}, jQuery));

BnsWeb.Sandbox = (function (S, $) {
	var _domain = '';
	var _area = null;
	var _api = {
		'MINI_PROFILE':'/profile.jsonp'
	};
	S.connect = function (domain) {
		_domain = domain;
	};
	S.introText = function (user, element) {
		_area = element;
		if (_area instanceof jQuery == false) _area = $(element);
		BnsWeb.jsonp(_domain + '/' + user + _api.MINI_PROFILE, 'get', null, 'BnsWeb.Sandbox._appendIntro');
	};
	S._appendIntro = function (response) {
		var intro = null;
		try { intro = response.profile.prflIntroTxt; } catch (e) {}
		if (intro == null || intro == '') intro = '자기 소개가 없습니다.';
		_area.text(intro);
	};
	return S;
}(BnsWeb.Sandbox || {}, jQuery));

BnsWeb.Login = (function (L, $) {
	var _loginForm=_id=_pwd=_friendPage=null;
	var _layerLoginForm=_layerId=_layerPwd=null;
	var _reload=false;
	function _validateLoginForm () {
		var value = _id.val();
		value = value.replace(/^\s+|\s+$/g, '');
		_id.val(value);
		if (value == '') {
			alert('계정을 입력해 주세요.');
			_id.focus();
			return false;
		}
		
		value = _pwd.val();
		value = value.replace(/^\s+|\s+$/g, '');
		_pwd.val(value);
		if (value == '') {
			alert('비밀번호를 입력해 주세요.');
			_pwd.focus();
			return false;
		}
		return true;
	}
	function _validateLoginLayer () {
		var value = _layerId.val();
		value = value.replace(/^\s+|\s+$/g, '');
		_layerId.val(value);
		if (value == '') {
			alert('계정을 입력해 주세요.');
			_layerId.focus();
			return false;
		}
		
		value = _layerPwd.val();
		value = value.replace(/^\s+|\s+$/g, '');
		_layerPwd.val(value);
		if (value == '') {
			alert('비밀번호를 입력해 주세요.');
			_layerPwd.focus();
			return false;
		}
		if (_loginForm != null) _layerLoginForm.find('input:[name="ukey"]').val(_loginForm.find('input:[name="ukey"]').val());
 
		return true;
	}
	
	function _removeCookie(cookieId) {
		var exp = new Date();
		exp.setTime(exp.getTime()-1);
		document.cookie = cookieId + "=" + ";expires=" + exp.toGMTString() + "; path=/;domain=plaync.com";
	}
	function _doLogin () {
		if (BnsWeb.cookieEnabled() == false) {
			alert('쿠키 설정 확인을 해 주세요.');
			return;
		}
		_removeCookie('DEF_LOGIN_SVC');
		if (_validateLoginForm() == true) {
			var href = window.location.href;
			_loginForm.find('input:[name="return_url"]').val(href);
			_loginForm.find('input:[name="cancel_url"]').val(href);
			_loginForm.find('input:[name="site_id"]').val(0);
			try { loginKey(); } catch (e) {}
			_loginForm.submit();
		}
	}
	function _layerDoLogin () {
		if (BnsWeb.cookieEnabled() == false) {
			alert('쿠키 설정 확인을 해 주세요.');
			return;
		}
		if (_validateLoginLayer() == true) {
			var href = window.location.href;
			_layerLoginForm.find('input:[name="return_url"]').val(href);
			_layerLoginForm.find('input:[name="cancel_url"]').val(href);
			_layerLoginForm.find('input:[name="site_id"]').val(0);
			_layerLoginForm.submit();
		}
	}
	L.loginAndGo = function (returnPath, loginURL) {
		
		alert("로그인 후 이용하실 수 있습니다.");
		var returnUrl = "http://" + document.domain + returnPath;
		var cancelUrl = document.location.href;
		var param = "?return_url=" + returnUrl + "&cancel_url=" + cancelUrl + "&site_id=0";
		document.location.href = loginURL + param;
		
		/* 20121102 :: 로그인 레이어 호출 
		bnsLayerLogin();
		*/
	};
	L.loginArea = function (loginArea) {
		$.ajax({
			type:'post', url:'/login/loginarea', cache:false,
			beforeSend: function () {
			},
			success: function (response) {
				$(loginArea).html(response);
			},
			complete: function (response) {}
		});
	};
	L.setReloadChangingCharacter = function (reload) {
		_reload = reload;
	};
	L.changeCharacter = function (loginArea, character) {
		$.ajax({
			type:'post', url:'/login/change', data:{'cn':character}, cache:false,
			beforeSend: function () {
			},
			success: function (response) {
				if (_reload == true) {
					window.location.reload();
					return false;
				}
				$(loginArea).replaceWith(response);
			},
			complete: function (response) {}
		});
	};
	L.setNextFriends = function (p) {
		_friendPage = p;
	};
	L.friends = function (area) {
		if (_friendPage == null) return;
		var data={};
		data.p=_friendPage;
		data._=parseInt((new Date().getTime())/(1000*60));
		$.ajax({
			type:'get', url:'/login/friendsall',
			beforeSend: function () {
			},
			success: function (response) {
				var areaCtx = $(area);
				areaCtx.append(response);
				areaCtx.find('img.lazy').lazyload({
					container:areaCtx
				});
			},
			complete: function (response) {}
		});
	};
	L.members = function (area) {
		var data={};
		data._=parseInt((new Date().getTime())/(1000*60));
		$.ajax({
			type:'get', url:'/login/members', data:data,
			beforeSend: function () {
			},
			success: function (response) {
				$(area).append(response);
			},
			complete: function (response) {}
		});
	};
	L.bindLoginFormEvent = function (loginAreaId) {
		var login = $(loginAreaId);
		var button = login.find('input:[name="login"]');
		_id = login.find('input:[name="id"]');
		_pwd = login.find('input:[name="pwd"]');
		_loginForm = login.find('form');
		_id.on({
			focusin : function () {
				checkLoginPlugin();
				var ctx = $(this);
				if (ctx.val() == '') ctx.removeClass();
			},
			focusout : function () {
				var ctx = $(this);
				if (ctx.val() == '') ctx.addClass('user_id');
			},
			keypress : function (e) {
				if (e.which == 13) {
					var value = _id.val();
					value = value.replace(/^\s+|\s+$/g, '');
					_id.val(value);
					if (value == '') {
						alert('계정을 입력해 주세요.');
						_id.focus();
						return false;
					}
					_pwd.focus();
					return false;
				}
			}
		});
		_pwd.on({
			focusin : function () {
				checkLoginPlugin();
				var ctx = $(this);
				if (ctx.val() == '') ctx.removeClass();
			},
			focusout : function () {
				var ctx = $(this);
				if (ctx.val() == '') ctx.addClass('user_pwd');
			},
			keypress : function (e) {
				if (e.which == 13) {
					_doLogin();
					return false;
				}
			}
		});
		button.click(function () {
			_doLogin();
			return false;
		});
	};
	L.bindLoginLayerForm = function (loginAreaId) {
		var login = $(loginAreaId);
		var button = login.find('input:[name="login"]');
		_layerId = login.find('input:[name="id"]');
		_layerPwd = login.find('input:[name="pwd"]');
		_layerLoginForm = login.find('form');
		_layerId.on({
			keypress : function (e) {
				if (e.which == 13) {
					var value = _layerId.val();
					value = value.replace(/^\s+|\s+$/g, '');
					_layerId.val(value);
					if (value == '') {
						alert('계정을 입력해 주세요.');
						_layerId.focus();
						return false;
					}
					_layerPwd.focus();
					return false;
				}
			}
		});
		_layerPwd.on({
			keypress : function (e) {
				if (e.which == 13) {
					_layerDoLogin();
					return false;
				}
			}
		});
		button.click(function () {
			_layerDoLogin();
			return false;
		});
	};
	L.bindMemberFormEvent = function (memberId) {
		var member = $(memberId);
		var findId = member.find('a:[name="findid"]');
		var findPwd = member.find('a:[name="findpwd"]');
		findId.click(function () {
			var ctx = $(this);
			openPopup(ctx.attr('href'), 540, 420, 'findid', 0, 1);
			return false;
		});
		findPwd.click(function () {
			var ctx = $(this);
			openPopup(ctx.attr('href'), 540, 420, 'findpwd', 0, 1);
			return false;
		});
	};
	L.loggedInFriendCount = function (area) {
		$.ajax({
			type:'get', url:'/login/loggedInFriendCount', cache:false, 
			beforeSend: function () {
			},
			success: function (response) {
				$(area).html(response);
			},
			complete: function (response) {}
		});
	};
	L.couponCount = function (area) {
		$.ajax({
			type:'get', url:'/login/couponCount', cache:false, 
			beforeSend: function () {
			},
			success: function (response) {
				$(area).html(response);
			},
			complete: function (response) {}
		});
	};
	return L;
}(BnsWeb.Login || {}, jQuery));

function GNBBNSData() {
	try {
		(function($) {
			var response = jQuery.ajax({type:"get", url:"1", cache:false, async:false}).responseText;
			var jsonObj = jQuery.parseJSON(response);
			ncGNB.myData( {"returnCode" : jsonObj.returnCode, "ncoin" : jsonObj.ncoin, "npoint" : jsonObj.npoint, "ngrade" : jsonObj.ngrade} );
		})(jQuery);
	} catch(e) {
		ncGNB.myData( {"returnCode" : "500", "ncoin" : "0", "npoint" : "0", "ngrade" : "0"} );
	}
}

BnsWeb.AppOpenerNew = (function (A, $) {
    
	var _config = {
            appName: "CAT 메신저",
            iosAppLink: "http://itunes.apple.com/kr/app/ncmesinjeo/id512119346",
            scheme: 'ncm',
            commands: "message",
            andPackage: "com.ncsoft.android.apps.ncm"
    };
	
	var global = (function(){ return this || (0,eval)('this'); }());
    var uagentLow = navigator.userAgent.toLocaleLowerCase();
    var isIos = (/iphone|ipad/gi).test(uagentLow);
    var isAndroid = (/android/gi).test(uagentLow);
    var isChrome = uagentLow.search("chrome") > -1;
   
    function objectToParams (_obj) {
        var str = '';
        for (var key in _obj) {
            str += ((str != '')? '&': '') + key + '=' + encodeURIComponent(_obj[key]);
        }
        return str;
    }

    function makeIFrame () {
        var tempIFrame = document.getElementById( '_applink_' );
        if (!tempIFrame) {
            tempIFrame = document.createElement( 'iframe' );
            tempIFrame.id = '_applink_';
            tempIFrame.style.display = 'none';
            document.body.appendChild( tempIFrame );
        }
        return tempIFrame;
    }
    
    A.excute = function(_param) {
    	_param = (typeof _param == 'object')? objectToParams(_param): '';

        var conf =  _config;
        if(isAndroid && isChrome){
            window.location = 'intent://' + conf.commands + '?' + _param + '#Intent;scheme='+ conf.scheme +';package=' + conf.andPackage + ';end';
            //console.log('test : ', 'intent://' + conf.commands + '?' + _param + '#Intent;scheme='+ conf.scheme +';package=' + conf.andPackage + ';end');
        }else{
            var iFrm = makeIFrame ();
            iFrm.src = conf.scheme + '://' + conf.commands + '?' + _param;
            A.install();
        }
    };
    
    A.install = function() {
    	 var openAt = +new Date;
         var conf =  _config;

         setTimeout( function() {
             if (+new Date - openAt < 2000) {
                 if (confirm( conf.appName + " 설치를 위해 "+(isAndroid? "Google": "App")+" Store를 실행하시겠습니까?" )) {
                     document.location.href = isAndroid? 'market://details?id=' + conf.andPackage: conf.iosAppLink;
                     return false;
                 }
             }
         }, 1500);
    };
    
    return A;
}(BnsWeb.AppOpenerNew || {}, jQuery));


var isIos = (/iphone|ipad/gi).test(navigator.userAgent);
var isAndroid = (/android/gi).test(navigator.userAgent);
var iosAppLink = "http://itunes.apple.com/kr/app/ncmesinjeo/id512119346";
var androidAppLink = "market://details?id=com.ncsoft.android.apps.ncm";
function sendNCMessage(userId, targetUserId, targetUserAlias) {
	BnsWeb.AppOpenerNew.excute({'guid':targetUserId, 'web_login_guid':userId});
	
	/*
	var baseTime = new Date();

	if (isIos) {
		document.location.href = "ncm://message?web_login_guid=" + userId + "&guid=" + targetUserId;
		window.location = 'intent://message?' + _param + '#Intent;scheme='+ conf.scheme +';package=' + conf.andPackage + ';end';
	} else if (isAndroid) {
		var linkDiv = $("#appLinkDiv");
		linkDiv.append("<iframe src='ncm://message?web_login_guid=" + userId + "&guid=" + targetUserId + "' width='0' height='0' frameborder='0'></iframe>");

		setTimeout(function() {
			var elements = linkDiv.find("iframe");

			if (elements.length > 0) {
				elements.remove();
			}
		}, 1000);
	}

	installApp(baseTime, targetUserAlias);
	*/
}
function installApp(baseTime, userAlias) {
	setTimeout(function() {
		if (1500 > new Date() - baseTime) {
			var msg = "CAT메신저를 설치하면 " + userAlias + "님과\n1:1 대화가 가능합니다.\nCAT메신저를 설치해보세요.";
			if (typeof userAlias == "undefined") {
				msg = "CAT메신저를 설치하면 친구와\n1:1 대화가 가능합니다.\nCAT메신저를 설치해보세요.";
			}
			if (!confirm(msg)) {
				return false;
			}
			if (isIos) {
				document.location.href = iosAppLink;
				return false;
			} else if (isAndroid) {
				document.location.href = androidAppLink;
				return false;
			}
		}
	}, 1000);
}

var myPostList = function(response, ncstatic) {
	if (typeof response.data.records != 'undefined') {
		var postArray = response.data.records[0].mail;
		var postArrayLength = postArray.length;
		if (postArrayLength == 0) {
			$('#list_post').html('<h1>우편</h1><article class="noneArticle tyEmpty"><h2>받은 우편이 없습니다.</h2><a class="btnGoPost" href="/bs/me/character/postoffice">우편함 바로가기</a></article>');
		} else {
			$('#list_post').html('<h1>우편</h1><article class="article1"><header><h2>최근 우편 4건까지 확인하실 수 있습니다.</h2><a class="btnGoPostMore" href="/bs/me/character/postoffice" title="더보기">더보기 &gt;</a></header><table cellspacing="0" cellpadding="0"><colgroup><col width="40" /><col width="90" /><col width="*" /></colgroup><tbody></tbody></article>');
			if (postArrayLength > 4) {
				postArrayLength = 4;
			}
			for (var i=0; i<postArrayLength; i++) {
				var title = postArray[i].title;
				var sender = postArray[i].sender.characterName;
				var amount = postArray[i].attachments.length;
				var name = '';
				if (amount > 0) {
					for (var j in postArray[i].attachments) {
						var item = postArray[i].attachments[j].name;
						if (item == 'MONEY') {
							item = '';
							var money = postArray[i].attachments[j].amount;
							var gold = Math.floor(money / 10000);
							var silver = Math.floor((money % 10000) / 100);
							var bronze = money % 100;
							if (gold > 0) {	item += gold + '금 '; }
							if (silver > 0) { item += silver + '은 '; }
							if (bronze > 0) { item += bronze + '동'; } 
						}
						name += item;
						if (j < postArray[i].attachments.length-1) {
							name += ', ';
						}
					}
				}
				
				if (postArray[i].messageType == 'MARKET_ITEM') {
					iconImg = ncstatic + '/world/marketItem.jpg';
					alt = '경매장 물품';
				} else if (postArray[i].messageType == 'COMMON_ITEM') {
					iconImg = ncstatic + '/world/userMulti.jpg';
					alt =  '물품과 메세지';
					title = postArray[i].sender.characterName + '님이 <em>' + amount + '개의 물품</em>(' + name + ')을 보냈습니다.';
				} else if (postArray[i].messageType == 'MARKET_CASH') {
					iconImg = ncstatic + '/world/marketCash.jpg';
					alt = '경매장 물품';
				} else if (postArray[i].messageType == 'COMMON_CASH') {
					iconImg = ncstatic + '/world/marketCash.jpg';
					alt = '돈';
					title = postArray[i].sender.characterName + '님이 <em>' + name + '</em>을 보냈습니다.';
				} else if (postArray[i].messageType == 'COMMON_MESSAGE') {
					iconImg = ncstatic + '/world/userMail.jpg';
					alt = '메세지';
				}
				$('#list_post .article1 tbody').append('<tr><td class="postBox"><div><span class="iconImg"><img src="' + iconImg + '" alt="' + alt + '" title="' + alt + '" /></span></div></td><th class="name">' + sender + '</th><td class="info">' + title + '</td></tr>');								
			}	
		}
	}
};
