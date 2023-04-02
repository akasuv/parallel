import React from "react";
import Models from "@/components/Models";

const Range = ({ label, fieldName }: { label: string; fieldName?: string }) => {
  const [temperature, setTemperature] = React.useState("50");
  const changeTemperature = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(e.target.value);
  };

  return (
    <div className="py-2">
      <p>{label}</p>
      <div className="flex gap-x-4 items-center">
        <input
          type="range"
          min="0"
          max="100"
          value={temperature}
          className="range range-xs"
          onChange={changeTemperature}
        />
        <p className="w-8 shrink-0">{Number(temperature) / 50}</p>
      </div>
    </div>
  );
};

const N = () => {
  return (
    <div className="py-2 flex items-center gap-x-2">
      <p>n</p>
      <input
        defaultValue="1"
        type="number"
        className="input input-bordered input-primary w-full max-w-xs h-full py-2 w-24"
      />
    </div>
  );
};

const MaxTokens = () => {
  return (
    <div className="py-2 flex items-center gap-x-2">
      <p>max_tokens</p>
      <input
        defaultValue="1"
        type="number"
        className="input input-bordered input-primary w-full max-w-xs h-full py-2 w-24"
      />
    </div>
  );
};
const Stream = () => {
  return (
    <div className="py-2 flex items-center gap-x-2">
      <p>Stream</p>
      <input type="checkbox" className="toggle" checked />
    </div>
  );
};
const Configuration = () => {
  return (
    <div className="py-4">
      <Models />
      <Range label="Temperature" />
      <Range label="top_p" />
      <Range label="presence_penalty" />
      <Range label="frequency_penalty" />
      <div className="flex items-center gap-x-4">
        <N />
        <Stream />
        <MaxTokens />
      </div>
    </div>
  );
};

export default Configuration;
