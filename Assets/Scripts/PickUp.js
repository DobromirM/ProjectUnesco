//Script for handling pick up, rotating and inventory management

//Hand Objects
var hand : Transform; 

//Pick Up distance
var dist = 3;

//Rotation Speed
var rotationSpeed = 100;

//Pushing force (for chest lids)
var force = 450; 

//Items for collecting
var rightItems : Transform[];

//Textures for the items in the inventory
var rightItemsTextures : Texture2D[];

//Texture for the scroll
var scrollTexture : Texture2D; 

//Main Camera
var myCamera : Transform;

//Object in player's hand
private var itemInHand : Transform;

//Check if item should be put in inventory
private var putInInventory = false;

//Check if should show scrolls
private var showScroll = false;

//Number of items in inventory
private var itemIndex = 0;

//Item for taking out of the inventory
private var takeOutIndex = null;
private var takeOutTexturesIndex = null;

//Is something in hand
private var isHolding = false;

//Is it Rotating 
private var rotateX = false;
private var rotateY = false;

//Object for moving and rotation
private var objectToManipulate : Transform; 

//Check if this is the first item to be ever picked Up
private var firstPickUp = false;

//Check if item is right
private var isItemRight = false;

//Show or Hide inventory
private var showInventory = true;

//Player inventory
private var inventory;
inventory = GameObject.Find("Inventory");

//Set up inventory space and appropriate textures
private var items : Transform[];
private var itemsTextures : Texture2D[]; 
items = new Transform[rightItems.Length];
itemsTextures = new Texture2D[rightItemsTextures.Length];

//Time
private var timeString;


//Remove items from the scene which have been picked already
if(inventory != null) {

    for(var child: Transform in inventory.transform) {

		for(var tempCounter = 0; tempCounter < rightItems.Length; tempCounter++) {

			if(child.name == rightItems[tempCounter].name) {
				rightItems[tempCounter].gameObject.SetActive(false);
            }

        }

	}

}


//Check for whole items
if(inventory != null) {

    //check for the whole vase
    var wholevase = false;

	for(var child: Transform in inventory.transform) {
		if(child.name == "wholevase") {
			wholevase = true;
		}
	}
    
    //check for the whole plate
    var wholeplate = false;

	for(var child: Transform in inventory.transform) {
		if(child.name == "wholeplate") {
			wholeplate = true;
		}
	}

    //check for the whole neclace
	var wholeneclace = false;

	for(var child: Transform in inventory.transform) {
		if(child.name == "wholeneclace") {
			wholeneclace = true;
		}
	}

    //This is shit
	var m1 = 0;
	if(wholevase || wholeplate || wholeneclace) {

		var temp = 0;
		if(wholevase){
			temp = 5;
		}

		for(var child: Transform in inventory.transform) {
			for(var s2 = temp; s2 < rightItems.Length; s2++) {
		
				if(wholeplate && s2 == 6){
					s2 = 9;
				}
			
				if(wholeneclace && s2 == 10){
					s2 = 12;
				}
			
				if(rightItems[s2].name == child.name) {
					items[m1] = child;
					itemsTextures[m1] = rightItemsTextures[s2];
					m1++;
					itemIndex++;
				}
			}
		}
	}
	else {		
		for(var child: Transform in inventory.transform) {
			items[m1] = child;
   			for(var p1 = 0 ; p1 < rightItems.Length; p1++) {
  				if(items[m1].name == rightItems[p1].name){
  					itemsTextures[m1] = rightItemsTextures[p1];
  				}
  			}
  	 	
  			m1++;
  			itemIndex++;
        }
    }
}


