var cols = 12;
var perSideSize = 50;
var totalSize = cols*perSideSize;
var lineStrokeWidth = 6;
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
				.viewbox(0, 0, totalSize*1.2, totalSize*1.2)
				.size('100%', '100%')
				.attr({id:'g4m3'});
}

function drawLines()
{
	//draw col lines
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
}


function drawVerticalLines(i , j)
{
	var vertical_startPointX = ((i-1)*perSideSize) + WidthAdjuster;
	var vertical_startPointY = ((j-1)*perSideSize) + WidthAdjuster;

	var vertical_endPointX = ((i-1)*perSideSize) + WidthAdjuster;
	var vertical_endPointY = (j*perSideSize) + WidthAdjuster;

	var V_id = (i)+':'+(j)+'-'+(i)+':'+(j+1);

	var V_line = draw
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

	var H_line = draw
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
	var polygon = draw
					.polygon(polygonPosition)
					.attr({id:'P_'+P_id,class:'p'});	
}



function markLine(element, orientation)
{
	if(SVG.get(element.id).hasClass('owned'))
		return false;

	//The color need to be identified by the player who is currently playing
	var playerDetails = getPlayerDetails(currentPlayer);
	SVG.get(element.id)
	.style({ stroke: playerDetails.color })
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
	$('#players-container table tr td').append(html);
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
	var ownedStatus = false;
	var currentUnderCheckingLine = (element.id).slice(2).split('-');

	//since	it is a horizontal line
	var actualPoints = [];
	for(var i in currentUnderCheckingLine)	
	   actualPoints.push(currentUnderCheckingLine[i].split(':'));

	//console.log(actualPoints);

	if(orientation == 'H')
	{
		//Need a better implementation

		//traversing counter anti clockwise
		if(actualPoints[0][1] > 1)	//which means it is the first row no anti clockwise is needed
		{
			var owned = traverseAntiClockWise_H(parseInt(actualPoints[0][0]), parseInt(actualPoints[0][1]), parseInt(actualPoints[1][0]), parseInt(actualPoints[1][1]))
			if(owned)
			{
				markOwned(owned, currentPlayer);
				ownedStatus = true;
			}
		}
		if(actualPoints[1][1] <= cols)	//which means it is the last row no clockwise is needed
		{
			var owned = traverseClockWise_H(parseInt(actualPoints[0][0]), parseInt(actualPoints[0][1]), parseInt(actualPoints[1][0]),parseInt( actualPoints[1][1]))
			if(owned)
			{
				markOwned(owned, currentPlayer);
				ownedStatus = true;		
			}
		}	
	}
	if(orientation == 'V')
	{
		if(actualPoints[1][0] > 1)	//which means it is the first row no anti clockwise is needed
		{
			var owned = traverseAntiClockWise_V(parseInt(actualPoints[0][0]), parseInt(actualPoints[0][1]), parseInt(actualPoints[1][0]),parseInt( actualPoints[1][1]))
			if(owned)
			{
				markOwned(owned, currentPlayer);
				ownedStatus = true;		
			}
		}

		if(actualPoints[0][0] <= cols)	//which means it is the first row no anti clockwise is needed
		{
			var owned = traverseClockWise_V(parseInt(actualPoints[0][0]), parseInt(actualPoints[0][1]), parseInt(actualPoints[1][0]),parseInt( actualPoints[1][1]))
			if(owned)
			{
				markOwned(owned, currentPlayer);
				ownedStatus = true;		
			}
		}
	}


	return ownedStatus;
}

function markOwned(rectangleId, ownedPlayer)
{
	var playerDetails = getPlayerDetails(ownedPlayer);
	SVG.get(rectangleId)
				.style({ fill: playerDetails.color })
				.addClass('owned');

	updateStat(rectangleId, ownedPlayer);			
}



