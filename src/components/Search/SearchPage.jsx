import React, { useState, useEffect, useRef } from "react";
import NavbarMini from "../Navbar/NavbarMini";
import BlogCard from "../BlogSection/BlogCard";
import "./SearchPage.css";
import FilterPopUp from "../Filter/FilterPopUp";
import Filter from "../Filter/Filter";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useSearchParams } from "react-router-dom";
import companyLogo from "/assets/images/company.png";
import { ReadTime, formatDate } from "../../services/date";
import SearchCardLoading from "./SearchCardLoading";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [company, setCompany] = useState([]);
  const [headerName, setHeaderName] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [filterPopUp, setFilterPopUp] = useState(false);
  const loadMoreRef = useRef(null);

  const openFilterPopup = () => {
    setFilterPopUp(true);
  };

  const closeFilterPopUp = () => {
    setFilterPopUp(false);
  };

  const fetchLatestArticles = async (endPoint, page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}${endPoint}?page=${page}`);
      const data = res.data.articles;

      if (page === 1) {
        setArticles(data);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...data]);
      }

      setHasMore(res.data.hasMore);
    } catch (error) {
      console.log("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async (query, page) => {
    setLoading(true);
    const params = { q: query, page, limit: 10 };
    console.log("params", params);

    try {
      const response = await axios.get(BACKEND_URL + "/search", { params });
      const newArticles = response.data.articles;

      if (page === 1) {
        setArticles([...newArticles]);
      } else {
        setArticles(prevArticles => [...prevArticles, ...newArticles]);
      }

      setHasMore(newArticles.length === 10);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  const countCompany = async () => {
    try {
      const res = await axios.get(BACKEND_URL + "/countCompanies");
      setCompany(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    countCompany();
  }, []);

  useEffect(() => {
    const query = searchParams.get('query');
    setIsSearching(!!query);

    if (query) {
      setArticles([]);
      setPage(1);
      fetchArticles(query, 1);
    } else {
      fetchLatestArticles("/blogs", page);
    }
  }, [searchParams, page]);

  const handleShowMore = () => {
    const query = searchParams.get('query');
    if (query) {
      fetchArticles(query, page + 1);
    } else {
      fetchLatestArticles("/blogs", page + 1);
    }
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleShowMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loadMoreRef.current]);

  return (
    <>
      {filterPopUp && <FilterPopUp closeFilterPopUp={closeFilterPopUp} company={company} fetchArticles={fetchArticles} setHeaderName={setHeaderName} />}
      <NavbarMini />
      <div className="pt-24 px-8 md:px-4 lg:px-14 2xl:px-28 h-full">
        <div className="w-full flex gap-10 h-full">
          <div className="section-left w-full flex flex-col gap-2 h-full max-w-5xl">
            <div className="flex w-full justify-between items-center">
              <h3 className="font-[400] text-2xl">{articles.length} Articles found for {headerName ? headerName : (isSearching ? decodeURIComponent(searchParams.toString().substring(6).replace(/\+/g, " ")) : "Latest Blogs")}</h3>
              <svg
                onClick={() => openFilterPopup()}
                className="md:block hidden cursor-pointer border border-[#c1c1c1] hover:border-[#919191] transition-all rounded-lg p-[2px] w-7 h-7"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.3999 2.1001H18.5999C19.6999 2.1001 20.5999 3.0001 20.5999 4.1001V6.3001C20.5999 7.1001 20.0999 8.1001 19.5999 8.6001L15.2999 12.4001C14.6999 12.9001 14.2999 13.9001 14.2999 14.7001V19.0001C14.2999 19.6001 13.8999 20.4001 13.3999 20.7001L11.9999 21.6001C10.6999 22.4001 8.8999 21.5001 8.8999 19.9001V14.6001C8.8999 13.9001 8.4999 13.0001 8.0999 12.5001L4.2999 8.5001C3.7999 8.0001 3.3999 7.1001 3.3999 6.5001V4.2001C3.3999 3.0001 4.2999 2.1001 5.3999 2.1001Z"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.93 2.1001L6 10.0001"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {loading && articles.length === 0 ? (
              <>
                <SearchCardLoading />
                <SearchCardLoading />
                <SearchCardLoading />
                <SearchCardLoading />
                <SearchCardLoading />
              </>
            ) : (
              articles.map((item) => (
                <BlogCard
                  key={item._id}
                  id={item._id}
                  link={`/blog/${item._id}`}
                  Title={item.title}
                  imagesrc={item.imageUrl === "your_image_url_here" ? companyLogo : item.imageUrl}
                  author={item.author?.name}
                  company={item.companyName}
                  data={item.description}
                  readingTime={ReadTime(item.description)}
                  date={formatDate(item.createdAt)}
                />
              ))
            )}

            {hasMore && !loading && (
              <div ref={loadMoreRef} className="pt-4 group pb-8 cursor-pointer h-full flex flex-col justify-center items-center w-full text-[#212121]">
                Loading more...
              </div>
            )}

            {loading && articles.length > 0 && <SearchCardLoading />}
            <br /><br />
          </div>
          <div className="section-right md:hidden w-1/5 flex flex-col gap-2">
            <Filter company={company} fetchArticles={fetchArticles} setHeaderName={setHeaderName} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;