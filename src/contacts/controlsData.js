import { useControls } from "leva";
import { useState } from "react";

// Time Data
export const timeData = ()=>{
    const [time, setTime] = useState(0);
    return {time, setTime};
}

// controls Data and initial Position
export const useControlsData = ()=>{
    const [initialPosition, setInitialPosition] = useState(0);
    const controls = useControls({
        run: false,
        initial_Position: { value: 0, min: -5, max: 5, onChange: setInitialPosition },
        velocity: { value: 1, min: 0, max: 5 },
    })
    return {initialPosition, setInitialPosition, ...controls};
}