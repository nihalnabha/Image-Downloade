// Import necessary libraries and components
import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import JSZip from "jszip";

// Define the IndexPage component
const IndexPage = () => {
  // State variables
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [docsId, setDocsId] = useState("");
  const [images, setImages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Function to handle input change
  const handleInputChange = (event) => {
    const inputUrl = event.target.value;
    setUrl(inputUrl);
    setError(""); // Reset error on input change

    // Extracting document ID from URL
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
      // If URL field is empty, set error message
      setError("Please paste a document URL.");
      return; // Exit early
    }
    if (!error) {
      console.log("clicked")
      try {
        // Fetch images from the server
        const response = await fetch(`/api/download?docsId=${docsId}`, { method:"GET"});
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setImages(data.images); // Update state with fetched images
        setImages(
          data.images.map((image) => ({
            image,
            selected: !selectAll,
          }))
        );
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Error fetching images. Please try again.");
      }
    } else {
      console.log("Form submission failed due to error:", error);
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
    if (images.length === 0) return; // No images to download

    const zip = new JSZip();
    images.forEach((image, index) => {
      if (!selectAll || image.selected) {
        // Only add selected images or all images if selectAll is true
        fetch(image.src)
          .then((response) => response.blob())
          .then((blob) => {
            zip.file(`image_${index + 1}.jpg`, blob);
            if (index === images.length - 1) {
              // Last image processed, generate ZIP and initiate download
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
            >
              Submit <FaArrowRightLong className="ml-2" />
            </button>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
      <div className="bg-black p-4">
        {/* Display images */}
        <div className="flex flex-wrap justify-center">
          {images.length> 0 && images.map((img, index) => (
            <div key={index} className="m-2">
              <img
                src={img.image}
                alt={`Image ${index + 1}`}
                className={img.selected ? "opacity-50" : ""}
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </div>
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
    </main>
  );
};

export default IndexPage;
