import React, { useState } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  onChange: (values: [number, number]) => void;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  step,
  onChange,
}) => {
  const [startValue, setStartValue] = useState(min);
  const [endValue, setEndValue] = useState(max);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartValue = Math.min(parseInt(e.target.value, 10), endValue);
    setStartValue(newStartValue);
    onChange([newStartValue, endValue]);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndValue = Math.max(parseInt(e.target.value, 10), startValue);
    setEndValue(newEndValue);
    onChange([startValue, newEndValue]);
  };

  return (
    <div className="form-control flex-col gap-1 items-start">
      <label htmlFor="startValue" className="label-text text-xs">
        Min Price: {startValue}
      </label>
      <input
        type="range"
        id="startValue"
        min={min}
        max={max}
        value={startValue}
        step={step}
        onChange={handleStartChange}
        className="range range-secondary range-xs"
      />
      <label htmlFor="endValue" className="label-text text-xs">
        Max Price: {endValue}
      </label>
      <input
        type="range"
        id="endValue"
        min={min}
        max={max}
        value={endValue}
        step={step}
        onChange={handleEndChange}
        className="range range-secondary range-xs"
      />
    </div>
  );
};

export default DualRangeSlider;
