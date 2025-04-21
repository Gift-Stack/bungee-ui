import { cn } from "@/lib/utils";

interface AppLogoProps {
  animate?: boolean;
  className?: string;
}

const AppLogo = ({ animate = false, className }: AppLogoProps) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div
        className={cn("size-6 bg-[#FF0050] rounded-full transition-all", {
          "animate-bounce delay-0": animate,
        })}
      />
      <div
        className={cn("size-6 bg-white rounded-full transition-all", {
          "animate-bounce delay-200": animate,
        })}
      />
      <div
        className={cn("size-6 bg-[#00E06C] rounded-full transition-all", {
          "animate-bounce delay-500": animate,
        })}
      />
    </div>
  );
};

export default AppLogo;
