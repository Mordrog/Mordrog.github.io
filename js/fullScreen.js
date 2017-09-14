var visPanel = document.getElementById("mynetwork");
var isFullScreen = false;
document.addEventListener('webkitfullscreenchange', exitHandler, false);
document.addEventListener('mozfullscreenchange', exitHandler, false);
document.addEventListener('fullscreenchange', exitHandler, false);
document.addEventListener('MSFullscreenChange', exitHandler, false);

function exitHandler()
{
    if ((document.webkitIsFullScreen && document.mozFullScreen && document.msFullscreenElement) === false)
    {
		$('#mynetwork').toggleClass('networkFullScreen');
		isFullScreen = false;
    }
}

function launchIntoFullscreen(element) {
	if (!isFullScreen){
		if(element.requestFullscreen) {
			element.requestFullscreen();
			$('#mynetwork').toggleClass('networkFullScreen');
			isFullScreen = true;
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
			$('#mynetwork').toggleClass('networkFullScreen'); 
			isFullScreen = true;
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
			$('#mynetwork').toggleClass('networkFullScreen');
			isFullScreen = true;
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
			$('#mynetwork').toggleClass('networkFullScreen'); 
			isFullScreen = true;
		}
	}
}

$("#fullScreen").click(function(){
	launchIntoFullscreen(document.getElementById("mynetwork"));
});