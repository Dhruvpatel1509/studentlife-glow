import { useEffect, useState } from "react";

interface ProstAnimationProps {
  show: boolean;
  onComplete: () => void;
}

const ProstAnimation = ({ show, onComplete }: ProstAnimationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-scale-in">
        <div className="text-9xl animate-bounce">🍻</div>
        <div className="mt-4 text-4xl font-bold gradient-text text-center animate-fade-in">
          PROST!
        </div>
      </div>
    </div>
  );
};

export default ProstAnimation;