function Update () {

	//Convert time to mm:ss
	Map.timer += Time.deltaTime;

	if(Map.timer > 60) {
		Map.timer = 0;
		Map.minutes++;		
	}
	
	if(Map.timer < 10) {
		timeString = Map.minutes + ":0" + parseInt(Map.timer);
	}

	else {
		timeString = Map.minutes + ":" + parseInt(Map.timer);
	}
			
	    /*                        *
         *      KEY BINDINGS      *
         *                        *
         *                        */      

    //Check for item in hand 
	if(hand.transform.childCount == 1) {

        //Put it in inventorty - RMB
		if(Input.GetMouseButtonDown(1)){
     	 putInInventory = true; 	 
	    }

        if(Input.GetKey(KeyCode.R)) {
         showScroll = true;
	    }

	}

    if(hand.transform.childCount == 0) {
    showScroll = false;
	}

	
    
    //Return to Map - ESC
    if(Input.GetKey(KeyCode.Escape)) {
    	isHolding = false;
	    //DontDestroyOnLoad (inventory); 
	    Application.LoadLevel("Map");
    }
    
    //First inventory item - 1
    if(Input.GetKey(KeyCode.Alpha1)) {
    takeOutIndex = 0;
    }
    
	//Second inventory item - 2
    if(Input.GetKey(KeyCode.Alpha2)) {
    takeOutIndex = 1;
    }
    
    //Third inventory item - 3
    if(Input.GetKey(KeyCode.Alpha3)) {
    takeOutIndex = 2;
    }
    
	//Fourth inventory item - 4
    if(Input.GetKey(KeyCode.Alpha4)) {
    takeOutIndex = 3;
    }
    
	//Fifth inventory item - 5
    if(Input.GetKey(KeyCode.Alpha5)) {
    takeOutIndex = 4;
    }
    
	//Sixth inventory item - 6
    if(Input.GetKey(KeyCode.Alpha6)) {
    takeOutIndex = 5;
    }

    //Seventh inventory item - 7
    if(Input.GetKey(KeyCode.Alpha7)) {
    takeOutIndex = 6;
    }
    
	//Eighth inventory item - 8
    if(Input.GetKey(KeyCode.Alpha8)) {
    takeOutIndex = 7;
    }

	//Nineth inventory item - 9
    if(Input.GetKey(KeyCode.Alpha9)) {
    takeOutIndex = 8;
    }

	//Tenth inventory item - 0
    if(Input.GetKey(KeyCode.Alpha0)) {
    takeOutIndex = 9;
    }

	//Eleventh inventory item - -
    if(Input.GetKey(KeyCode.Minus)) {
    takeOutIndex = 10;
    }

    //Rotate item on its X-axis - Q
    if(Input.GetKey(KeyCode.Q)){
    	 rotateX = true;    	 
	}

    //Rotate item on its Y-axis - E
    if(Input.GetKey(KeyCode.E)){
    	 rotateY = true;    	 
    }
    
    // Show/Hide inventory - I
    if(Input.GetKeyDown(KeyCode.I)){
    	 showInventory = !showInventory;    	 
    }
    
    // Pickup/Drop item - LMB
    if(Input.GetMouseButtonDown(0)){ 

        //Drop if holding
    	if (isHolding == true) {

    	 isHolding = false;

    	 	 if(firstPickUp) { 
            	 hand.transform.DetachChildren(); //detach child (object) from hand
            	 objectToManipulate.GetComponent.<Rigidbody>().freezeRotation = false;
            	 objectToManipulate.GetComponent.<Rigidbody>().useGravity = true;
	        }

	    }

     	 else {    	 
     	 	 var hit: RaycastHit;
             var ray : Ray = Camera.main.ViewportPointToRay (Vector3(0.5,0.5,0));   	 	 
      	     if (Physics.Raycast(ray, hit, dist))
     	 	 {    	 	 
     	 	 	 if(hit.collider.gameObject.tag == "Collectibles")
     	     	 {         
             	 	 isHolding = true;
             	 	 objectToManipulate = hit.transform;
             	 	 objectToManipulate.parent = hand;
             	 	 firstPickUp = true;
             	 	 
             	 }
             	 
             	 if(hit.collider.gameObject.tag == "cover")
     	     	 {         
             	 	
             	 	 
             	 	 objectToManipulate = hit.transform;
             	 	 objectToManipulate.GetComponent.<Rigidbody>().AddForce(Vector3.up * force, ForceMode.Acceleration);
             	 	 
             	 	 
             	 }
             	   
         	 }
     	 }  
     }
     
} 

