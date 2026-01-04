import { useNavigate } from "react-router-dom";
import FlipCard from "../../components/flip/FlipCard";

export default function FlipHome() {
  const navigate = useNavigate();

  // Sample flipbooks JSON (replace with API later)
  const sampleFlipbooks = [
    {
      id: 1,
      title: "JavaScript Basics",
      description: "Learn JS fundamentals with interactive pages.",
      cover: "/pdfs/flip1.jpg", // use an image in public folder as cover
      pdfUrl: "/pdfs/flip1.pdf"
    },
    {
      id: 2,
      title: "React Guide",
      description: "Step-by-step React tutorials in flipbook style.",
      cover: "/pdfs/flip2.jpg",
      pdfUrl: "/pdfs/flip2.pdf"
    },
    {
      id: 3,
      title: "CSS Animations",
      description: "Master animations with CSS in an interactive book.",
      cover: "/pdfs/flip3.jpg",
      pdfUrl: "/pdfs/flip3.pdf"
    },
    {
      id: 4,
      title: "Python 101",
      description: "Beginner Python programming with examples.",
      cover: "/pdfs/flip4.jpg",
      pdfUrl: "/pdfs/flip4.pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* Page Title */}
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Flipbooks Library
      </h2>

      {/* Flipbook Cards Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sampleFlipbooks.map((book) => (
          <FlipCard
            key={book.id}
            book={book}
            onClick={() => navigate(`/flip/${book.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
