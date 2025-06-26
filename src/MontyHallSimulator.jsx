import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Constants
const GAME_CONSTANTS = {
  DOOR_COUNT: 3,
  DOOR_SPACING: 3.5,
  ANIMATION_DURATION: 800,
  AUTO_SIM_INTERVAL: 150,
  CONFETTI_COUNT: 40
};

const GAME_STEPS = {
  PICK: 'pick',
  SWITCH: 'switch', 
  REVEAL: 'reveal',
  END: 'end'
};

// Utility Functions
const getRandomDoor = () => Math.floor(Math.random() * GAME_CONSTANTS.DOOR_COUNT);

const getAvailableDoorsForHost = (playerPick, prizeDoor) => 
  [0, 1, 2].filter(i => i !== playerPick && i !== prizeDoor);

const getRemainingDoor = (playerPick, hostOpens) =>
  [0, 1, 2].find(i => i !== playerPick && i !== hostOpens);

// Custom Hooks
const useGameState = () => {
  const [gameState, setGameState] = useState({
    step: GAME_STEPS.PICK,
    prizeDoor: getRandomDoor(),
    playerPick: null,
    hostOpens: null,
    finalChoice: null,
    gameResult: null,
    showConfetti: false
  });

  const resetGame = useCallback(() => {
    setGameState({
      step: GAME_STEPS.PICK,
      prizeDoor: getRandomDoor(),
      playerPick: null,
      hostOpens: null,
      finalChoice: null,
      gameResult: null,
      showConfetti: false
    });
  }, []);

  return { gameState, setGameState, resetGame };
};

const useGameStats = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    switchWins: 0,
    stayWins: 0,
    switchGames: 0,
    stayGames: 0
  });

  const updateStats = useCallback((won, switched) => {
    setStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      switchWins: prev.switchWins + (switched && won ? 1 : 0),
      stayWins: prev.stayWins + (!switched && won ? 1 : 0),
      switchGames: prev.switchGames + (switched ? 1 : 0),
      stayGames: prev.stayGames + (!switched ? 1 : 0)
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      totalGames: 0,
      switchWins: 0, 
      stayWins: 0,
      switchGames: 0,
      stayGames: 0
    });
  }, []);

  return { stats, updateStats, resetStats };
};

const useAutoSimulation = (updateStats) => {
  const [autoSimulate, setAutoSimulate] = useState(false);
  const intervalRef = useRef(null);

  const runSingleSimulation = useCallback(() => {
    const prizeDoor = getRandomDoor();
    const playerPick = getRandomDoor();
    const shouldSwitch = Math.random() < 0.5;
    
    const availableDoors = getAvailableDoorsForHost(playerPick, prizeDoor);
    const hostOpens = availableDoors[Math.floor(Math.random() * availableDoors.length)];
    const finalChoice = shouldSwitch ? getRemainingDoor(playerPick, hostOpens) : playerPick;
    const won = finalChoice === prizeDoor;
    
    updateStats(won, shouldSwitch);
  }, [updateStats]);

  useEffect(() => {
    if (autoSimulate) {
      intervalRef.current = setInterval(runSingleSimulation, GAME_CONSTANTS.AUTO_SIM_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSimulate, runSingleSimulation]);

  return { autoSimulate, setAutoSimulate };
};

// 3D Model Creators
const create3DCarModel = () => {
  const carGroup = new THREE.Group();
  
  // Car body
  const bodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 0.8);
  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2563eb });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.3;
  body.castShadow = true;
  carGroup.add(body);
  
  // Car roof
  const roofGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.7);
  const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 0.8;
  roof.castShadow = true;
  carGroup.add(roof);
  
  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1f2937 });
  
  const wheelPositions = [[-0.6, 0, 0.5], [0.6, 0, 0.5], [-0.6, 0, -0.5], [0.6, 0, -0.5]];
  
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(...pos);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    carGroup.add(wheel);
  });
  
  // Headlights
  const lightGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const lightMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xffffff, 
    emissive: 0x444444 
  });
  
  const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
  leftLight.position.set(-0.6, 0.4, 0.41);
  carGroup.add(leftLight);
  
  const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
  rightLight.position.set(0.6, 0.4, 0.41);
  carGroup.add(rightLight);
  
  carGroup.userData.type = 'car';
  return carGroup;
};

