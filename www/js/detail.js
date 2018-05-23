module.controller('PageController', function ($scope, $location, $anchorScroll) {

	$scope.gotoTop = function () {
		$location.hash('topanc')
		$anchorScroll()
	}

	// $scope.toiletPush = function () {
	// 	$scope.navi.pushPage('toiletsettings.html')
	// }

	// Pull2Refreshの処理
	this.items = [3, 2, 1];
	this.load = function ($done) {
		$timeout(function () {
			this.items.unshift(this.items.length + 1);
			$done();
		}.bind(this), 1000);
	}.bind(this);

	// こんな感じで直接指定かどうか決める
	// $scope.wa = "○"


	//○×判定 しようかと思ったけど鯖に直接○×保存すりゃええやん
	var arrayCheck = []
	$scope.checkData = [{ "id": "0", "checkD": "×" }, { "id": "1", "checkD": "○" }]
	$scope.checkD = $scope.checkData[0].checkD

	// //配列のやり方 データを取ってきてifで入れれば良さげ
	// $scope.checkD = [
	// 	{
	// 		washiki:"○",
	// 		youshiki:"×"
	// 	}
	// ]
	//(html内) {{checkD.washiki}}でアクセスできる

	// forで回そうかと思ったけど止めた
	// //要素数
	// var cnt = 6
	// ons.preload(function () {
	// 	//鯖から値を持ってくる処理
	// 	for (var i = 0; i < cnt; i++) {
	// 		arrayCheck[i] = "1"
	// 	}
	// 	//○×判定機
	// 	for (var i = 0; i < cnt; i++) {
	// 		eval("$scope.checkD"+ i +" = $scope.checkData[" + arrayCheck[i] +"].checkD")
	// 		$scope.checkD = $scope.checkData[checkData[i]].checkD
	// 	}
	// });
});
// レビューのリスト表示
module.controller('ListController', function () {
	this.delegate = {
		configureItemScope: function (index, itemScope) {
			//ここでリストに表示するもの
			itemScope.item = 'Item ' + index
		},
		countItems: function () {
			//レビュー数を取得してぶちこむ
			return 50000
		},
		calculateItemHeight: function () {
			return ons.platform.isAndroid() ? 48 : 44
		}
	}
})
//レビュー投稿関連
module.controller('ReviewController', function ($scope, $timeout) {
	this.username = ''
	this.comment = ''
	//レビュー内容をJSON文字列に変換
	$scope.saveReview = function () {
		// JSON.stringify(username + ' ' + comment)
		$scope.myModal.hide()
		//値を格納
		// this.youshiki = $scope.youshiki
		// this.washiki = $scope.washiki
		// this.washlet = $scope.washlet
	}
	var timer
	$scope.showToast = function () {
		toast.show()
		timer = $timeout(function () {
			toast.hide()
		}, 2000)
	}
})

module.controller('SettingsController', function ($scope, $timeout) {
	$scope.saveSettings = function () {
		$scope.navi.popPage()
		var timer
		toast2.show()
		timer = $timeout(function () {
			toast2.hide()
		}, 2000)
	}
})

//ページ更新云々
// document.addEventListener('show',function(event){
// 	var page = event.target
// 	if(page.id == 'detail'){
// 		//ons-list要素を初期化
// 		var list = page.querySelector('#list')
// 	}
// })