/*
 // Create Box, Sphere ( Animation - rotation, moving )

 import './App.css'
import { useRef } from 'react'; // reference a space 
import { Canvas, useFrame } from "@react-three/fiber";  // create a space, create animation

const App = () => {

  // Create Cube Component
  const Cube = (props)=>{
    //Animate
    const ref = useRef();
    // Animation
    useFrame((state, delta)=>{
        ref.current.rotation.x += delta;
        ref.current.rotation.y += delta;
        ref.current.position.z = Math.sin(state.clock.elapsedTime)*2;
        
        console.log(state.clock.elapsedTime);
    })
      
      
    return(
      <mesh position={props.meshPosition} ref={ref} >
        <boxGeometry args={props.meshSize} />
        <meshStandardMaterial color={props.meshColor} />
      </mesh>
    )
  }
  

  // Create Shpere Component
  const Sphere = (props)=>{
    return(
      <mesh position={props.meshPosition}>
        <sphereGeometry args={props.meshSize} />
        <meshStandardMaterial color={props.meshColor} />
      </mesh>
    )
  }

  return (
    <Canvas>
      <directionalLight position={[0,0,2]} intensity={0.5}/>
      <ambientLight intensity={0.1} />

      <group position={[0,-1,0]} >
        <Cube meshPosition={[1,0,0]} meshSize={[1,1,1]} meshColor={"orange"} />
        <Cube meshPosition={[-1,0,0]} meshSize={[1,1,1]} meshColor={"blue"} />
      </group> 

      <Sphere meshPosition={[0,0,0]} meshSize={[1,30,30]} meshColor={"orange"} />
        
    </Canvas>
  )
}

export default App
// ////////////////////////////////////////////////////////////////////
*/

/*
// Orbit Control ///////////////////

import './App.css'
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const App = () => {

  // Create Shpere Component
  const Sphere = (props)=>{
    return(
      <mesh position={props.meshPosition}>
        <sphereGeometry args={props.meshSize} />
        <meshStandardMaterial color={props.meshColor} />
      </mesh>
    )
  }

  return (
    <Canvas>
      <directionalLight position={[0,0,2]} intensity={0.5}/>
      <ambientLight intensity={0.1} />

      <Sphere meshPosition={[0,0,0]} meshSize={[1,30,30]} meshColor={"hotpink"} />
      <OrbitControls enableZoom={false} />
        
    </Canvas>
  )
}

export default App
// //////////////////////////////////////////////////////////////
*/

/*
// GUI Interface /////////////////////////////////////////////////////
import './App.css'
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";

const App = () => {
  // Create Shpere Component
  const Cube = (props)=>{
    const {scale, position, color}= useControls({
        scale: { value:1, min:0.5, max:2, step:0.1 },
        position: { value:-1, min:-2, max:2, step:0.1 },
        color: "hotpink"
    });
    return(
      <mesh position={position} scale={scale} >
        <boxGeometry args={props.meshSize} />
        <meshStandardMaterial color={color} />
      </mesh>
    )
  }
  const { name, aNumber } = useControls({ name: 'World', aNumber: 0 })
  return (
    <Canvas>
      <directionalLight position={[0,0,2]} intensity={0.5}/>
      <ambientLight intensity={0.1} />

      <Cube meshSize={[1,1,1]} />
    </Canvas>
  )
}
export default App

// //////////////////////////////////////////////////////////////////////
*/


