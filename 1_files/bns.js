/* global.js
------------------------------------------------------------------------------*/
function getCookie(cookieName){
var cookies=document.cookie;
if(cookies.indexOf(cookieName)==-1)return false;
cookie=cookies.substr(cookies.indexOf(cookieName));
cookie=cookie.split(';')[0];
cookie=cookie.substr(cookie.indexOf('=')+1);
return cookie;
}
function getStyleAtt(obj,stylePrp){
var att="";
if(obj.currentStyle){
stylePrp=stylePrp.replace(/\-(\w)/g,function(k,z){return z.toUpperCase();});
att=obj.currentStyle[stylePrp];
}
else if(document.defaultView&&document.defaultView.getComputedStyle){
att=document.defaultView.getComputedStyle(obj,null).getPropertyValue(stylePrp);
}
return att;
}

function setCookie( name, value, expiredays )
{
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; domain=.plaync.com;expires=" + todayDate.toGMTString() + ";"
 }

//popup
function openPopup(obj,objWidth,objHeight,objName,objScroll,deny,objFull,addParam){
try{
	if (objScroll!==1&&objScroll!==0&&objScroll!=='1'&&objScroll!=='0') {
		var objScrollCopy=objScroll;
		objScroll=objName;
		objName=objScrollCopy;
	}

	if(typeof(obj)=='string'){
		var setup="width="+objWidth+",height="+objHeight+",toolbar=no,location=no,status=no,menubar=no,top=20,left=20,scrollbars="+objScroll+",resizable=no";
		if(objName==""||!objName)objName="popup";
		if(objFull)setup="fullscreen=1,scrollbars=0";
		var win=window.open(obj,objName,setup);
		if(win!=null)
		win.focus();
		return win;
	}
	if(!objName)objName="popup";
	if(!objScroll)objScroll="auto";
	var url=addParam?obj.href+'?'+addParam:obj.href;
	var setup="width="+objWidth+",height="+objHeight+",toolbar=no,location=no,status=no,menubar=no,top=20,left=20,scrollbars="+objScroll+",resizable=no";
	if(objFull)setup="fullscreen=1,scrollbars=0";
	var win=window.open(url,objName,setup);
	if(deny){
	if(win==null)alert('팝업 차단을 해제하여 주시기 바랍니다.');
	else win.focus();
	}

	return win;
}
catch(e){}
}

