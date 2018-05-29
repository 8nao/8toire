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

var contentString = "<div>"+
"<h1 class='firstHeading'>扇町公園のトイレ</h1>"+
"<img src='img/test.jpg' class='img'></img>"+
"<div class='info'>評価:★★★<br>"+
"清潔度:★★★<br>"+
"営業時間:年中無休<br>"+
"<input type='button' value='詳細' onClick='detail()'></div></div>"

function initialize() {
  var mapOptions = {
          center: new google.maps.LatLng(34.703615, 135.509339),    //地図上で表示させる緯度経度
          zoom: 14,                                                 //地図の倍率
          mapTypeId: google.maps.MapTypeId.ROADMAP                  //地図の種類
     };
     var map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);

     var simpleMapStyle, map;

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

     var responseTextarea = document.getElementById( "response" ) ;

       var myLatlng = new google.maps.LatLng(34.703615, 135.509339); //扇町公園の経度、緯度
     var marker = new google.maps.Marker({
          position: myLatlng,
          title: "梅田の家"
     });
       marker.setMap(map);
     //ポップアップ表示のやつ
     marker.addListener("click", function () {
          var infowindow = new google.maps.InfoWindow({
               content: contentString
          });
          infowindow.open(map, marker);
     });

	// Method
	document.getElementById( "method" ).onclick = function () {
		var response = map.getCenter() ;
		new google.maps.Marker( { map: map, position: response, } ) ;
		try{ response = typeof response == "object" ? JSON.stringify( response ) : response ; }catch(e){}
		responseTextarea = response ;
		console.log( response ) ;
    
	}
}
function detail(){
     navi.pushPage('detail.html')
}

//💩
ons.ready(function () {
})



    