/*
// Graph - use chartjs2 //////////////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Chart from "chart.js/auto";

// 🎯 1. Graph Component (Velocity & Acceleration)
function PhysicsGraph({ velocity, acceleration, isPlaying }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          { label: "Velocity (m/s)", data: [], borderColor: "red", borderWidth: 2, fill: false },
          { label: "Acceleration (m/s²)", data: [], borderColor: "blue", borderWidth: 2, fill: false },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Time (s)" } },
          y: { title: { display: true, text: "Value" }, min: -10, max: 10 },
        },
      },
    });

    return () => chartInstance.current.destroy();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (chartInstance.current && isPlaying) {
      const chart = chartInstance.current;
      chart.data.labels.push(time.toFixed(1));
      chart.data.datasets[0].data.push(velocity.toFixed(2));
      chart.data.datasets[1].data.push(acceleration.toFixed(2));

      if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
      }

      chart.update();
    }
  }, [time, velocity, acceleration, isPlaying]);

  return (
    <div className="absolute top-4 left-4 w-80 bg-white p-2 shadow-lg">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

// 🎯 2. Moving Box Component (React-Three-Fiber)
function MovingBox({ velocity, acceleration, isPlaying }) {
  const meshRef = useRef();
  let currentVelocity = 0;
  let direction = 1;

  useFrame(() => {
    if (meshRef.current && isPlaying) {
      currentVelocity += acceleration * direction;
      meshRef.current.position.x += currentVelocity;

      if (meshRef.current.position.x > 2 || meshRef.current.position.x < -2) {
        direction *= -1;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[-2, 0, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

// 🎯 3. Controls for Velocity & Acceleration
function Controls({ velocity, setVelocity, acceleration, setAcceleration, isPlaying, setIsPlaying }) {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 shadow-lg rounded-md">
      <div className="mb-2">
        <label className="block text-sm font-bold">Velocity: {velocity.toFixed(2)} m/s</label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.1"
          value={velocity}
          onChange={(e) => setVelocity(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-bold">Acceleration: {acceleration.toFixed(2)} m/s²</label>
        <input
          type="range"
          min="-2"
          max="2"
          step="0.1"
          value={acceleration}
          onChange={(e) => setAcceleration(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}

// 🎯 4. Main App
export default function App() {
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <>
      <PhysicsGraph velocity={velocity} acceleration={acceleration} isPlaying={isPlaying} />
      <Controls velocity={velocity} setVelocity={setVelocity} acceleration={acceleration} setAcceleration={setAcceleration} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <Canvas>
        <ambientLight />
        <MovingBox velocity={velocity} acceleration={acceleration} isPlaying={isPlaying} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </>
  );
}

*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// Start - Create a single Box--------------------------------------------------------------------------------------------------

import "./App.css";  // for page style
import { Canvas } from "@react-three/fiber"; // for space

function App() {

  // creare a place
    // create a box
  return (
    <Canvas>
      <directionalLight position={[0,0,1]}/>
      <ambientLight intensity={0.5} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  )
}

export default App

// End - Create a single box --------------------------------------------------------------------------------------------
*/

/*
// Start - Create four boxes --------------------------------------------------------------------------------------------

import "./App.css";
import { Canvas } from "@react-three/fiber";

function App() {

  return (
    <Canvas>
      <directionalLight position={[0,0,1]}/>
      <ambientLight intensity={0.5} />

      <mesh position={[1,0,0]} >
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color={"green"} />
      </mesh>

      <mesh position={[-1,0,0]} >
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color={"red"} />
      </mesh>

      <mesh position={[1,2,0]} >
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color={"orange"} />
      </mesh>

      <mesh position={[-1,2,0]} >
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>

    </Canvas>
  )
}

export default App
*/

// End - Create four boxes --------------------------------------------------------------------------------------------

/*
// Start - Create a single box with rotating animation ------------------------------------------------------------------------

import './App.css'
import { useRef } from 'react'; // reference a space 
import { Canvas, useFrame } from "@react-three/fiber";  // create a space, create animation

const App = () => {

  // Create Cube Component
  const Cube = (props)=>{
    //Animate
    const ref = useRef();
    // Animation
    useFrame((state, delta)=>{
        ref.current.rotation.y = state.clock.elapsedTime;
        console.log(state.clock.elapsedTime);
    })
      
      
    return(
      <mesh position={props.meshPosition} ref={ref} >
        <boxGeometry args={props.meshSize} />
        <meshStandardMaterial color={props.meshColor} />
      </mesh>
    )
  }
  

  return (
    <Canvas>
      <directionalLight position={[0,0,2]} intensity={0.5}/>
      <ambientLight intensity={0.1} />

        <Cube meshPosition={[1,0,0]} meshSize={[1,1,1]} meshColor={"orange"} />
        
    </Canvas>
  )
}

export default App

// End - Create a single box with rotating animation ------------------------------------------------------------------------
*/

/*
// Start - Create a single box with rotating animation and GUI Interface ( Most simple )------------------------------------------------------------------------

import './App.css'
import { useRef } from 'react'; // reference a space 
import { Canvas, useFrame } from "@react-three/fiber";  // create a space, create animation
import { useControls } from "leva";

const App = () => {


  // Create Cube Component
  const Cube = (props)=>{

    // Prepare to use this component outside this function
    const ref = useRef();

    // Leva Interface
    const { boxScale } = useControls({
      boxScale: {value:1, min:0.5, max: 2}
    })

    // Animation
    useFrame((state, delta)=>{
        ref.current.rotation.y = state.clock.elapsedTime;
        // console.log(state.clock.elapsedTime);
        console.log(delta);
        
    })
    
      
    return(
      <mesh position={props.meshPosition} ref={ref} scale={boxScale} >
        <boxGeometry args={props.meshSize} />
        <meshStandardMaterial color={props.meshColor} />
      </mesh>
    )
  }
  

  return (
    <Canvas>
      <directionalLight position={[0,0,2]} intensity={0.5}/>
      <ambientLight intensity={0.1} />

        <Cube meshPosition={[1,0,0]} meshSize={[1,1,1]} meshColor={"orange"} />
        
    </Canvas>
  )
}

export default App

// End - Create a single box with rotating animation and GUI Interface (Most Simple )------------------------------------------------------------------------
*/

