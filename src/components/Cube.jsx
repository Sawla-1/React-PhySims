import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { cube } from "../contacts/cubeData";


// Cube component
const Cube = (props) => {  // Using props object method                         <------------ Refactor
    const ref = useRef();
  
    useFrame((_, delta) => {
      if (!ref.current) return;
      const {position} = ref.current; // Using destructuring                      <------------ Refactor
  
      position.x = props.initialPosition;
      
      if (props.run) {
        position.x += delta * props.velocity;
        const newTime = props.chartData.labels.length * 0.01;
  
        props.setInitialPosition(position.x);
        props.setTime(newTime);
        props.setChartData(prev => ({
          ...prev,
          labels: [...prev.labels, newTime],
          datasets: [{
            ...prev.datasets[0],
            data: [...prev.datasets[0].data, position.x],
          }],
        }));
  
      }
    });
  
    return (
      <mesh ref={ref}>
        <ambientLight intensity={cube.intensity} />
        <boxGeometry args={cube.size} />
        <meshStandardMaterial color={cube.color} />
      </mesh>
    );
  };
  
  export default Cube;