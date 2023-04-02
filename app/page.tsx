"use client";
import React from "react";
import Image from "next/image";
import Configuration from "@/components/Configuration";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3004"
    : "https://paralll-server.fly.dev";

export default function Home() {
  const [prompt, setPrompt] = React.useState<string>("");
  const [messages, setMessages] = React.useState<any>([]);
  const [racing, setRacing] = React.useState<boolean>(false);
  const [failed, setFailed] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<any>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<any>();
  const [continuedConversation, setContinuedConversation] = React.useState<any>(
    []
  );
  const [continuing, setContinuing] = React.useState<boolean>(false);
  const [promptForContinuation, setPromptForContinuation] = React.useState("");

  const generateImage = () => {
    setPromptForContinuation("");
    setContinuedConversation([]);
    setSelectedConversation(null);
    setMessages([]);
    setImages([]);
    setRacing(true);
    setFailed(false);
    fetch(`${ENDPOINT}/image?prompt=${prompt}`)
      .then((res) => res.json())
      .then((res) => {
        setImages(res.data);
      })
      .finally(() => {
        setRacing(false);
      });
  };

  const handleRun = () => {
    setPromptForContinuation("");
    setContinuedConversation([]);
    setSelectedConversation(null);
    setMessages([]);
    setImages([]);
    setFailed(false);
    if (prompt !== "") {
      setRacing(true);

      fetch(`${ENDPOINT}/gpt?prompt=${prompt}`)
        .then((res) => res.json())
        .then((data) =>
          setMessages(
            data.choices.map((choice: any) => {
              let obj = {};

              try {
                obj = JSON.parse(choice.message.content);
              } catch (e) {
                obj = {
                  nickname: "unknown",
                  title: "unknown",
                  answer: choice.message.content,
                };
              }

              return {
                index: choice.index,
                ...obj,
              };
            })
          )
        )
        .catch((err) => {
          setFailed(true);
          console.log(err);
        })
        .finally(() => setRacing(false));
    }
  };

  const continueTalk = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && promptForContinuation !== "") {
      setContinuing(true);
      fetch(
        `${ENDPOINT}/continue?choiceIndex=0&prompt=${promptForContinuation}`
      )
        .then((res) => res.json())
        .then((data) =>
          setContinuedConversation((prev: any) => {
            const choice = data.choices[0];
            return [...prev, choice.message.content];
          })
        )
        .finally(() => setContinuing(false));
      setPromptForContinuation("");
    }
  };

  React.useEffect(() => {
    if (!selectedConversation) return;
    setContinuing(true);
    fetch(`${ENDPOINT}/continue?choiceIndex=${selectedConversation.index}`)
      .then((res) => res.json())
      .then((data) =>
        setContinuedConversation((prev: any) => {
          const choice = data.choices[0];
          return [...prev, choice.message.content];
        })
      )
      .finally(() => setContinuing(false));
  }, [selectedConversation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRun();
    }
  };

  return (
    <div className="min-h-screen w-screen flex">
      <div className="sticky top-0 h-screen py-32 px-16">
        <div className="mb-8">
          <Image src="/logo.png" alt="Logo" width={200} height={100} />
        </div>
        <div>
          <Configuration />
        </div>
        <div className="flex flex-col items-center w-full justify-center gap-y-8">
          <input
            className="input input-bordered input-primary w-full focus:outline-none border-[2px] "
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here"
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-x-4">
            <button className="btn lg:btn-wide" onClick={handleRun}>
              Search
            </button>
            <button className="btn lg:btn-wide" onClick={generateImage}>
              Image
            </button>
          </div>
        </div>
      </div>
      <div className="p-8 bg-[radial-gradient(rgba(0,0,0,0.2)_0.5px,rgba(242,242,242)_0.5px)] bg-[length:5px_5px] flex-grow overflow-scroll h-screen">
        {racing && (
          <div className="flex flex-col gap-8 pt-32 ">
            <p className="text-2xl font-bold">Racing...</p>
            <progress className="progress w-30"></progress>
            <progress className="progress w-30"></progress>
            <progress className="progress w-30"></progress>
          </div>
        )}
        {failed && (
          <p className="mb-8">Something went wrong. Please try again later.</p>
        )}
        {!racing && images.length > 0 && (
          <div className="w-full flex items-center justify-center">
            <Image
              width={500}
              height={500}
              src={"data:image/png;base64," + images[0].b64_json}
              alt="image"
            />
          </div>
        )}
        {selectedConversation && (
          <ul className="w-full  flex flex-col gap-y-4 pb-32">
            <li className="p-4 flex flex-col gap-y-2">
              <div className="chat chat-end">
                <div className="chat-header w-full flex justify-between">
                  <div className="opacity-50">{selectedConversation.title}</div>
                  <p>{selectedConversation.nickname}</p>
                </div>
                <div className="chat-bubble max-w-full">
                  {selectedConversation.answer}
                </div>
              </div>
            </li>
            {continuedConversation.map((message: any, idx: number) => (
              <li className="p-4 flex flex-col gap-y-2" key={idx}>
                <div className="chat chat-end">
                  <div className="chat-header w-full flex justify-between">
                    <div className="opacity-50">
                      {selectedConversation.title}
                    </div>
                    <p>{selectedConversation.nickname}</p>
                  </div>
                  <div className="chat-bubble max-w-full">{message}</div>
                </div>
              </li>
            ))}
            {continuing && (
              <div className="flex justify-center">
                <progress className="progress w-20"></progress>
              </div>
            )}
            <li>
              <input
                className="fixed bottom-8 input input-bordered input-primary w-[700px] focus:outline-none border-[2px] "
                value={promptForContinuation}
                onChange={(e) => setPromptForContinuation(e.target.value)}
                placeholder="Enter your prompt here"
                onKeyDown={continueTalk}
              />
            </li>
          </ul>
        )}

        {!racing && !selectedConversation && (
          <ul className="w-full  flex flex-col gap-y-4">
            {messages.map((message: any, idx: number) => (
              <li className="p-4 flex flex-col gap-y-2" key={idx}>
                <div className="chat chat-end">
                  <div className="chat-header w-full flex justify-between">
                    <div className="opacity-50">{message.title}</div>
                    <p>{message.nickname}</p>
                  </div>
                  <div className="chat-bubble max-w-full">
                    {message.answer}
                    <div className="mt-4">
                      <a
                        className="link"
                        onClick={() => setSelectedConversation(message)}
                      >
                        Continue
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
