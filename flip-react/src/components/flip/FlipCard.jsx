export default function FlipCard({ book, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <img
        src={book.cover}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{book.description}</p>
      </div>
    </div>
  );
}
