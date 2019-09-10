var BnsWeb = (function (W, $) {
	return W;
}(BnsWeb || {}, jQuery));

BnsWeb.Game = (function (G, $) {
	G.moneyObject = function (price) {
		var gold = parseInt(price / 10000);
		var silver = parseInt((price % 10000) / 100);
		var bronze = price % 100;
		return {'gold':gold,'silver':silver,'bronze':bronze};
	};
	G.moneyHtml = function (price) {
		var money = G.moneyObject(price);
		var html = '';
		if (money.gold > 0) html += '<span class="gold">' + parseInt(money.gold) + '</span> ';
		if (money.silver > 0) html += '<span class="silver">' +parseInt( money.silver) + '</span> ';
		if (money.bronze > 0) html += '<span class="bronze">' + parseInt(money.bronze) + '</span>';
		return html;
	};
	return G;
}(BnsWeb.Game || {}, jQuery));

BnsWeb.Stat = (function (S, $) {
	S.showPointsEffects = function(records) {
		for (var idx in records) {
			$("#bonus-"+records[idx].type+" .split-bonus-list").append('<li class="disabled"><span class="bonus">'+records[idx].point+'</span> '+records[idx].description+'</li>');
		}
	},
	S.showAbilities = function (records, type) {
		for (var idx in records.base_ability) {
			if (typeof "#"+type+"-stat #base-"+idx != "undefined") {
				$("."+type+"-stat #base-"+idx).text(records.base_ability[idx]);
				if (idx.indexOf("_rate") >= 0) $("."+type+"-stat #base-"+idx).append("%");
			}
		}
		for (var idx in records.equipped_ability) {
			if (typeof "#"+type+"-stat #equip-"+idx != "undefined") {	
				$("."+type+"-stat #equip-"+idx).text(records.equipped_ability[idx]);
				if (idx.indexOf("_rate") >= 0) $("."+type+"-stat #equip-"+idx).append("%");
			}
		}
		for (var idx in records.total_ability) {
			if (idx.indexOf("_level") >= 0) {
				$("."+type+"-stat #total-"+idx).text(records.total_ability[idx]+"단계");
			} else {
				if (typeof "#"+type+"-stat #total-"+idx != "undefined") {
					$("."+type+"-stat #total-"+idx).text(records.total_ability[idx]);
					if (idx.indexOf("_rate") >= 0) $("."+type+"-stat #total-"+idx).append("%");
				}
			}
		}

		if (type == 'me') {
			var defensePoint = 0;
			var offensePoint = 0;
			var defenseEffectCnt = 0;
			var offenseEffectCnt = 0;
			var effectType;
			for (var idx in records.point_ability) {
				if (idx == 'picks') {
					if (records.point_ability[idx] != null) {
						for (var pickIdx = 0 ; pickIdx < records.point_ability[idx].length ; pickIdx++) {

							if (records.point_ability[idx][pickIdx].point > 0) {
								$("#point-point_pick"+records.point_ability[idx][pickIdx].slot).text(records.point_ability[idx][pickIdx].point+"P").parent("span").removeClass("disabed");

								effectType = $("#point-point_pick"+records.point_ability[idx][pickIdx].slot).parent("div").parent("div").parent("div").attr("class");

								if (records.point_ability[idx][pickIdx].slot == 1 || records.point_ability[idx][pickIdx].slot == 4) {
									effectType = 'attack';
								} else {
									effectType = 'defense';
								}
								$("#effect-"+effectType).find(".split-select-list").append('<li><strong class="name effect-'+records.point_ability[idx][pickIdx].slot+'">'+records.point_ability[idx][pickIdx].name+' '+records.point_ability[idx][pickIdx].tier+'단계</strong><p class="text">'+records.point_ability[idx][pickIdx].description+'</p></li>');

								if (effectType == 'attack') {
									offenseEffectCnt++;
								} else if (effectType == 'defense') {
									defenseEffectCnt++;
								}
							}
						}
					}
				} else {
					$("."+type+"-stat #point-"+idx).text(records.point_ability[idx]);
					if (idx.indexOf("_point") >= 0) $("."+type+"-stat #point-"+idx).append("P");

					if (idx == 'offense_point') {
						offensePoint = records.point_ability[idx];
					}
					if (idx == 'defense_point') {
						defensePoint = records.point_ability[idx];
					}
				}
			}

			if (offenseEffectCnt > 0) {
				$("#effect-attack").show();
			}
			if (defenseEffectCnt > 0) {
				$("#effect-defense").show();
			}

			$(".me-stat #bonus-offense .split-bonus-list").find("li").each(function() {
				if (offensePoint >= parseInt($(this).find("span").text())) {
					$(this).removeClass("disabled");
				}
			});

			$(".me-stat #bonus-defense .split-bonus-list").find("li").each(function() {
				if (defensePoint >= parseInt($(this).find("span").text())) {
					$(this).removeClass("disabled");
				}
			});
		}

		return true;
	},
	S.compareAbilities = function () {
		$(".me-stat .stat-title .stat-point").each(function() {
			if (typeof $(this).attr("id") != "undefined") {
				var id = $(this).attr("id");

				var mePoint = parseInt($(".me-stat").find("#"+id).text().replace('단계', '').replace('%', ''));
				var otherPoint = parseInt($("#other-stat").find("#"+id).text().replace('단계', '').replace('%', ''));

				id = id.replace('total-', '');

				if (mePoint > otherPoint) {
					$(".me-stat").find("#compare-"+id).addClass("morethan");
				} else if (mePoint < otherPoint) {
					$(".me-stat").find("#compare-"+id).addClass("lessthan");
				} else {
					$(".me-stat").find("#compare-"+id).addClass("equal");
				}
			}
		});
	}
	return S;
}(BnsWeb.Stat || {}, jQuery));

