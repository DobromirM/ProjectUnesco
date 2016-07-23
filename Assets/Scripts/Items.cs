using UnityEngine;
using System.Collections;

[System.Serializable]
public class Items {
    public int Code;
    public string Title;
    public string Descript;
    public Texture2D Icon;
    public Type iType; 
    public enum Type {
        Vase,
        Ring,
        Necklace
    }
    //това са всички пропъртийс, които имат итемите

    public Items(int code, string title, string descript, Type type) {
        Code = code;
        Title = title;
        Descript = descript;
        Icon = Resources.Load<Texture2D>("Icons/" + title);
        iType = type;
    } //конструктор, нужен за запълване на слот от инвентара

    public Items() {

    } //конструктор, нужен за изпразване на слот от инвентара
}
