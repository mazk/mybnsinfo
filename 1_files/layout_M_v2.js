/****  mobile ****/
var
	// Browser capabilities
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isPlaybook = (/playbook/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

	hasTouch = 'ontouchstart' in window && !isTouchPad;

/****  PC 공용 ****/

//tab
var tabCtrl = function(btnID, layerID, viewNum, motion) {
	var tabBtn = jQuery(btnID);
	var tabLayer = jQuery(layerID);
	var tabMotion = motion;

	tabBtn.find('span').eq(viewNum).addClass('on');
	tabLayer.eq(viewNum).show();

	tabBtn.bind(tabMotion, function(){
		var et = tabBtn.index(this)+1;
		jQuery(this).siblings().find('span').removeClass('on');
		jQuery(this).find('span').addClass('on');

		tabLayer.hide();
		if (this.className=='m'+et) tabLayer.eq(et-1).show();
	});
};

//layer ( input 레이어 )
var layerInputCtrl = function(btnID, layerID) {
	var layerBtn = jQuery(btnID);
	var layerCnt = jQuery(layerID);

	layerCnt.find(':radio').each(function(e){
		if ( jQuery(this).is(':checked') ){
			jQuery(this).parents('li').addClass('selected');
			layerBtn.html( jQuery(this).parent('label').text() );
			//alert( $(this).prop({checked: true}).val() );
		}
	});

	layerBtn.bind("click", function(){
		//$(this).addClass('lyOn'); //레이어가 보일때
		//layerCnt.show();
		if ( layerCnt.css('display') == 'block' ) {
			jQuery(this).removeClass('lyOn');
			layerCnt.hide();
		} else {
			jQuery(this).addClass('lyOn');
			layerCnt.show();
		}
	});

	layerCnt.find('li').bind("click", function(e){
		var et = jQuery(e.target);

		layerCnt.find('li').removeClass('selected');
		layerCnt.find(':radio').removeAttr('checked');

		layerBtn.html( jQuery(this).find('label').text() );
		layerBtn.removeClass('lyOn');
		jQuery(this).find(':radio').attr('checked', 'checked');
		et.parents('li').addClass('selected');
		layerCnt.hide();
		return false;
	});

	jQuery(document).bind("click", function(e){
		var et = jQuery(e.target);
		var etid = et.attr('id');

		if ( etid != layerBtn.attr('id') ) {
			layerBtn.removeClass('lyOn');
			layerCnt.hide();
		}
	});
};

//문파 checkbox img
var checkboxCtrl = function(btnID) {
	var checkBtn = jQuery(btnID).find('input:checkbox');
	checkBtn.bind("click", function(){
		if ( !jQuery(this).is(':checked') ) {
			jQuery(this).parent('label').removeClass('checked');
		} else {
			jQuery(this).parent('label').addClass('checked');
		}
	});
};

//캐릭터 radio img
var radioCtrl = function(btnID) {
	var checkBtn = jQuery(btnID).find('input:radio');
	checkBtn.bind("click", function(){
		//alert('1');
		checkBtn.parent('label').removeClass('checked');
		if ( !jQuery(this).is(':checked') ) {
			jQuery(this).parent('label').removeClass('checked');
		} else {
			jQuery(this).parent('label').addClass('checked');
		}
	});
};

/* nc app download */
function ncAppDownload(appName) {
	var baseTime = new Date();

	if (isIDevice) {
		document.location.href = "ncm://friendList";
	} else if (isAndroid) {
		var linkDiv = $("#appLinkDiv");
		linkDiv.append("<iframe src='ncm://friendList' width='0' height='0' frameborder='0'></iframe>");

		setTimeout(function() {
			var elements = linkDiv.find("iframe");

			if (elements.length > 0) {
				elements.remove();
			}
		}, 1000);
	}

	installApp(baseTime);
}

function installApp(baseTime) {
	setTimeout(function() {
		if (1500 > new Date() - baseTime) {
			if (isIDevice) {
				if (confirm("CAT 메신저 설치를 위해 App Store를 실행하시겠습니까?")) {
					document.location.href = "http://itunes.apple.com/kr/app/ncmesinjeo/id512119346";
					return false;
				}
			} else if (isAndroid) {
				if (confirm("CAT 메신저 설치를 위해 Google Store를 실행하시겠습니까?")) {
					document.location.href = "market://details?id=com.ncsoft.android.apps.ncm";
					return false;
				}
			}
		}
	}, 1000);
}

/* nc app download
function ncAppDownload(appName) {
	url = "";
	//IOS
	if(isIDevice) {
		if (appName == "ncmessager") url = "http://itunes.apple.com/kr/app/ncmesinjeo/id512119346";
	}
	//안드로이드
	if(isAndroid) {
		if (appName == "ncmessager") url = "https://play.google.com/store/apps/details?id=com.ncsoft.android.apps.ncm";
	}
	if(url) window.open(url);
}
*/
// Common Var
if (location.href.indexOf('/rc.') == -1) {
	var bns_path = "http://bns.plaync.com";
	var bns_m_path = "http://m.bns.plaync.com";
	var sns_path ='http://sandbox.plaync.com/$!/bns';
	var search_path ='http://search.plaync.co.kr/bns';
	var power_path ='http://power.plaync.co.kr/bns';
	var qna_path ='http://qna.plaync.co.kr/bns';
	var bnsshop_path ='http://nshop.plaync.com/bns/';
	var trainingSimulator_path ='http://bns.training.plaync.com/bnstr/board/';
} else {
	var bns_path = "http://rc.bns.plaync.com";
	var bns_m_path = "http://rc.m.bns.plaync.com";
	var sns_path ='http://rc.sandbox.plaync.com/$!/bns';
	var search_path ='http://rc.search.plaync.co.kr/bns';
	var power_path ='http://rc.power.plaync.co.kr/bns';
	var qna_path ='http://rc.qna.plaync.co.kr/bns';
	var bnsshop_path ='http://rc.nshop.plaync.com/bns/';
	var trainingSimulator_path ='http://rc.bns.training.plaync.com/bnstr/board/';
}

/* sidebar and friendbar */
/*
(function(d){d.revealSidebarManager={_sidebar:[],add:function(d){this._sidebar.push(d)},open:function(d){for(var c=0,h=this._sidebar.length;h>c;c++)d!==this._sidebar[c]&&this._sidebar[c].off()}};d.revealSidebar=function(k){var c={},h=d.Callbacks(),l=d.Callbacks(),p=d.Callbacks(),m=d.Callbacks(),i={},j={},n={},o={},a={isLeft:!0,isOpen:!1,sideWidth:0,buttons:null,sidebar:null,content:null,onBeforeOpen:null,onBeforeClose:null,onOpen:null,onClose:null},e=d("<div />");c.init=function(){d.extend(a,k);"function"===
	typeof a.onOpen&&h.add(a.onOpen);"function"===typeof a.onClose&&l.add(a.onClose);"function"===typeof a.onBeforeOpen&&p.add(a.onBeforeOpen);"function"===typeof a.onBeforeClose&&m.add(a.onBeforeClose);var b=a.sideWidth=!a.sideWidth?a.sidebar.width():a.sideWidth;a.isLeft?a.sidebar.css("left",-b+"px"):(a.sidebar.css("right",-b+"px"),a.sidebar.css("display","none"));a.content.parent().append(e.css({position:"absolute",top:"0",display:"none"}))};var q=function(){var a=d(document).width(),c=d(window).width();
	return a>c?a:c},f=function(){var a=d(document).height(),c=d(window).height();return a>c?a:c},s=function(b){b.preventDefault();c.setHeight();var b={},d=e.is(":visible"),g=a.sideWidth;d&&e.hide();b.height=f();b.width=q()-g;a.isLeft?b.left=g:b.right=g;e.css(b);d&&e.show()};c.setHeight=function(b){a.sidebar.css("height",b?b:f());e.css("height",b?b:f())};c.off=function(){var b=i,c=j;a.isOpen&&(m.fire(),a.content.css(b),a.sidebar.css(c),_coverPanelanel.hide(),l.fire(),a.isOpen=!1)};c.onoff=function(){var b=
	i,r=j,g=n,k=o;f();a.isOpen?(m.fire(),a.content.animate(b,200),a.sidebar.animate(r,200,function(){a.isLeft||a.sidebar.css("display","none");l.fire();e.hide();a.isOpen=!1})):(d.revealSidebarManager.open(c),p.fire(),a.isLeft||a.sidebar.css("display","block"),a.content.animate(g,200),a.sidebar.animate(k,200,function(){var c=a.sideWidth,b={};b.height=f();b.width=q()-c;a.isLeft?b.left=c:b.right=c;h.fire();e.css(b);e.show();a.isOpen=!0}))};c.addEvent=function(){var b=a.sideWidth,d=b+"px",b=-b+"px";a.isLeft?
	(i={marginLeft:0,width:"100%"},j={left:b},n={marginLeft:d,width:"100%"},o={left:0}):(i={marginLeft:0,width:"100%"},j={right:b},n={marginLeft:b,width:"100%"},o={right:0});a.buttons.on("click",function(a){a.preventDefault();c.onoff();return false});e&&e.on("click",function(a){a.preventDefault();c.onoff();return false});window.addEventListener("resize",s,!1)};c.init();c.addEvent();c.setHeight();d.revealSidebarManager.add(c);return c}})(jQuery);
*/
!function(e){e.revealSidebarManager={_sidebar:[],add:function(e){this._sidebar.push(e)},open:function(e){for(var n=0,i=this._sidebar.length;i>n;n++)e!==this._sidebar[n]&&this._sidebar[n].off()}},e.revealSidebar=function(n){var i={},t=e.Callbacks(),o=e.Callbacks(),s=e.Callbacks(),a=e.Callbacks(),r={closeContent:{},closeSidebar:{},openContent:{},openSidebar:{}},d={isLeft:!0,isOpen:!1,sideWidth:0,buttons:null,sidebar:null,content:null,onBeforeOpen:null,onBeforeClose:null,onOpen:null,onClose:null},f=e("<div />");i.init=function(){e.extend(d,n),"function"==typeof d.onOpen&&t.add(d.onOpen),"function"==typeof d.onClose&&o.add(d.onClose),"function"==typeof d.onBeforeOpen&&s.add(d.onBeforeOpen),"function"==typeof d.onBeforeClose&&a.add(d.onBeforeClose);var i=d.sideWidth=d.sideWidth?d.sideWidth:d.sidebar.width();d.isLeft?(d.sidebar.css("left",-i+"px"),d.sidebar.css("display","none")):(d.sidebar.css("right",-i+"px"),d.sidebar.css("display","none")),d.content.parent().append(f.css({position:"absolute",top:"0",display:"none"}))};var l=function(){var n=e(document).width(),i=e(window).width();return n>i?n:i},c=function(){var n=e(document).height(),i=e(window).height();return n>i?n:i},h=function(e){e.preventDefault(),i.setHeight();var n={},t=f.is(":visible"),o=d.sideWidth;t&&f.hide(),n.height=c(),n.width=l()-o,d.isLeft?n.left=o:n.right=o,f.css(n),t&&f.show()};return i.setHeight=function(e){d.sidebar.css("height",e?e:c()/2),f.css("height",e?e:c()/2)},i.off=function(){var e=r.closeContent,n=r.closeSidebar;r.openContent,r.openSidebar;d.isOpen&&(a.fire(),d.content.css(e),d.sidebar.css(n),_coverPanelanel.hide(),o.fire(),d.isOpen=!1)},i.onoff=function(){var n=r.closeContent,h=r.closeSidebar,p=r.openContent,u=r.openSidebar;c(),d.isOpen?(a.fire(),d.content.animate(n,200),d.sidebar.animate(h,200,function(){d.sidebar.css("display","none"),o.fire(),f.hide(),d.isOpen=!1})):(e.revealSidebarManager.open(i),s.fire(),d.sidebar.css("display","block"),d.content.animate(p,200),d.sidebar.animate(u,200,function(){var e=d.sideWidth,n={};n.height=c(),n.width=l()-e,d.isLeft?n.left=e:n.right=e,t.fire(),f.css(n),f.show(),d.isOpen=!0}))},i.addEvent=function(){var e=d.sideWidth,n=e+"px",t=-e+"px",o="100%";d.isLeft?(r.closeContent={marginLeft:0,width:o},r.closeSidebar={left:t},r.openContent={marginLeft:n,width:o},r.openSidebar={left:0}):(r.closeContent={marginLeft:0,width:o},r.closeSidebar={right:t},r.openContent={marginLeft:t,width:o},r.openSidebar={right:0}),d.buttons.on("click",function(e){return e.preventDefault(),i.onoff(),!1}),f&&f.on("click",function(e){return e.preventDefault(),i.onoff(),!1}),window.addEventListener("resize",h,!1)},i.init(),i.addEvent(),i.setHeight(),e.revealSidebarManager.add(i),i}}(jQuery);
(function($) {
	$(document).ready(function () {
		var isSideBarLoaded = false;

		if( $( '#btnSidebar , #btnMenuMore' ).length ){
			$.revealSidebar({
				isLeft: true,
				sideWidth: 262,
				buttons: $( '#btnSidebar , #btnMenuMore' ),
				content: $( '#container' ),
				sidebar: $( '#sidebar' ),
				/*onOpen: function(){},*/
				onBeforeOpen: function(){
					if( isSideBarLoaded ) return;
					isSideBarLoaded = true;
					if (location.href.indexOf('/UiDev') == -1) {
						$.ajax({type:'get', url:'/common/inc/sidebar', cache:false, success:function(response) {
							$( '#sidebar' ).html(response);

							//자동완성
							$(document).ready(function () {
								resetFn();
							});
							navDefault();
						}});
					} else {
						$.ajax({type:'get', url:'/api/UiDev/common/inc/sidebar', cache:false, success:function(response) {
							$( '#sidebar' ).html(response);
							navDefault();
						}});
					}
				}
			});
		};

		if( $( '#btnFriendbar' ).length ){
			$.revealSidebar({
				isLeft: false,
				sideWidth: 272,
				buttons: $( '#btnFriendbar' ),
				content: $( '#container' ),
				sidebar:  $( '#friendbar' ),
				onBeforeOpen: function(){
				/*
					if (location.href.indexOf('/UiDev') == -1) {
						$.ajax({type:'get', url:'/contents/my/mobile/friendbar', cache:false, success:function(response) {
							$('#friendbar').html(response);
						}});
					} else {
						$.ajax({type:'get', url:'/api/UiDev/common/inc/friendbar', cache:false, success:function(response) {
							$('#friendbar').html(response);
						}});
					}
				*/
				}
			});
		};
		//일반모드Call
		navDefault = function() {
			if($("#nav").hasClass("loading")) {
				$("#nav").removeClass("loading");
				loadMenu();
			} else {
				loadMenu();
			}
		};
		//메뉴리스트
		loadMenu = function(mode) {
			if (location.href.indexOf('/UiDev') == -1) {
				//$.ajax({type:'get', url:'/common/inc/sidebar_nav', cache:false, success:function(response) {
				$.ajax({type:'get', url: bns_m_path +'/api/menu/msidebar_nav', dataType:'jsonp', cache:false, success:function(response) {
					$('#nav').html(response.html);
				}});
			} else {
				$.ajax({type:'get', url:'/api/UiDev/common/inc/sidebar_nav', cache:false, success:function(response) {
					$('#nav').html(response);
				}});
			}
		};
	});
})(jQuery);

/* 동영상 */
(function($) {
  $(document).ready(function() {
	if (location.href.indexOf('bns.plaync.com') != -1) {
	  $('.movWrapG').each(function(i) {
		var checkId = $('.movWrapG:eq(' + i + ')').find('.movPlayerG').attr('id');
		if (isIDevice) {
		  $('.movWrapG:eq(' + i + ')').attr('style', '');
		  $('.movWrapG:eq(' + i + ')').find('.movPlayerG').hide();
		  $('.movWrapG:eq(' + i + ')').find('.webOnlyMediaObject').attr('style', '');
		}
		if (isAndroid) $('.movWrapG:eq(' + i + ')').find('.movPlayerG').show();
		if (checkId) {
		  var w = $('.movWrapG:eq(' + i + ')').find('.movPlayerG').width();
		  var h = $('.movWrapG:eq(' + i + ')').find('.movPlayerG').height();

		  if( w && h){
			  var ratio = w / h, winW = $( window ).width();
			  w = ( winW < w )? winW: w;
			  h = w / ratio;
		  }else{
			  w = 300;
			  h = 225;
		  }

		  w = 300;
		  h = 225;

			var innerHTML = "<iframe width=\""+ w +"\" height=\""+ h +"\" src=\"http://www.youtube.com/embed/" + checkId + "\" frameborder=\"0\" allowfullscreen></iframe>";
			//var innerHTML = "<iframe src=\"http://www.youtube.com/embed/" + checkId + "\" frameborder=\"0\" allowfullscreen></iframe>";
			$('.movWrapG:eq(' + i + ')').html(innerHTML);
		}
	  });
	}
  });
})(jQuery);

function bnsLayerLogin() {
	//var loginURL = "http://login.plaync.com/login/loginform";
	var loginURL = "https://mlogin.plaync.com/login/signin";
	var returnUrl = document.location.href;
	var param = "?return_url=" + returnUrl + "&site_id=0";
	document.location.href = loginURL + param;
}

/* search */
function customFn() {
	if (this.keyword.length === 0) {
		alert("검색어를 입력 해 주세요.");
		return false;
	} else {
		if (location.href.indexOf('/rc.') == -1) {
			location.href = "http://search.plaync.co.kr/bns/index.jsp?" + $.param({
				query : this.orgKeyword,
				where : this.options.param.where,
				site : this.options.param.site,
				pos : this.options.param.pos
			});
		} else {
			location.href = "http://rc.search.plaync.co.kr/bns/index.jsp?" + $.param({
				query : this.orgKeyword,
				where : this.options.param.where,
				site : this.options.param.site,
				pos : this.options.param.pos
			});
		}
	}
}

// 모바일 검색창 리셑 버튼
function resetFn() {
		var btn = jQuery(".searchBoxWrap .reset");
		var field = jQuery(".searchBoxWrap .inputBox");
		var checkInput = null;

		btn.bind("click", function () {
			btn.css('display', 'none');
			field.val("");
			field.focus();
			return false
		});

		field.focus( function(e){
			checkInput = setInterval( function(){
				if (field.val().length==0) {
					btn.css('display', 'none');
				} else {
					btn.css('display', 'block');
				}
			}, 300 );
		});

		field.blur(function(e){
			clearInterval( checkInput );
		});

		if( field.val().length != 0 ){
			btn.css('display', 'block');
		}
}

if( !window.nc ) nc = {};
if( !window.nc.ui ) nc.ui = {};
nc.ui.TextareaAutoScroll = (function( $ ) {

	var init = function( textarea ){
		var txt = $( '#' + textarea ),
			oFontH,
			clone, cloneH, cloneScrollH,
			timer;

		if( !txt.length ) return;

		if( txt[ 0 ].nodeName.toLowerCase() != 'textarea' ) return;

		clone = txt.clone();
		clone.removeAttr( 'id' ).removeAttr( 'name' ).css( { position:'absolute', top:0, left:-99999 } )
				.appendTo( 'body' );

		cloneH = Math.max( clone.height(), txt[ 0 ].offsetHeight );

		oFontH = parseInt( txt.css( 'fontSize' ) );

		txt.on( 'focus', function(){
			timer = setInterval(function(){
				clone.val( txt.val() );
				cloneScrollH = clone[ 0 ].scrollHeight;

				( cloneH < cloneScrollH )?
					txt.css( 'height', cloneScrollH + oFontH ):
					txt.css( 'height', cloneH );
			}, 100);
		});

		txt.on( 'blur', function(){
			clearInterval( timer );
		});
	};

	return function( textarea ){
		if( !textarea ) return;
		init( textarea );
	}
})( jQuery );
jQuery( document ).ready(function () {
	nc.ui.TextareaAutoScroll( 'xqEditor' );
});