BnsWeb.Equip = (function (E, $) {
	E.displayEquipments = function (records, type, charName) {
		var trId;
		var iconHtml;
		var nameHtml;

		for (var idx = 0 ; idx < records.length ; idx++) {
			if (records[idx].item != null) {
				var assetType = records[idx].asset_type;
				var equipType = records[idx].equipped_part;

				if (assetType != 'amulet') {				// 보패가 아닌 경우만
					if (records[idx].item.id > 0) {
						//trId = records[idx].asset_type + "-" + equipType;
						trId = $("#"+type+"items").find("#"+records[idx].asset_type + "-" + equipType);
	
						trId.find(".icon").find("span").remove();
	
						if (records[idx].asset_type == 'weapon') {
							trId.find(".icon").append("<p></p>");
							trId.find(".icon p").addClass("thumb itemLink").attr("data", '{"item":"'+type+'profile-'+equipType+'", "equipinfo":"equipped-'+records[idx].asset_type+'-'+records[idx].id+'", "set":"'+type+'set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}');
	
							if (equipType == 'pet') {
								if (records[idx].appearance != null && records[idx].appearance.id > 0) {
									trId.find(".icon p").append("<img></img>");
									trId.find(".icon p img").attr("src", records[idx].appearance.icon).attr("alt", records[idx].item.name).attr("title", records[idx].item.name).addClass("iconImg itemLink");
								} else {
									trId.find(".icon p").append("<img></img>");
									trId.find(".icon p img").attr("src", records[idx].item.icon).attr("alt", records[idx].item.name).attr("title", records[idx].item.name).addClass("iconImg itemLink");
								}
							} else {
								if (records[idx].appearance != null && records[idx].appearance.id > 0) {
									trId.find(".icon p").append("<span class=\"iconLook\">외형변경</span>");
								}
	
								trId.find(".icon p").append("<img></img>");
								trId.find(".icon p img").attr("src", records[idx].item.icon).attr("alt", records[idx].item.name).attr("title", records[idx].item.name).addClass("iconImg itemLink");
							}
	
						} else {
							trId.find(".icon").append("<img></img>");
							trId.find(".icon img").attr("src", records[idx].item.icon).attr("alt", records[idx].item.name).attr("title", records[idx].item.name).addClass("iconImg itemLink");
							trId.find(".icon img").attr("data", '{"item":"'+type+'profile-'+equipType+'", "equipinfo":"equipped-'+records[idx].asset_type+'-'+records[idx].id+'", "set":"'+type+'set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}');
						}
	
						trId.find(".name span").text(records[idx].item.name).removeClass("empty").addClass("grade_"+records[idx].item.grade+" itemLink").attr("data", '{"item":"'+type+'profile-'+equipType+'", "equipinfo":"equipped-'+records[idx].asset_type+'-'+records[idx].id+'", "set":"'+type+'set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}');
					}
				} else {				// 보패인 경우
					// 예비 보패가 아닌 경우
					if (equipType.indexOf("soulshield_") == 0) {
						$("#"+type+"charms .pos"+equipType.substring(equipType.lastIndexOf("_")+1)).append("<img src=\""+records[idx].item.icon_extra+"\" />");
						$("#"+type+"charms .mapsPos area").each(function() {
							if (equipType.substring(equipType.lastIndexOf("_")+1) == $(this).index()+1) {
								$(this).attr("data", '{"item":"'+type+'profile-'+equipType+'", "equipinfo":"equipped-'+records[idx].asset_type+'-'+records[idx].id+'", "set":"'+type+'set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}');
								$(this).attr("alt", records[idx].item.name);
								$(this).attr("title", records[idx].item.name);
								$(this).addClass("itemLink");
	
							}
						})
					}
				}
			}

			/*

			if (records[idx].asset_type == 'weapon') {
				iconHtml = '<p class="thumb itemLink" data=\'{"item":"profile-'+records[idx].equipped_part+'", "set":"set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}\'>';

				if (records[idx].equipped_part == 'pet') {
					if ("외형변경이면") {

					} else {
						iconHtml += '<img src="'+records[idx].item.icon+'" alt="'+records[idx].item.name+'" title="'+records[idx].item.name+'" class="iconImg itemLink" />';
					}
				} else {
					if ("외형변경이면") {
						iconHtml += '<span class="iconLook">외형변경</span>';
					}

					iconHtml += '<img src="'+records[idx].item.icon+'" alt="'+records[idx].item.name+'" title="'+records[idx].item.name+'" class="iconImg itemLink" />';
				}

			} else {
				iconHtml = '<img src="'+records[idx].item.icon+'" alt="'+records[idx].item.name+'" title="'+records[idx].item.name+'" data=\'{"item":"profile-'+records[idx].equipped_part+'","set":"set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}\' class="iconImg itemLink" />';
			}

			nameHtml = '<th class="name"><span class="'+records[idx].item.grade+' itemLink" data=\'{"item":"profile-'+records[idx].equipped_part+'","set":"set-'+((records[idx].item.set_item_code == null) ? "" : records[idx].item.set_item_code)+'"}\'>'+records[idx].item.name+'</span></th>';

			alert(iconHtml);
			*/
		}

		BnsWeb.Game.Item.initializeNew('#'+type+'items', '.itemLink, .name span', '', null, charName, type);
	},
	E.displaySoulshieldsAbilities = function (records, type) {
		var baseAbility = records.ability.base_ability;
		var extraAbility = records.ability.extra_ability;
		var setAbility = records.ability.set_ability;
		var baseVal = 0;
		var extraVal = 0;
		var setVal = 0;

		$("#"+type+"charms .lyCharmEffect table tr").each(function() {
			baseVal = parseInt(baseAbility[$(this).attr("id")]);
			extraVal = parseInt(extraAbility[$(this).attr("id")]);
			setVal = parseInt(setAbility[$(this).attr("id")]);

			if (baseVal + extraVal + setVal > 0) {
				$(this).find("td").html('<span class="current">'+(baseVal+extraVal+setVal)+'</span> ('+baseVal+' + <strong class="plus">'+extraVal+'</strong> + <strong class="plus">'+setVal+'</strong>)');
				$(this).show();

				if (type != "") {
					$("#"+type+"charms .charmEffect").find("#"+$(this).attr("id")).html(baseVal+extraVal+setVal);
				}
			}
		})

		var effects = records.effects;
		var description;

		if (effects != null && effects.length > 0) {

			for (var effectIdx in effects) {
				var affected = false;

				for (var actuationIdx in effects[effectIdx].actuations) {
					if (effects[effectIdx].actuations[actuationIdx].affected) {
						affected = true;
					}
				}

				if (affected) {
					$("#"+type+"charms .lyCharmEffect").append('<p class="description">'+effects[effectIdx].name+'</p>');
					$("#"+type+"charms .lyCharmEffect").append('<p class="setEffect" id="effect_'+effectIdx+'"></p>');

					for (var actuationIdx in effects[effectIdx].actuations) {
						description = "";
						if (typeof effects[effectIdx].actuations[actuationIdx].part_count != 'undefined') {
							$("#"+type+"charms .lyCharmEffect #effect_"+effectIdx).append('<strong>'+effects[effectIdx].actuations[actuationIdx].part_count+'세트</strong>&nbsp;');
							for (var i = 0 ; i < effects[effectIdx].actuations[actuationIdx].part_effects.length ; i++) {
								if (effects[effectIdx].actuations[actuationIdx].affected) {
									description += (effects[effectIdx].actuations[actuationIdx].part_effects[i].skill_name != null) ? effects[effectIdx].actuations[actuationIdx].part_effects[i].skill_name : "";
									description += " " + effects[effectIdx].actuations[actuationIdx].part_effects[i].description;
									if (i < effects[effectIdx].actuations[actuationIdx].part_effects.length-1) {
										description += "<br/>";
									}
								}
							}

							$("#"+type+"charms .lyCharmEffect #effect_"+effectIdx).append(description+"<br/>");
						}
					}
				}
			}
		} else {
			$('.lyCharmEffect table').html('<tr><td style="text-align:center;padding:25px 0;background-color:#f6f6f6;">착용한 보패가 없습니다.</div</td></tr>');
		}
	}

	return E;
}(BnsWeb.Equip || {}, jQuery));