function FixedUpdate () {

     if(putInInventory) {	
	    itemInHand = hand.transform.GetChild(0);
	    for(var j=0; j < itemIndex; j++) {
	    	if(itemInHand.gameObject.name == items[j].gameObject.name) {
	    		 itemInHand.gameObject.SetActive(false);
	    		 itemInHand.parent = inventory.transform;
	    		 hand.transform.DetachChildren();	    		 
	    		 isHolding = false;
	    		 isItemRight = true;
	    		 takeOutTexturesIndex = null;
	    	}
	    }
	  	if(isItemRight == false) {
	 		 for(var i=0; i < items.Length; i++) {
	     	 	if(itemInHand.gameObject.name == rightItems[i].gameObject.name) {
	    	 		 itemInHand.gameObject.SetActive(false);
	    		 	 items[itemIndex] = rightItems[i];
	    		 	 itemsTextures[itemIndex] = rightItemsTextures[i];
	    		 	 hand.transform.DetachChildren();
	    		 	 items[itemIndex].parent = inventory.transform;
	    		 	 itemIndex ++;
	    		 	 isItemRight = true;
	    		 	 isHolding = false;
	    	 	}
	    	}
	    	
	    	if(isItemRight == false) {
	    		hand.transform.DetachChildren();
	     		isHolding = false;
	     		//DontDestroyOnLoad (inventory); 
	    		Application.LoadLevel("Map");
	    	}
	         
	     }
	     isItemRight = false;
}

	if(isHolding == false) {
		for(var k=0; k < itemIndex; k++) {
			items[k].gameObject.SetActive(false);
			items[k].parent = inventory.transform;
	    	hand.transform.DetachChildren();
	    	takeOutTexturesIndex = null;
	    }
	}
	 
	if(hand.transform.childCount == 0) {	
		 if(takeOutIndex != null) {
			 if(itemIndex > takeOutIndex) {
				 items[takeOutIndex].parent = hand;
				 items[takeOutIndex].gameObject.SetActive(true);
				 objectToManipulate = items[takeOutIndex];
				 isHolding = true;
				 takeOutTexturesIndex = takeOutIndex;
			 }
		 }
	}


     if(isHolding == true){
		 objectToManipulate.GetComponent.<Rigidbody>().useGravity = false;
         objectToManipulate.GetComponent.<Rigidbody>().MovePosition(hand.transform.position);
         objectToManipulate.GetComponent.<Rigidbody>().freezeRotation = true;
         if(rotateX){
         	 objectToManipulate.transform.Rotate(Vector3.down * rotationSpeed);
         }
         if(rotateY){
         	 objectToManipulate.transform.Rotate(Vector3.right * rotationSpeed);
         }         	 
     }

     //This is also shit (item building/crafting)
     if(Input.GetKeyDown(KeyCode.C)){

     	var vasepart = 0;
     	var platepart = 0;
     	var neclacepart = 0;

     	if(itemIndex > 0) {

     		for(var i1 = 0; i1 < 5; i1++) {
     			for(var i2 = 0; i2 < itemIndex; i2++) {
     				if(rightItems[i1].gameObject.name == items[i2].gameObject.name) {
     					vasepart++;
     				}
     			}
     		}
     		if(vasepart == 5) {     	
    			hand.transform.DetachChildren();
	     		isHolding = false;
	     		//DontDestroyOnLoad (inventory);
	    		Application.LoadLevel("BuildingVase");
     	
            }
            vasepart = 0;



            for(var i3 = 6; i3 < 9; i3++) {
     			for(var i4 = 0; i4 < itemIndex; i4++) {
     				if(rightItems[i3].gameObject.name == items[i4].gameObject.name) {
     					platepart++;
     				}
     			}
     		}
     		if(platepart == 3) {     	
    			hand.transform.DetachChildren();
	     		isHolding = false;
	     		//DontDestroyOnLoad (inventory);    		
	    		Application.LoadLevel("BuildingPlate");
     	
            }
            platepart = 0;



            for(var i5 = 10; i5 < 12; i5++) {
     			for(var i6 = 0; i6 < itemIndex; i6++) {
     				if(rightItems[i5].gameObject.name == items[i6].gameObject.name) {
     					neclacepart++;
     				}
     			}
     		}
     		if(neclacepart == 2) {     	
    			hand.transform.DetachChildren();
	     		isHolding = false;
	     		//DontDestroyOnLoad (inventory);    		
	    		Application.LoadLevel("BuildingNeclace");
     	
            }
            neclacepart = 0;

        }
    }
    
	putInInventory = false;
	takeOutIndex = null;
     
    rotateX = false;
    rotateY = false;
     
     
}