/*
// Start - Create a single box with rotating animation and GUI Interface (Not Most Simple )------------------------------------------------------------------------

import "./App.css";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";

const Cube = (props) => {
  const ref = useRef();

  // Leva controls
  const { boxScale, rotationSpeed, color } = useControls({
    boxScale: { value: 1, min: 0.5, max: 2 },
    rotationSpeed: { value: 1, min: 0, max: 5 },
    color: { value: "orange" },
  });

  // Animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed; // Controlled rotation speed
      console.log(ref.current.rotation.y);
    }
  });

  return (
    <mesh position={props.meshPosition} ref={ref} scale={boxScale}>
      <boxGeometry args={props.meshSize} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <directionalLight position={[0, 0, 2]} intensity={0.5} />
      <ambientLight intensity={0.1} />
      <Cube meshPosition={[1, 0, 0]} meshSize={[1, 1, 1]} />
    </Canvas>
  );
};

export default App;

// End - Create a single box with rotating animation and GUI Interface (Not Most Simple )------------------------------------------------------------------------
*/

/*
// Start - Create a single box with rotating animation and GUI Interface (Not Most Simple )------------------------------------------------------------------------

import "./App.css";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";

const Cube = (props) => {
  const ref = useRef();

  // Leva controls
  const { boxScale, rotationSpeed, color } = useControls({
    boxScale: { value: 1, min: 0.5, max: 2 },
    rotationSpeed: { value: 1, min: 0, max: 5 },
    color: { value: "orange" },
  });

  // Animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed; // Controlled rotation speed
      console.log(ref.current.rotation.y);
    }
  });

  return (
    <mesh position={props.meshPosition} ref={ref} scale={boxScale}>
      <boxGeometry args={props.meshSize} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <directionalLight position={[0, 0, 2]} intensity={0.5} />
      <ambientLight intensity={0.1} />
      <Cube meshPosition={[1, 0, 0]} meshSize={[1, 1, 1]} />
    </Canvas>
  );
};

export default App;

// End - Create a single box with rotating animation and GUI Interface (Not Most Simple )------------------------------------------------------------------------
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// start ( chart.js ) ////////////////////////////////////////

import { Line } from "react-chartjs-2"; // Import Line component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"; // Add PointElement and LineElement

// Register required Chart.js components for the line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart() {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: ["red", "blue", "yellow", "green", "purple", "orange"], // Use borderColor instead of backgroundColor
        tension: 0.4, // Optional: Adjust smoothness of the line
        fill: false, // Optional: Do not fill under the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sample Line Chart" },
    },
  };

  return <Line data={data} options={options} />; // Render the Line chart
}

export default LineChart;


// end ( chart.js ) ////////////////////////////////////////
*/

/*
// start ( Chart.js zoom and pan plugin)

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom"; // Import the zoom plugin

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin // Register zoom plugin
);

function LineChart() {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "blue", // Line color
        backgroundColor: "rgba(0, 0, 255, 0.1)", // Light blue fill
        tension: 0.4, // Curve smoothing
        fill: true, // Fill under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Makes sure zooming works well
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Line Chart with Zoom & Pan" },
      zoom: {
        pan: {
          enabled: true, // Enable panning
          mode: "xy", // Allow panning in both x and y directions
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zooming with mouse wheel
          },
          pinch: {
            enabled: true, // Enable zooming on touch devices
          },
          mode: "xy", // Allow zooming in both x and y directions
        },
      },
    },
    scales: {
      x: {
        type: "category", // Ensure correct scale
      },
      y: {
        type: "linear",
      },
    },
  };

  return (
    <div style={{ width: "80%", height: "400px", margin: "auto" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart;

// end (Chart.js zoom and pan plugin)
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
// Start ( Three.js + dat.gui + chart.js + chart zoom and pan ) /////////////////////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

function App() {

  const [chartData, setChartData] = useState({
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Box Rotation",
        data: [1, 2, 3, 4, 5, 6],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0,
        fill: false,
      },
    ],
  });

  // Chart 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };

  return (

        <Line data={chartData} options={options} />
  );
}

export default App;

// end ( Three.js + dat.gui + chart.js + chart zoom and pan ) /////////////////////////////////////////////////////////////////////
*/

