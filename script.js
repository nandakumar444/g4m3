var cols = 2;
var perSideSize = 50;
var totalSize = cols*perSideSize;
var lineStrokeWidth = 4;
var WidthAdjuster = (lineStrokeWidth/2);


var draw;
var lineStyle = {cursor:'pointer'};

var playerJsonArray = {
							"1":{"id":"9999","name":"Player 1","initial":"H","color":"#337ab7"},
							"2":{"id":"4444","name":"Player 2","initial":"N","color":"#5cb85c"},
							"3":{"id":"5555","name":"Player 3","initial":"K","color":"#d9534f"}
						};
var playerArray = [];

var currentPlayer = 1;
var totalPlayers = Object.keys(playerJsonArray).length;

function  initializeSVG()
{
	draw = SVG('drawing')
				.size(totalSize*1.2, totalSize*1.2);
}

function drawLines()
{
	//draw col lines
	for(var i = 1; i <= cols+1; i++)
	{
		for(var j = 1; j <= cols; j++)
		{
			var id = i+':'+j+'-'+(i+1)+':'+(j+1);

			//Draw columns lines
			var horizontal_startPointX = ((j-1)*perSideSize) + WidthAdjuster;	
			var horizontal_startPointY = ((i-1)*perSideSize) + WidthAdjuster;

			var horizontal_endPointX = (j*perSideSize) + WidthAdjuster;
			var horizontal_endPointY = ((i-1)*perSideSize) + WidthAdjuster;

			var H_id = (i)+':'+(j)+'-'+(j+1)+':'+(i);

			var H_line = draw
							.line(horizontal_startPointX, horizontal_startPointY, horizontal_endPointX, horizontal_endPointY)
							.stroke({ width: lineStrokeWidth,color:'#fc8502'})
							.attr({id:'H_'+H_id,onclick:'markLine(this,"H")', style:lineStyle});


			
			//Draw row lines
			var vertical_startPointX = ((i-1)*perSideSize) + WidthAdjuster;
			var vertical_startPointY = ((j-1)*perSideSize) + WidthAdjuster;

			var vertical_endPointX = ((i-1)*perSideSize) + WidthAdjuster;
			var vertical_endPointY = (j*perSideSize) + WidthAdjuster;

			var V_id = (i)+':'+(j)+'-'+(i)+':'+(j+1);

			var V_line = draw
							.line(vertical_startPointX, vertical_startPointY, vertical_endPointX, vertical_endPointY)
							.stroke({ width: lineStrokeWidth,color:'#fc8502'})
							.attr({id:'V_'+V_id,onclick:'markLine(this,"V")', style:lineStyle});					
		}
	}
}


function drawRechangularContainers()
{
	//Draw the rectangle
	var boxWidthFactor = WidthAdjuster + (lineStrokeWidth/2);
	for(var i = 0; i < cols; i++)
	{
		for(var j = 0; j < cols; j++)
		{
			var topLeft = [(i*perSideSize)+boxWidthFactor, (j*perSideSize)+boxWidthFactor];
			var topRight = [((i+1)*perSideSize),(j*perSideSize)+boxWidthFactor];
			var bottomRight = [((i+1)*perSideSize),((j+1)*perSideSize)];
			var bottomLeft = [(i*perSideSize)+boxWidthFactor,((j+1)*perSideSize)];

			var polygonPosition = [topLeft,topRight,bottomRight,bottomLeft];
			//console.log(polygonPosition);	
			var P_id = (i)+':'+(j)+'-'+(i+1)+':'+(j)+'-'+(i+1)+':'+(j+1)+'-'+(i)+':'+(j+1);
			var polygon = draw
							.polygon(polygonPosition)
							.fill('#c9d7de')
							.stroke({ width: 0 })
							.attr({id:'P_'+P_id});	

								
		}
	}
}

function markLine(element, orientation)
{
	//The color need to be identified by the player who is currently playing
	var playerDetails = getPlayerDetails(currentPlayer);
	SVG.get(element.id)
	.stroke({color:playerDetails.color})
	.addClass('owned');

	//Find if the currently marked line gives the player any row
	owned = checkIfOwned(element, orientation);
	if(!owned)
	{
		findNextPlayer();
		switchPlayer(currentPlayer);
	}
	else
	{
		//Mark the current player as the owner of the rectangle
		//reflect the value onto the stat
	}
}


function initializeUsers()
{
	//Issue in the below code
	// i will start from 1, but the array will be created with index as 0
	for(var i in playerJsonArray)
	{	
	    playerArray.push(playerJsonArray [i]);

	    //Create the html
	    createPlayerDetails(i, playerJsonArray [i]);
	}

}

function createPlayerDetails(playerId, playerDetails)
{
	var currentPlayerStat = (currentPlayer == playerId)?' btn-loading ':'';
	var html = '<button id="player-btn-'+playerId+'" class="btn btn-primary playerstat '+currentPlayerStat+'" type="button" style="background-color:'+playerDetails.color+'">'+playerDetails.name+' <span class="badge">0</span></button>';
	$('#players-container table').append(html);
}

function switchPlayer(playerId)
{
	$('.playerstat').removeClass('btn-loading');
	$('#player-btn-'+playerId).addClass('btn-loading');
}

function findNextPlayer()
{
	if(currentPlayer >= totalPlayers)
		currentPlayer = 1;
	else 
		currentPlayer = currentPlayer +1;
}

function getPlayerDetails(playerId)
{
	return playerArray[playerId-1];
}

function checkIfOwned(element, orientation)
{
	if(orientation == 'H')
	{
		var currentUnderCheckingLine = (element.id).slice(2).split('-');

		//since it is a horizontal line
		var actualPoints = [];
		for(var i in currentUnderCheckingLine)	
		   actualPoints.push(currentUnderCheckingLine[i].split(':'));

		console.log(actualPoints);

		//Need a better implementation

		//traversing counter clockwise

		var clk_firstLine = 'H_'+actualPoints[0][0]+'-'+actualPoints[0][1]+':'+actualPoints[1][0]+'-'+actualPoints[1][1];
		var clk_secondLine = 'V_'+actualPoints[1][0]+'-'+actualPoints[1][1]+':'+actualPoints[1][0]+'-'+ (parseInt(actualPoints[1][1])-1);
		var clk_thirdLine = 'H_'+actualPoints[1][0]+'-'+ (parseInt(actualPoints[1][1])-1)+':'+(parseInt(actualPoints[1][0]) - 1)+'-'+(parseInt(actualPoints[1][1])-1);	
		var clk_fourthLine = 'V_'+(parseInt(actualPoints[1][0]) - 1)+'-'+(parseInt(actualPoints[1][1])-1)+'::'+actualPoints[0][0]+'-'+actualPoints[0][1];

		if(SVG.get(clk_firstLine).hasClass('owned') && SVG.get(clk_secondLine).hasClass('owned') && SVG.get(clk_thirdLine).hasClass('owned') && SVG.get(clk_fourthLine).hasClass('owned') )
		{
			markOwned('123', currentPlayer);
			alert();
		}


		
	}


	return false;
}

function markOwned(rectangleId, ownedPlayer)
{
	var playerDetails = getPlayerDetails(ownedPlayer);
	SVG.get(rectangleId)
				.fill(playerDetails.color);
}


function traverseClockWise(actualPoints)
{
	for(i in actualPoints)
	{

	}
}