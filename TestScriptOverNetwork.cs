using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestScriptOverNetwork : MonoBehaviour
{
    private bool digs = false;
    public void Digens()
    {
        digs = !digs;
        if(digs)
        FindObjectOfType<TF_Manager>().ChangePrimaryColor(Color.red);
        else
        FindObjectOfType<TF_Manager>().ChangePrimaryColor(Color.green);
    }
}
