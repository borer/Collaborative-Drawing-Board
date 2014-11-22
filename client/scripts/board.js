/////////////////////////////////////FIGURES

var figureEnum = {
	line: 1,
	circle: 2,
	rectangle: 3,
	rotatedRrectangle: 4,
	filledCircle: 5
};

var Line = function (canvasContext) {

	var newLine = {
		init: function(context) {
			this.ctx = context;
			this.defaultColor = '#C06979';
		},
		draw: function(fromX, fromY, toX, toY, myColor) {
			var color = myColor || this.defaultColor;
			this.json = {
				'figureId': figureEnum.line,
				'fromX': fromX,
				'fromY': fromY,
				'toX': toX,
				'toY' : toY,
				'myColor': myColor
			};

			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.moveTo(fromX, fromY);
			this.ctx.lineTo(toX, toY);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.restore();
		},
		toJson: function() {
			return this.json;
		},
		drawFromJson: function(props) {
			this.draw(props.fromX, props.fromY, props.toX, props.toY, props.myColor);
		}
	};

	newLine.init(canvasContext);

	return newLine;
};

var Circle = function (canvasContext) {

	var newCircle =	{
		init: function(context) {
			this.ctx = context;
			this.defaultColor = '#E77D87';
			this.defaultRadius = 10;
		},
		draw: function(centerX, centerY, myRadius, myColor) {
			var radius = myRadius || this.defaultRadius;
			var color = myColor || this.defaultColor;
			this.json = {
				'figureId': figureEnum.circle,
				'centerX': centerX,
				'centerY': centerY,
				'myRadius': myRadius,
				'myColor': myColor
			};

			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.arc(centerX,centerY,radius,0,2*Math.PI);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.restore();
		},
		toJson: function() {
			return this.json;
		},
		drawFromJson: function(props) {
			this.draw(props.centerX, props.centerY, props.myRadius, props.myColor);
		}
	};

	newCircle.init(canvasContext);

	return newCircle;
};

var FilledCircle = function (canvasContext) {

	var newFilledCircle = {
		init: function(context){
			this.ctx = context;
			this.circle = new Circle(this.ctx);
			this.defaultFillColor = '#E3AE0A';
		},
		draw: function(centerX, centerY, myColor) {
			this.json = {
				'figureId': figureEnum.filledCircle,
				'centerX': centerX,
				'centerY': centerY,
				'myColor': myColor
			};

			this.ctx.save();
			this.circle.draw(centerX, centerY);
			this.ctx.fillStyle = myColor || this.defaultFillColor;
			this.ctx.fill();			
			this.ctx.restore();
		},
		toJson: function() {
			return this.json;
		},
		drawFromJson: function(props) {
			this.draw(props.centerX, props.centerY, props.myColor);
		}
	};

	newFilledCircle.init(canvasContext);

	return newFilledCircle;
};

var Rectangle = function (canvasContext) {

	var newRectangle =	{
		init: function(context) {
			this.ctx = context;
			this.defaultColor = '#E3AE0A';
			this.defaultWidth = 30;
			this.defaultHeight = 10;
		},
		draw: function(centerX, centerY, myWidth, myHeight, myColor) {
			var color = myColor || this.defaultColor;
			var width = myWidth || this.defaultWidth;
			var height = myHeight || this.defaultHeight;

			var fromX = centerX - width/2;
			var fromY = centerY - height/2;

			this.json = {
				'figureId': figureEnum.rectangle, 
				'centerX': centerX,
				'centerY': centerY,
				'myWidth': myWidth,
				'myHeight': myHeight,
				'myColor': myColor
			};

			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.rect(fromX, fromY, width, height);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.restore();
		},
		toJson: function() {
			return this.json;
		},
		drawFromJson: function(props) {
			this.draw(props.centerX, props.centerY, props.myWidth, props.myHeight, props.myColor);
		}
	};

	newRectangle.init(canvasContext);

	return newRectangle;
};

