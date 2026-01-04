import { useParams, useNavigate } from "react-router-dom";
import FlipBookPDF from "../../components/flip/FlipBookPDF";
import FlipBookDetails from "../../components/flip/FlipBookDetails";

export default function FlipBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 Sample data (replace with API later)
  const sampleFlipbooks = [
    {
      id: "1",
      title: "JavaScript Basics",
      description: "Learn JS fundamentals with interactive pages.",
      author: "John Doe",
      pdf: "/pdfs/flip1.pdf",
      cover: "/pdfs/flip1.jpg"
    },
    {
      id: "2",
      title: "React Guide",
      description: "Step-by-step React tutorials in flipbook style.",
      author: "Jane Smith",
      pdf: "/pdfs/flip2.pdf",
      cover: "/pdfs/flip2.jpg"
    },
    {
      id: "3",
      title: "CSS Animations",
      description: "Master animations with CSS in an interactive book.",
      author: "Alex Brown",
      pdf: "/pdfs/flip3.pdf",
      cover: "/pdfs/flip3.jpg"
    }
  ];

  // 🔹 Match route param
  const book = sampleFlipbooks.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Flipbook not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/flip")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Flipbooks
      </button>

      {/* Details */}
      <FlipBookDetails book={book} />

      {/* Flipbook Viewer */}
      <div className="mt-8">
        <FlipBookPDF pdfUrl={book.pdf} />
      </div>
    </div>
  );
}
