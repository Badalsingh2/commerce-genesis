import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { models } from "./models"; // Import models list
import { useLocation, useNavigate } from "react-router-dom";

const App = () => {
  const containerRef = useRef(null);
  const overlayContent = useRef(null);
  const modelRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isARActive, setIsARActive] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleModelSelection = (model) => {
    if (model && model.name) {
      setSelectedModel(model);
      navigate(`/5167/${model.name.toLowerCase()}`);
    } else {
      console.error("Invalid model or model name");
    }
  };

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const modelName = pathParts[pathParts.length - 1];
    if (modelName) {
      const model = models.find((m) => m.name && m.name.toLowerCase() === modelName.toLowerCase());
      if (model) {
        setSelectedModel(model);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!selectedModel) return;

    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 4, 2).normalize();
    const pointLight = new THREE.PointLight(0xffffff, 3, 10);
    pointLight.position.set(0, 2, 0);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 5, 0);

    scene.add(ambientLight, directionalLight, pointLight, hemiLight);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
      })
    );
    reticle.visible = false;
    reticle.matrixAutoUpdate = false;
    scene.add(reticle);

    let hitTestSource = null;
    let hitTestSourceRequested = false;

    const gltfLoader = new GLTFLoader();
    const controller = renderer.xr.getController(0);
    controller.addEventListener("select", () => {
      if (reticle.visible) {
        if (modelRef.current) {
          modelRef.current.position.setFromMatrixPosition(reticle.matrix);
        } else {
          gltfLoader.load(
            selectedModel.path,
            (gltf) => {
              const model = gltf.scene;
              model.position.setFromMatrixPosition(reticle.matrix);
              model.scale.set(0.3, 0.3, 0.3);
              model.traverse((node) => {
                if (node.isMesh) {
                  node.castShadow = true;
                  node.receiveShadow = true;
                }
              });
              scene.add(model);
              modelRef.current = model;
              pointLight.position.set(
                model.position.x,
                model.position.y + 1,
                model.position.z
              );
              scene.add(pointLight);

              // Add touch event listeners for rotation and scaling
              let touchStartDistance = 0;
              let initialScale = model.scale.clone();
              let touchStartAngle = 0;
              let initialRotation = model.rotation.y;

              const handleTouchStart = (event) => {
                if (event.touches.length === 2) {
                  // Calculate initial distance between two touches
                  touchStartDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                  );
                  // Calculate initial angle between two touches
                  touchStartAngle = Math.atan2(
                    event.touches[1].clientY - event.touches[0].clientY,
                    event.touches[1].clientX - event.touches[0].clientX
                  );
                }
              };

              const handleTouchMove = (event) => {
                if (event.touches.length === 2 && modelRef.current) {
                  // Calculate current distance between two touches
                  const touchEndDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                  );
                  // Calculate scale factor
                  const scaleFactor = touchEndDistance / touchStartDistance;
                  modelRef.current.scale.set(
                    initialScale.x * scaleFactor,
                    initialScale.y * scaleFactor,
                    initialScale.z * scaleFactor
                  );

                  // Calculate current angle between two touches
                  const touchEndAngle = Math.atan2(
                    event.touches[1].clientY - event.touches[0].clientY,
                    event.touches[1].clientX - event.touches[0].clientX
                  );
                  // Calculate rotation delta
                  const rotationDelta = touchEndAngle - touchStartAngle;
                  modelRef.current.rotation.y = initialRotation + rotationDelta;
                }
              };

              const handleTouchEnd = () => {
                // Update initial scale and rotation for the next gesture
                if (modelRef.current) {
                  initialScale = modelRef.current.scale.clone();
                  initialRotation = modelRef.current.rotation.y;
                }
              };

              window.addEventListener("touchstart", handleTouchStart);
              window.addEventListener("touchmove", handleTouchMove);
              window.addEventListener("touchend", handleTouchEnd);

              // Cleanup event listeners on component unmount
              return () => {
                window.removeEventListener("touchstart", handleTouchStart);
                window.removeEventListener("touchmove", handleTouchMove);
                window.removeEventListener("touchend", handleTouchEnd);
              };
            },
            undefined,
            (error) => console.error("Error loading model:", error)
          );
        }
      }
    });
    scene.add(controller);

    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: overlayContent.current },
    });

    arButton.addEventListener("click", () => setIsARActive(true));
    containerRef.current.appendChild(arButton);

    const render = (timestamp, frame) => {
      if (frame) {
        const session = renderer.xr.getSession();
        if (!hitTestSourceRequested) {
          session.requestReferenceSpace("viewer").then((referenceSpace) => {
            session
              .requestHitTestSource({ space: referenceSpace })
              .then((source) => (hitTestSource = source));
          });
          hitTestSourceRequested = true;
          session.addEventListener("end", () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
            reticle.visible = false;
            setIsARActive(false);
          });
        }
        if (hitTestSource) {
          const referenceSpace = renderer.xr.getReferenceSpace();
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length > 0) {
            reticle.visible = true;
            reticle.matrix.fromArray(
              hitTestResults[0].getPose(referenceSpace).transform.matrix
            );
          } else {
            reticle.visible = false;
          }
        }
      }
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(render);

    return () => {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, [selectedModel]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-900 text-white">
      {!selectedModel ? (
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Select a Model</h2>
          <div className="grid grid-cols-2 gap-4">
            {models.map((model) => (
              <button
                key={model.name}
                onClick={() => handleModelSelection(model)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen">
          <div ref={containerRef} className="absolute inset-0" />
          {isARActive && (
            <button
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            >
              Back to Menu
            </button>
          )}
          <div id="overlay-content" ref={overlayContent} />
        </div>
      )}
    </div>
  );
};

export default App;