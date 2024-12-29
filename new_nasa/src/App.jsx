// src/App.jsx
import * as THREE from "three";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Image,
  ScrollControls,
  useScroll,
  Billboard,
  Text,
  Points,
  PointMaterial,
} from "@react-three/drei";
import { easing } from "maath";
import { useNasaImages } from "./hooks/useNasaImages";
import * as random from "maath/random/dist/maath-random.esm";

export default function App() {
  return (
    <Canvas dpr={[1, 5]} camera={{ position: [0, 0, 9], fov: 50 }}>
      <ScrollControls pages={4} infinite>
        <Suspense fallback={null}>
          <Scene position={[0, -1, 0]} />
          <Stars />
        </Suspense>
      </ScrollControls>
    </Canvas>
  );
}

function Stars(props) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.5 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function Scene({ ...props }) {
  const groupRef = useRef();
  const scroll = useScroll();
  const [hovered, setHovered] = useState(null);
  const { photos, loading, error } = useNasaImages();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -scroll.offset * Math.PI * 2; // Rotate contents based on scroll
    }
    // Smooth camera movement
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9],
      0.3,
      delta
    );
    state.camera.lookAt(0, 0, 0); // Ensure the camera always looks at the center
  });

  if (loading) {
    return <Text position={[0, 0, 0]}>Loading...</Text>;
  }

  if (error) {
    return (
      <Text position={[0, 0, 0]} color="red">
        {error}
      </Text>
    );
  }

  return (
    <group ref={groupRef} {...props}>
      {/* Define different seasons/categories if needed */}
      <Cards
        category="EPIC Images"
        from={0}
        len={Math.PI * 2}
        onPointerOver={setHovered}
        onPointerOut={setHovered}
        photos={photos}
      />
      {/* ActiveCard displays details of the hovered image */}
      <ActiveCard hovered={hovered} photos={photos} />
    </group>
  );
}

function Cards({
  category,
  from = 0,
  len = Math.PI * 2,
  radius = 5.25,
  onPointerOver,
  onPointerOut,
  photos,
  ...props
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const amount = photos.length;
  const textPosition = from + (amount / 2 / amount) * len;

  return (
    <group {...props}>
      {/* Category Label */}
      <Billboard
        position={[
          Math.sin(textPosition) * radius * 1.4,
          0.5,
          Math.cos(textPosition) * radius * 1.4,
        ]}
      >
        <Text fontSize={0.25} anchorX="center" color="black">
          {category}
        </Text>
      </Billboard>

      {/* Render each photo as a Card */}
      {photos.map((photo, i) => {
        const angle = from + (i / amount) * len;
        return (
          <Card
            key={photo.identifier} // Unique key for each card
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredIndex(i);
              onPointerOver && onPointerOver(i);
            }}
            onPointerOut={() => {
              setHoveredIndex(null);
              onPointerOut && onPointerOut(null);
            }}
            position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            rotation={[0, Math.PI / 2 + angle, 0]}
            active={hoveredIndex !== null}
            hovered={hoveredIndex === i}
            url={photo.imageUrl}
          />
        );
      })}
    </group>
  );
}

function Card({ url, active, hovered, ...props }) {
  const ref = useRef();

  useFrame((state, delta) => {
    const scaleFactor = hovered ? 1.4 : active ? 1.25 : 1;
    // Smooth position animation
    easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta);
    // Smooth scale animation
    easing.damp3(
      ref.current.scale,
      [1.618 * scaleFactor, 1 * scaleFactor, 1],
      0.15,
      delta
    );
  });

  return (
    <group {...props}>
      <Image
        ref={ref}
        transparent
        radius={0.075}
        url={url}
        scale={[1.618, 1, 1]}
        side={THREE.DoubleSide}
      />
    </group>
  );
}

function ActiveCard({ hovered, photos, ...props }) {
  const ref = useRef();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.material.zoom = 0.8;
    }
  }, [hovered]);

  useFrame((state, delta) => {
    if (ref.current) {
      // Smooth zoom animation
      easing.damp(ref.current.material, "zoom", 1, 0.5, delta);
      // Smooth opacity animation
      easing.damp(
        ref.current.material,
        "opacity",
        hovered !== null ? 1 : 0,
        0.3,
        delta
      );
    }
  });

  if (hovered === null || !photos[hovered]) return null;

  const photo = photos[hovered];

  return (
    <Billboard {...props}>
      {/* Display caption and date from the API */}
      <Text
        fontSize={0.2}
        position={[2.15, 3.85, 0]}
        maxWidth={3}
        anchorX="left"
        color="black"
      >
        {`${photo.caption}\n${photo.date}`}
      </Text>
      <Image
        ref={ref}
        transparent
        radius={0.3}
        position={[0, 1.5, 0]}
        scale={[3.5, 1.618 * 3.5, 0.2, 1]}
        url={photo.imageUrl}
      />
    </Billboard>
  );
}
