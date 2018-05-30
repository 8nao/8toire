var module = angular.module('my-app', ['onsen'])
module.controller('AppController', function ($scope) {
	this.load = function (page) {
		splitter.content.load(page)
			.then(function () {
				splitter.left.close()
				if (page == 'home.html') {
					initialize()
				}
			})
	}
});

//infowindowの中身 DOM形式にしてaddDomListenerを使えるようにする
var boxText = document.createElement("div");
// boxText.id = 1
//boxText.style.backgroundColor = "red";
boxText.innerHTML = "<div>" +
	"<h4 class='firstHeading'>扇町公園のトイレ</h4>" +
	"<table><tr>" +
	"<td rowspan='4'><img src='img/test.jpg' class='img'></img></td>" +
	"<td>評価:★★★</td></tr>" +
	"<tr><td>清潔度:★★★</td></tr>" +
	"<tr><td>営業時間:年中無休</td></tr>" +
	"<tr><td><input type='button' value='詳細' ng-Click='navi.pushPage('detail.html')'></td></tr>" +
	"</table></div>"

var infowindow, map,obj
var data = []

// マップ表示初期処理
function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(34.703615, 135.509339),    //地図上で表示させる緯度経度
		zoom: 14,											//地図の倍率
		minZoom: 10,									//ズームアウト制限
		mapTypeId: google.maps.MapTypeId.ROADMAP,                  //地図の種類
		mapTypeControl: false,						//航空写真とかのアレ削除
		zoomControl: false,								//ズームコントローラ削除
		fullscreenControl: false,							//フルスクリーンコントローラ削除
		streetViewControl: true							//ストリートビューコントローラの表示
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),
		mapOptions);

	var simpleMapStyle
	// POI を非表示にするマップタイプを定義
	simpleMapStyle = new google.maps.StyledMapType([
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
		}
	], { name: "Simple Map" });

	// マップタイプを追加して設定
	map.mapTypes.set("simple_map", simpleMapStyle);
	map.setMapTypeId("simple_map");

	addMarkers()

}

//マーカー追加1
function addM() {
		var response = map.getCenter() ;
		new google.maps.Marker( { map: map, position: response, } ) ;
		try{ response = typeof response == "object" ? JSON.stringify( response ) : response ; }catch(e){}
		responseTextarea = response ;
		console.log( response ) ;
	}

//マーカー追加2
function addMarkers() {
	var myLatlng = new google.maps.LatLng(34.703615, 135.509339); //扇町公園の経度、緯度
	var marker = new google.maps.Marker({
		position: myLatlng,
		title: "梅田の家"
	});
	var myLatlng2 = new google.maps.LatLng(34.6756075,135.5573662); //扇町公園の経度、緯度
	var marker2 = new google.maps.Marker({
		position: myLatlng2,
		title: "矢原の家"
	});
	marker.setMap(map);
	marker2.setMap(map);
	//data配列にpush
	data.push({umeda:myLatlng})
	data.push({yahara:myLatlng2})

	//初期化処理
	infowindow = new google.maps.InfoWindow({
		content: ""
	});
	//ポップアップ表示のやつ
	marker.addListener("click", function () {
		infowindow.close()
		infowindow = new google.maps.InfoWindow({
			content: boxText
		});
		infowindow.open(map, marker)
		map.panTo(myLatlng)
		//localStorageに保存(key,value)
		localStorage.setItem('json',JSON.stringify(data))
		matrix()
	});
	google.maps.event.addDomListener(boxText, 'click', function () {
		navi.pushPage('detail.html')
	})
	google.maps.event.addListener(map, "click", function () {
		infowindow.close()
	})
}


//directionでルートと時間表示 distanceMatrixで近い順ソート
//ここからdirection API と distanceMatrix てすと 扇町公園→Y家
function matrix() {
	var distanceMatrixService = new google.maps.DistanceMatrixService()

	var directionsService = new google.maps.DirectionsService
	var directionsRenderer = new google.maps.DirectionsRenderer

	var origins = [new google.maps.LatLng(34.703615,135.509339)]
	var origin = new google.maps.LatLng(34.703615,135.509339)
	var destinations = [new google.maps.LatLng(34.6756075,135.5573662)]
	var destination = new google.maps.LatLng(34.6756075,135.5573662)
	
	directionsService.route({
		origin:origin,
		destination:destination,
		travelMode:google.maps.TravelMode.WALKING
	},function(response,status){
		console.log(response)
		if(status == google.maps.DistanceMatrixStatus.OK){
			// //ルートの所要時間
			// var time = response.route.legs[0].duration.text
			// //ルートの距離
			// var dist = response.route.legs[0].distance.text
			// //start_addressのテキストを変更
			// response.route.legs[0].start_address = '出発地点:'+ start
			// response.route.legs[0].end_address = '目的地点:'+ end + '出発地点からの距離:' + dist + '出発地点からの所要時間:' + time
			directionsRenderer.setMap(map)
			directionsRenderer.setDirections(response)
		}
	})

	directionsRenderer.setOptions({
		suppressMarkers:true,
	// 	suppressPolylines:true,
	// 	suppressInfoWindows:false,
		draggable:true,
	// 	preserveViewport:false
	markerOptions:{
		icon:'img/test.jpg'
	}
	})

	distanceMatrixService.getDistanceMatrix({
		origins:origins,
		destinations:destinations,
		travelMode:google.maps.TravelMode.WALKING
	},function(response,status){
		if(status == google.maps.DistanceMatrixStatus.OK){
			var origins = response.originAddresses
			var destinations = response.destinationAddresses

			for(var  i = 0 ; i < origins.length ; i++ ){
				var results = response.rows[i].elements

				for(var j=0;j<results.length;j++){
					var from = origins[i]
					var to = destinations[j]
					// ルート辿った場合の時間(秒)
					var duration = results[j].duration.value
					// ルートの距離(メートル)
					var distance = results[j].distance.value
					console.log("from:" + from + "to" + to + "duration" +duration + "distance" + distance)
				}
			}
		}
	})
	// var umedaPlace = "34.703615,135.509339"
	// var goalPlace = "34.69607,135.51258"
	// var apiKey = "AIzaSyDdS1HNAhjv-G7Q543N4Pbypv_1EDn0BTM"
	// var dMatrix = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+
	// umedaPlace + "&destinations=" + goalPlace + "&mode=walking&key=" + apiKey
	// var jsonResult = JSON.parse(dMatrix)
	// console.log(jsonResult)
}

//ここまで

$(function () {
            $("#rate").keyup(function(){
                var width = parseFloat($("#rate").val());
                // var width = $("#rate").val();
                $('.star-rating-front').css('width',width + "em");
            })
        })

function detail() {
	navi.pushPage('detail.html')
}

//💩
ons.ready(function () {
	console.log('unchi ready')
})
