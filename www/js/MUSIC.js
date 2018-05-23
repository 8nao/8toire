var flg = false;

function sound(){
     var audio = document.getElementById('sound-file');
     if(flg){
          audio.pause();
          flg = false;
          audio.currentTime = 0;
     }else{
          audio.play();
          flg = true;
     }
}