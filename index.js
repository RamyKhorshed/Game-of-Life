var liveCount = 0;
var maxCount = 0;
var percentage = (liveCount/maxCount) *100;

window.onload=function(){
	var gridHeight = 500;
	var gridWidth = 500;
	var theGrid = createArray(gridWidth);
	var mirrorGrid = createArray(gridWidth);
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.fillStyle = "#FF0000";
  createTimeline()

	fillRandom(); //create the starting state for the grid by filling it with random cells

	tick(); //call main loop

	//functions
	function tick() { //main loop
	    console.time("loop");
	    drawGrid();
	    updateGrid();
	    console.timeEnd("loop");
	    requestAnimationFrame(tick);
	}

	function createArray(rows) { //creates a 2 dimensional array of required height
	    var arr = [];
	    for (var i = 0; i < rows; i++) {
	        arr[i] = [];
	    }
	    return arr;
	}

	function fillRandom() { //fill the grid randomly
	    for (var j = 50; j < gridHeight - 50; j++) { //iterate through rows
	        for (var k = 50; k < gridWidth - 50; k++) { //iterate through columns
	            theGrid[j][k] = Math.round(Math.random());
	        }
	    }
	}

	function drawGrid() { //draw the contents of the grid onto a canvas
    liveCount = 0;
	    ctx.clearRect(0, 0, gridHeight, gridWidth); //this should clear the canvas ahead of each redraw
	    for (var j = 1; j < gridHeight; j++) { //iterate through rows
	        for (var k = 1; k < gridWidth; k++) { //iterate through columns
	            if (theGrid[j][k] === 1) {
	                ctx.fillRect(j, k, 1, 1);
                    liveCount++;


	            }
	        }
	    }
		document.getElementById('counter').innerHTML = liveCount;

	}

  function calculateCells(totalCells, theGrid, j, k) {
 							totalCells += theGrid[j - 1][k - 1]; //top left
	            totalCells += theGrid[j - 1][k]; //top center
	            totalCells += theGrid[j - 1][k + 1]; //top right

	            totalCells += theGrid[j][k - 1]; //middle left
	            totalCells += theGrid[j][k + 1]; //middle right

	            totalCells += theGrid[j + 1][k - 1]; //bottom left
	            totalCells += theGrid[j + 1][k]; //bottom center
	            totalCells += theGrid[j + 1][k + 1]; //bottom right
              return totalCells
  }

	function updateGrid() { //perform one iteration of grid update

	    for (var j = 1; j < gridHeight - 1; j++) { //iterate through rows
	        for (var k = 1; k < gridWidth - 1; k++) { //iterate through columns
	            var totalCells = 0;
	            //add up the total values for the surrounding cells
	            totalCells = calculateCells(totalCells, theGrid, j, k)

	            //apply the rules to each cell
	            switch (totalCells) {
	                case 2:
	                    mirrorGrid[j][k] = 0;

	                    break;
	                case 3:
	                    mirrorGrid[j][k] = 1; //live

	                    break;

										

	                default:
	                    mirrorGrid[j][k] = 0; //
	            }
	        }
	    }

	    //mirror edges to create wraparound effect

	    for (var l = 1; l < gridHeight - 1; l++) { //iterate through rows
	        //top and bottom
	        mirrorGrid[l][0] = mirrorGrid[l][gridHeight - 3];
	        mirrorGrid[l][gridHeight - 2] = mirrorGrid[l][1];
	        //left and right
	        mirrorGrid[0][l] = mirrorGrid[gridHeight - 3][l];
	        mirrorGrid[gridHeight - 2][l] = mirrorGrid[1][l];

	    }


	    //swap grids
	    var temp = theGrid;
	    theGrid = mirrorGrid;
	    mirrorGrid = temp;
	}
}//]]>

var random = new TimeSeries();
setInterval(function() {
  random.append(new Date().getTime(), liveCount);
}, 500);

function createTimeline() {
  var chart = new SmoothieChart();
  chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 2 });
  chart.streamTo(document.getElementById("chart"), 1000);
}