function OnGUI() {
        
    //Font size
    GUI.skin.label.fontSize = 35;
    //Font color
    GUI.skin.label.normal.textColor= Color.black;
    
    if(showScroll) {
        GUI.DrawTexture(Rect(Screen.width/1.85, 0, Screen.width/2, Screen.height), scrollTexture, ScaleMode.StretchToFill, true, 10.0F);
        GUI.Label(Rect(Screen.width/1.6, Screen.height/4, Screen.width/3, Screen.height/2), "We're no strangers to love You know the rules and so do I A full commitment's what I'm thinking of You wouldn't get this from any other guy I just wanna tell you how I'm feeling Gotta make you understand Never gonna give you up Never gonna let you down Never gonna run around and desert you Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and hurt you");
    }

    //Font size
    GUI.skin.label.fontSize = 50;
    //Font color
    GUI.skin.label.normal.textColor= Color.red;

		 var temp = itemIndex;	
		 if(showInventory) {
		 	GUI.Box(Rect(Screen.width/2 - Screen.height/1.6 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"1");	
		 	GUI.Box(Rect(Screen.width/2 - Screen.height/1.95 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"2");	
		 	GUI.Box(Rect(Screen.width/2 - Screen.height/2.5 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"3");	 
		  	GUI.Box(Rect(Screen.width/2 - Screen.height/3.5 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"4");
		 	GUI.Box(Rect(Screen.width/2 - Screen.height/6 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"5");
		 	GUI.Box(Rect(Screen.width/2 - Screen.height/20 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"6");	 
		 	GUI.Box(Rect(Screen.width/2 + Screen.height/14 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"7");
		 	GUI.Box(Rect(Screen.width/2 + Screen.height/5.3 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"8");
		 	GUI.Box(Rect(Screen.width/2 + Screen.height/3.3 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"9");
		 	GUI.Box(Rect(Screen.width/2 + Screen.height/2.4 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"0");
		 	GUI.Box(Rect(Screen.width/2 + Screen.height/1.9 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),"-");		 
		 
		 	switch(temp){
		 		 case 11:
		 		 case 10 : if(takeOutTexturesIndex == 10) {temp--;} else {GUI.Box(Rect(Screen.width/2 + Screen.height/1.9 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[10]);}
		 		 case 9 : if(takeOutTexturesIndex == 9) {temp--;} else {GUI.Box(Rect(Screen.width/2 + Screen.height/2.4 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[9]);}	
		 	 	 case 8 : if(takeOutTexturesIndex == 8) {temp--;} else {GUI.Box(Rect(Screen.width/2 + Screen.height/3.3 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[8]);}
		 		 case 7 : if(takeOutTexturesIndex == 7) {temp--;} else {GUI.Box(Rect(Screen.width/2 + Screen.height/5.3 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[7]);}
		 		 case 6 : if(takeOutTexturesIndex == 6) {temp--;} else {GUI.Box(Rect(Screen.width/2 + Screen.height/14 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[6]);} 		 	
			     case 5 : if(takeOutTexturesIndex == 5) {temp--;} else {GUI.Box(Rect(Screen.width/2 - Screen.height/20 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[5]);}
			 	 case 4 : if(takeOutTexturesIndex == 4) {temp--;} else {GUI.Box(Rect(Screen.width/2 - Screen.height/6 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[4]);}
			 	 case 3 : if(takeOutTexturesIndex == 3) {temp--;} else {GUI.Box(Rect(Screen.width/2 - Screen.height/3.5 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[3]);}
			 	 case 2 : if(takeOutTexturesIndex == 2) {temp--;} else {GUI.Box(Rect(Screen.width/2 - Screen.height/2.5 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[2]);}
			 	 case 1 : if(takeOutTexturesIndex == 1) {temp--;} else {GUI.Box(Rect(Screen.width/2 - Screen.height/1.95 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[1]);}
			 	 case 0 : if(takeOutTexturesIndex == 0) {temp--;} else {GUI.Box(Rect(Screen.width/2 - Screen.height/1.6 ,Screen.height - Screen.height/10,Screen.height/10,Screen.height/10),itemsTextures[0]);}
		 	}
		}
		 
		GUI.Label(Rect(Screen.width/2 - Screen.width/25 ,0,Screen.width,Screen.width), timeString);
		 
	}

 