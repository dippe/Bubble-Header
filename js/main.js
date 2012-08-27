/*
* Bubble Header
*
* Copyright (c) 2012 Peter Dajka
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/	


/*
* Global variables
*/
	var game	= {};
	var globals	= {};

	/*
	*	CONSTS
	*/

	globals.STAGE_WIDTH				= 900;
	globals.STAGE_HEIGHT			= 100;
	
	/*
	*	GAME VARIABLES
	*/

	globals.canvas;			// the Main canvas
	globals.stage;			// Main stage

	// Layers
	globals.layerMainContainer;		// main container of the layers (~stage)
	globals.layerBubble;
	
	// Bubbles
	globals.bubbleArr				= new Array();


	/*
	*	DEVELOPMENT VARIABLES
	*/	

	// Development: variables for code running time measurement	
	var programStartDate		= new Date;
	var programStartTime		= programStartDate.getTime();
	var lastLogT				= programStartTime;
	
	// for measuring FPS
	var currDateFPS				= new Date;
	var currTimeFPS				= currDateFPS.getTime();



/*
*	the Main init function
*/
$(document).ready( function() {

	/* Get the globals.canvas and set the its size.
	*		(The size setting works only this way. why??)
	*/
	globals.canvas		= $('#container').get(0);
	globals.canvas.width	= globals.STAGE_WIDTH;
	globals.canvas.height	= globals.STAGE_HEIGHT;

	/* A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target globals.canvas. */
	globals.stage		= new createjs.Stage(globals.canvas);


	/*
	* Create layers in proper order
	*/

	// *** Create main layers ***
	globals.layerMainContainer	= new createjs.Container();
	globals.stage.addChild(globals.layerMainContainer);


	// *** Fill the layers ***

	game.Main.bubble();
	// game.Main.havacska();

	// set the global ticker which used by tween.js and easeljs animations
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addListener(tick);

}
);
// *** end $(document).ready function

function tick(){
	globals.stage.update();
}



/*
*	The Main object
*/

(function(namespace){
	var Main	= new Object;

	Main.havacska	= function(){
		for(var i=0;i<100;i++){

			var g		= new createjs.Graphics;
			var x		= Math.round(Math.random()*globals.STAGE_WIDTH);
			// var y		= Math.round(Math.random()*500);
			var y		= -12;
			var size	= Math.round(Math.random()*5)+1;
			var wait	= Math.round(Math.random()*3000);
			var time	= Math.round( 10000/(size/2) );		// minel nagyobb, annal gyorsabban essen le

			var randomYOffset	= Math.round(Math.random()*-30);


			g.beginFill( createjs.Graphics.getRGB( '0xdddddd', 1/size ) );
			g.setStrokeStyle(1);
			g.beginStroke('#eee');
			g.drawCircle( 0, 0, size );
			g.endStroke();


			var s	= new createjs.Shape(g);
			s.x	= x;
			s.y	= y;
			s.cache(-1*size,-1*size,size*2,size*2);

			tween = createjs.Tween.get( s );
			tween.wait(wait).to({y:(globals.STAGE_HEIGHT+randomYOffset),alpha:0.2},time, createjs.Ease.bounceOut );

			tween.loop=true;

			globals.layerMainContainer.addChild(s);

		}
	}

	Main.bubble	= function(){
		for(var i=0;i<50;i++){

			var g		= new createjs.Graphics;
			var x		= Math.round(Math.random()*globals.STAGE_WIDTH);
			var y		= Math.round(Math.random()*globals.STAGE_HEIGHT);
			var size	= Math.round(Math.random()*50);
			var wait	= Math.round(Math.random()*3000);

			var randomYOffset	= Math.round(Math.random()*-30);


			g.beginFill( createjs.Graphics.getRGB( '0xcccccc', 0.1 ) );
			g.setStrokeStyle(1);
			g.beginStroke('#ddd');
			g.drawCircle( 0, 0, size );
			g.endStroke();


			var s	= new createjs.Shape(g);
			s.x	= x;
			s.y	= y;
			s.alpha = 0;
			// s.cache(-1*size,-1*size,size*2,size*2);

			tween = createjs.Tween.get( s );
			tween.wait(wait).to({alpha:1,x:(x+25)},1000).to({alpha:0,x:(x+100)},4000 );

			tween.loop=true;

			globals.layerMainContainer.addChild(s);

		}
	}



	/*
	*	Cache testing:
	*	Add cache to every cloud shape;
	*	Comment: The caching will be slow if the cached graphic is too big. 
	*/
	Main.turnOnCache	= function( sizeX, sizeY ){
		// set the defult size
		if (sizeX==0){
			sizeX=300;
			sizeY=180;
		}

		for  ( var i=0; i<globals.cloudArr.length; i++){
			//turn on the cache
			globals.cloudArr[i].shape.cache(0,0,sizeX,sizeY);					// NA EZÉRT SZÍVÁS A DEFAULT FELHŐ OFFSET
		}
	}


	Main.turnOffCache	= function(){

		for  ( var i=0; i<globals.cloudArr.length; i++){
			//turn on the cache
			globals.cloudArr[i].shape.uncache();
		}
	}


namespace.Main	= Main;
}(game || (game = {})));
var game;