const create3DGoatModel = () => {
  const goatGroup = new THREE.Group();
  
  // Goat body
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 8);
  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  body.castShadow = true;
  goatGroup.add(body);
  
  // Goat head
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const headMaterial = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.9, 0.3);
  head.castShadow = true;
  goatGroup.add(head);
  
  // Ears and horns
  const earGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
  const earMaterial = new THREE.MeshLambertMaterial({ color: 0xd1d5db });
  
  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(-0.15, 1.05, 0.3);
  leftEar.rotation.z = 0.3;
  goatGroup.add(leftEar);
  
  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.15, 1.05, 0.3);
  rightEar.rotation.z = -0.3;
  goatGroup.add(rightEar);
  
  // Horns
  const hornGeometry = new THREE.ConeGeometry(0.03, 0.15, 8);
  const hornMaterial = new THREE.MeshLambertMaterial({ color: 0x6b7280 });
  
  const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
  leftHorn.position.set(-0.1, 1.2, 0.25);
  goatGroup.add(leftHorn);
  
  const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
  rightHorn.position.set(0.1, 1.2, 0.25);
  goatGroup.add(rightHorn);
  
  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
  const legMaterial = new THREE.MeshLambertMaterial({ color: 0xd1d5db });
  
  const legPositions = [[-0.2, 0, 0.2], [0.2, 0, 0.2], [-0.2, 0, -0.2], [0.2, 0, -0.2]];
  
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...pos);
    leg.castShadow = true;
    goatGroup.add(leg);
  });
  
  // Tail
  const tailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const tailMaterial = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.set(0, 0.4, -0.45);
  goatGroup.add(tail);
  
  goatGroup.userData.type = 'goat';
  return goatGroup;
};

// Components
const StatsCard = ({ stats, autoSimulate, setAutoSimulate, resetStats }) => {
  const chartData = [
    {
      strategy: 'Switch',
      value: stats.switchGames > 0 ? (stats.switchWins / stats.switchGames * 100) : 0,
      games: stats.switchGames,
      wins: stats.switchWins
    },
    {
      strategy: 'Stay', 
      value: stats.stayGames > 0 ? (stats.stayWins / stats.stayGames * 100) : 0,
      games: stats.stayGames,
      wins: stats.stayWins
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="text-4xl font-light text-slate-900 mb-2">{stats.totalGames}</div>
          <div className="text-slate-600 font-medium">Total Games</div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 md:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Win Rate Comparison</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setAutoSimulate(!autoSimulate)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                autoSimulate 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {autoSimulate ? 'Stop' : 'Auto-Simulate'}
            </button>
            <button
              onClick={resetStats}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>
        
        {stats.totalGames > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="strategy" stroke="#64748b" fontSize={14} />
                <YAxis stroke="#64748b" fontSize={14} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    color: '#1e293b'
                  }}
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Win Rate']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-lg">
            Play some games to see statistics
          </div>
        )}
      </div>
    </div>
  );
};

const GameControls = ({ gameState, onSelectDoor, onMakeDecision, onResetGame }) => {
  const renderGameStep = () => {
    switch (gameState.step) {
      case GAME_STEPS.PICK:
        return (
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-light text-slate-900 mb-4">Choose your door</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Behind one door is a luxury car, behind the others are goats. Make your choice.
            </p>
            <div className="flex justify-center gap-4">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  onClick={() => onSelectDoor(i)}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Door {i + 1}
                </button>
              ))}
            </div>
          </div>
        );

      case GAME_STEPS.SWITCH:
        const remainingDoor = getRemainingDoor(gameState.playerPick, gameState.hostOpens);
        return (
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-slate-900 mb-4">Now for the twist</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              I've opened Door {gameState.hostOpens + 1}, revealing a goat. You chose Door {gameState.playerPick + 1}. 
              <br />
              Would you like to switch to Door {remainingDoor + 1}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => onMakeDecision(false)}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-medium text-lg transition-all duration-200 hover:shadow-md"
              >
                Stay with Door {gameState.playerPick + 1}
              </button>
              <button
                onClick={() => onMakeDecision(true)}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Switch to Door {remainingDoor + 1}
              </button>
            </div>
          </div>
        );

      case GAME_STEPS.REVEAL:
        return (
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-light text-slate-900 mb-4">The grand reveal</h2>
            <p className="text-lg text-slate-600">All doors are opening...</p>
          </div>
        );

      case GAME_STEPS.END:
        return (
          <div className="text-center max-w-2xl mx-auto">
            <h2 className={`text-4xl font-light mb-4 ${gameState.gameResult ? 'text-green-600' : 'text-slate-600'}`}>
              {gameState.gameResult ? 'Congratulations!' : 'Better luck next time'}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              The car was behind Door {gameState.prizeDoor + 1}. You chose Door {gameState.finalChoice + 1}.
              {gameState.gameResult ? ' You won the car!' : ' You got a goat.'}
            </p>
            <button
              onClick={onResetGame}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
      {renderGameStep()}
    </div>
  );
};

