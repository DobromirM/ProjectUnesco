//Main settings for the map


//Texture for the buttons
var btnTexture : Texture;

//Texture for right tomb
var right: Texture;

//Texture for wrong tomb
var wrong: Texture;

//Texture for basilica
var basilica: Texture;

//Texture for 'Enter' button
var enter : Texture;

//Player Inventory 
private var inventory;

//Timer
static var timer = Time.time;
static var minutes = 0;
private var timeString;

//Keep inventory
inventory = GameObject.Find("Inventory");

//Enable cursor
Cursor.visible = true;
Cursor.lockState = CursorLockMode.Confined;
private var show = 0;


//Convert time to mm:ss
function Update() {

    timer += Time.deltaTime;

	if(timer > 60) {
		timer = 0;
		minutes++;
	}
	
	if(timer < 10) {
		timeString = minutes + ":0" + parseInt(timer);
	}
	else {
		timeString = minutes + ":" + parseInt(timer);
	}

}



function OnGUI() {

    //Font size
    GUI.skin.label.fontSize = 50;

    //Font color
	GUI.skin.label.normal.textColor= Color.red;

    //Button for right tomb settings
	if (GUI.Button(Rect(Screen.width/2.7,Screen.height/1.4,50,50), btnTexture, GUIStyle.none)) {
		show = 1;
	}
	
    //Button for wrong tomb settings
	if (GUI.Button(Rect(Screen.width/2.5,Screen.height/1.6,50,50), btnTexture, GUIStyle.none)) {
		show = 2;
	}

    //Button for basilica
	if (GUI.Button(Rect(Screen.width/2,Screen.height/1.2,50,50), btnTexture, GUIStyle.none)) {
	    show = 3;
	}
		

	switch(show) {

        //Action for right button
	    case 1: GUI.Box(Rect(Screen.width - Screen.width/5,0,Screen.width/5,Screen.height/3), wrong, GUIStyle.none);

			    if(GUI.Button(Rect(Screen.width - Screen.width/6.8,Screen.width/6.8,Screen.width/10,Screen.height/10), enter, GUIStyle.none)){
			        DontDestroyOnLoad (inventory); 
		     	    Application.LoadLevel("Place2");
			    }

				break;
			
			
		//Action for wrong button	
	    case 2: GUI.Box(Rect(Screen.width - Screen.width/5,0,Screen.width/5,Screen.height/3), right, GUIStyle.none);

				if(GUI.Button(Rect(Screen.width - Screen.width/6.8,Screen.width/6.8,Screen.width/10,Screen.height/10), enter, GUIStyle.none)) {
					DontDestroyOnLoad (inventory); 
					Application.LoadLevel("Place1");
				}

				break;

	    //Action for basilica button
	    case 3: GUI.Box(Rect(Screen.width - Screen.width/5,0,Screen.width/5,Screen.height/3), basilica, GUIStyle.none);

	        if(GUI.Button(Rect(Screen.width - Screen.width/6.8,Screen.width/6.8,Screen.width/10,Screen.height/10), enter, GUIStyle.none)) {
	            DontDestroyOnLoad (inventory); 
	            Application.LoadLevel("Place3");
	        }

	        break;
	 	}

	 	
	 	
        //Timer Position
	 	GUI.Label(Rect(Screen.width/2 - Screen.width/25 ,0,Screen.width,Screen.width), timeString);
	 	
	}