/* bns.js
------------------------------------------------------------------------------*/
/* 롤링배너 develop by dentibes */
	var rollingData = function( option ) {
		this.opt = option || {};
		this.init();
	};
	rollingData.prototype = {
		init: function() {
			if ( !this.opt.banner ) {
				return;
			}
			this.old = this.ing = this.loop = null;
			this.opt.time = this.opt.time || 4000;
			this.now = this.opt.startAt || 0;
			this.opt.fn = this.opt.fn || [ 'basic' ];
			this.opt.term = this.opt.term || 0;
			this.prepare();
		},
		prepare: function() {
			$( this.opt.banner + ' .hidden').remove();
			$( this.opt.banner ).find( this.opt.bannerFind ).hide().has( 'img[src="about:blank"]' ).remove();
			this.banners = $( this.opt.banner ).find( this.opt.bannerFind );
			this.total = this.banners.length - 1;

			this.pager = $( this.opt.page );

			if (this.total <1) this.pager.hide()
			else this.pager.show();



			if (  $(this.opt.banner).is('#mainRollBanner')    ) {
				for ( var i = 0, ins = $( this.opt.page + ' .paging' ); i <= this.total; i++ ) {
				//ins.append( '<a href="' + $(this.banners[i]).find("a").attr("href") + '">' + i + '</a>' );    // 2012-06-08 cherryai
					ins.append( '<a>' + i + '</a>' );
				}
				this.pages = $( this.opt.page + ' .paging a');

				//console.log (  $(this.banners)  );
				$('#mainRollBanner').on('mouseenter', function(e) {
					$('#mainRollBannerPager').find('button').show();

				});

				$('#mainRollBanner').on('mouseleave', function(e) {
					var el = e.target;
					if ( $(el).is('#mainRollBannerPager') ) return;
					$('#mainRollBannerPager').find('button').hide();
				});

				$('#mainRollBannerPager').on('mouseenter', function(e){
					$('#mainRollBannerPager').find('button').show();

				});


			} else {

				for ( var i = 0, ins = $( this.opt.page ); i <= this.total; i++ ) {
				//ins.append( '<a href="' + $(this.banners[i]).find("a").attr("href") + '">' + i + '</a>' );    // 2012-06-08 cherryai
					ins.append( '<a>' + i + '</a>' );
				}
				this.pages = $( this.opt.page + ' a');
			}


			var _this = this;
			this.loop = function() {
				_this.old = _this.now;
				_this.now = _this.now >= _this.total ? 0 : _this.now + 1;
				if(!_this.total) return;
				_this.eff();
				_this.ing = setTimeout( _this.loop, _this.opt.time );
			}
			this.evtBind();
			this.start();
		},
		evtBind: function() {
			var _this = this;
			$( [this.pages, this.banners] ).each(function() {
				var target = this;
				target.bind({
					mouseover: function() { on( target, target.index( this ) ) },
					focusin: function() { on( target, target.index( this ) ) },
					mouseout: restart,
					focusout: restart
				});
			});
			function on( target, index ) {
				_this.stop();
				if ( target === _this.pages && _this.now !== index ) {
					_this.old = _this.now;
					_this.now = index;
					_this.eff();
				}
			}
			function restart() { _this.ing = setTimeout( _this.loop, _this.opt.time ) }

			//$(this.opt.banner).find('.prevPage').bind('click', function() {
			$(this.opt.page).find('.prevPage').bind('click', function() {
				_this.prev();
			});
			//$(this.opt.banner).find('.nextPage').bind('click', function() {
			$(this.opt.page).find('.nextPage').bind('click', function() {
				_this.next();
			});
		},
		start: function() {
			this.eff();
			this.banners.eq( this.now ).show();
			this.pages.eq( this.now ).attr( 'class', this.addOn );

			var me = this;
			setTimeout( function(){
				me.ing = setTimeout( me.loop, me.opt.time );
			}, this.opt.term );
		},
		eff: function() {
			for ( var i = 0; i < this.opt.fn.length; i++ ) {
				if ( this[ this.opt.fn[i] ] ) {
					this[ this.opt.fn[i] ]();
				}
			}
			if ( this.ing ) {
				this.pages.eq( this.old ).attr( 'class', this.rmvOn );
				this.pages.eq( this.now ).attr( 'class', this.addOn );
			}
		},
		stop: function() { clearTimeout( this.ing ); },
		addOn: function( i, v ) { if(!v) v=""; return v + 'on'; },
		rmvOn: function( i, v ) { if(!v) v=""; return v.replace( 'on', '' ); },
		basic: function() {
			if ( !this.ing ) {
				return;
			}
			this.banners.eq( this.old ).hide();
			this.banners.eq( this.now ).show();
		},
		next: function() {
			this.stop();
			this.old = this.now;
			this.now = this.now >= this.total ? 0 : this.now + 1;
			this.eff();
			this.ing = setTimeout( this.loop, this.opt.time );
		},
		prev: function() {
			this.stop();
			this.old = this.now;
			this.now = this.now <= 0 ? this.total : this.now - 1;
			this.eff();
			this.ing = setTimeout( this.loop, this.opt.time );
		}
	};
	rollingData.prototype.fadeInOut = function() {
		if ( !this.ing ) {
			this.banners.show().css({ 'zIndex' : '0', 'opacity' : 0 });
			this.banners.eq( this.now ).css({ 'zIndex' : '2', 'opacity' : 1 });
			return;
		}
		var _this = this;
		this.banners.eq( this.now ).css( 'zIndex', '2' ).animate( { 'opacity': 1 }, {
			duration: 1000,
			queue: false
		});
		this.banners.eq( this.old ).css( 'zIndex', '1' ).animate( { 'opacity': 0 }, {
			duration: 1000,
			queue: false,
			complete: function() {
				$( this ).css( { 'zIndex': '0' } );
			}
		});
	};

/* 게시판 */
var device = null;
device = $("html").attr("id");
var viewer, imageIdx = 0;

function popView(src, idx) {
	if (device == "noob") {
		srcOrgin = src.replace( '/download_mobile/', '/download/' );
		srcOrgin = srcOrgin.replace( '/download_thumbnail/', '/download/' );
		document.location.href = "/board/viewImage?url=" + srcOrgin;
	} else {
		return false;
	}
}

function resizeImage(img){
	var maxImageWidth = 300;//$(".viewArticle").width();
	if(img.width > maxImageWidth) {
		img.style.width = maxImageWidth + 'px';
		img.width = maxImageWidth;
	}
}

function checkLoginLink(before,after) {
	if (isLoginFlag == "Y"){ urlText = before;}
	else {urlText = after;}
	if(url) location.href = urlText;
}


//prev, next button scrolling 2067
(function( $ ){
$( document ).ready( function(){
	var cssObj = {},
		hideTimeout = 0,
		$window = $( window ), $body = $( 'body' ),
		$prevViewBtn = $( '.prevView' ),
		$nextViewBtn = $( '.nextView' );

	var setPosition = function(){
		var $viewArticle = $( '.viewArticle' );
		var	windowHeight = $window.height(),
			scrollTop = $window.scrollTop() || document.documentElement.scrollTop;

		var top = parseInt( ( windowHeight / 2 ) + scrollTop ),
			articleH = $viewArticle.height();

		if( top > articleH )
			top = articleH;

		if( $prevViewBtn.length ){
			cssObj.top = top;
			$prevViewBtn.stop().animate( cssObj, 100 );

		}

		if( $nextViewBtn.length ){
			cssObj.top = top;
			$nextViewBtn.stop().animate( cssObj, 100 );
		}
	};

	var showButton = function(){
		$prevViewBtn.show();
		$nextViewBtn.show();
	};

	var hideButton = function(){
		hideTimeout = setTimeout(function(){
			$prevViewBtn.fadeOut();
			$nextViewBtn.fadeOut();
		}, 3000);
	};

	$( window ).scroll( function( e ){
		clearTimeout( hideTimeout );
		showButton();
		setPosition();
		hideButton();
	});

	setPosition();
});
})( jQuery );