var TO_RADIANS = Math.PI/180; 
var RotatedRectangle = function (canvasContext) {

	var newRotatedRectangle = {
		init: function(context){
			this.ctx = context;
			this.rectangle = new Rectangle(this.ctx);
		},
		draw: function(centerX, centerY, angleRotation) {
			this.json = {
				'figureId': figureEnum.rotatedRrectangle, 
				'centerX': centerX,
				'centerY': centerY,
				'angleRotation': angleRotation
			};

			this.ctx.save();
			this.ctx.translate(centerX, centerY);
			this.ctx.rotate(angleRotation * TO_RADIANS);
			this.ctx.translate(-centerX, -centerY);
			this.rectangle.draw(centerX, centerY);			
			this.ctx.restore();
		},
		toJson: function() {
			return this.json;
		},
		parseFromJson: function(props) {
			this.draw(props.centerX, props.centerY, props.angleRotation);
		}
	};

	newRotatedRectangle.init(canvasContext);

	return newRotatedRectangle;
};

/////////////////////////////////////UTILS

function SelectionManager() {

	var selectedFigure = figureEnum.line;

	$('.line').click(function() {
		selectedFigure = figureEnum.line;
	});
	$('.circle').click(function() {
		selectedFigure = figureEnum.circle;
	});
	$('.rectangle').click(function() {
		selectedFigure = figureEnum.rectangle;
	});
	$('.rotatedRrectangle').click(function() {
		selectedFigure = figureEnum.rotatedRrectangle;
	});
	$('.filledCircle').click(function() {
		selectedFigure = figureEnum.filledCircle;
	});

	return {
		isLineSelected: function() {
			return selectedFigure === figureEnum.line;
		},
		isCircleSelected: function() {
			return selectedFigure === figureEnum.circle;
		},
		isRectangleSelected: function() {
			return selectedFigure === figureEnum.rectangle;
		},
		isRotatedRectangleSelected: function() {
			return selectedFigure === figureEnum.rotatedRrectangle;
		},
		isFilledCircleSelected: function() {
			return selectedFigure === figureEnum.filledCircle;
		}
	};
}

function initBoard(canvasContext) {
    canvasContext.rect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.fillStyle = "#5A798D";
    canvasContext.fill();
}

/////////////////////////////////////SERVER_COMUNNICATION

var eventNames = {
	newDraw: 'newDraw'
};

function CommunicationManager(canvasContext) {
	var socket = io();

	socket.on(eventNames.newDraw, function(msg){
		drawFigureFromJson(msg, canvasContext);
	});

	function drawFigureFromJson(msg, canvasContext) {

		var newFigure;

		if (msg.figureId === figureEnum.circle) {
			newFigure = Circle(canvasContext);

		} else if (msg.figureId === figureEnum.filledCircle) {
			newFigure = FilledCircle(canvasContext);

		} else if (msg.figureId === figureEnum.rectangle) {
			newFigure = Rectangle(canvasContext);

		} else if (msg.figureId === figureEnum.rotatedRrectangle) {
			newFigure = RotatedRectangle(canvasContext);

		} else if(msg.figureId === figureEnum.line) {
			newFigure = Line(canvasContext);
		} 

		newFigure.drawFromJson(msg);
	}

	return {
		broadcastEvent: function(event) {
			socket.emit(event.name, event.data);
		}
	};
}

/////////////////////////////////////MAIN

$(function() {
    var boardElement = $('#Board').get(0);
	var canvasContext = boardElement.getContext("2d");
	initBoard(canvasContext);

	var selectionManager = new SelectionManager();
	var communicationManager = new CommunicationManager(canvasContext);

	$('#Board').click(function (event) {
		var x = event.offsetX;
		var y = event.offsetY;

		var newFigure;
		if (selectionManager.isCircleSelected()) {
			newFigure = Circle(canvasContext);
			newFigure.draw(x, y);

		} else if(selectionManager.isFilledCircleSelected()) {
			newFigure = FilledCircle(canvasContext);
			newFigure.draw(x, y);

		} else if (selectionManager.isRectangleSelected()) {
			newFigure = Rectangle(canvasContext);
			newFigure.draw(x, y);

		} else if(selectionManager.isRotatedRectangleSelected()) {
			newFigure = RotatedRectangle(canvasContext);
			newFigure.draw(x, y, 20);

		} else if(selectionManager.isLineSelected()) {
			var centerX = canvasContext.canvas.width/2;
			var centerY = canvasContext.canvas.height/2;
			newFigure = Line(canvasContext);
			newFigure.draw(x, y,  centerX,  centerY);
		} 

		communicationManager.broadcastEvent({name: eventNames.newDraw, data: newFigure.toJson()});
	});
});