const ExplanationSection = ({ stats }) => {
  if (stats.totalGames <= 5) return null;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mt-8">
      <h3 className="text-2xl font-light text-slate-900 mb-6">Why switching wins</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">1</div>
            <p className="text-slate-700 leading-relaxed">Initially, each door has a 1/3 probability of hiding the car</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">2</div>
            <p className="text-slate-700 leading-relaxed">When you pick a door, there's a 1/3 chance it has the car</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">3</div>
            <p className="text-slate-700 leading-relaxed">The other two doors combined have a 2/3 probability</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">4</div>
            <p className="text-slate-700 leading-relaxed">When one door is revealed to have a goat, the remaining door inherits the full 2/3 probability</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-6">
          <h4 className="font-semibold text-slate-900 mb-4">The Mathematics</h4>
          <div className="space-y-3 text-slate-700">
            <div className="flex justify-between">
              <span>Staying strategy:</span>
              <span className="font-mono">33.3%</span>
            </div>
            <div className="flex justify-between">
              <span>Switching strategy:</span>
              <span className="font-mono">66.7%</span>
            </div>
            <div className="border-t border-slate-200 pt-3 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Advantage of switching:</span>
                <span className="font-mono text-blue-600">+33.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Confetti = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(GAME_CONSTANTS.CONFETTI_COUNT)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};