/*
// Start - Create a single box with rotating animation and GUI Interface with a graph(Not Most Simple)------------------------------------------------------------------------

import "./App.css";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const Cube = (props) => {
  const ref = useRef();

  // Leva controls
  const { boxScale, rotationSpeed, color } = useControls({
    boxScale: { value: 1, min: 0.5, max: 2 },
    rotationSpeed: { value: 1, min: 0, max: 5 },
    color: { value: "orange" },
  });

  // Animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed; // Controlled rotation speed
      console.log(ref.current.rotation.y);
    }
  });

  return (
    <mesh position={props.meshPosition} ref={ref} scale={boxScale}>
      <boxGeometry args={props.meshSize} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const App = () => {
  // chart
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Box Rotation",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        tension: 0,
        fill: false,
      },
    ],
  });

  // Chart 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };

  return (
    <>
    <div className="container">
      <div className="box">
        <Canvas>
          <directionalLight position={[0, 0, 2]} intensity={0.5} />
          <ambientLight intensity={0.1} />
          <Cube meshPosition={[1, 0, 0]} meshSize={[1, 1, 1]} />
        </Canvas>
      </div>

      <div className="chart">
      <Line data={chartData} options={options} />
      </div>

    </div>
    </>
  );
};

export default App;

// End - Create a single box with rotating animation and GUI Interface with a graph(Not Most Simple )------------------------------------------------------------------------
*/

/*
// Start - React+ three-fiber + leva + react-chartjs2 ( Relate to everything with only one position graph) ------------------------------------------------------------------------

import "./App.css";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const Cube = ({ run, rotationSpeed, color, setChartData }) => {
  const ref = useRef();
  const lastUpdateTime = useRef(0);

  useFrame((state, delta) => {
    if (ref.current && run) {
      ref.current.rotation.y += delta * rotationSpeed; 

      // Throttle updates to every 0.1s
      if (state.clock.elapsedTime - lastUpdateTime.current > 0.1) {
        lastUpdateTime.current = state.clock.elapsedTime;

        setChartData((prev) => ({
          labels: [...prev.labels, prev.labels.length * 0.1],
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data, ref.current.rotation.y],
            },
          ],
        }));
      }
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color= {color} />
    </mesh>
  );
};

const App = () => {

  const { run, rotationSpeed, color } = useControls({
    run: false,
    rotationSpeed: { value: 1, min: 0, max: 5 },
    color: { value: "#ff6600" },
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Box Rotation",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        tension: 0,
        fill: false,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };

  return (
    <div className="container" >
      <Canvas className="box" >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube run={run} rotationSpeed={rotationSpeed} color={color} setChartData={setChartData} />
      </Canvas>

      <div className="chart" >
        <Line data={chartData} options={options}/>
      </div>
    </div>
  );
};

export default App;

// End - React+ three-fiber + leva + react-chartjs2 ( Relate to everything with only one position graph) ------------------------------------------------------------------------
*/

/*
// Start - Position Graph, Cube rotation(run/pause, rotationSpeed, cube color) ----------------------------------------------

import "./App.css";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

// Cube component
const Cube = ({ run, rotationSpeed, color, setChartData, setTime, setPosition, chartData }) => {
  const ref = useRef();
  // const lastUpdateTime = useRef(0);

  useFrame((state, delta) => {
    if (ref.current && run) {
      ref.current.rotation.y += delta * rotationSpeed;
      setPosition((ref.current.rotation.y).toFixed(2));
      setTime((chartData.labels.length*0.01).toFixed(2))
      // console.log(lastUpdateTime);
      // Throttle updates to every 0.1s
      // if (state.clock.elapsedTime - lastUpdateTime.current > 0.1) {
      //   lastUpdateTime.current = state.clock.elapsedTime;

        setChartData((prev) => ({
          labels: [...prev.labels, prev.labels.length * 0.1],
          datasets: [
                {
                  ...prev.datasets[0],
                  data: [...prev.datasets[0].data, ref.current.rotation.y],
                },
              ],
        }));
      // }
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color= {color} />
    </mesh>
  );
};

// Main Component

const App = () => {
  
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState(0);

  const { run, rotationSpeed, color } = useControls({
    run: false,
    rotationSpeed: { value: 1, min: 0, max: 5 },
    color: { value: "#ff6600" },
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Box Rotation",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        tension: 0,
        fill: false,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };

  return (
    <div className="container" >
      <Canvas className="box" >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube run={run} rotationSpeed={rotationSpeed} color={color} setChartData={setChartData} setTime={setTime} setPosition={setPosition} chartData={chartData} />
      </Canvas>

      <div className="chart" >
        Position : {position} m
        <br />
        Time : {time} s
        <br />
        Velocity: {rotationSpeed} m/s
        <Line data={chartData} options={options}/>
      </div>
    </div>
  );
};

export default App;

// End - Position Graph, Cube rotation(run/pause, rotationSpeed, cube color) ----------------------------------------------
*/

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// Update Section

