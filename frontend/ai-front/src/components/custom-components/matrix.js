
import {useState,useEffect} from "react";
import  styles from "./components.module.css";
import { Box } from "@chakra-ui/react";

export default function Matrix({elem,start,stop})
{
    const cols=Array(10).fill(0,0,10);



    return(
        <div className={styles.matrixContainer}>
            {
        cols.map((col,index)=>
        {
        return(
            <div key={index} className={styles.verticalCol}>
            <p className={styles.absolute}>{col}</p>
            </div>
        )})}
        </div>
    
    )
}