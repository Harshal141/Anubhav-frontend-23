import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SuccessMessage from "../components/notification/SuccessMessage";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import ButtonV5 from "../components/ui/buttonv5";
import { Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import BasicInformation from "../components/Create/BasicInformation";
import WriteHere from "../components/Create/WriteHere";
import SubmittedCard from "../components/Create/SubmittedCard";
import PreviewPage from "../components/Create/PreviewPage";
import useErrorToast from "../hooks/useErrorToast";

const Create = () => {
  const initialState = {
    name: "",
    email: "",
    company: "",
    position: "",
    title: "",
  };

  const [file, setFile] = useState(null);
  const [bannerImage, setbannerImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [value, setValue] = useState(initialState);
  const [requestSend, setRequestSend] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showError = useErrorToast();

  const publishPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(BACKEND_URL + "/blogs", {
        title: value.title,
        authorName: value.name,
        authorEmailId: value.email,
        companyName: value.company,
        role: value.position,
        articleTags: tags,
        article: article,
        image: bannerImage,
      });
      setIsLoading(false);
      console.log("Article submitted successfully");
      setRequestSend("Article submitted successfully");
      setValue(initialState);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting post:", error.response.data);
      showError("Failed to submit the article. Please try again.");
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (value.name === "") {
        showError("Name cannot be empty");
        return;
      }
      if (value.email === "") {
        showError("Email cannot be empty");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.email)) {
        showError("Please enter a valid email address");
        return;
      }

      if (value.company === "") {
        showError("Company cannot be empty");
        return;
      }

      if (value.position === "") {
        showError("Position cannot be empty");
        return;
      }

      if (value.title === "") {
        showError("Title cannot be empty");
        return;
      }

      if (!file) {
        showError("Please upload a banner image");
        return;
      }

      if (tags.length === 0) {
        showError("Write a tag and press enter to add it");
        return;
      }
    }

    if (step === 2 && article === "") {
      showError("Article cannot be empty");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // Calculate progress
  const progressPercentage = ((step - 1) / 3) * 100;

  return (
    <>
      <Navbar />
      {isSubmitted && <SubmittedCard />}
      {isVisible && (
        <p className="relative flex w-full items-center justify-center bg-white/40 pb-1 pt-16 text-[#212121] x-sm:text-sm">
          Before writing an article, please read the &nbsp;
          <Link to="/guidelines" target="_blank" className="underline">
            Guidelines
          </Link>
          .
        </p>
      )}

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 pt-4">
        {/* Progress Bar */}
        <div className="relative z-0 mt-4 h-12 w-[70%] border border-[#d3ddeb] bg-[#f7f7f8] md:w-[90%] md:text-[14px] xl:w-[50%]">
          <div className="absolute inset-0 left-1/3 z-[99] w-3">
            <svg
              class="h-full w-full text-slate-300"
              viewBox="0 0 12 82"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0.5 0V31L10.5 41L0.5 51V82"
                stroke="currentcolor"
                vector-effect="non-scaling-stroke"
              ></path>
            </svg>
          </div>
          <div className="absolute inset-0 left-2/3 z-[99] w-3">
            <svg
              class="h-full w-full text-slate-300"
              viewBox="0 0 12 82"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0.5 0V31L10.5 41L0.5 51V82"
                stroke="currentcolor"
                vector-effect="non-scaling-stroke"
              ></path>
            </svg>
          </div>
          <div
            className={`-50 absolute ${step >= 1 ? "bg-[#fff]" : ""} left-0 top-1/2 flex h-full w-1/3 -translate-y-1/2 translate-x-0 items-center justify-center text-[#212121]`}
          >
            1. Basic Info <span className="md:hidden">rmation</span>
          </div>
          <div
            className={`-50 absolute ${step >= 2 ? "bg-[#fff]" : ""} left-1/3 top-1/2 flex h-full w-1/3 -translate-y-1/2 translate-x-0 items-center justify-center text-[#212121]`}
          >
            2. Write Here
          </div>
          <div
            className={`-50 absolute ${step >= 3 ? "bg-[#fff]" : ""} right-0 top-1/2 flex h-full w-1/3 -translate-y-1/2 translate-x-0 items-center justify-center text-[#212121]`}
          >
            3. Preview <span className="md:hidden">&nbsp;& Publish</span>
          </div>
          <div
            className="absolute bottom-0 z-[999] h-1 bg-[#212121] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        {step === 1 && (
          <BasicInformation
            value={value}
            setValue={setValue}
            tags={tags}
            setTags={setTags}
            file={file}
            setFile={setFile}
            bannerImage={bannerImage}
            setbannerImage={setbannerImage}
          />
        )}
        {step === 2 && <WriteHere article={article} setArticle={setArticle} />}
        {step === 3 && (
          <PreviewPage
            value={value}
            article={article}
            bannerImage={bannerImage}
            tags={tags}
          />
        )}
        <div className="mt-6 flex w-full max-w-[70%] justify-between gap-4 pb-4 sm:mt-8 sm:pb-4 md:max-w-[90%] md:px-5 xl:mt-0 x-sm:mt-20 x-sm:px-0 x-sm:pb-8">
          {step > 1 && (
            <div
              onClick={handleBack}
              className="w-full p-0 font-[400] outline-none focus:outline-none"
            >
              <ButtonV5 className="w-full" icon={false} color="#f6f8fb">
                <h5 className="flex w-full gap-1 text-[16px] font-[500] -tracking-[0.2px] text-[#212121]">
                  Previous
                </h5>
              </ButtonV5>
            </div>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="ml-auto w-full p-0 font-[400] outline-none focus:outline-none"
            >
              <ButtonV5 className="w-full" icon={true}>
                Next
              </ButtonV5>
            </button>
          ) : (
            <button
              onClick={publishPost}
              disabled={isLoading}
              className="ml-auto w-full p-0 font-[400] outline-none focus:outline-none"
            >
              <ButtonV5 className="w-full" disabled={isLoading} icon={false}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-1 font-[300]">
                    &nbsp; Processing <Spinner color="#fff" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    Publish
                    {/* airplane svg */}
                    <div className="flex w-5 items-center justify-end overflow-hidden">
                      <div className="w-5">
                        <svg
                          className={`h-5 w-5 translate-x-[0%] translate-y-[66%] text-[#ffffff80] opacity-0 transition-all duration-0 group-hover:translate-x-[100%] group-hover:translate-y-[0%] group-hover:text-[#ffffff] group-hover:opacity-100 group-hover:duration-300`}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.39993 6.31991L15.8899 3.48991C19.6999 2.21991 21.7699 4.29991 20.5099 8.10991L17.6799 16.5999C15.7799 22.3099 12.6599 22.3099 10.7599 16.5999L9.91993 14.0799L7.39993 13.2399C1.68993 11.3399 1.68993 8.22991 7.39993 6.31991Z"
                            stroke="#f0f0f0"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.1101 13.6501L13.6901 10.0601"
                            stroke="#f0f0f0"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="w-5">
                        <svg
                          className={`h-5 w-5 translate-x-[0%] translate-y-[0%] text-[#ffffff80] opacity-100 transition-all duration-0 group-hover:-translate-y-[66%] group-hover:translate-x-[100%] group-hover:text-[#ffffff] group-hover:opacity-0 group-hover:duration-300`}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.39993 6.31991L15.8899 3.48991C19.6999 2.21991 21.7699 4.29991 20.5099 8.10991L17.6799 16.5999C15.7799 22.3099 12.6599 22.3099 10.7599 16.5999L9.91993 14.0799L7.39993 13.2399C1.68993 11.3399 1.68993 8.22991 7.39993 6.31991Z"
                            stroke="#f0f0f0"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.1101 13.6501L13.6901 10.0601"
                            stroke="#f0f0f0"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </ButtonV5>
            </button>
          )}
        </div>

        {requestSend && (
          <SuccessMessage
            message={requestSend}
            onClose={() => setRequestSend(null)}
          />
        )}
      </div>

      <Footer />
    </>
  );
};

export default Create;
