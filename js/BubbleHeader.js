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
globalBubbleHeaderArr	= Array();



/*
*	Using:
*	var tmp	= new dippe.BubbleHeader( document.getElementById('something') );
*
*	The canvas size will be set to the element CSS size, which must be given in px!!. If it is not set then will be set to the default 900x100px
*
*	Multiple effect per page is allowed :)
*
*/
(function(namespace){

	//  *** BubbleHeader ***
	var BubbleHeader	= function( DOMCanvas, effect ){

		globalBubbleHeaderArr.push( this );

		style		= window.getComputedStyle(DOMCanvas)
    	cssWidth	= style.getPropertyValue('width');
    	cssHeight	= style.getPropertyValue('height');

    	// get the css and remove the "px" from the end
    	var tmpWidth	= Number( cssWidth.substr(0,cssWidth.length-2) );
    	var tmpHeight	= Number( cssHeight.substr(0,cssHeight.length-2) );

		this.STAGE_WIDTH	= typeof tmpWidth == "undefined" ? this.STAGE_WIDTH : tmpWidth;
		this.STAGE_HEIGHT	= typeof tmpHeight == "undefined" ? this.STAGE_HEIGHT : tmpHeight;

		/* A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target globals.canvas. */
		this.stage		= new createjs.Stage(DOMCanvas);
        DOMCanvas.width    = this.STAGE_WIDTH;
        DOMCanvas.height   = this.STAGE_HEIGHT;

		// *** generate header ***
		switch( effect ){
			case 1: this.effectRain();
				break;
			case 0: 
			default: this.effectBubble();
				break;
		}

		
		// set the global ticker which used by tween.js and easeljs animations
		var	thisBubbleHeader	= this;

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addListener(this.tick);

		console.log('BubbleHeader started (x,y):' + (this.STAGE_WIDTH + ',' + this.STAGE_HEIGHT));
	}

	//  *** BubbleHeader properties ***
	BubbleHeader.stage			= null;
	BubbleHeader.shape			= null;
	BubbleHeader.bubbleArr		= Array();
	BubbleHeader.STAGE_WIDTH	= 900;
	BubbleHeader.STAGE_HEIGHT	= 100;


	/*
	*	*** BubbleHeader methods ***
	*/

	BubbleHeader.prototype.tick = function(){
		// console.log(this.a);
		for( i=0; i<globalBubbleHeaderArr.length; i++){
			globalBubbleHeaderArr[i].stage.update();
		}
	}


	BubbleHeader.prototype.effectRain	= function(){
		for(var i=0;i<100;i++){

			var g		= new createjs.Graphics;
			var x		= Math.round(Math.random()*this.STAGE_WIDTH);
			// var y		= Math.round(Math.random()*500);
			var y		= -12;
			var size	= Math.round(Math.random()*5)+1;
			var wait	= Math.round(Math.random()*3000);
			var time	= Math.round( 10000/(size/2) );		// minel nagyobb, annal gyorsabban essen le

			var randomYOffset	= Math.round(Math.random()*-30);


			g.beginFill( createjs.Graphics.getRGB( '0xcccccc', 1/size ) );
			g.setStrokeStyle(1);
			g.beginStroke('#eee');
			g.drawCircle( 0, 0, size );
			g.endStroke();


			s	= new createjs.Shape(g);
			s.x	= x;
			s.y	= y;
			s.cache(-1*size,-1*size,size*2,size*2);

			tween = createjs.Tween.get( s );
			tween.wait(wait).to({y:(this.STAGE_HEIGHT+randomYOffset),alpha:0.2},time, createjs.Ease.bounceOut );

			tween.loop=true;

			this.stage.addChild(s);
			// this.bubbleArr[i].shape	= s;

		}
	}

	
	BubbleHeader.prototype.effectBubble	= function(){
		for(var i=0;i<50;i++){

			var g		= new createjs.Graphics;
			var x		= Math.round(Math.random()*this.STAGE_WIDTH);
			var y		= Math.round(Math.random()*this.STAGE_HEIGHT);
			var size	= Math.round(Math.random()*50);
			var wait	= Math.round(Math.random()*3000);

			var randomYOffset	= Math.round(Math.random()*-30);


			g.beginFill( createjs.Graphics.getRGB( '0xcccccc', 0.1 ) );
			g.setStrokeStyle(1);
			g.beginStroke('#ddd');
			g.drawCircle( 0, 0, size );
			g.endStroke();


			s	= new createjs.Shape(g);
			s.x	= x;
			s.y	= y;
			s.alpha = 0;
			// s.cache(-1*size,-1*size,size*2,size*2);

			tween = createjs.Tween.get( s );
			tween.wait(wait).to({alpha:1,x:(x+25)},1000).to({alpha:0,x:(x+100)},4000 );

			tween.loop=true;

			this.stage.addChild(s);
			// this.bubbleArr[i].shape	= s;

		}
	}



	/*
	*	Cache testing:
	*	Add cache to every cloud shape;
	*	Comment: The caching will be slow if the cached graphic is too big. 
	*/
	BubbleHeader.prototype.turnOnCache	= function( sizeX, sizeY ){
		// set the defult size
		if (sizeX==0){
			sizeX=300;
			sizeY=180;
		}

		for  ( var i=0; i<globals.cloudArr.length; i++){
			//turn on the cache
			this.bubbleArr[i].shape.cache(0,0,sizeX,sizeY);					// NA EZÉRT SZÍVÁS A DEFAULT FELHŐ OFFSET
		}
	}


	BubbleHeader.prototype.turnOffCache	= function(){

		for  ( var i=0; i<globals.cloudArr.length; i++){
			//turn on the cache
			this.bubbleArr[i].shape.uncache();
		}
	}


namespace.BubbleHeader	= BubbleHeader;
}(dippe || (dippe = {})));
var dippe;