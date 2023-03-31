"use client";

import React from "react";
import Image from "next/image";

const ENDPOINT = "https://parallel-server.fly.dev";

export default function Home() {
  const [prompt, setPrompt] = React.useState<string>("");
  const [choices, setChoices] = React.useState<any>([]);
  const [running, setRunning] = React.useState<boolean>(false);
  const [failed, setFailed] = React.useState<boolean>(false);

  const handleRun = () => {
    if (prompt !== "") {
      setRunning(true);
      fetch(`${ENDPOINT}/gpt?prompt=${prompt}`)
        .then((res) => res.json())
        .then((data) => setChoices(data.choices))
        .catch((err) => {
          setFailed(true);
          console.log(err);
        })
        .finally(() => setRunning(false));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRun();
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center p-8 md:p-[100px] gap-y-4">
      <div className="mb-8">
        <Image src="/logo.png" alt="Logo" width={400} height={200} />
      </div>
      <div className="flex items-center mb-8 w-full justify-center">
        <input
          className="h-[40px] w-full lg:w-[600px] border border-black border border-black p-4 border-2 focus:outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-black h-[40px] w-[120px] text-white"
          onClick={handleRun}
        >
          Run
        </button>
      </div>
      {running && <p className="mb-8">Running...</p>}
      {failed && (
        <p className="mb-8">Something went wrong. Please try again later.</p>
      )}
      <ul className="w-full lg:w-[1200px] flex flex-col gap-y-4">
        {choices.map((choice: any, idx: number) => (
          <li
            className="border border-black rounded p-4 flex flex-col gap-y-2"
            key={idx}
          >
            {choice.message.content
              .split("|")
              .map((item: any, index: number) => {
                if (index === 0) {
                  return (
                    <p className="font-bold" key={index}>
                      {item}
                    </p>
                  );
                }
                if (index === choice.message.content.split("|").length - 1) {
                  return (
                    <a
                      href={item}
                      target="_blank"
                      className="underline"
                      key={index}
                    >
                      Search on Google
                    </a>
                  );
                }
                return (
                  <p className="block" key={index}>
                    {item}
                  </p>
                );
              })}
          </li>
        ))}
      </ul>
    </div>
  );
}
