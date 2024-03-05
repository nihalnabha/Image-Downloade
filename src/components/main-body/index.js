// Import necessary libraries and components
import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import JSZip from "jszip";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import FeedbackFormWithRating from "./FeedbackFormWithRating"; // Import the feedback form component

// Define the IndexPage component
const IndexPage = () => {
  // State variables
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [docsId, setDocsId] = useState("");
  const [images, setImages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloaderRating, setDownloaderRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Function to handle input change
  const handleInputChange = (event) => {
    const inputUrl = event.target.value;
    setUrl(inputUrl);
    setError("");
    const docsIDPattern = /\/document\/d\/([a-zA-Z0-9-_]+)\//;
    const match = inputUrl.match(docsIDPattern);
    if (match && match[1]) {
      setDocsId(match[1]);
    } else {
      setDocsId("");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url.trim()) {
      setError("Please paste a document URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/download?docsId=${docsId}`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(
        data.images.map((image) => ({
          original: image,
          thumbnail: image,
          description: `Image ${index + 1}`,
        }))
      );

      setShowFeedbackForm(true);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Error fetching images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setImages(
      images.map((image) => ({
        ...image,
        selected: !selectAll,
      }))
    );
  };

  const handleImageClick = (index) => {
    setImages(
      images.map((image, i) => ({
        ...image,
        selected: index === i ? !image.selected : image.selected,
      }))
    );
  };

  const handleDownloadZip = () => {
    if (images.length === 0) return;

    const zip = new JSZip();
    images.forEach((image, index) => {
      if (!selectAll || image.selected) {
        fetch(image.src)
          .then((response) => response.blob())
          .then((blob) => {
            zip.file(`image_${index + 1}.jpg`, blob);
            if (index === images.length - 1) {
              zip.generateAsync({ type: "blob" }).then((content) => {
                const url = URL.createObjectURL(content);
                const a = document.createElement("a");
                a.href = url;
                a.download = "selected_images.zip";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              });
            }
          })
          .catch((error) => console.error("Error downloading image:", error));
      }
    });
  };

  // Function to handle feedback form submission
  const handleFeedbackSubmit = (_feedback) => {
    setDownloaderRating(_feedback.rating);
    setFeedback(_feedback.text);
    setShowFeedbackForm(false);
  };

  return (
    <main className="bg-white flex flex-col justify-between min-h-screen">
      <div className="px-4 py-8 md:px-8 lg:px-16 xl:px-32 flex-grow">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold text-center text-black mb-4">
            Docs Image Downloader
          </h1>
          <p className="text-center text-gray-700 mb-8">
            Download docs images in a single click. Try it now to streamline
            your processes & save time.
          </p>
          {/* Only show the form if images are not loaded */}
          {!images.length ? (
            <form
              className="flex flex-col sm:flex-row items-center justify-between mb-8"
              onSubmit={handleSubmit}
            >
              <input
                type="url"
                placeholder="https://docs.google.com/document/d/xxxxxxxxx_xxxxxxxx/edit"
                className="text-black max-w-lg w-full px-4 py-2 hover:border-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4 sm:mb-0 sm:mr-4 placeholder-gray-500 placeholder-opacity-100"
                value={url}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-purple-500 focus:outline-none focus:bg-blue-700 mt-2 sm:mt-0"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}{" "}
                <FaArrowRightLong className="ml-2" />
              </button>
            </form>
          ) : null}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
      <div className="bg-black p-4">
        {/* Display images using the react-image-gallery component */}
        {showFeedbackForm ? (
          <div>
            <p>
              Thank you for using the tool! Please provide your feedback:
            </p>
            <FeedbackFormWithRating onSubmit={handleFeedbackSubmit} />
          </div>
        ) : (
          <div>
            <Gallery items={images} />
            {/* Buttons */}
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md mr-4"
                onClick={handleSelectAll}
              >
                {selectAll ? "Deselect All" : "Select All"}
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleDownloadZip}
                disabled={images.length === 0}
              >
                Download (ZIP)
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default IndexPage;