function traverseAntiClockWise_H(x1, y1, x2, y2)
{
	var L1 = 'H_'+(x1)+':'+(y1)+'-'+(x2)+':'+(y2);
	var L2 = 'V_'+(x1+1)+':'+(y1-1)+'-'+(x2)+':'+(y2);	
	var L3 = 'H_'+(x1)+':'+(y1-1)+'-'+(x2)+':'+(y2-1);	
	var L4 = 'V_'+(x1)+':'+(y1-1)+'-'+(x2-1)+':'+(y2);

	//The sides would be L3-L2-L1-L4
	var R = 'P_'+(x1)+':'+(y1-1)+'-'+(x2)+':'+(y2-1)+'-'+(x2)+':'+(y2)+'-'+(x1)+':'+(y1); //Find the rectangle id
	if(checkIfLinesMarked(L1, L2, L3, L4))
		return R;
	else
		return false;
}



function traverseClockWise_H(x1, y1, x2, y2)
{
	var L1 = 'H_'+(x1)+':'+(y1)+'-'+(x2)+':'+(y2);
	var L2 = 'V_'+(x1+1)+':'+(y1)+'-'+(x2)+':'+(y2+1);
	var L3 = 'H_'+(x1)+':'+(y1+1)+'-'+(x2)+':'+(y2+1);
	var L4 = 'V_'+(x1)+':'+(y1)+'-'+(x2-1)+':'+(y2+1);

	//The sides would beL1-L2-L3-L4
	var R = 'P_'+(x1)+':'+(y1)+'-'+(x2)+':'+(y2)+'-'+(x2)+':'+(y2+1)+'-'+(x1)+':'+(y1+1); //Find the rectangle id
	if(checkIfLinesMarked(L1, L2, L3, L4))
		return R;
	else
		return false;
}



function traverseClockWise_V(x1, y1, x2, y2)
{
	var L1 = 'V_'+(x1)+':'+(y1)+'-'+(x2)+':'+(y2);
	var L2 = 'H_'+(x1)+':'+(y1)+'-'+(x2+1)+':'+(y2-1);	
	var L3 = 'V_'+(x1+1)+':'+(y1)+'-'+(x2+1)+':'+(y2);	
	var L4 = 'H_'+(x1)+':'+(y1+1)+'-'+(x2+1)+':'+(y2);

	//The sides would be L1-L2-L3-L4
	var R = 'P_'+(x1)+':'+(y1)+'-'+(x1+1)+':'+(y1)+'-'+(x2+1)+':'+(y2)+'-'+(x2)+':'+(y2); //Find the rectangle id
	if(checkIfLinesMarked(L1, L2, L3, L4))
		return R;
	else
		return false;
}



function traverseAntiClockWise_V(x1, y1, x2, y2)
{
	var L1 = 'V_'+(x1)+':'+(y1)+'-'+(x2)+':'+(y2);
	var L2 = 'H_'+(x1-1)+':'+(y1+1)+'-'+(x2)+':'+(y2);	
	var L3 = 'V_'+(x1-1)+':'+(y1)+'-'+(x2-1)+':'+(y2);	
	var L4 = 'H_'+(x1-1)+':'+(y1)+'-'+(x2)+':'+(y2-1);

	//The sides would be L3-L2-L1-L4

	var R = 'P_'+(x1-1)+':'+(y1)+'-'+(x1)+':'+(y1)+'-'+(x2)+':'+(y2)+'-'+(x2-1)+':'+(y2); //Find the rectangle id
	if(checkIfLinesMarked(L1, L2, L3, L4))
		return R;
	else
		return false;
}



function checkIfLinesMarked(L1, L2, L3, L4)
{
	try {
	  if(SVG.get(L1).hasClass('owned') && SVG.get(L2).hasClass('owned') && SVG.get(L3).hasClass('owned') && SVG.get(L4).hasClass('owned') )
	  	return true;
	  else
	  	return false;
	}
	catch (ex) {
	  console.error("outer", ex.message);
	  return false;
	}
}

function updateStat(rectangleId, playerId)
{
	var currentUserStat = $('#player-btn-'+playerId+' .badge').html();
	$('#player-btn-'+playerId+' .badge').html((parseInt(currentUserStat)+1));
}

function checkIfGameComplete()
{
	if($('polygon').not('.owned').length == 0)
		return true;
	else
		return false;
}

function zoom(value)
{
	var box = draw.scale(0.5, -1);
}