BnsWeb.Game.Item = (function (G, I, $) {
	var _items = null, _profileLayer = null, _powerbook = null, _charInfo = null, _itemKey = null, _apiUrl = null, _posX, _posY;;
	var isMobile = false;
	function _initializeProfileLayer () {
		_profileLayer.html('<div class="itemLayer"><div class="itemBasicInfo"><a href="#" class="btnClose">닫기</a></div><div class="cnt"></div><div class="navigation"><a href="#" class="powerbook">파워북</a><a href="#" class="btnClose">닫기</a></div></div>');
		_profileLayer.find('.itemBasicInfo a.btnClose, .navigation a.btnClose').click(function () {
			_profileLayer.hide();
			return false;
		});
		_profileLayer.hide();
	}
	function _initializeProfileLayerWithRequestData(closeHander) {
		_profileLayer.html('<div class="itemLayer"><div class="itemBasicInfo"><a href="#" class="btnClose">닫기</a></div><div class="cnt"></div><div class="navigation"><a href="#" class="powerbook">파워북</a><a href="#" class="btnClose">닫기</a></div></div>');
		_profileLayer.find('.itemBasicInfo a.btnClose, .navigation a.btnClose').click(function() {
			closeHander();

			return false;
		});
		_profileLayer.hide();
	}
	function _showProfileLayer (pos) {
		if (isMobile !== true) {
			_profileLayer.css(pos);
		} else {
			docH =  $(document).innerHeight();
			_profileLayer.css({height:docH+"px"});
			_profileLayer.css({left:0});
			setTimeout(scrollTo,0,0,1);
		}
		_profileLayer.show();
	}
	function _hideProfileLayer () {
		_profileLayer.hide();
	}
	function _gemPosition (category) {
		var position = 0;
		switch (category) {
		case '감': position=1; break;		case '간': position=2; break;		case '진': position=3; break;		case '손': position=4; break;
		case '리': position=5; break;		case '곤': position=6; break;		case '태': position=7; break;		case '건': position=8; break;
		}
		return position;
	}
	function _isInSealedPrefixName (name) {
		var prefix = '봉인된';
		return name.indexOf(prefix) != -1;
	}
	function _isMyRaceItem(equipRace, characterRace, characterJob) {
		if (equipRace == characterRace || equipRace == '고양이' && characterJob == '소환사') {
			return true;
		}
		return false;
	}

	function _makeRandomSlotInfo(slotInfo) {
		var info = '';

		/*
		info += '<li class="info-sub">'+slotInfo.abilityText;
		if (slotInfo.valueEquipGem > 0) {
			info += '<span class="stat-point">'+slotInfo.valueTotal+'</span>';
			info += '('+slotInfo.valueAbility+'+<span class="stat-point">'+slotInfo.valueEquipGem+'</span>';
			if (slotInfo.isMax == 'true') {
				info += ' <span class="stat-icon">최대</span>';
			}
			info += ')';
		} else {
			info += slotInfo.valueTotal;
		}
		*/

		info += _makeInfo(slotInfo);

		if ((slotInfo.valueEquipGem > 0 && slotInfo.isMax == 'true' && slotInfo.valueMax <= slotInfo.valueAbility)
				|| (slotInfo.valueEquipGem == 0 && slotInfo.valueMax <= slotInfo.valueAbility)) {		// 최대 성장
			info += '<span class="info-limit">최대성장</span></li>';
		} else {
			info += '<span class="info-limit">최대 '+slotInfo.valueMax;
			if (slotInfo.valueEquipGem > 0) {
				info += '+<span class="stat-point">'+slotInfo.valueEquipGem+'</span>';
			}
			info +='</span></li>'
		}

		return info;
	}

	function _makeInfoList(subInfo) {
		var info = '';

		if (subInfo == null || subInfo.length == 0) {
			return '';
		}

		if (typeof subInfo == 'string') {
			info = '<li class="info-sub">'+subInfo+'</li>';
		} else {
			for (var i = 0 ; i < subInfo.length ; i++) {
				/*
				info += '<li class="info-sub">'+subInfo[i].abilityText;
				info += '<span class="stat-point">'+subInfo[i].valueTotal+'</span>';

				if (subInfo[i].valueEquipGem > 0) {
					info += '('+subInfo[i].valueAbility+'+<span class="stat-point">'+subInfo[i].valueEquipGem+'</span>';
					if (subInfo[i].isMax == 'true') {
						info += ' <span class="stat-icon">최대</span>';
					}
					info += ')';
				}

				info += '</li>'
				*/
				info += _makeInfo(subInfo[i]);
				info += '</li>';
			}
		}
		return info;
	}

	function _makeInfo(infoJson) {
		var info = '';

		info += '<li class="info-sub" id="order-'+infoJson.abilityOrder+'">'+infoJson.abilityText;
		if (infoJson.valueEquipGem > 0) {
			info += '<span class="stat-point">'+infoJson.valueTotal+'</span>';
			info += '('+infoJson.valueAbility+'+<span class="stat-point">'+infoJson.valueEquipGem+'</span>';
			if (infoJson.isMax == 'true') {
				info += ' <span class="stat-icon">최대</span>';
			}
			info += ')';
		} else {
			info += infoJson.valueTotal;
		}

		return info;
	}

	function subInfoSort() {
		var sr = _profileLayer.find('div.base ul');
		var lis = sr.children(".info-sub").get();

		lis.sort(function(a, b) {
			var idA = parseInt($(a).attr('id').replace('order-', ''));
			var idB = parseInt($(b).attr('id').replace('order-', ''));

			return (idA < idB) ? -1 : (idA > idB) ? 1 : 0;
		});

		$.each(lis, function(index, row) {
			sr.append(row);
		});
	}

	function _makeItemProfile (key, charName, items) {
		var jsonKey = $.parseJSON(key);
		//var json = _items.data(jsonKey.item);

		var layerItemJson = $(items).data(jsonKey.item);
		var layerSetJson = $(items).data(jsonKey.set);

		if (typeof layerItemJson != 'undefined' && layerItemJson != "") {
			_makeItemLayerFromJson(eval('('+layerItemJson+')'), eval('('+layerSetJson+')'));
		} else {
			jQuery.ajax({
				url : "1",
				dataType : "jsonp",
				type : "GET",
				xhrFields : {withCredentials:true},
				success: function (response) {
					$(items).data(jsonKey.item, response.item_json);
					$(items).data(jsonKey.set, response.set_item_json);

					_makeItemLayerFromJson(eval('('+response.item_json+')'), eval('('+response.set_item_json+')'));
				},
				error: function () { alert('잠시 후에 다시 이용해 주세요.'); }
			});
		}
	}

	function _makeItemLayerFromJson(json, setItem) {
		var isSealed = (typeof json.isSealed != 'undefined' && json.isSealed == 'true') ? true : false;

		
		_profileLayer.find('.itemBasicInfo').html('<a href="#" class="btnClose">닫기</a>');
		_profileLayer.find('.cnt').html("");

		
		if (typeof json.equippedPosition != 'undefined' && json.equippedPosition != 'NONE') _profileLayer.find('.itemBasicInfo').append('<p class="status">장착중</p>');
		else if (typeof json.category != 'undefined' && json.category.category1 == '소비물품') _profileLayer.find('.itemBasicInfo').append('<p class="status">소비물품</p>');
		else _profileLayer.find('.itemBasicInfo').append('<p class="status"></p>');

		var itemName = json.name;
		if (isSealed == true && !_isInSealedPrefixName(itemName)) itemName = '봉인된 ' + itemName;
		if (typeof json.grade != 'undefined') _profileLayer.find('.itemBasicInfo').append('<h1 class="grade_' + json.grade.code + '">' + itemName + '</h1>');
		else _profileLayer.find('.itemBasicInfo').append('<h1>' + itemName + '</h1>');

		var growthStepType = '';
		var growthLevel = 1;
		if (typeof json.growth != 'undefined' && typeof json.growth.canGrowth != 'undefined') {
			if (json.growth.canGrowth == false && json.growth.maxLevel == true) growthStepType = 'evolution2';
			else if (json.growth.canGrowth == true && json.growth.maxLevel == false && json.growth.gauge == 100) growthStepType = 'evolution1';
			else growthStepType = 'itemLv'+json.growth.level;

			growthLevel = json.growth.level;
			//var gauge = parseInt(240*json.growth.gauge/100); gauge = gauge > 240 ? 240 : gauge;
			var gauge = json.growth.gauge;
			_profileLayer.find('.itemBasicInfo').addClass('itemLevel');
			_profileLayer.find('.itemBasicInfo').append('<div class="'+growthStepType+' itemLevelInfo"><p class="thumb"><span>아이템 레벨 : '+json.growth.level+'</span></p><div class="levelgauge"><span class="bar" style="width:'+gauge+'%;"></span><span class="text">'+json.growth.percent+'%</span></div></div>');
		}

		var iconUrl = json.icon;
		var isLocked = false;
		var lockInfo = '';
		if (typeof json.onlyPCCafe != 'undefined' && json.onlyPCCafe == true) lockInfo = '<span class="iconLock Pcbang">PC방 아이템 제한</span>';
		if (typeof json.sequestration != 'undefined' && json.sequestration == true) lockInfo = '<span class="iconLock Seize">압류</span>';
		lockInfo = (lockInfo == '' && isSealed == true) ? '<span class="iconLock Seal">봉인해제</span>' : '';
		if (isSealed == false && _charInfo != null && typeof json.equipType != 'undefined') {
			if (isLocked == false && typeof json.equipType.equipSex != 'undefined' && json.equipType.equipSex != '' && json.equipType.equipSex != 'all' && json.equipType.equipSex != _charInfo.sex) isLocked = true;
			if (isLocked == false && typeof json.equipType.equipRace != 'undefined' && json.equipType.equipRace != '' && json.equipType.equipRace != 'all' && _isMyRaceItem(json.equipType.equipRace, _charInfo.race, _charInfo.job) == false ) isLocked = true;
			if (isLocked == false && typeof json.equipType.equipJobRefine != 'undefined' && json.equipType.equipJobRefine != '' && json.equipType.equipJobRefine.indexOf(_charInfo.job) == -1) isLocked = true;
			if (isLocked == false && typeof json.equipType.equipFaction != 'undefined' && json.equipType.equipFaction != '' && json.equipType.equipFaction != _charInfo.faction) isLocked = true;
			if (isLocked == false && typeof json.isWearable == false) isLocked = true;
			if (isLocked == true) lockInfo = '<span class="iconLock Job">착용 불가</span>';
		}
		if (lockInfo == '' && (growthStepType == 'evolution1' || growthStepType == 'evolution2')) lockInfo = '<span class="itemLv '+growthStepType+'"><span>아이템 레벨 : '+growthLevel+'</span></span>';
		if (typeof json.sequestration != 'undefined' && json.sequestration == true) lockInfo = '<span class="iconLock Seize">압류</span>';

		if (isSealed == false && isLocked == false) {
			if (_charInfo != null && typeof json.level != 'undefined' && json.level != '0' && parseInt(json.level) > parseInt(_charInfo.level)) lockInfo = '<span class="iconLock Level">레벨제한</span>';
			if (json.isAppearance == 'true') {		// 외형 변경
				if (typeof json.equippedPosition != 'undefined' && json.equippedPosition == 'guardian') {
					iconUrl = json.appearanceIcon;
				} else {
					lockInfo = '<span class="iconLook">외형변경</span>';
				}
			}

			if (lockInfo == '' && typeof json.timeLimit != 'undefined' && json.timeLimit.type == 'DURATION') {		// 기간제 아이템
				lockInfo = '<span class="iconLock Period">기간제아이템</span>';
			}
		}

		if(typeof json.gemType != 'undefined' && json.gemType != '') {
			_profileLayer.find('.cnt').append('<div class="itemStat cntTy1"><div class="base"><p class="thumb">'+lockInfo+'<img src="'+iconUrl+'" /></p></div><div class="wrapGem"></div></div>');
		} else {
			_profileLayer.find('.cnt').append('<div class="itemStat cntTy1"><div class="base"><p class="thumb">'+lockInfo+'<img src="'+iconUrl+'" /></p></div></div>');
		}

		var sealedInfo = '';
		if (typeof json.decomposeName != 'undefined' && isSealed == true) {
			sealedInfo = json.decomposeName + ' ';
			if (json.decomposeItemCount > 1) sealedInfo += json.decomposeItemCount + '개';
			sealedInfo += ' 필요';
			_profileLayer.find('div.base').append('<li class="first">' + sealedInfo + '</li>');
		}

		var info = '';
		var info = '';

		if (isSealed == false) {
			if (json.gemType != null && json.gemType.indexOf('gem') >= 0) {
				if (json.gemType == 'random-stat-equip-gem') {					// 랜덤보패인 경우
					info = '<li class="info-base">'+json.randomMainInfo.abilityText+' '+json.randomMainInfo.valueAbility;
					if (json.randomMainInfo.valueMax <= json.randomMainInfo.valueAbility) {		// 최대 성장
						info += '<span class="info-limit">최대성장</span></li>';
					} else {
						info += '<span class="info-limit">최대 '+json.randomMainInfo.valueMax+'</span></li>';
					}
				} else {
					if (typeof json.mainInfo != 'undefined') {
						info = _makeInfoList(json.mainInfo).replace('info-sub', 'info-base');
					}
				}
			} else {
				if (typeof json.mainInfo != 'undefined' && json.mainInfo != null) {//악세서리일 경우 <li class="first"> ->first삭제
					info = json.mainInfo.split('<br/>').join('</li><li>').split('max').join('<span class="max">최대</span>');
				}
			}
		}

		if (typeof json.identifyMainInfo != 'undefined') info = json.identifyMainInfo.split('<br/>').join('</li><li class="first">').split('<Image Imagesetpath="00015590.Tag_Random" enablescale="true" scalerate="1.2"/>').join('<span class="max">무작위</span>');
		_profileLayer.find('div.base').append('<ul><li class="first">'+info+'</li></ul>');

		if (typeof json.identifySubInfo != 'undefined') {
			info = json.identifySubInfo.split('<br/>').join('</li><li>').split('<Image Imagesetpath="00015590.Tag_Random" enablescale="true" scalerate="1.2"/>').join('<em>무작위</em>');
			_profileLayer.find('div.base ul').append('<li class="opRandom">' + info + '</li>');
		}

		info = "";

		if (isSealed == false) {
			if (json.gemType != null && json.gemType.indexOf('gem') >= 0) {
				if (json.gemType == 'random-stat-equip-gem') {					// 랜덤보패인 경우
					if (typeof json.mainInfo != 'undefined' && json.mainInfo.length > 1) {
						for (var i = 1 ; i < json.mainInfo.length ; i++) {
							info += _makeInfo(json.mainInfo[i]);
							info += '</li>';
						}
					}

					info += _makeRandomSlotInfo(json.randomSub1Info);
					info += _makeRandomSlotInfo(json.randomSub2Info);

					if (json.randomSub1Info.valueEquipGem == 0 && json.randomSub2Info.valueEquipGem == 0 && typeof json.subInfo != 'undefined') {
						//info += json.subInfo.split('<br/>').join('</li><li>').split('max').join('<em>최대</em>');
						info += _makeInfoList(json.subInfo);
					}

					_profileLayer.find('div.base ul').append(info).addClass("itemStatInfo")

					subInfoSort();

				} else {
					if (typeof json.subInfo != 'undefined') {
						info = _makeInfoList(json.subInfo);
						_profileLayer.find('div.base ul').append(info).addClass("itemStatInfo");

						subInfoSort();
					}
				}
			} else {
				if (typeof json.subInfo != 'undefined') {
					info = json.subInfo.split('<br/>').join('</li><li>').split('max').join('<em>최대</em>');
					_profileLayer.find('div.base ul').append('<li class="opMax">' + info + '</li>');
				}
			}
		}

		var itemStatDesc = "";
		var itemSkillName = "";
		if (typeof json.description7 != 'undefined') {
			itemStatDesc = json.description7;
		}
		if (typeof json.itemSkillInfo != 'undefined') {
			/*
			if (typeof json.itemSkillInfo.desc != 'undefined') {
				for (var i in json.itemSkillInfo.desc) {
					if (itemStatDesc != "") itemStatDesc += "<br/>";
					itemStatDesc += json.itemSkillInfo.desc[i];
				}
				for (var i in json.itemSkillInfo.name) {
					itemSkillName += json.itemSkillInfo.name[i] + "<br/>";
				}
			}
			*/
			
			if (itemStatDesc != "") itemStatDesc += '<br/>';
			for (var i in json.itemSkillInfo) {
				if (i == 0) itemStatDesc += '<span class="font_green">';
				if (i > 0) itemStatDesc += "<br/>";
				
				itemStatDesc += json.itemSkillInfo[i];
				if (i == json.itemSkillInfo.length-1) {
					itemStatDesc += '</span>';
				}
			}			
		}

		if (itemSkillName != "" && typeof json.equippedPosition != 'undefined' && json.equippedPosition.toUpperCase() == 'SINGONGPAE') {
			_profileLayer.find('div.base ul').append('<li><b>'+itemSkillName+'</b></li>');
		}

		if (typeof json.skillModEquip != 'undefined' && json.skillModEquip != "" && json.skillModEquip != null) {
			if (itemStatDesc != "") itemStatDesc += "<br/>";
			itemStatDesc += json.skillModEquip;
		}

		_profileLayer.find('.base').append('<div class="itemStatDesc">'+itemStatDesc+'</div>');
		
		//전수 추가
		if (typeof json.itemSpiritInfo != 'undefined') {
			var spiritInfo = '<div class="itemStatJunsu"><span class="grade_' +json.itemSpiritInfo.grade+'">';
			spiritInfo += json.itemSpiritInfo.name + '</span><br/>';
			for (var i = 0 ; i < json.itemSpiritInfo.abilities.length ; i++) {
				spiritInfo += json.itemSpiritInfo.abilities[i].abilityText + ' ' + json.itemSpiritInfo.abilities[i].valueAbility;
				if (json.itemSpiritInfo.abilities[i].isMax == 'true') {
					spiritInfo += ' <span class="stat-icon">최대</span>';
				}
				if (i < json.itemSpiritInfo.abilities.length-1) {
					spiritInfo += '<br/>';
				}
			}
			
			spiritInfo += '</div>';
			
			_profileLayer.find('.base').append(spiritInfo);
		}	

		if (typeof json.gemsInWeapon != 'undefined') {
			var tableEle = $('<table class="enchant"></table>');
			var gemInfo = '';
			var gemGrade = '';
			for (var i in json.gemsInWeapon) {
				if (json.gemsInWeapon[i].name != null) {
					gemInfo = json.gemsInWeapon[i].mainInfo;
					if (json.gemsInWeapon[i].subInfo != '') {
						if (json.gemsInWeapon[i].subInfo.indexOf("귀혼") > 0) {
							gemInfo = gemInfo + "<br/><span class='font_green'>귀혼속성</span>";
						} else {
							gemInfo = gemInfo + "<br/>" + json.gemsInWeapon[i].subInfo;
						}
					}
					if (typeof json.gemsInWeapon[i].grade != 'undefined') gemGrade = 'grade_'+json.gemsInWeapon[i].grade.code;
					else gemGrade = '';
					tableEle.append('<tr><th><span class="thumb"><img src="' + json.gemsInWeapon[i].iconNoBgUrl + '" alt="' + json.gemsInWeapon[i].name + '" /></span></th><td><strong class="'+gemGrade+'">' + json.gemsInWeapon[i].name + '</strong>' + gemInfo + '</td></tr>');
				} else {
					if (typeof json.gemsInWeapon[i].slotOpened != 'undefined' && json.gemsInWeapon[i].slotOpened == 'true') {
						tableEle.append('<tr><th><span class="empty"></span></th><td>보석 장착 가능</td></tr>');
					}
				}
			}
			_profileLayer.find('.itemStat').append(tableEle);
		}

		if (typeof setItem != 'undefined' && setItem != null) {
			//var setItem = _items.data(jsonKey.set);
			var current = _gemPosition(json.category.category3);
			var setItemEffects = [];
			if (typeof setItem.description != 'undefined') {
				//var setItemEffectsDescription = $.parseJSON(setItem.description.set_effect);
				var setItemEffectsDescription = setItem.description.set_effect;
				var sortSetItemEffects = [];
				for (var setCount in setItemEffectsDescription) {
					sortSetItemEffects.push({"key":setCount, "value":setItemEffectsDescription[setCount]});
				}
				sortSetItemEffects.sort(function(a,b){
					return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
				});
				for (var sortIdx in sortSetItemEffects) {
					var setCount = sortSetItemEffects[sortIdx].key;
					var effects = sortSetItemEffects[sortIdx].value['effect'];
					var skillModify = sortSetItemEffects[sortIdx].value['skill-modify'];
					var label = '<label class="set_effect_'+setCount+'">'+setCount+'세트</label>';
					var description = '';
					if (typeof effects != 'undefined') {
						for (var idx in effects) {
							if (effects[idx] != null) {
								description += effects[idx] + '<br/>';
							}
						}
					}
					if (typeof skillModify != 'undefined') {
						/*
						for (var idx in skillModify['effect']) {
							description += '<span class="skill">'+skillModify['skill_names']+'</span> ' + skillModify['effect'][idx] + '<br/>';
						}
						*/
						for (var skillIdx in skillModify) {
							// 'description' 먼저 체크
							if (typeof skillModify[skillIdx]['description'] != 'undefined') {
								for (var descIdx in skillModify[skillIdx]['description']) {
									description += '<span class="skill">'+skillModify[skillIdx]['description'][descIdx]['name'].replace(/ /gi, ', ')+'</span> ' + skillModify[skillIdx]['description'][descIdx]['effect'] + '<br/>';
								}
							} else {
								for (var effectIdx in skillModify[skillIdx]['effect']) {
									description += '<span class="skill">'+skillModify[skillIdx]['skill_names']+'</span> ' + skillModify[skillIdx]['effect'][effectIdx] + '<br/>';
								}
							}
						}
					}
					if (setCount <= setItem.equipped.count) {
						setItemEffects.push('<li>'+label+'<p>' + description + '</p></li>');
					} else {
						setItemEffects.push('<li class="empty">'+label+'<p>' + description + '</p></li>');
					}
				}
			}
			_profileLayer.find('.itemStat').append('<div class="bonus"><ul class="set_effect">'+setItemEffects.join('')+'</ul></div>');

			// 09.18 세트효과 변경으로 인하여 보패 세트효과는 일시적으로 보이지 않게 처리함.
			if (typeof json.equippedPosition != 'undefined' && json.equippedPosition.indexOf("gem") >= 0) {
				_profileLayer.find('.itemStat').find(".bonus").hide();
			}

			var iconsEle = $('<div class="gemIcon"></div>');
			var gemStatusEle = $('<ul class="gemStatus"></ul>');
			/*악세서리 세트 효과에 대한 예외 처리 */
			if (setItem.equipped.setItemType === 'amulet') {
				if (typeof setItem.equipped.gem1IconExtra != 'undefined') {
					if (current == 1) iconsEle.append('<span class="pos1"><span class="current_grade'+setItem.equipped.gem1Grade+'_pos1"></span><img src="'+setItem.equipped.gem1IconExtra+'" alt="보패1" /></span>');
					else iconsEle.append('<span class="pos1"><span class="grade'+setItem.equipped.gem1Grade+'_pos1"></span><img src="'+setItem.equipped.gem1IconExtra+'" alt="보패1" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem1Grade+'">보패 <span class="pos pos1">1</span></li>');
				} else {
					if (current == 1) iconsEle.append('<span class="pos1"><span class="current_grade'+json.grade.code+'_pos1"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos1">1</span></li>');
				}
				if (typeof setItem.equipped.gem2IconExtra != 'undefined') {
					if (current == 2) iconsEle.append('<span class="pos2"><span class="current_grade'+setItem.equipped.gem2Grade+'_pos2"></span><img src="'+setItem.equipped.gem2IconExtra+'" alt="보패2" /></span>');
					else iconsEle.append('<span class="pos2"><span class="grade'+setItem.equipped.gem2Grade+'_pos2"></span><img src="'+setItem.equipped.gem2IconExtra+'" alt="보패2" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem2Grade+'">보패 <span class="pos pos2">2</span></li>');
				} else {
					if (current == 2) iconsEle.append('<span class="pos2"><span class="current_grade'+json.grade.code+'_pos2"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos2">2</span></li>');
				}
				if (typeof setItem.equipped.gem3IconExtra != 'undefined') {
					if (current == 3) iconsEle.append('<span class="pos3"><span class="current_grade'+setItem.equipped.gem3Grade+'_pos3"></span><img src="'+setItem.equipped.gem3IconExtra+'" alt="보패3" /></span>');
					else iconsEle.append('<span class="pos3"><span class="grade'+setItem.equipped.gem3Grade+'_pos3"></span><img src="'+setItem.equipped.gem3IconExtra+'" alt="보패3" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem3Grade+'">보패 <span class="pos pos3">3</span></li>');
				} else {
					if (current == 3) iconsEle.append('<span class="pos3"><span class="current_grade'+json.grade.code+'_pos3"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos3">3</span></li>');
				}
				if (typeof setItem.equipped.gem4IconExtra != 'undefined') {
					if (current == 4) iconsEle.append('<span class="pos4"><span class="current_grade'+setItem.equipped.gem4Grade+'_pos4"></span><img src="'+setItem.equipped.gem4IconExtra+'" alt="보패4" /></span>');
					else iconsEle.append('<span class="pos4"><span class="grade'+setItem.equipped.gem4Grade+'_pos4"></span><img src="'+setItem.equipped.gem4IconExtra+'" alt="보패4" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem4Grade+'">보패 <span class="pos pos4">4</span></li>');
				} else {
					if (current == 4) iconsEle.append('<span class="pos4"><span class="current_grade'+json.grade.code+'_pos4"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos4">4</span></li>');
				}
				if (typeof setItem.equipped.gem5IconExtra != 'undefined') {
					if (current == 5) iconsEle.append('<span class="pos5"><span class="current_grade'+setItem.equipped.gem5Grade+'_pos5"></span><img src="'+setItem.equipped.gem5IconExtra+'" alt="보패5" /></span>');
					else iconsEle.append('<span class="pos5"><span class="grade'+setItem.equipped.gem5Grade+'_pos5"></span><img src="'+setItem.equipped.gem5IconExtra+'" alt="보패5" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem5Grade+'">보패 <span class="pos pos5">5</span></li>');
				} else {
					if (current == 5) iconsEle.append('<span class="pos5"><span class="current_grade'+json.grade.code+'_pos5"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos5">5</span></li>');
				}
				if (typeof setItem.equipped.gem6IconExtra != 'undefined') {
					if (current == 6) iconsEle.append('<span class="pos6"><span class="current_grade'+setItem.equipped.gem6Grade+'_pos6"></span><img src="'+setItem.equipped.gem6IconExtra+'" alt="보패6" /></span>');
					else iconsEle.append('<span class="pos6"><span class="grade'+setItem.equipped.gem6Grade+'_pos6"></span><img src="'+setItem.equipped.gem6IconExtra+'" alt="보패6" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem6Grade+'">보패 <span class="pos pos6">6</span></li>');
				} else {
					if (current == 6) iconsEle.append('<span class="pos6"><span class="current_grade'+json.grade.code+'_pos6"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos6">6</span></li>');
				}
				if (typeof setItem.equipped.gem7IconExtra != 'undefined') {
					if (current == 7) iconsEle.append('<span class="pos7"><span class="current_grade'+setItem.equipped.gem7Grade+'_pos7"></span><img src="'+setItem.equipped.gem7IconExtra+'" alt="보패7" /></span>');
					else iconsEle.append('<span class="pos7"><span class="grade'+setItem.equipped.gem7Grade+'_pos7"></span><img src="'+setItem.equipped.gem7IconExtra+'" alt="보패7" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem7Grade+'">보패 <span class="pos pos7">7</span></li>');
				} else {
					if (current == 7) iconsEle.append('<span class="pos7"><span class="current_grade'+json.grade.code+'_pos7"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos7">7</span></li>');
				}
				if (typeof setItem.equipped.gem8IconExtra != 'undefined') {
					if (current == 8) iconsEle.append('<span class="pos8"><span class="current_grade'+setItem.equipped.gem8Grade+'_pos8"></span><img src="'+setItem.equipped.gem8IconExtra+'" alt="보패8" /></span>');
					else iconsEle.append('<span class="pos8"><span class="grade'+setItem.equipped.gem8Grade+'_pos8"></span><img src="'+setItem.equipped.gem8IconExtra+'" alt="보패8" /></span>');
					gemStatusEle.append('<li class="grade_'+setItem.equipped.gem8Grade+'">보패 <span class="pos pos8">8</span></li>');
				} else {
					if (current == 8) iconsEle.append('<span class="pos8"><span class="current_grade'+json.grade.code+'_pos8"></span></span>');
					gemStatusEle.append('<li class="empty">보패 <span class="pos pos8">8</span></li>');
				}

				var gemEle = $('<div class="gem cntTy1"></div>');
				var gemInfo = $('<div class="gemInfo"></div>');
				gemEle.append('<h2>'+setItem.name+' ('+setItem.equipped.count+'/8)</h2>');
				gemInfo.append(iconsEle);
				gemInfo.append(gemStatusEle);
				gemEle.append(gemInfo);
				_profileLayer.find('.cnt').find('.wrapGem').append(gemEle);
			}
		}

		var descriptionEle = $('<div class="itemDesc cntTy1"></div>');
		if (typeof json.description4Title != 'undefined' && typeof json.description4 != 'undefined') descriptionEle.append('<dl><dt>'+json.description4Title+'</dt><dd>'+json.description4+'</dd></dl>');
		if (typeof json.description5Title != 'undefined' && typeof json.description5 != 'undefined') descriptionEle.append('<dl><dt>'+json.description5Title+'</dt><dd>'+json.description5+'</dd></dl>');
		if (typeof json.description6Title != 'undefined' && typeof json.description6 != 'undefined') descriptionEle.append('<dl><dt>'+json.description6Title+'</dt><dd>'+json.description6+'</dd></dl>');
		//if (typeof json.randomPreviewRefine != 'undefined') descriptionEle.append('<dl><dt>보상</dt><dd>'+json.randomPreviewRefine+'</dd></dl>');
		if (descriptionEle.find('dl').length > 0) {
			descriptionEle.find('dl').first().addClass('first');
			_profileLayer.find('.cnt').append(descriptionEle);
		}

		var description = ''; var identifyDescription = '';
		if (typeof json.description != 'undefined' && isSealed == false) description = json.description.replace('<image enablescale="true" height="19" path="00015590.GameUI_Tag" scalerate="1.5" u="178" ul="51" v="318" vl="19" width="51"/>', '<img src="http://static.plaync.co.kr/powerbook/bns/ui_resource/GameUI_Tag/paid_item.png" />');
		if (typeof json.identifyDescription != 'undefined' && description == '') identifyDescription = json.identifyDescription.replace('<image enablescale="true" height="19" path="00015590.GameUI_Tag" scalerate="1.5" u="178" ul="51" v="318" vl="19" width="51"/>', '<img src="http://static.plaync.co.kr/powerbook/bns/ui_resource/GameUI_Tag/paid_item.png" />');
		if (description != '' || identifyDescription != '') description = description + '<br/>';
		if (description != '') _profileLayer.find('.cnt').append('<div class="desc cntTy1">'+description+identifyDescription+'</div>');

		_profileLayer.find('.cnt').append('<div class="itemProperty cntTy1"></div>');
		var itemPropertyEle = $('<ul></ul>');
		if (typeof json.level != 'undefined' && json.level > 1) itemPropertyEle.append('<li>요구 레벨 '+json.level+'</li>');
		if (typeof json.equipType != 'undefined') {
			if (typeof json.equipType.equipSex != 'undefined' && json.equipType.equipSex != 'all') itemPropertyEle.append('<li>' + json.equipType.equipSex + '</li>');
			if (typeof json.equipType.equipRace != 'undefined' && json.equipType.equipRace != 'all') itemPropertyEle.append('<li>' + json.equipType.equipRace + '</li>');
			if (typeof json.equipType.equipJobRefine != 'undefined' && json.equipType.equipJobRefine != '') itemPropertyEle.append('<li>' + json.equipType.equipJobRefine + ' 전용</li>');
			if (typeof json.equipType.equipFaction != 'undefined') itemPropertyEle.append('<li>' + json.equipType.equipFaction + '</li>');
		}

		// 기간제 아이템
		if (typeof json.timeLimit != 'undefined') {
			if (json.timeLimit.type == 'DURATION' && json.timeLimit.expiration == true) {
				itemPropertyEle.append('<li class="trade">사용 기간 만료</li>');
			}
		}

		if (typeof json.eligibleType != 'undefined') {
			var eligible, eligibleText=[];
			for (var i in json.eligibleType) {
				eligible = json.eligibleType[i];
				if (eligible == 'cannotDispose') eligibleText.push('파괴');
				else if (eligible == 'cannotSell') eligibleText.push('판매');
				else if (eligible == 'cannotTrade') eligibleText.push('거래');
				//else if (eligible == 'cannotDepot') eligibleText.push('창고저장');
				//else if (eligible == 'cannotAuctionable') eligibleText.push('경매');
			}
			itemPropertyEle.append('<li class="trade">'+eligibleText.join(", ")+' 불가</li>');
		}

		if (isSealed == false && (typeof json.sealConsumeItem != 'undefined' || json.reSealable == true)) {
			itemPropertyEle.append('<li>재봉인 가능</li>');
		}

		// 게임 내에서 귀속 개념이 사라짐
		//if (typeof json.isUsed != 'undefined' && isSealed == false && json.isUsed == 'true') itemPropertyEle.append('<li>귀속됨</li>');
		/*
		 *  16.09.21 - 수호석이 영구 아이템으로 전환됨에 따라 내구도 영역 삭제
		if (typeof json.durabilityType != 'undefined' && isSealed == false) {
			var gauge = json.durabilityType.gauge;
			//var percent = parseInt(168*gauge/100); percent = percent > 168 ? 168 : percent;
			var percent = gauge;
			itemPropertyEle.append('<li class="quality">내구도<div class="graph"><span class="bar" style="width:'+percent+'%;"></span></div><span class="text"> '+gauge+'/'+100+'</span><div class="repair"></div></li>');
			if (typeof json.repairItemIconUrl != 'undefined') {
				itemPropertyEle.find('.repair').append('<span class="empty thumb"><img src="'+json.repairItemIconUrl+'" /></span>'+json.repairItemName);
			}
		}
		*/

		_profileLayer.find('div.itemProperty').append(itemPropertyEle);

		if (typeof json.price != 'undefined' && parseInt(json.price) > 0) {
			var totalPrice = parseInt(json.price)*parseInt(json.amount);
			if (typeof json.amount == 'undefined') totalPrice = parseInt(json.price);
			_profileLayer.find('div.itemProperty').append('<div class="price">판매 가격 '+G.moneyHtml(totalPrice)+'</div>');
		}
		_profileLayer.find('a.powerbook').attr('href', _powerbook+'/wiki/'+encodeURIComponent(json.name));
		
		// 레이어 노출
		_showProfileLayer({top:posY, left:posX});
	}

	I.initializeEquip = function (powerbook, apiUrl) {
		_powerbook = powerbook;
		_apiUrl = apiUrl;
	}

	I.initialize = function (items, links, powerbook, charInfo) {
		initializeNew(items, links, powerbook, charInfo, null, "");
	}

	I.initializeNew = function (items, links, powerbook, charInfo, charName, type) {
		_profileLayer = $('<div id="itemInfo"></div>');
		$('html, body').append(_profileLayer);
		_initializeProfileLayer();

		_items = $(items);
		if (typeof powerbook != 'undefined' && powerbook != "") _powerbook = powerbook;
		if (typeof charInfo != 'undefined') _charInfo = charInfo;


		var linkEle = $("#"+type+"items, #"+type+"charms").find(links);
		linkEle.click(function (e) {
			var key = $(this).attr('data');
			var jsonKey = $.parseJSON(key);

			if (_itemKey != null && _itemKey == jsonKey.item && _profileLayer.is(':visible')) {
				_hideProfileLayer();
			} else {
				_itemKey = jsonKey.item;

				//보패 일 때 체크
				var mapElement = $(this).parent('map');
				if (mapElement.hasClass('mapsPos')) {
					var winSizeWidth = document.body.clientWidth;
					var winSizeHeight = document.body.clientHeight;

					// 비교하기 일 경우 제외
					var checkCompare = $(this).parents().hasClass('characterInfoSub');
					if ( checkCompare == true ) {

						//내캐릭터 일 경우
						var checkMy = $(this).parents().hasClass('myCharacter');
						if ( checkMy == true ) {
							posX =  (winSizeWidth/2)-500;
						} else {
							posX =  (winSizeWidth/2)-95;
						}
						posY = 960 + 'px';

					} else {
						//보패의 경우
						posX =  (winSizeWidth/2)-280;
						posY = 860 + 'px';

						$("html, body").animate({scrollTop:800}, 10);//보패 클릭시 스크롤 이동
					}

				} else {
					//보패가 아닌 아이템 레이어
					var target = $(e.target);
					pos =  target.offset();
					posX = pos.left + 'px';
					posY = pos.top + target.height()*0.8 + 'px';
				}
				_initializeProfileLayer();
				_makeItemProfile(key, charName, items);
				//_showProfileLayer({top:posY, left:posX});
			}
		});
		$(document.body).click(function(e) {
			var el = e.target;
			if ($(el).parents('.itemLayer').size() > 0) _hideProfileLayer();
		});
	};
	I.initializeWithRequestData = function(itemData, setItemData, powerbook, charInfo, closeHander) {
		_profileLayer = $('<div id="itemInfo"></div>');
		$('body').append(_profileLayer);
		_initializeProfileLayerWithRequestData(closeHander);

		_powerbook = powerbook;

		if (typeof charInfo != 'undefined') {
			_charInfo = charInfo;
		}

		_itemKey = itemData;

		_makeItemProfile(null, itemData, setItemData);

		_profileLayer.show();
	};
	I.MarketItemIcon = function (itemId, attach) {
		var itemspan = _items.find("[name='" + itemId + "']");
		var jsonKey = itemId.replace("id-", "");
		var json = _items.data("profile-" + jsonKey);

		var isSealed = false;
		var isLocked = false;
		var itemName = json.name;
		if (_isInSealedPrefixName(itemName) || (typeof json.isSealed != 'undefined' && json.isSealed == 'true')) {
			isSealed = true;
			$(itemspan).attr("class", "iconLock Seal itemLink");
			$(itemspan).html("봉인해제");
		}

		if (isSealed == false && _charInfo != null && typeof json.equipType != 'undefined') {
			if (isLocked == false && typeof json.equipType.equipSex != 'undefined' && json.equipType.equipSex != '' && json.equipType.equipSex != _charInfo.sex) isLocked = true;
			if (isLocked == false && typeof json.equipType.equipRace != 'undefined' && json.equipType.equipRace != '' && _isMyRaceItem(json.equipType.equipRace, _charInfo.race, _charInfo.job) == false ) isLocked = true;
			if (isLocked == false && typeof json.equipType.equipFaction != 'undefined' && json.equipType.equipFaction != '' && json.equipType.equipFaction != _charInfo.faction) isLocked = true;
			if (isLocked == false && typeof json.equipType.equipJobRefine != 'undefined' && json.equipType.equipJobRefine != '' && json.equipType.equipJobRefine.indexOf(_charInfo.job) == -1) isLocked = true;
			if (isLocked == true){
				$(itemspan).attr("class", "iconLock Job itemLink");
				$(itemspan).html("착용 불가");
			}
		}
		if (isSealed == false && isLocked == false && _charInfo != null && typeof json.level != 'undefined' && json.level != '0' && (parseInt(json.level, 10) > parseInt(_charInfo.level, 10))) {
			$(itemspan).attr("class", "iconLock Level itemLink");
			$(itemspan).html("레벨제한");
		}

		if (typeof attach == 'undefined' || attach == true) {
			var linkEle = $(itemspan);
			linkEle.click(function(e){
				pos = $(e.target).offset();
				posY = pos.top + $(e.target).height() * 0.8 + 'px';
				posX = pos.left + 'px';

				_initializeProfileLayer();
				_makeItemProfile($(this).attr('data'));
				/*
				_showProfileLayer({
					top: posY,
					left: posX
				});
				*/
			});
		}
	};
	I.setMobile = function(isMobileVal) {
		isMobile = isMobileVal;
	};
	return I;
}(BnsWeb.Game, BnsWeb.Game.Item || {}, jQuery));
