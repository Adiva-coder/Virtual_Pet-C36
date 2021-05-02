//assigning variables
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood, feedTime;
var foodObj;
var feed, lastFed;
var milk, milkImg;


function preload(){
  //loading all images
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
  milkImg = loadImage("Milk.png");

}


function setup() {
  //introducing firebase database
  database = firebase.database();
  createCanvas(1000,400);

  //creating food obj to display the food class
  foodObj = new Food();
  
  //creating dog and milk sprites
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  milk = createSprite(720, 220, 0, 0);
  milk.visible = false;
 

  //creating the feed and addFoods button
  feed=createButton("Feed the Dog");
  feed.position(1050,96);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(970,96);
  addFood.mousePressed(addFoods);

  
  //reading and listening to the changes in 'food' in the database
  foodStock = database.ref('food');
  foodStock.on("value",readStock);

}

function draw() {
  //assigning colour to the background
  background(46,139,87);

  //displaying the food class
  foodObj.display();

  //writing code to read feedtime value from the database 
  feedTime = database.ref('feedTime');
  feedTime.on("value", (data)=>{
    lastFed = data.val();
  })

  //writing code to display text lastFed time according to am, pm
  fill("white");
  textSize(20);

  if(lastFed >= 12){

    text("Last Feed : " + lastFed + " PM", 50, 30);

  }else if(lastFed == 0){

    text("Last Feed : 12 AM", 50, 30);

  }else if(lastFed < 12){
    
    text("Last Feed : " + lastFed + " AM", 50, 30);

  }else{

    text(lastFed, 50, 30);

  }

  //drawing the sprites
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to decrease milk and adding sprite when feed button is pressed
function feedDog(){
  dog.addImage(happyDog);    
  
  if(foodS<=0){
  foodS = foodS*0;
  }else{
    foodS -= 1;
  }
  
  database.ref('/').update({
    food:foodS,
    feedTime: hour()
  })

  milk.visible = true;
  milk.addImage(milkImg);
  milk.scale = 0.1

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}
