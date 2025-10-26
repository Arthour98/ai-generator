
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./components.module.css";
import { Box } from "@chakra-ui/react";

export default function Matrix({ elem, start, stop, }) {
    const [multiplier, setMultiplier] = useState(1)
    const [heightLimit, setHeightLimit] = useState(null);
    let [cols, setCols] = useState(Array(1).fill(0));
    let [rows, setRows] = useState((rows) => Array(1).fill(null));
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

    const getElemsHeight = (elem) => {
        let elemHeight = elem?.current.offsetHeight;
        return elemHeight;
    }

    const getRowHeight = (row) => {
        let rowHeight = row?.offsetHeight;
        return rowHeight;
    }



    useEffect(() => {
        let row = rowsRef.current[0];
        if (!row || !elem?.current) return;

        let multiplier = Math.round(getElemsWidth(elem) / getRowWidth(row))
        let heightLimit = (getElemsHeight(elem) / getRowHeight(row)) + 1;

        if (multiplier !== 0) setMultiplier(multiplier);
        if (heightLimit !== 0) setHeightLimit(heightLimit);
    }, [rowsRef, start]);

    useLayoutEffect(() => {
        setRows(() => Array(multiplier).fill(0));
    }, [multiplier])

    useEffect(() => {
        const timer = setTimeout(() => {
            let newNumber = Math.floor(Math.random() * 2);
            let newCol = [newNumber, ...cols]
            if (newCol.length > heightLimit) {
                newCol.pop();
            }
            setCols(newCol);
        }, 500)
        return () => clearTimeout(timer);
    }, [cols])


    const shuffleNumbers = (col) => {
        return Math.floor(Math.random() * 2);
    }

    if (!start) return null;

    return (

        <div className={styles.matrixContainer}>
            {
                rows?.map((row, index) => {
                    return (
                        <div key={index} ref={(r) => rowsRef.current[index] = r} className={styles.rows}>
                            {
                                cols?.map((col, indexC) => {

                                    return (
                                        <div key={indexC} ref={(r) => colsRef.current[index] = r} className={styles.verticalCol}>
                                            <p className={Math.floor(Math.random() * 2) === 1 ? `${styles.flicker}` : ""}
                                            >{shuffleNumbers(col)}
                                            </p>
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