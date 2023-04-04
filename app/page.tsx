"use client";
import React from "react";
import Image from "next/image";
import Configuration from "@/components/Configuration";
import { Formik, Form, FormikProps } from "formik";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type FormValues = {
  apiOptions: {
    model: string;
    temperature: number;
    top_p: number;
    presence_penalty: number;
    frequency_penalty: number;
    n: number;
    max_tokens: number;
    stream: boolean;
  };
  prompt: string;
};

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3004"
    : "https://paralll-server.fly.dev";

export default function Home() {
  const [prompt, setPrompt] = React.useState<string>("");
  const [messages, setMessages] = React.useState<any>([]);
  const [generating, setGenerating] = React.useState<boolean>(false);
  const [failed, setFailed] = React.useState<boolean>(false);
  const [images, setImages] = React.useState<any>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<any>();
  const [continuedConversation, setContinuedConversation] = React.useState<any>(
    []
  );
  const [continuing, setContinuing] = React.useState<boolean>(false);
  const [promptForContinuation, setPromptForContinuation] = React.useState("");

  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  }, []);
  const generateImage = () => {
    setPromptForContinuation("");
    setContinuedConversation([]);
    setSelectedConversation(null);
    setMessages([]);
    setImages([]);
    setGenerating(true);
    setFailed(false);
    fetch(`${ENDPOINT}/image?prompt=${prompt}`)
      .then((res) => res.json())
      .then((res) => {
        setImages(res.data);
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  const handleRun = (formValues: FormValues) => {
    const { prompt, apiOptions } = formValues;
    setPromptForContinuation("");
    setContinuedConversation([]);
    setSelectedConversation(null);
    setMessages([]);
    setImages([]);
    setFailed(false);

    if (prompt !== "") {
      setGenerating(true);
      const queryString = `prompt=${prompt}&apiOptions=${JSON.stringify(
        apiOptions
      )}`;

      fetch(`${ENDPOINT}/gpt?${queryString}`)
        .then((res) => res.json())
        .then((data) =>
          setMessages(data.choices.map((choice: any) => choice.message.content))
        )
        .catch((err) => {
          setFailed(true);
          console.log(err);
        })
        .finally(() => setGenerating(false));
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    values: FormValues
  ) => {
    if (event.key === "Enter") {
      handleRun(values);
    }
  };

  return (
    <div className="min-h-screen w-screen flex">
      <div className="sticky top-0 h-screen pt-16 pb-32 px-16">
        <div className="mb-8">
          <Image src="/logo.png" alt="Logo" width={200} height={100} />
        </div>
        <Formik
          initialValues={{
            apiOptions: {
              model: "gpt-3.5-turbo",
              temperature: 1,
              top_p: 1,
              presence_penalty: 0,
              frequency_penalty: 0,
              n: 1,
              max_tokens: 1000,
              stream: false,
            },
            prompt: "",
          }}
          onSubmit={handleRun}
        >
          {(props: FormikProps<FormValues>) => (
            <Form>
              <div>
                <Configuration />
              </div>
              <div className="flex flex-col items-center w-full justify-center gap-y-8 mt-4">
                <input
                  className="input input-bordered input-primary w-full focus:outline-none border-[2px] "
                  value={props.values.prompt}
                  name="prompt"
                  onChange={props.handleChange}
                  placeholder="Enter your prompt here"
                  onKeyDown={(e) => handleKeyDown(e, props.values)}
                />
                <div className="flex gap-x-4">
                  <button
                    className="btn lg:btn-wide"
                    type="submit" /* onClick={handleRun} */
                  >
                    Search
                  </button>
                  <button
                    className="btn btn-outline lg:btn-wide"
                    onClick={() => props.resetForm()}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="p-8 bg-[radial-gradient(rgba(0,0,0,0.2)_0.5px,rgba(242,242,242)_0.5px)] bg-[length:5px_5px] flex-grow overflow-scroll h-screen">
        {generating && (
          <div className="flex flex-col gap-y-16 pt-32 items-center">
            {/* @ts-ignore */}
            <lottie-player
              speed="0.7"
              autoplay
              loop
              mode="bounce"
              src="https://assets4.lottiefiles.com/packages/lf20_aMX99M5A06.json"
              style={{ height: "300px", width: "300px" }}
            />
            <p className="font-medium">Thinking...</p>
          </div>
        )}
        {failed && (
          <p className="mb-8">Something went wrong. Please try again later.</p>
        )}
        {!generating && images.length > 0 && (
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

        {!generating && !selectedConversation && (
          <ul className="w-full  flex flex-col gap-y-4 prose prose-pre:bg-transparent prose-pre:p-0">
            {messages.map((message: any, idx: number) => (
              <li key={idx}>
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={{ ...dracula }}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            backgroundColor: "black",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props}>{children}</code>
                      );
                    },
                  }}
                >
                  {message}
                </ReactMarkdown>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
