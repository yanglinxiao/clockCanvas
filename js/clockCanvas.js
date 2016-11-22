var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	endTime = new Date(2016,10,22,23,50,00),//截至时间
	currentTimeSeconds = getCurrentTimeSeconds(),//当前剩余秒数
	balls = [],//数字改变，把要滚落小球添加到该数组
	ballColor = ['#EA4343','#7E87F0','#6FDEFF','yellow','#24DD37','#DD5124'];
	//滚落小球的颜色
const CANVAS_WIDTH = 1080,
	CANVAS_HEIGHT = 540,
	MARGIN_LEFT = 10,//数字之间的左边距
	MARGIN_TOP = 20,//数字距离画布的上外边距
	RADIUS = 8;	//绘制小圆点的半径

canvas.width = CANVAS_WIDTH;//画布宽度
canvas.height = CANVAS_HEIGHT;//画布高度

setInterval(function(){
	shapeData();
	update();
},50);//每隔50毫秒绘制并更新倒计时和要滚落的小球

/*获取当前剩余秒数*/
function getCurrentTimeSeconds(){
	var currentTime = new Date();//获取当前剩余时间的毫秒数
	var leftTime = endTime.getTime() - currentTime.getTime();
	leftTime = Math.round(leftTime/1000);//把剩余毫秒数转为秒数
	return leftTime > 0 ? leftTime : 0 ;
	//如果倒计时还没结束就返回所剩秒数，否则返回0
}

/*绘制剩余时间的数据*/
function shapeData(){
	context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);// 每次绘制之前需要清空画布，要不然会出现数字的重叠
	//获取时分秒
	var hours = parseInt(currentTimeSeconds/3600);
	var minutes = parseInt((currentTimeSeconds-hours*3600)/60);
	var seconds = currentTimeSeconds % 60;
	//调用paintshape进行倒计时的绘制
	paintShape(0,MARGIN_TOP,parseInt(hours/10),context);
	paintShape(7*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(hours%10),context);
	paintShape(14*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,10,context);
	paintShape(18*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(minutes/10),context);
	paintShape(25*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(minutes%10),context);
	paintShape(32*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,10,context);
	paintShape(36*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(seconds/10),context);
	paintShape(44*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(seconds%10),context);
	paintDropBall();
}

//绘制滚落小球的形状
function paintDropBall () {
	for(var i = 0; i < balls.length; i++){
		context.fillStyle = balls[i].color;
		context.beginPath();
		context.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,false);
		context.fill();
		context.closePath();
		context.strokeStyle = balls[i].color;
		context.stroke();
	}
}

/*更新剩余时间的数据*/
function update(){
	var nextTimeSeconds = getCurrentTimeSeconds();
	var nextHours = parseInt(nextTimeSeconds/3600);
	var nextMinutes = parseInt((nextTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextTimeSeconds % 60;
	var currentHours = parseInt(currentTimeSeconds/3600);
	var currentMinutes = parseInt((currentTimeSeconds-currentHours*3600)/60);
	var currentSeconds = currentTimeSeconds % 60;
	if(currentSeconds != nextSeconds){
	//如果当前秒数和上一次秒数不一样，就意味时间改变，需要遍历倒数计时的每位数字，判定哪位数字发生改变
		if(parseInt(currentHours/10)!=parseInt(nextHours/10)){
			addBalls(0,MARGIN_TOP,parseInt(nextHours/10));
		}
		if(parseInt(currentHours%10)!=parseInt(nextHours%10)){
			addBalls(7*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(nextHours%10));	
		}
		if(parseInt(currentMinutes/10)!=parseInt(nextMinutes/10)){
			addBalls(18*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(nextMinutes/10));
		}
		if(parseInt(currentMinutes%10)!=parseInt(nextMinutes%10)){
			addBalls(25*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(nextMinutes%10));
		}
		if(parseInt(currentSeconds/10)!=parseInt(nextSeconds/10)){
			addBalls(36*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(nextSeconds/10));
		}
		if(parseInt(currentSeconds%10)!=parseInt(nextSeconds%10)){
			addBalls(44*2*(RADIUS+1)+MARGIN_LEFT,MARGIN_TOP,parseInt(nextSeconds%10));
		}
		currentTimeSeconds = nextTimeSeconds;
		
	}
	//当滚落小球数组的长度大于0，才执行滚落小球的路径模拟
	if(balls.length > 0){
		updateBalls();
	}
}

/*指定滚落小球的运动路径*/
function updateBalls() {
	for(var i = 0; i < balls.length; i++){
		balls[i].x += balls[i].Vx;//每次水平偏移的圆心x坐标
		balls[i].y += balls[i].Vy;//每次垂直偏移的圆心y坐标
		balls[i].Vy += balls[i].g;//固定的重力加速度垂直偏移
		if(balls[i].y > (CANVAS_HEIGHT - RADIUS)){
			balls[i].y = CANVAS_HEIGHT - RADIUS;
			balls[i].Vy = - balls[i].Vy * 0.75;
		}//超出画布高度就反弹到垂直偏移的0.75倍高度
		/*超出画布边界的小球将从数组删除掉*/
		if(balls[i].x + RADIUS < 0 || balls[i].x -RADIUS >CANVAS_WIDTH){
			balls.splice(i,1);
		}
	}
}

/*倒计时数字发生改变，就添加小球进行滚落,也就是绘制改变的数字的图形*/
function addBalls (x,y,num) {
	for(var i = 0;i < digit[num].length; i++){
		for(var j = 0;j < digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var ball = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),//圆心的x坐标
					y:y+i*2*(RADIUS+1)+(RADIUS+1),//圆心的y坐标
					g:1 + Math.random(),//垂直加速度
					Vx:Math.pow(-1, Math.ceil(Math.random()*1000))*4,//水平速度，也可理解为水平偏移
					Vy:-5,//垂直速度
					color:ballColor[Math.floor(Math.random()*ballColor.length)]
					//随机生成小球颜色
				}
				balls.push(ball);//把需要滚落的小球添加到balls数组
			}
		}
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