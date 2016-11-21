var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	endTime = new Date(2016,10,21,23,40,00),//截至时间
	currentTimeSeconds = getCurrentTimeSeconds(),//当前剩余秒数
	balls = [];
const CANVAS_WIDTH = 1024,
	CANVAS_HEIGHT = 768,
	MARGIN_LEFT = 10,//数字之间的左边距
	RADIUS = 8;	//绘制小圆点的半径

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

setInterval(function(){
	shapeData();
	update();
},50);

/*获取当前剩余秒数*/
function getCurrentTimeSeconds(){
	var currentTime = new Date();
	var leftTime = endTime.getTime() - currentTime.getTime();
	leftTime = Math.round(leftTime/1000);//把剩余毫秒数转为秒数
	return leftTime > 0 ? leftTime : 0 ;
}

/*绘制剩余时间的数据*/
function shapeData(){
	context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	var hours = parseInt(currentTimeSeconds/3600);
	var minutes = parseInt((currentTimeSeconds-hours*3600)/60);
	var seconds = currentTimeSeconds % 60;
	paintShape(0,0,parseInt(hours/10),context);
	paintShape(7*2*(RADIUS+1)+MARGIN_LEFT,0,parseInt(hours%10),context);
	paintShape(14*2*(RADIUS+1)+MARGIN_LEFT,0,10,context);
	paintShape(18*2*(RADIUS+1)+MARGIN_LEFT,0,parseInt(minutes/10),context);
	paintShape(25*2*(RADIUS+1)+MARGIN_LEFT,0,parseInt(minutes%10),context);
	paintShape(32*2*(RADIUS+1)+MARGIN_LEFT,0,10,context);
	paintShape(36*2*(RADIUS+1)+MARGIN_LEFT,0,parseInt(seconds/10),context);
	paintShape(44*2*(RADIUS+1)+MARGIN_LEFT,0,parseInt(seconds%10),context);
}

/*更新剩余时间的数据*/
function update(){
	var nextTimeSeconds = getCurrentTimeSeconds();
	var nextHours = parseInt(nextSeconds/3600);
	var nextMinutes = parseInt((nextSeconds-nextHours*3600)/60);
	var nextSeconds = nextSeconds % 60;
	var currentHours = parseInt(currentTimeSeconds/3600);
	var currentMinutes = parseInt((currentTimeSeconds-currentHours*3600)/60);
	var currentSeconds = currentTimeSeconds % 60;
	if(currentSeconds != nextSeconds){
		currentTimeSeconds = nextTimeSeconds;
	}
}


/*绘制剩余时间的图形*/
function paintShape(x,y,num,context){
	context.fillStyle = "#335588";
	for(var i = 0;i < digit[num].length; i++){
		for(var j = 0;j < digit[num][i].length;j++){
			if(digit[num][i][j] === 1){
				context.beginPath();
				context.arc(x+j*2*(RADIUS+1)+(RADIUS+1),
					y+i*2*(RADIUS+1)+(RADIUS+1),
					RADIUS,0,2*Math.PI,false);
				context.fill();
				context.closePath();
				context.strokeStyle = "#335588";
				context.stroke();
			}
		}
	}
}