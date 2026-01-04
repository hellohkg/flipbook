import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { PageFlip } from "page-flip";
import "./FlipBookPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function FlipBookPDF({ pdfUrl }) {

  const pdfRef = useRef(null);
  const renderedPagesRef = useRef(new Map());

  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);
  const frameRef = useRef(null);

  const [images, setImages] = useState([]);
  const [pageWidth, setPageWidth] = useState(420);
  const [pageHeight, setPageHeight] = useState(560);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true); // 🔹 NEW

  const calculateSize = (ratio) => {
    const containerWidth =
      frameRef.current?.clientWidth || window.innerWidth - 80;

    const singlePageWidth = Math.floor(containerWidth / 2);

    setPageWidth(singlePageWidth);
    setPageHeight(Math.round(singlePageWidth * ratio));
  };


  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;
    setLoading(true);
    setImages([]);

    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument({
          url: pdfUrl,
          disableAutoFetch: true,
          disableStream: true
        }).promise;

        if (cancelled) return;

        const pages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;

const DPR = window.devicePixelRatio || 1;
const viewport = page.getViewport({ scale: 2 * DPR });

          if (i === 1) calculateSize(viewport.height / viewport.width);

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
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF load error:", err);
          setLoading(false);
        }
      }
    };

    loadPDF();
    return () => (cancelled = true);
  }, [pdfUrl]);

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

  return (
    <div className="book-wrapper">
      <div className="book-frame" ref={frameRef}>
        {/* 🔹 Loading Skeleton */}
        {loading && (
          <div
            className="flex items-center justify-center"
            style={{
              width: pageWidth * 2,
              height: pageHeight
            }}
          >
            <FlipbookSkeleton
              pageWidth={pageWidth}
              pageHeight={pageHeight}
            />
          </div>
        )}


        {/* 🔹 Flipbook */}
        {!loading && (
          <>
            <div
              className="book-container"
              style={{ width: pageWidth * 2 }}
            >
              <div ref={bookRef} />
            </div>

            {/* Controls */}
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

            <button
              className="fullscreen-btn"
              onClick={() =>
                document.fullscreenElement
                  ? document.exitFullscreen()
                  : frameRef.current.requestFullscreen()
              }
            >
              ⛶
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FlipbookSkeleton({ pageWidth, pageHeight }) {
  return (
    <div className="flex gap-4 animate-pulse">
      <div
        style={{ width: pageWidth, height: pageHeight }}
        className="bg-gray-300 rounded-lg"
      />
      <div
        style={{ width: pageWidth, height: pageHeight }}
        className="bg-gray-300 rounded-lg hidden sm:block"
      />
    </div>
  );
}

