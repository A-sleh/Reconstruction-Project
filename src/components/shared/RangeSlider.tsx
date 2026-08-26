import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface RangeSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

const RangeSlider = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className,
}: RangeSliderProps) => {
  return (
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={([v]) => onChange(v)}
      className={cn("w-full ", className)}
    />
  );
};

export default RangeSlider;
