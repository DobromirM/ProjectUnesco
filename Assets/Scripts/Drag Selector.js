//Make puzzle pieces dragable and make them snap into place

//Cursor object
var Cursor1: Transform;

//Puzzle piece object
var Object1: Transform;

//Puzzle piece place
var ObjPlace: Transform;

//Place collider
var Place: Collider;

//Shows if piece is in right place
private var rightPlace = false;

//Make cursor invisible while dragging a piece
function OnMouseDrag() { 

	Object1.parent = Cursor1;
	Cursor.visible = false;

}

//Enable cursor when the piece is dropped
function OnMouseUp() { 

    Cursor1.transform.DetachChildren();
    Cursor.visible = true;

}

//If the piece is dropped in the right place
function OnTriggerEnter(other : Collider) {

	if(other == Place) { 
		rightPlace = true;
	}

}
	
//If the piece is dropped in the wrong place
function OnTriggerExit(other : Collider) {

	if(other == Place) { 
		rightPlace = false;
	}

}
	

function Update() {

    if (Cursor1.transform.childCount == 0){

        //Check if the piece is near the right place and snap it into position
        if(rightPlace){

			Object1.gameObject.transform.position = Place.gameObject.transform.position;
			Object1.parent = ObjPlace;

		}

	}
	
}