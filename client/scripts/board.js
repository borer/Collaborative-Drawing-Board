/////////////////////////////////////FIGURES

var Line = function (canvasContext) {

	var newLine = {
		init: function(context) {
			this.ctx = context;
			this.defaultColor = '#C06979';
		},
		draw: function(fromX, fromY, toX, toY, myColor) {
			var color = myColor || this.defaultColor;

			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.moveTo(fromX, fromY);
			this.ctx.lineTo(toX, toY);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.restore();
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

			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.arc(centerX,centerY,radius,0,2*Math.PI);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.restore();
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
			this.ctx.save();
			this.circle.draw(centerX, centerY);
			this.ctx.fillStyle = myColor || this.defaultFillColor;
			this.ctx.fill();			
			this.ctx.restore();
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

			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.rect(fromX, fromY, width, height);
			this.ctx.strokeStyle = color;
			this.ctx.stroke();
			this.ctx.restore();
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
			this.ctx.save();
			this.ctx.translate(centerX, centerY);
			this.ctx.rotate(angleRotation * TO_RADIANS);
			this.ctx.translate(-centerX, -centerY);
			this.rectangle.draw(centerX, centerY);			
			this.ctx.restore();
		}
	};

	newRotatedRectangle.init(canvasContext);

	return newRotatedRectangle;
};

/////////////////////////////////////SERVER_COMUNNICATION



/////////////////////////////////////UTILS

function manageFigureSelection() {

	var figureEnum = {
		line: 1,
		circle: 2,
		rectangle: 3,
		rotatedRrectangle: 4,
		filledCircle: 5
	};
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
	var width = canvasContext.canvas.width;
    var height = canvasContext.canvas.height;

    canvasContext.rect(0, 0, width, height);
    canvasContext.fillStyle = "#5A798D";
    canvasContext.fill();
}

/////////////////////////////////////MAIN

$(function() {
    var boardElement = $('#Board').get(0);
	var canvasContext = boardElement.getContext("2d");
	initBoard(canvasContext);
	var selection = new manageFigureSelection();

	$('#Board').click(function (event) {
		var x = event.offsetX;
		var y = event.offsetY;

		if (selection.isCircleSelected()) {
			Circle(canvasContext).draw(x, y);
		} else if(selection.isFilledCircleSelected()) {
			FilledCircle(canvasContext).draw(x, y);
		}	else if (selection.isRectangleSelected()) {
			Rectangle(canvasContext).draw(x, y);
		} else if(selection.isRotatedRectangleSelected()) {
			RotatedRectangle(canvasContext).draw(x, y, 20);
		} else if(selection.isLineSelected()) {
			var centerX = canvasContext.canvas.width/2;
			var centerY = canvasContext.canvas.height/2;
			Line(canvasContext).draw(x, y,  centerX,  centerY);
		} 
	});
});