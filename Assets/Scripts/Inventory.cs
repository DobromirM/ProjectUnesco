using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Inventory : MonoBehaviour {
    public int sX, sY;
    private int prevCode;
    public GUISkin textureBase;
    public List<Items> slotSpace = new List<Items>();
    public List<Items> itemInventory = new List<Items>();
    private Data database;
    private bool showOrHide;
    private bool showOrHideHelp;
    private bool drag;
    private string Help;
    private Items currentDrag;
	
	void Start () {
        for (int i=0;i<(sX*sY);i++) {
            slotSpace.Add(new Items());
            itemInventory.Add(new Items());
        }
        database = GameObject.FindGameObjectWithTag("Database").GetComponent<Data>();
        for(int j=0; j < database.Database.Count; j++) NewItem(j); //всичко от базата данни се добавя в инвентара
    }
	
    void Update() {
        if (Input.GetButtonDown("Inventory")) {
            showOrHide = !showOrHide;
        }
    }

	void OnGUI() {
        Help = "";
        GUI.skin = textureBase;
        if (showOrHide) {
            LoadInventory();
            if (showOrHideHelp)
            {
                GUI.Box(new Rect(Event.current.mousePosition.x + 17f, Event.current.mousePosition.y, 250, 250), Help, textureBase.GetStyle("HelpTexture"));
            }
        }
        if (drag) {
            GUI.DrawTexture(new Rect(Event.current.mousePosition.x, Event.current.mousePosition.y, 55, 55), currentDrag.Icon);
        }
    }

    void NewItem(int code) {
        for (int i=0;i<itemInventory.Count;i++) {
            if (itemInventory[i].Title == null) {
                itemInventory[i] = database.Database[code];
                for (int j = 0; j < database.Database.Count; j++) {
                    if (database.Database[j].Code == code) {
                        itemInventory[i] = database.Database[j];
                    }
                }
                break;
            }
        }
    }

    string NewHelp(Items item) {
        Help = "<color=#ffffff>Name: </color><color=#C0C969>" + item.Title + "</color>\n<color=#ffffff>Description: </color><color=#C0C969>" + item.Descript + "</color>\n<color=#ffffff>Type: </color><color=#C0C969>" + item.iType + "</color>";
        return Help;
    }

    void LoadInventory() {
        Event e = Event.current;
        int i = 0;
        for (int y = 0; y < sY; y++) {
            for (int x = 0; x < sX; x++) {
                Rect slotRect = new Rect(x * 70, y * 70, 65, 65);
                GUI.Box(slotRect, "", textureBase.GetStyle("SlotTexture"));
                slotSpace[i] = itemInventory[i];
                if (slotSpace[i].Title != null) {
                    GUI.DrawTexture(slotRect,slotSpace[i].Icon);
                    if (slotRect.Contains(e.mousePosition)) {
                        Help = NewHelp(slotSpace[i]);
                        showOrHideHelp = true;
                        if (e.button == 0 && e.type==EventType.MouseDown && !drag)
                        {
                            drag = true;
                            prevCode = i;
                            itemInventory[i] = new Items();
                            currentDrag = slotSpace[i];
                            StartCoroutine(waiting());
                        }
                        if (e.type==EventType.MouseUp && drag)
                        {
                            itemInventory[prevCode] = itemInventory[i];
                            itemInventory[i] = currentDrag;
                            drag = false;
                            currentDrag = null;
                        }
                    }
                    if (Help == "") showOrHideHelp = false;
                    
                }
                else
                {
                    if (slotRect.Contains(e.mousePosition))
                    {
                        if (e.type == EventType.MouseUp && drag)
                        {
                            itemInventory[i] = currentDrag;
                            drag = false;
                            currentDrag = null;
                        }
                    }
                }
                i++;
            }
        }
    }

    IEnumerator waiting()
    {
        yield return new WaitForSeconds(0.5f);
    }
}
