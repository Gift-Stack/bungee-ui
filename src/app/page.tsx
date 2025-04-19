import Image from "next/image";
import SwapInterface from "../components/SwapInterface";

export default function Home() {
  return (
    <div className="mx-auto flex h-full justify-center items-center px-4">
      <SwapInterface />
    </div>
  );
}
