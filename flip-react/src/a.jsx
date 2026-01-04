import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { PageFlip } from "page-flip";
import "./FlipBookPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PAGE_WIDTH = 420;

export default function FlipBookPDF({ pdfUrl }) {
  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);
  const frameRef = useRef(null);

  const [images, setImages] = useState([]);
  const [pageWidth, setPageWidth] = useState(420);
  const [pageHeight, setPageHeight] = useState(560);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const calculateSize = (ratio) => {
    const availableWidth = window.innerWidth - 100;
    const single = Math.min(
      MAX_PAGE_WIDTH,
      Math.floor(availableWidth / 2)
    );
    setPageWidth(single);
    setPageHeight(Math.round(single * ratio));
  };

  // 🔹 Load PDF from URL / path
  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;

    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          disableAutoFetch: true,
          disableStream: true
        });

        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const pages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: 1 });

          if (i === 1) {
            calculateSize(viewport.height / viewport.width);
          }

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport
          }).promise;

          pages.push(canvas.toDataURL("image/jpeg"));
        }

        if (!cancelled) {
          setImages(pages);
          setTotalPages(pdf.numPages);
          setCurrentPage(1);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF load error:", err);
        }
      }
    };

    loadPDF();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  // 🔹 Init PageFlip
  useEffect(() => {
    if (!images.length) return;

    bookRef.current.innerHTML = "";

    images.forEach((src) => {
      const el = document.createElement("div");
      el.className = "page";
      el.innerHTML = `<img src="${src}" />`;
      bookRef.current.appendChild(el);
    });

    pageFlipRef.current?.destroy();

    pageFlipRef.current = new PageFlip(bookRef.current, {
      width: pageWidth,
      height: pageHeight,
      size: "fixed",
      showCover: true,
      drawShadow: true,
      maxShadowOpacity: 0.4,
      useMouseEvents: true
    });

    pageFlipRef.current.loadFromHTML(
      bookRef.current.querySelectorAll(".page")
    );

    pageFlipRef.current.on("flip", (e) =>
      setCurrentPage(e.data + 1)
    );
  }, [images, pageWidth, pageHeight]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      frameRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!pdfUrl) return null;

  return (
    <div className="book-wrapper">
      <div className="book-frame" ref={frameRef}>
        {/* Flipbook */}
        <div
          className="book-container"
          style={{ width: pageWidth * 2 }}
        >
          <div ref={bookRef} />
        </div>

        {/* Bottom Center Controls */}
        <div className="controls-center">
          <button
            onClick={() => pageFlipRef.current.flipPrev()}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => pageFlipRef.current.flipNext()}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>

        {/* Bottom Right Fullscreen */}
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}