/*
// Start - add initial Position GUI and Change rotation to moving ----------------------------------------------

import "./App.css";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

// Cube component
const Cube = ({ run, initialPosition, setInitialPosition, velocity, chartData, setChartData, setTime }) => {
  const ref = useRef();

  useFrame((state, delta) => {

    ref.current.position.x = initialPosition;

    if (ref.current && run) {
      ref.current.position.x += delta * velocity;

      setInitialPosition(ref.current.position.x);
      setTime(chartData.labels.length*0.01);

      setChartData((prev) => ({
        labels: [...prev.labels, prev.labels.length * 0.1],
        datasets: [
              {
                ...prev.datasets[0],
                data: [...prev.datasets[0].data, ref.current.position.x],
              },
            ],
      }));
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color= "orange" />
    </mesh>
  );
};

// Main Component

const App = () => {
  
  const [initialPosition, setInitialPosition] = useState(0);
  const [time, setTime] = useState(0);

  const { run, initial_Position, velocity } = useControls({
    run: false,
    initial_Position: { value: 0, min: -5, max: 5, onChange: (value)=> setInitialPosition(value) },
    velocity: { value: 1, min: 0, max: 5 }
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Box Rotation",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        tension: 0,
        fill: false,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };

  return (
    <div className="container" >
      <Canvas className="box" >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube run={run} initialPosition={initialPosition} setInitialPosition={setInitialPosition} velocity={velocity} chartData={chartData} setChartData={setChartData} setTime={setTime} />
      </Canvas>

      <div className="chart" >
        Position : {initialPosition.toFixed(2)} m
        <br />
        Time : {time.toFixed(2)} s
        <br />
        Velocity: {velocity.toFixed(2)} m/s
        <Line data={chartData} options={options}/>
      </div>
    </div>
  );
};

export default App;

// End - add initial Position GUI and Change rotation to moving ----------------------------------------------
*/

/*
// Start - add initial Position GUI, change rotation to moving, velocity graph ----------------------------------------------

import "./App.css";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

// Cube component
const Cube = (props) => {
  const ref = useRef();

  useFrame((state, delta) => {

    ref.current.position.x = props.initialPosition;

    if (ref.current && props.run) {
      ref.current.position.x += delta * props.velocity;

      props.setInitialPosition(ref.current.position.x);
      props.setTime(props.chartData.labels.length*0.01);
      props.setChartData((prev) => ({
        labels: [...prev.labels, prev.labels.length * 0.01],
        datasets: [
              {
                ...prev.datasets[0],
                data: [...prev.datasets[0].data, ref.current.position.x],
              },
            ],
      }));
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color= "orange" />
    </mesh>
  );
};
// Main Component
const App = () => {
  // position, time variables
  const [initialPosition, setInitialPosition] = useState(0);
  const [time, setTime] = useState(0);
  // create interface with useControls and store their variables
  const controls = useControls({
    run: false,
    initial_Position: { value: 0, min: -5, max: 5, onChange: (value)=> setInitialPosition(value) },
    velocity: { value: 1, min: 0, max: 5 }
  });
  // create chart - data attribute of Line component
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Box Rotation",
        data: [],
        borderColor: "blue",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        tension: 0,
        fill: false,
      },
    ],
  });
  // create chart - option attribute of Line component
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };
  
  return (
    <div className="container" >
      <Canvas className="box" >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube run={controls.run} initialPosition={initialPosition} setInitialPosition={setInitialPosition} 
        velocity={controls.velocity} chartData={chartData} setChartData={setChartData} setTime={setTime} />
      </Canvas>

      <div className="chart" >
        Position : {initialPosition.toFixed(2)} m
        <br />
        Time : {time.toFixed(2)} s
        <br />
        Velocity: {controls.velocity.toFixed(2)} m/s
        <Line data={chartData} options={options}/>
      </div>
    </div>
  );
};
export default App;

// End - add initial Position GUI, change rotation to moving, velocity graph  ----------------------------------------------
*/

