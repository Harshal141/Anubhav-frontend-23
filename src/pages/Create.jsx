import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Inputtag from "../components/InputTag/Usertag";
import TextEditor from "../components/Editor/TextEditor";
import Footer from "../components/Footer/Footer";
import Upload from "../assets/images/upload.svg";
import ErrorMessage from "../components/notification/ErrorMessage";
import SuccessMessage from "../components/notification/SuccessMessage";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import ButtonV5 from "../components/ui/buttonv5";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
const Create = () => {
  const initialState = {
    name: "",
    email: "",
    company: "",
    position: "",
    title: "",
  };

  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [bannerImage, setbannerImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState("");
  const [value, setValue] = useState(initialState);
  const [requestSend, setRequestSend] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const content = JSON.parse(savedContent);
      setArticle(content.article);
      setValue(content.value);
    }
  }, []);

  useEffect(() => {
    const Debouncer = setTimeout(() => {
      const content = {
        value: value,
        article: article,
      };
      const savedContent = JSON.stringify(content);
      localStorage.setItem("editorContent", savedContent);
    }, 500);
    // clean up the timeout if content changes before delay
    return () => clearTimeout(Debouncer);
  }, [article, value]);

  const addError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const UploadFile = async () => {
    const file = inputRef.current.files[0];
    setFile(URL.createObjectURL(file));
    // console.log(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      // TODO: hide this key
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=cc540dc0e2847dccaa0d727a71651587",
        formData,
      );
      // console.log("Response form image cloud", response);
      setbannerImage(response.data.data.display_url);
    } catch (error) {
      console.log("Error uploading image: ", error);
    }
  };

  useEffect(() => {
    // console.log("Banner Image", bannerImage);
  }, [bannerImage]);

  const publishPost = async () => {
    if (article === "") {
      addError("Article cannot be empty");
      return;
    }

    if (!file) {
      addError("Please upload a banner image");
      return;
    }
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
      const id = response.data.createArticle._id;
      console.log("Article submitted successfully");
      setRequestSend("Article submitted successfully");
      setValue(initialState);
    } catch (error) {
      console.error("Error submittin post:", error.response.data);
      setIsLoading(false);
    }
  };

  const [companySuggestions, setCompanySuggestions] = useState([]);

  useEffect(() => {
    const fetchCompanySuggestions = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/companies");
        setCompanySuggestions(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching company suggestions:", error);
      }
    };

    fetchCompanySuggestions();
  }, []);

  const UserImage = () => {
    return (
      <>
        <h3 className="bg -mb-2 flex justify-start text-[#212121]">
          Banner Image
        </h3>
        <div className="border-[rgba(0, 0, 0, 0.15)] flex h-[80%] w-full flex-col items-center justify-center gap-2 rounded-xl border-[2px] border-dashed bg-white md:w-full">
          <div className="flex w-full justify-center">
            <div className="flex h-[150px] w-[150px] justify-center rounded-full sm:h-24 sm:w-24">
              {file ? (
                <img
                  src={file}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <img
                  className="cursor-pointer"
                  src={Upload}
                  onClick={(e) => {
                    inputRef.current.click();
                    e.preventDefault();
                  }}
                />
              )}
            </div>
          </div>
          <p className="text-gray-300">
            {file ? null : (
              <>
                <h1 className="text-center text-xs font-[300] text-[#C3C3C3]">
                  JPG, JPEG, PNG file size no more than 10MB
                </h1>
                <h1 className="text-center text-xs font-[400] text-[#322e2e]">
                  Keep the image ratio to 280x180 px
                </h1>
              </>
            )}
          </p>
          {file && (
            <div
              className="flex h-[20px] cursor-pointer items-center justify-center gap-1 border-b border-[#fff] text-[#717171] hover:border-[#717171]"
              onClick={() => setFile(null)}
            >
              Remove <span className="text-[24px]">×</span>
            </div>
          )}
          {/* </div> */}
          <input
            type="file"
            ref={inputRef}
            name=""
            id=""
            onChange={UploadFile}
            className="hidden"
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />

      {isVisible && (
        <p className="flex justify-center x-sm:text-sm pt-16 pb-1 w-full relative bg-white/40 items-center text-[#212121]">
          Before writing an article, please read the &nbsp;
          <Link to="/guidelines" className="underline">Guidelines</Link>.
          <svg
            className="cursor-pointer absolute x-sm:right-2 right-[6%] md:right-[4%]"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleDismiss} // Call this function when clicking the cross icon
          >
            <path d="M16.0163 15.8805L4.72266 4.58691" stroke="#212121" strokeWidth="1.42857" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.8796 4.71973L4.58594 16.0134" stroke="#212121" strokeWidth="1.42857" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      )}
      <div
        className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 pt-8"
      // style={{ backgroundImage: `url(${background2})` }}
      >
        {/* basic info */}
        <div className="relative flex w-[100%] max-w-[100%] justify-center md:h-[70%] md:w-[90%]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              publishPost();
            }}
            className="relative flex w-[70%] flex-col gap-3 rounded-xl pb-4 md:w-full md:gap-1 md:p-5 x-sm:p-0"
          >
            <div className="w-full">
              <h2 className="text-2xl font-[500] text-[#212121]">
                Basic Information
              </h2>
            </div>

            <div className="g flex md:flex-col">
              <div className="flex w-[50%] flex-col gap-3 md:w-full md:gap-2">
                <div className="flex flex-col gap-3 md:gap-1">
                  <h4 className="text-gray-700">About You</h4>

                  <div className="flex flex-col gap-2">
                    <div className="relative flex flex-col gap-2">
                      <input
                        required
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Name"
                        value={value.name}
                        onChange={handleChange}
                        className="text-md w-full rounded-lg border-[1px] border-[#78788033] bg-white p-3 text-[#3C3C43] shadow-sm shadow-[#00000020] ring ring-transparent placeholder:text-[#3C3C4399] focus:outline-none focus:placeholder:text-[#3c3c4350] sm:p-2 sm:text-[13px] md:w-full"
                      />
                    </div>

                    <div className="relative flex flex-col gap-2">
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={value.email}
                        onChange={handleChange}
                        className="text-md w-full rounded-lg border-[1px] border-[#78788033] bg-white p-3 text-[#3C3C43] shadow-sm shadow-[#00000020] ring ring-transparent placeholder:text-[#3C3C4399] focus:outline-none focus:placeholder:text-[#3c3c4350] sm:p-2 sm:text-[13px] md:w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:gap-1">
                  <h4 className="text-gray-700">About Company</h4>
                  <div className="flex flex-col gap-2">
                    <div className="relative flex flex-col gap-2">
                      <input
                        required
                        type="text"
                        name="company"
                        id="name"
                        list="companySuggestions"
                        placeholder="Company's name"
                        value={value.company}
                        onChange={handleChange}
                        className="text-md w-full rounded-lg border-[1px] border-[#78788033] bg-white p-3 text-[#3C3C43] shadow-sm shadow-[#00000020] ring ring-transparent placeholder:text-[#3C3C4399] focus:outline-none focus:placeholder:text-[#3c3c4350] sm:p-2 sm:text-[13px] md:w-full"
                      />
                      <datalist id="companySuggestions">
                        {companySuggestions.map((suggestion, index) => (
                          <option key={index} value={suggestion} />
                        ))}
                      </datalist>
                    </div>

                    <div className="relative flex flex-col gap-2">
                      <select
                        required
                        name="position"
                        id="position"
                        value={value.position}
                        onChange={handleChange}
                        className="text-md w-full rounded-lg border-[1px] border-[#78788033] bg-white p-3 text-[#3C3C43] shadow-sm shadow-[#00000020] ring ring-transparent placeholder:text-[#3C3C4399] focus:outline-none focus:placeholder:text-[#3c3c4350] sm:p-2 sm:text-[13px] md:w-full"
                      >
                        <option value="">Select Position</option>
                        <option value="Internship">Internship</option>
                        <option value="FullTime">Full Time</option>
                        <option value="Interview-experience">
                          Interview Experience
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:gap-1">
                  <h4 className="text-gray-700">Title</h4>
                  <div className="flex flex-col gap-2">
                    <div className="relative flex flex-col gap-2">
                      <div className="relative flex flex-col gap-2">
                        <input
                          required
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Blog Title"
                          value={value.title}
                          onChange={handleChange}
                          className="text-md w-full rounded-lg border-[1px] border-[#78788033] bg-white p-3 text-[#3C3C43] shadow-sm shadow-[#00000020] ring ring-transparent placeholder:text-[#3C3C4399] focus:outline-none focus:placeholder:text-[#3c3c4350] sm:p-2 sm:text-[13px] md:w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* image upload and tag */}
              <div className="flex h-full w-[50%] flex-col gap-3 pl-2 pt-2 md:w-full">
                <UserImage />
                <Inputtag tags={tags} setTags={setTags} />
              </div>
            </div>
            <h1 className=" text-left text-2xl font-[500] text-[#212121]">
              Write Here
            </h1>
            <div className="flex w-screen max-w-[100%] flex-col items-center justify-center gap-0 pb-5 ">
          <div className="relative mx-auto flex w-full flex-col items-center justify-center text-[#212121]">
            <TextEditor article={article} setArticle={setArticle} />
          </div>
          
            {/* submit button */}

            <button
              type="submit"
              disabled={isLoading}
              className="p-0 font-[400] mt-4 max-w-[100%] outline-none focus:outline-none"
            >
              <ButtonV5 icon={false}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-1">
                    &nbsp;
                    Processing <Spinner className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    Submit
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
        </div>
          </form>
        </div>
      </div>
      <div className="pt-7">
        <Footer />
      </div>
      <ErrorMessage error={error} />
      <SuccessMessage
        requestSend={requestSend}
        setRequestSend={setRequestSend}
      />
    </>
  );
};

export default Create;
