import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { PageFlip } from "page-flip";
import "./App.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PAGE_WIDTH = 420;

export default function App() {
  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);

  const [images, setImages] = useState([]);
  const [aspectRatio, setAspectRatio] = useState(1.414);
  const [pageWidth, setPageWidth] = useState(420);
  const [pageHeight, setPageHeight] = useState(560);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const calculateSize = (ratio) => {
    const availableWidth = window.innerWidth - 80;
    const singlePageWidth = Math.min(
      MAX_PAGE_WIDTH,
      Math.floor(availableWidth / 2)
    );

    setPageWidth(singlePageWidth);
    setPageHeight(Math.round(singlePageWidth * ratio));
  };

  const loadPDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      if (i === 1) {
        const ratio = viewport.height / viewport.width;
        setAspectRatio(ratio);
        calculateSize(ratio);
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
      pages.push(canvas.toDataURL("image/jpeg"));
    }

    setImages(pages);
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!images.length) return;

    bookRef.current.innerHTML = "";

    images.forEach((src) => {
      const page = document.createElement("div");
      page.className = "page";
      page.innerHTML = `<img src="${src}" />`;
      bookRef.current.appendChild(page);
    });

    if (pageFlipRef.current) {
      pageFlipRef.current.destroy();
    }

    pageFlipRef.current = new PageFlip(bookRef.current, {
      width: pageWidth,
      height: pageHeight,
      size: "fixed",
      showCover: true,
      drawShadow: true,
      maxShadowOpacity: 0.4,
      mobileScrollSupport: false,
      useMouseEvents: true
    });

    pageFlipRef.current.loadFromHTML(
      bookRef.current.querySelectorAll(".page")
    );

    pageFlipRef.current.on("flip", (e) => {
      setCurrentPage(e.data + 1);
    });
  }, [images, pageWidth, pageHeight]);

  // useEffect(() => {
  //   const onResize = () => calculateSize(aspectRatio);
  //   window.addEventListener("resize", onResize);
  //   return () => window.removeEventListener("resize", onResize);
  // }, [aspectRatio]);

  return (
    <div className="app">
      <h2>PDF Album Flipbook</h2> 

      <input
        type="file"
        accept="application/pdf"
        onChange={loadPDF}
      />

      {images.length > 0 && (
        <>
          <div className="book-wrapper">
            <div className="book-frame">
              <div
                className="book-container"
                style={{ width: pageWidth * 2 }}
              >
                <div ref={bookRef} />
              </div>
            

          {/* Bottom Controls */}
          <div className="bottom-controls">
            <button
              className="nav-btn"
              onClick={() => pageFlipRef.current.flipPrev()}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            <span className="page-indicator">
              Page {currentPage} / {totalPages}
            </span>

            <button
              className="nav-btn"
              onClick={() => pageFlipRef.current.flipNext()}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
