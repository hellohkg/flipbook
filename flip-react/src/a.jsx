import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { PageFlip } from "page-flip";
import "./App.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PAGE_WIDTH = 420; // desktop cap

export default function App() {
  const bookRef = useRef(null);
  const pageFlipRef = useRef(null);

  const [images, setImages] = useState([]);
  const [aspectRatio, setAspectRatio] = useState(1.414); // default A4
  const [pageWidth, setPageWidth] = useState(420);
  const [pageHeight, setPageHeight] = useState(560);

  // 🔑 calculate width based on screen
  const calculateSize = (ratio) => {
    const screenWidth = window.innerWidth - 40; // padding
    const singlePageWidth = Math.min(
      MAX_PAGE_WIDTH,
      Math.floor(screenWidth / 2)
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

      // get aspect ratio once
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
  };

  // 🔄 rebuild book when size or pages change
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
      maxShadowOpacity: 0.4,
      mobileScrollSupport: false,
      useMouseEvents: true
    });

    pageFlipRef.current.loadFromHTML(
      bookRef.current.querySelectorAll(".page")
    );
  }, [images, pageWidth, pageHeight]);

  // 📐 handle resize
  useEffect(() => {
    const onResize = () => calculateSize(aspectRatio);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [aspectRatio]);

  return (
    <div style={{ padding: 20 }}>
      <h2>PDF Album Flipbook</h2>
      <input type="file" accept="application/pdf" onChange={loadPDF} />

      <div
        style={{
          width: pageWidth * 2,
          margin: "30px auto"
        }}
      >
        <div ref={bookRef} />
      </div>
    </div>
  );
}