// ////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// Start - simple Refactor ------------------------------------------------------------------------------------------

import "./App.css";
import React, { useRef, useState} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

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
      <ambientLight intensity={0.5} />
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

// Main Component
const App = () => {
  const [initialPosition, setInitialPosition] = useState(0);
  const [time, setTime] = useState(0);

  // Leva Controls
  const { run, initial_Position, velocity } = useControls({
    run: false,
    initial_Position: { value: 0, min: -5, max: 5, onChange: setInitialPosition },
    velocity: { value: 1, min: 0, max: 5 },
  });

  // Chart Data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Box Rotation",
      data: [],
      borderColor: "blue",
      tension: 0,
      fill: false,
    }],
  });

  // Chart Options (useMemo prevents unnecessary recalculations)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time" } },
      y: { type: "linear", title: { display: true, text: "Rotation (radians)" } },
    },
  };


// Make props smaller by store in an object
const cubeProps = {run, initialPosition, setInitialPosition, velocity, chartData, setChartData, setTime};  // <------------ Refactor

  return (
    <div className="container">
      <Canvas className="box">
        <Cube {...cubeProps} />
      </Canvas>

      <div className="chart">
        <span>Position: {initialPosition.toFixed(2)} m</span>
        <span>Time: {time.toFixed(2)} s</span>
        <span>Velocity: {velocity.toFixed(2)} m/s</span>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default App;

// Start - simple Refactor ------------------------------------------------------------------------------------------
*/

/*
// Start - simple Refactor one more step ------------------------------------------------------------------------------------------

import "./App.css";
import { Canvas} from "@react-three/fiber";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  zoomPlugin
);

// import contacts 
import {options, useChartData} from "./contacts/chartData";// <------------ Refactor
import { timeData, useControlsData } from "./contacts/controlsData";// <------------ Refactor

// import components
import { Cube } from "./components/Cube";


// Main Component
const App = () => {
  const {chartData, setChartData} = useChartData();// <------------ Refactor
  const {run, initial_Position, velocity, initialPosition, setInitialPosition} = useControlsData();// <------------ Refactor
  const {time, setTime} = timeData();// <------------ Refactor

  // Leva Controls// <------------ Refactor
  // Chart Data// <------------ Refactor
  // Chart Options (useMemo prevents unnecessary recalculations)// <------------ Refactor

// Make props smaller by store in an object
const cubeProps = {run, initialPosition, setInitialPosition, velocity, chartData, setChartData, setTime};  // <------------ Refactor

  return (
    <div className="container">
      <Canvas className="box">
        <Cube {...cubeProps} />
      </Canvas>

      <div className="chart">
        <span>Position: {initialPosition.toFixed(2)} m</span>
        <span>Time: {time.toFixed(2)} s</span>
        <span>Velocity: {velocity.toFixed(2)} m/s</span>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default App;

// Start - simple Refactor one more step------------------------------------------------------------------------------------------
*/


// Start - simple Refactor one more step ------------------------------------------------------------------------------------------

import "./App.css";
import { Canvas} from "@react-three/fiber";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  zoomPlugin
);

// import contacts 
import {options, useChartData} from "./contacts/chartData";// <------------ Refactor
import { timeData, useControlsData } from "./contacts/controlsData";// <------------ Refactor

// import components
import Cube from "./components/Cube";
import Chart from "./components/Chart";

// Main Component
const App = () => {
  const {chartData, setChartData} = useChartData();// <------------ Refactor
  const {run, velocity, initialPosition, setInitialPosition} = useControlsData();// <------------ Refactor
  const {time, setTime} = timeData();// <------------ Refactor

// Make props smaller by store in an object
const cubeProps = {run, initialPosition, setInitialPosition, velocity, chartData, setChartData, setTime};  // <------------ Refactor
const chartProps = {options, chartData, initialPosition, velocity, time};// <------------ Refactor

  return (
    <div className="container">
      <Canvas className="box">
        <Cube {...cubeProps} />
      </Canvas>

      <Chart {...chartProps} />
    </div>
  );
};

export default App;

// Start - simple Refactor one more step------------------------------------------------------------------------------------------
