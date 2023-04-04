import React from "react";
import Models from "@/components/Models";
import { useField } from "formik";

type RangeProps = {
  label: string;
  name: string;
  max?: number;
  min?: number;
};

const Range = ({ label, name, min = 0, max = 1 }: RangeProps) => {
  const [field, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(Number(e.target.value).toFixed(2)));
  };

  return (
    <div>
      <label>{label}</label>
      <div className="flex gap-x-4 items-center">
        <input
          {...field}
          type="range"
          min={min}
          max={max}
          className="range range-xs"
          step="any"
          onChange={handleChange}
        />
        <p className="w-8 shrink-0">{value}</p>
      </div>
    </div>
  );
};

type NumberInputProps = {
  label: string;
  name: string;
};

const NumberInput = ({ label, name }: NumberInputProps) => {
  const [field] = useField(name);
  return (
    <div className="py-2 flex items-center gap-x-2">
      <p>{label}</p>
      <input
        {...field}
        type="number"
        className="input input-bordered input-primary h-full py-2 w-20"
      />
    </div>
  );
};

type CheckboxProps = {
  label: string;
  name: string;
};

const Checkbox = ({ label, name }: CheckboxProps) => {
  const [field] = useField(name);
  return (
    <div className="py-2 flex items-center gap-x-2">
      <p>{label}</p>
      <input type="checkbox" className="toggle" {...field} />
    </div>
  );
};

type ConfigurationProps = {};

const Configuration = ({}: ConfigurationProps) => {
  return (
    <div className="py-4 mb-8">
      <div className="mb-8">
        <Models name="apiOptions.model" />
      </div>
      <div className="flex flex-col gap-y-4">
        <Range label="Temperature" name="apiOptions.temperature" max={2} />
        <Range label="top_p" name="apiOptions.top_p" max={2} />
        <Range
          label="presence_penalty"
          name="apiOptions.presence_penalty"
          max={2}
          min={-2}
        />
        <Range
          label="frequency_penalty"
          name="apiOptions.frequency_penalty"
          max={2}
          min={-2}
        />
        <div className="flex items-center gap-x-4">
          <NumberInput label="n" name="apiOptions.n" />
          <NumberInput label="max_tokens" name="apiOptions.max_tokens" />
          <Checkbox label="Stream" name="apiOptions.stream" />
        </div>
      </div>
    </div>
  );
};

export default Configuration;
