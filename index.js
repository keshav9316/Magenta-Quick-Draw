let sketchRNN;
let currentStroke;
let nextpen = "down";
let x;
let y;
let personDrawing = false;
let seedpath =[];
let drawPoints =[];

function preload(){
 sketchRNN = ml5.sketchRNN('syringe');
}

function gotStrokePath(error , result){
 if(error){
   console.error(error)
 }
  console.log(result);
  currentStroke = result;
}

function startDrawing(){
 personDrawing = "true";
 x = mouseX;
 y = mouseY;
}
/*                    "sketchRNN" is an object of objects. 
"generate" generates a random sketch (which is an OBJECT) from sketchRNN  
             HOWEVER, "seedpath" is an array of objects.             */

function sketchRNNstart(){
  personDrawing = false; // control is taken back from user

//RNN
let rdpPoints = [];
rdpPoints.push(seedpath[0]); // seedpath is the array of our drawing-----------push start coordinate
rdp2(seedpath,0,seedpath.length-1,rdpPoints);  // RDP algorithm optimization call on our drawing-----> fills the rdpPoints[] with optimized coordinates
rdpPoints.push(seedpath[seedpath.length-1]); // push last drawn coordinate
//console.log(rdpPoints);
                   //drawing simplified rnn
 background(235);
 stroke(0);
 strokeWeight(4);
 beginShape();
 noFill();
 console.log(rdpPoints);
//  for(let i=0;i<rdpPoints.length-1;i++){
//    line(rdpPoints[i].x,rdpPoints[i].y,rdpPoints[i+1].x,rdpPoints[i+1].y)
//  }
 for (let v of rdpPoints) {
    vertex(v.x, v.y);
 }
 endShape();

 x = rdpPoints[rdpPoints.length - 1].x;
 y = rdpPoints[rdpPoints.length - 1].y;
 drawPoints = [];
                      // Converting structure to SketchRNN type object predict on simplified rnn
 for (let i = 1; i < rdpPoints.length; i++) {
   let strokePath = {
     dx: rdpPoints[i].x - rdpPoints[i - 1].x,
     dy: rdpPoints[i].y - rdpPoints[i - 1].y,
     pen: 'down'
   };
   drawPoints.push(strokePath);
 }

//
  sketchRNN.generate(drawPoints, gotStrokePath);  // generate :generates a sketch based upon its fed input_sketch and calls gotStokePath as callback
  drawPoints = null;
  rdpPoints = null;
  // draws seedpath sketch and at end of it draw current sketch
  //console.log(sketchRNN);
}

function setup() {  // runs only once
 let canvas = createCanvas(600,600);
 canvas.mousePressed( startDrawing );
 canvas.mouseReleased( sketchRNNstart );   // will be on hold untill draw() execute for that frame

 background(230); // background of canvas
//  x = width/2;
//  y = height/2;
  //sketchRNN.generate(gotStrokePath);
}


//while time passes every frame is also being passed those frames are handled here
function draw() { // infinite loop for every frame
 stroke(0);
 strokeWeight(4);
 // background(255);
//  translate(width/2,height/2);

if(personDrawing == "true"){  // check if we are drawing 

  // let drawingPath = {
  //   dx : mouseX -pmouseX,
  //   dy : mouseY -pmouseY,
  //   pen : "down"
  // }
  // seedpath.push(drawingPath);
  // line(x,y,x + drawingPath.dx,y + drawingPath.dy);
  
  // x += drawingPath.dx;
  // y += drawingPath.dy;


   seedpath.push(createVector(mouseX, mouseY));  // in case we are push coordinates in a array on which automation shall proceed
   line(mouseX, mouseY, pmouseX, pmouseY);  // and draw 
}

  if(currentStroke){   // if we are still drawing wont't execute, but if we have stopped drawing our automated drawing shall take place

    if(nextpen == "end"){ // if model has ended drawing ..................3
      sketchRNN.reset();
      sketchRNNstart();  //rnn call
      currentStroke = null;
      nextpen = "down";
      return;
    }

    if (nextpen == "down"){ // if model is still drawing ......................2
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }

    x = x + currentStroke.dx;
    y = y + currentStroke.dy;
    nextpen = currentStroke.pen;  // if model has still not started drawing...................1
    currentStroke = null;
  sketchRNN.generate(gotStrokePath); // generate drawings coordinates.

  }

  
}
