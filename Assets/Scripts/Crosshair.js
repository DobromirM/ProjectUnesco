//Script for crosshair texture


// Hand object
var hand : Transform;

// Pick up distance
var dist = 3;

// Texture for crosshair
var crosshairTexture : Texture2D;

// Texture for active crosshair
var crosshairInteractTexture : Texture2D;

//crosshair position
var position : Rect;
static var OriginalOn = true;

//Disable the curosor
Cursor.visible = false;
Cursor.lockState = CursorLockMode.Locked;
 

 function Start()
 {
     //Center the crosshair
     position = Rect((Screen.width - crosshairTexture.width) / 2, (Screen.height - 
     crosshairTexture.height) /2, crosshairTexture.width, crosshairTexture.height);
 }
 

 function OnGUI()
 {
     //Main collision ray
 	 var hit: RaycastHit;
 	 var ray : Ray = Camera.main.ViewportPointToRay (Vector3(0.5,0.5,0)); 
     
     //Check for crosshair state
     if (Physics.Raycast(ray, hit, dist) && hand.transform.childCount == 0) 
     {
         //Change texture to active if pointing at collectible
     	 if(hit.collider.gameObject.tag == "Collectibles" || hit.collider.gameObject.tag == "cover" )
     	 {
     	 	 GUI.DrawTexture(position, crosshairInteractTexture, ScaleMode.ScaleToFit);
     	 }
     	 //Change it to normal if not pointing at collectible
     	 else 
     	 {
     	 	 GUI.DrawTexture(position, crosshairTexture, ScaleMode.ScaleToFit);
     	 }
     	 
     }
     //While hand is empty and pointing at nothing keep it visible
     else if(OriginalOn == true && hand.transform.childCount == 0)
     {
         GUI.DrawTexture(position, crosshairTexture, ScaleMode.ScaleToFit);
     }
 }