// Main Component
const MontyHallSimulator = () => {
  const { gameState, setGameState, resetGame } = useGameState();
  const { stats, updateStats, resetStats } = useGameStats();
  const { autoSimulate, setAutoSimulate } = useAutoSimulation(updateStats);

  // Three.js refs
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const doorsRef = useRef([]);
  const animationRef = useRef(null);
  const prizeAnimationsRef = useRef([]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0xf8fafc, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create doors
    const doors = [];
    for (let i = 0; i < GAME_CONSTANTS.DOOR_COUNT; i++) {
      const doorGroup = new THREE.Group();
      
      // Door
      const doorGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.15);
      const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.castShadow = true;
      door.receiveShadow = true;
      doorGroup.add(door);
      
      // Frame
      const frameGeometry = new THREE.BoxGeometry(2.4, 3.4, 0.05);
      const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.z = -0.1;
      doorGroup.add(frame);
      
      // Handle
      const handleGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.3);
      const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x64748b });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.position.set(0.8, 0, 0.2);
      handle.castShadow = true;
      doorGroup.add(handle);
      
      // Door number
      const numberGeometry = new THREE.CircleGeometry(0.25, 32);
      const numberMaterial = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const numberBg = new THREE.Mesh(numberGeometry, numberMaterial);
      numberBg.position.set(0, 1.2, 0.08);
      doorGroup.add(numberBg);
      
      doorGroup.position.x = (i - 1) * GAME_CONSTANTS.DOOR_SPACING;
      doorGroup.userData = { 
        index: i, 
        isOpen: false, 
        originalRotation: doorGroup.rotation.y,
        door: door,
        handle: handle
      };
      
      scene.add(doorGroup);
      doors.push(doorGroup);
    }

    camera.position.set(0, 3, 9);
    camera.lookAt(0, 0, 0);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    doorsRef.current = doors;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Animate prizes
      prizeAnimationsRef.current.forEach(prize => {
        if (prize && prize.parent) {
          prize.rotation.y += 0.02;
          if (prize.userData.type === 'goat') {
            prize.position.y = -0.8 + Math.sin(Date.now() * 0.003) * 0.1;
          }
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Animation functions
  const animateDoor = useCallback((doorIndex, open, callback) => {
    const door = doorsRef.current[doorIndex];
    if (!door) return;

    const targetRotation = open ? -Math.PI / 2.2 : 0;
    const startRotation = door.rotation.y;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / GAME_CONSTANTS.ANIMATION_DURATION, 1);
      
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      door.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        door.userData.isOpen = open;
        if (callback) callback();
      }
    };
    animate();
  }, []);

  const addPrizeToScene = useCallback((doorIndex, prizeType) => {
    const door = doorsRef.current[doorIndex];
    if (!door) return;

    // Remove existing prize
    const existingPrize = door.children.find(child => child.userData.isPrize);
    if (existingPrize) {
      door.remove(existingPrize);
      const index = prizeAnimationsRef.current.indexOf(existingPrize);
      if (index > -1) {
        prizeAnimationsRef.current.splice(index, 1);
      }
    }

    let prize;
    if (prizeType === 'car') {
      prize = create3DCarModel();
      prize.position.set(0, -1.2, -1.5);
      prize.scale.set(0.8, 0.8, 0.8);
    } else {
      prize = create3DGoatModel();
      prize.position.set(0, -1.5, -1.2);
      prize.scale.set(1.2, 1.2, 1.2);
    }
    
    prize.userData.isPrize = true;
    door.add(prize);
    prizeAnimationsRef.current.push(prize);
  }, []);

  // Game logic handlers
  const handleSelectDoor = useCallback((doorIndex) => {
    if (gameState.step !== GAME_STEPS.PICK) return;

    // Highlight selected door
    doorsRef.current.forEach((door, i) => {
      const doorMesh = door.children.find(child => 
        child.geometry?.type === 'BoxGeometry' && child.position.z === 0
      );
      if (doorMesh) {
        doorMesh.material.color.setHex(i === doorIndex ? 0x3b82f6 : 0xffffff);
        doorMesh.material.emissive.setHex(i === doorIndex ? 0x1e40af : 0x000000);
      }
    });

    const availableDoors = getAvailableDoorsForHost(doorIndex, gameState.prizeDoor);
    const hostOpens = availableDoors[Math.floor(Math.random() * availableDoors.length)];

    setGameState(prev => ({
      ...prev,
      playerPick: doorIndex,
      hostOpens: hostOpens,
      step: GAME_STEPS.SWITCH
    }));

    setTimeout(() => {
      animateDoor(hostOpens, true);
      addPrizeToScene(hostOpens, 'goat');
    }, 1200);
  }, [gameState.step, gameState.prizeDoor, animateDoor, addPrizeToScene, setGameState]);

  const handleMakeDecision = useCallback((shouldSwitch) => {
    const finalChoice = shouldSwitch ? 
      getRemainingDoor(gameState.playerPick, gameState.hostOpens) : 
      gameState.playerPick;

    const won = finalChoice === gameState.prizeDoor;

    setGameState(prev => ({
      ...prev,
      finalChoice: finalChoice,
      gameResult: won,
      step: GAME_STEPS.REVEAL,
      showConfetti: won
    }));

    updateStats(won, shouldSwitch);

    setTimeout(() => {
      [0, 1, 2].forEach(i => {
        if (i !== gameState.hostOpens) {
          animateDoor(i, true);
          addPrizeToScene(i, i === gameState.prizeDoor ? 'car' : 'goat');
        }
      });
    }, 600);

    setTimeout(() => {
      setGameState(prev => ({ ...prev, step: GAME_STEPS.END }));
    }, 2500);
  }, [gameState.playerPick, gameState.hostOpens, gameState.prizeDoor, setGameState, updateStats, animateDoor, addPrizeToScene]);

  const handleResetGame = useCallback(() => {
    // Reset door states
    doorsRef.current.forEach((door) => {
      door.rotation.y = 0;
      door.userData.isOpen = false;
      
      const doorMesh = door.children.find(child => 
        child.geometry?.type === 'BoxGeometry' && child.position.z === 0
      );
      if (doorMesh) {
        doorMesh.material.color.setHex(0xffffff);
        doorMesh.material.emissive.setHex(0x000000);
      }
      
      const prize = door.children.find(child => child.userData.isPrize);
      if (prize) {
        door.remove(prize);
        const index = prizeAnimationsRef.current.indexOf(prize);
        if (index > -1) {
          prizeAnimationsRef.current.splice(index, 1);
        }
      }
    });

    resetGame();
  }, [resetGame]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" 
         style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      <Confetti show={gameState.showConfetti} />

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-4">
            Monty Hall
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light">
            The probability paradox that challenges intuition
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <StatsCard 
          stats={stats}
          autoSimulate={autoSimulate}
          setAutoSimulate={setAutoSimulate}
          resetStats={resetStats}
        />

        {/* 3D Scene */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
          <div 
            ref={mountRef} 
            className="h-96 rounded-xl overflow-hidden bg-slate-50"
            style={{ minHeight: '400px' }}
          />
        </div>

        <GameControls 
          gameState={gameState}
          onSelectDoor={handleSelectDoor}
          onMakeDecision={handleMakeDecision}
          onResetGame={handleResetGame}
        />

        <ExplanationSection stats={stats} />
      </div>
    </div>
  );
};

export default MontyHallSimulator;