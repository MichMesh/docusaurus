import React from 'react';
import styles from './MeshAnimation.module.css';

// 15 mesh nodes scattered across 1200x500
const nodes = [
  { id: 0,  cx: 60,   cy: 220 },
  { id: 1,  cx: 150,  cy: 100 },
  { id: 2,  cx: 180,  cy: 340 },
  { id: 3,  cx: 310,  cy: 180 },
  { id: 4,  cx: 350,  cy: 400 },
  { id: 5,  cx: 480,  cy: 80  },
  { id: 6,  cx: 520,  cy: 280 },
  { id: 7,  cx: 600,  cy: 160 },
  { id: 8,  cx: 700,  cy: 380 },
  { id: 9,  cx: 750,  cy: 120 },
  { id: 10, cx: 850,  cy: 260 },
  { id: 11, cx: 920,  cy: 90  },
  { id: 12, cx: 960,  cy: 380 },
  { id: 13, cx: 1060, cy: 200 },
  { id: 14, cx: 1140, cy: 320 },
];

// ~22 connections between nearby nodes (pairs of node indices)
const edges = [
  [0, 1], [0, 2], [1, 3], [2, 4], [2, 6],
  [3, 5], [3, 6], [3, 7], [4, 6], [4, 8],
  [5, 7], [5, 9], [6, 7], [6, 8], [6, 10],
  [7, 9], [8, 10], [8, 12], [9, 11], [9, 10],
  [10, 11], [10, 13], [10, 12], [11, 13],
  [12, 14], [13, 14],
];

// Path 1 (coral packet): left-to-right through nodes 0→1→3→7→9→11→13→14
// 8 nodes = 7 segments, plus pauses at each node
const path1Nodes = [0, 1, 3, 7, 9, 11, 13, 14];
const path1D = path1Nodes
  .map((ni, i) => `${i === 0 ? 'M' : 'L'}${nodes[ni].cx},${nodes[ni].cy}`)
  .join(' ');

// Path 2 (mint packet): right-to-left through nodes 14→12→8→4→2→0
// 6 nodes = 5 segments, plus pauses at each node
const path2Nodes = [14, 12, 8, 4, 2, 0];
const path2D = path2Nodes
  .map((ni, i) => `${i === 0 ? 'M' : 'L'}${nodes[ni].cx},${nodes[ni].cy}`)
  .join(' ');

// Generate hop-and-pause keyPoints/keyTimes for a given number of stops
// Each stop: travel to node, then pause briefly
function hopKeyframes(numStops) {
  const segments = numStops - 1;
  const points = [];
  const times = [];
  // Each segment gets equal travel portion; pauses are inserted between
  // Total: segments travel + (numStops) pauses (including start and end)
  const pauseFraction = 0.06;
  const totalPause = pauseFraction * numStops;
  const totalTravel = 1 - totalPause;
  const segTravel = totalTravel / segments;

  let t = 0;
  for (let i = 0; i < numStops; i++) {
    const kp = i / segments;
    // Arrive at node
    points.push(kp.toFixed(4));
    times.push(t.toFixed(4));
    // Pause at node
    t += pauseFraction;
    if (i < numStops - 1) {
      points.push(kp.toFixed(4));
      times.push(t.toFixed(4));
      t += segTravel;
    } else {
      // Final node — just hold
      points.push(kp.toFixed(4));
      times.push(Math.min(t, 1).toFixed(4));
    }
  }
  return {
    keyPoints: points.join(';'),
    keyTimes: times.join(';'),
  };
}

const hop1 = hopKeyframes(path1Nodes.length);
const hop2 = hopKeyframes(path2Nodes.length);

export default function MeshAnimation() {
  return (
    <div className={styles.meshWrapper} aria-hidden="true">
      <svg
        className={styles.meshSvg}
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter for nodes */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for packets */}
          <filter id="packetGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Motion paths */}
          <path id="motionPath1" d={path1D} fill="none" />
          <path id="motionPath2" d={path2D} fill="none" />
        </defs>

        {/* Connection lines */}
        {edges.map(([a, b], i) => (
          <line
            key={`edge-${i}`}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="#67ea94"
            strokeWidth="1"
            opacity="0.25"
          />
        ))}

        {/* Mesh nodes */}
        {nodes.map((n) => (
          <circle
            key={`node-${n.id}`}
            cx={n.cx}
            cy={n.cy}
            r="5"
            fill="#67ea94"
            opacity="0.6"
            filter="url(#nodeGlow)"
          />
        ))}

        {/* Packet 1: coral, left-to-right */}
        <g filter="url(#packetGlow)">
          {/* Pulsing glow ring */}
          <circle r="12" fill="none" stroke="#e07050" strokeWidth="2" opacity="0.5">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              keyPoints={hop1.keyPoints}
              keyTimes={hop1.keyTimes}
              calcMode="linear"
            >
              <mpath href="#motionPath1" />
            </animateMotion>
            <animate
              attributeName="r"
              values="8;14;8"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.15;0.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Solid packet dot */}
          <circle r="5" fill="#e07050">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              keyPoints={hop1.keyPoints}
              keyTimes={hop1.keyTimes}
              calcMode="linear"
            >
              <mpath href="#motionPath1" />
            </animateMotion>
          </circle>
        </g>

        {/* Packet 2: mint, right-to-left, offset start */}
        <g filter="url(#packetGlow)">
          {/* Pulsing glow ring */}
          <circle r="12" fill="none" stroke="#67ea94" strokeWidth="2" opacity="0.5">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              begin="5s"
              keyPoints={hop2.keyPoints}
              keyTimes={hop2.keyTimes}
              calcMode="linear"
            >
              <mpath href="#motionPath2" />
            </animateMotion>
            <animate
              attributeName="r"
              values="8;14;8"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.15;0.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Solid packet dot */}
          <circle r="5" fill="#67ea94">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              begin="5s"
              keyPoints={hop2.keyPoints}
              keyTimes={hop2.keyTimes}
              calcMode="linear"
            >
              <mpath href="#motionPath2" />
            </animateMotion>
          </circle>
        </g>
      </svg>
    </div>
  );
}
