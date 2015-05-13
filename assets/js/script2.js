function g4m3()
{
	this.game;
	this.cols;

	this.start = function(){
		//this function works as a construcor; sort of
		this.cols = 5;

		//Get the game details from the server
		this.render();
	}			
	this.render = function(){

		var perSideSize = 50;
		var totalSize = (this.cols)*perSideSize;
		var lineStrokeWidth = 6;
		var WidthAdjuster = (lineStrokeWidth/2);
		var cols = this.cols;

		//create the svg
		game = this.game = SVG('drawing')
				.viewbox(0, 0, totalSize*1.2, totalSize*1.2)
				.size('100%', '100%')
				.attr({id:'g4m3'});

		//render the lines
		for(var i = 1; i <= cols+1; i++)
		{
			for(var j = 1; j <= cols; j++)
			{
				drawVerticalLines(i , j);
				drawHorizontalLines(i, j);

				if(i <= cols )
					drawRechangularContainers(i, j);					
			}
		}

		function drawVerticalLines(i , j)
		{
			var vertical_startPointX = ((i-1)*perSideSize) + WidthAdjuster;
			var vertical_startPointY = ((j-1)*perSideSize) + WidthAdjuster;

			var vertical_endPointX = ((i-1)*perSideSize) + WidthAdjuster;
			var vertical_endPointY = (j*perSideSize) + WidthAdjuster;

			var V_id = (i)+':'+(j)+'-'+(i)+':'+(j+1);

			var V_line = game
							.line(vertical_startPointX, vertical_startPointY, vertical_endPointX, vertical_endPointY)
							.attr({id:'V_'+V_id,class:'l',onclick:'markLine(this,"V")'});				
		}

		function drawHorizontalLines(i, j)
		{
			//Draw columns lines
			var horizontal_startPointX = ((j-1)*perSideSize) + WidthAdjuster;	
			var horizontal_startPointY = ((i-1)*perSideSize) + WidthAdjuster;

			var horizontal_endPointX = (j*perSideSize) + WidthAdjuster;
			var horizontal_endPointY = ((i-1)*perSideSize) + WidthAdjuster;

			var H_id = (j)+':'+(i)+'-'+(j+1)+':'+(i);

			var H_line = game
							.line(horizontal_startPointX, horizontal_startPointY, horizontal_endPointX, horizontal_endPointY)
							.attr({id:'H_'+H_id,class:'l',onclick:'markLine(this,"H")'});
		}
		function drawRechangularContainers(i, j)
		{
			//Draw the rectangle
			var boxWidthFactor = WidthAdjuster + (lineStrokeWidth/2);
			var topLeft = [((i-1)*perSideSize)+boxWidthFactor, ((j-1)*perSideSize)+boxWidthFactor];
			var topRight = [((i)*perSideSize),((j-1)*perSideSize)+boxWidthFactor];
			var bottomRight = [((i)*perSideSize),((j)*perSideSize)];
			var bottomLeft = [((i-1)*perSideSize)+boxWidthFactor,((j)*perSideSize)];

			var polygonPosition = [topLeft,topRight,bottomRight,bottomLeft];
			//console.log(polygonPosition);	
			var P_id = (i)+':'+(j)+'-'+(i+1)+':'+(j)+'-'+(i+1)+':'+(j+1)+'-'+(i)+':'+(j+1);
			var polygon = game
							.polygon(polygonPosition)
							.attr({id:'P_'+P_id,class:'p'});	
		}
	}


}