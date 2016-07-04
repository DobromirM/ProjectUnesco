//Script for movement of puzzle pieces and scene settings

//Number of pieces and right positions
var pieces : Transform[];

//Cursor object
var Cursor1: Transform;

//Item for construction
var wholeitem: Transform;

//Enable cursor
Cursor.visible = true;
Cursor.lockState = CursorLockMode.Confined;

//Mouse ofset
private var ofset: Vector2;

//Mouse position
private var mousePosition: Vector2;

//Inventory
private var inventory;

//Current Time
private var timeString;

//Set variables
ofset = Vector2(Input.mousePosition.x, Input.mousePosition.y);
inventory = GameObject.Find("Inventory");


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
	
    //Ofset Calculation
    ofset = mousePosition;
    mousePosition = Vector2(Input.mousePosition.x, Input.mousePosition.y);
    ofset = mousePosition - ofset;

    //Move picked up object
    if(Cursor1.transform.childCount == 1) {

        //Change position
    	Cursor1.transform.GetChild(0).gameObject.transform.position = Cursor1.transform.GetChild(0).gameObject.transform.position + ofset * Time.deltaTime / 2; 
	
    }

    //reset ofset
    ofset= Vector2 (0,0);
    
    //Check if pieces are in place
    if(pieces[0].transform.childCount == 1 && pieces[1].transform.childCount == 1 && pieces[2].transform.childCount == 1 && pieces[3].transform.childCount == 1 && pieces[4].transform.childCount == 1) {

        //Craft the whole object 
    	 if(Input.GetKeyDown(KeyCode.C)){ 
	     	wholeitem.parent = inventory.transform;
         	Application.LoadLevel("Place1");
    	 }

    }

}

function OnGUI() {

        //Timer Position
	    GUI.Label(Rect(Screen.width/2 - Screen.width/25 ,0,Screen.width,Screen.width), timeString);
}