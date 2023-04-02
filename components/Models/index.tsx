import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
const models = [
  "OpenAI - GPT-4",
  "OPenAI - GPT-3.5",
  "DALL·E",
  "Whisper",
  "Embeddings",
  "Moderation",
  "GPT-3",
  "Codex",
].map((item, idx) => ({ id: idx, name: item }));

const Models = () => {
  const [selectedModel, setSelectedModel] = React.useState(models[0]);
  return (
    <div className="w-full">
      <Listbox value={selectedModel} onChange={setSelectedModel}>
        <div className="relative mt-1 w-[200px]">
          <Listbox.Button className="relative w-full cursor-default rounded-sm bg-white py-2 pl-3 pr-10 text-left border border-black border-2 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm">
            <span className="block truncate">{selectedModel.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {models.map((model, modelIdx) => (
                <Listbox.Option
                  key={modelIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 p-4 ${
                      active ? "bg-black text-white" : "text-gray-900"
                    }`
                  }
                  value={model}
                >
                  {({ selected }) => (
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {model.name}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Models;
