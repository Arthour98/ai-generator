
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./components.module.css";
import { Box } from "@chakra-ui/react";

export default function Matrix({ elem, start, stop, }) {
    const [multiplier, setMultiplier] = useState(1)
    let [rows, setRows] = useState((rows) => Array(1).fill(0));
    let [cols, setCols] = useState(Array(1).fill(0));
    let rowsRef = useRef([]);
    let colsRef = useRef([]);


    const getElemsWidth = (elem) => {
        let elemWidth = elem?.current?.offsetWidth;
        return elemWidth;
    }

    const getRowWidth = (row) => {
        let rowWidth = row?.offsetWidth;
        return rowWidth;
    }



    useEffect(() => {
        let row = rowsRef.current[0];
        if (!row || !elem?.current) return;

        let multiplier = Math.round(getElemsWidth(elem) / getRowWidth(row))

        if (multiplier !== 0) setMultiplier(multiplier);
    }, [rowsRef])

    useLayoutEffect(() => {
        setRows(() => Array(multiplier).fill(0));
    }, [multiplier])

    useEffect(() => {

        const timer = setTimeout(() => {
            const newCol = Math.floor(Math.random() * 2);
            let newCols = [newCol, ...cols]

            setCols(newCols)


        }, 500)
        console.log(cols);

    }, [cols])



    return (
        <div className={styles.matrixContainer}>
            {
                rows?.map((row, index) => {
                    return (
                        <div key={index} ref={(r) => rowsRef.current[index] = r} className={styles.rows}>
                            {
                                cols?.map((col, index) => {
                                    return (
                                        <div key={index} ref={(r) => colsRef.current[index] = r} className={styles.verticalCol}>
                                            <p>{col}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>)
                })
            }

        </div>

    )
}