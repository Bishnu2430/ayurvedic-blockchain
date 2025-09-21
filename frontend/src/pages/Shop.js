import React, { useState } from "react";
import { ShoppingCart, X, ChevronDown } from "lucide-react";
import ChatBot from "../components/ChatBot";

// Detailed product data
const products = [
  // ==== Raw Herbs ====
  {
    id: "ASH1758202125157-ciyjeo",
    name: "Ashwagandha Root",
    image: "/shop/Ashwagandha.jpg",
    price: 250,
    quality: "Premium",
    rating: 4.7,
    description:
      "Ashwagandha is a powerful adaptogen that helps reduce stress, improve vitality, and support overall wellness.",
    category: "Raw Herb",
    reviews: [
      "Excellent quality, very fresh roots.",
      "Helped with my stress issues, authentic product.",
      "Good but slightly pricey.",
    ],
  },
  {
    id: "TUR1758202125171-lgt8qr",
    name: "Turmeric",
    image: "/shop/Turmeric.jpg",
    price: 180,
    quality: "Standard",
    rating: 4.5,
    description:
      "High-curcumin turmeric powder, used for anti-inflammatory and antioxidant properties.",
    category: "Raw Herb",
    reviews: [
      "Bright color, seems pure.",
      "Aroma is strong, feels authentic.",
      "Decent but packaging could be better.",
    ],
  },
  {
    id: "BRA1758202125181-ahiabm",
    name: "Brahmi",
    image: "/shop/Brahmi.jpg",
    price: 220,
    quality: "Premium",
    rating: 4.6,
    description:
      "Brahmi is known for enhancing memory, concentration, and overall cognitive health.",
    category: "Raw Herb",
    reviews: [
      "Fresh leaves, very effective.",
      "Good quality for price.",
      "Works well in my decoctions.",
    ],
  },
  {
    id: "TUL1758203892375-eqqp5g",
    name: "Tulsi (Holy Basil)",
    image: "/shop/Tulsi.jpg",
    price: 150,
    quality: "Premium",
    rating: 4.8,
    description:
      "Sacred Tulsi leaves known for immunity boosting and respiratory health benefits.",
    category: "Raw Herb",
    reviews: [
      "Fragrant and authentic Tulsi.",
      "Good for making herbal tea.",
      "Loved it, will reorder.",
    ],
  },
  {
    id: "SHI1758202125192-abc123",
    name: "Shatavari",
    image: "/shop/Shatavari.jpg",
    price: 220,
    quality: "Premium",
    rating: 4.7,
    description:
      "Shatavari is a vital herb for women’s health, supporting hormonal balance and reproductive wellness.",
    category: "Raw Herb",
    reviews: [
      "High-quality roots.",
      "Helps with energy and vitality.",
      "Authentic and effective.",
    ],
  },
  {
    id: "AMA1758202125203-def456",
    name: "Amalaki",
    image: "/shop/Amalaki.jpg",
    price: 200,
    quality: "Standard",
    rating: 4.6,
    description:
      "Amalaki, or Indian Gooseberry, is rich in vitamin C and antioxidants, supporting immunity and skin health.",
    category: "Raw Herb",
    reviews: [
      "Fresh and tangy.",
      "Boosted my immunity.",
      "Good quality for the price.",
    ],
  },
  {
    id: "GUD1758202125214-ghi789",
    name: "Guduchi",
    image: "/shop/Guduchi.jpg",
    price: 270,
    quality: "Premium",
    rating: 4.7,
    description:
      "Guduchi is an immune-boosting herb, known for detoxification and promoting overall wellness.",
    category: "Raw Herb",
    reviews: [
      "Very effective herb.",
      "Authentic Guduchi.",
      "Helps with general immunity.",
    ],
  },
  {
    id: "NEEM1758202125225-jkl012",
    name: "Neem",
    image: "/shop/Neem.jpg",
    price: 150,
    quality: "Standard",
    rating: 4.5,
    description:
      "Neem leaves are widely used for skin health, cleansing, and antimicrobial benefits.",
    category: "Raw Herb",
    reviews: [
      "Good for skin applications.",
      "Leaves are fresh.",
      "Strong neem aroma.",
    ],
  },
  {
    id: "HAR1758202125236-mno345",
    name: "Haritaki",
    image: "/shop/Haritaki.jpg",
    price: 230,
    quality: "Premium",
    rating: 4.6,
    description:
      "Haritaki is a rejuvenating herb known for digestive health and detoxification.",
    category: "Raw Herb",
    reviews: [
      "High-quality fruit.",
      "Helps with digestion.",
      "Fresh and authentic.",
    ],
  },
  {
    id: "BAC1758202125247-pqr678",
    name: "Bacopa",
    image: "/shop/Bacopa.jpg",
    price: 280,
    quality: "Premium",
    rating: 4.8,
    description:
      "Bacopa improves memory, focus, and cognitive health. Ideal for daily herbal supplementation.",
    category: "Raw Herb",
    reviews: [
      "Excellent quality leaves.",
      "Boosted my concentration.",
      "Works as expected.",
    ],
  },
  {
    id: "GIN1758202125258-stu901",
    name: "Ginger",
    image: "/shop/Ginger.jpg",
    price: 100,
    quality: "Standard",
    rating: 4.4,
    description:
      "Fresh ginger, great for cooking, digestion, and immunity support.",
    category: "Raw Herb",
    reviews: ["Aromatic and fresh.", "Good for tea.", "Affordable quality."],
  },
  {
    id: "CIN1758202125269-vwx234",
    name: "Cinnamon",
    image: "/shop/Cinnamon.jpg",
    price: 90,
    quality: "Standard",
    rating: 4.5,
    description:
      "Cinnamon bark with strong aroma and natural antioxidant properties.",
    category: "Raw Herb",
    reviews: ["Nice aroma.", "Good quality.", "Slightly pricey but authentic."],
  },
  {
    id: "LIC1758202125280-yza567",
    name: "Licorice",
    image: "/shop/Licorice.jpg",
    price: 160,
    quality: "Standard",
    rating: 4.6,
    description:
      "Licorice root supports digestion and respiratory health, widely used in herbal remedies.",
    category: "Raw Herb",
    reviews: ["Sweet taste.", "Works well in teas.", "Good quality."],
  },

  // ==== Processed Products ====
  {
    id: "PROC1",
    name: "Ashwagandha Capsules",
    image: "/shop/AshwagandhaCapsules.jpg",
    price: 500,
    quality: "Premium",
    rating: 4.9,
    description:
      "Ashwagandha capsules help reduce stress and support vitality in convenient dosage.",
    category: "Processed",
    reviews: [
      "Effective and easy to take.",
      "High quality.",
      "Good packaging.",
    ],
  },
  {
    id: "PROC2",
    name: "Turmeric Powder",
    image: "/shop/TurmericPowder.jpg",
    price: 220,
    quality: "Standard",
    rating: 4.6,
    description:
      "High-quality turmeric powder for cooking and health benefits.",
    category: "Processed",
    reviews: ["Bright color, fine powder.", "Good aroma.", "Satisfactory."],
  },
  {
    id: "PROC3",
    name: "Tulsi Tea Bags",
    image: "/shop/TulsiTea.jpg",
    price: 350,
    quality: "Premium",
    rating: 4.8,
    description:
      "Refreshing Tulsi tea bags, rich in antioxidants and immunity boosting.",
    category: "Processed",
    reviews: ["Great taste.", "Convenient packaging.", "Highly recommended."],
  },
  {
    id: "PROC4",
    name: "Brahmi Tablets",
    image: "/shop/BrahmiTablets.jpg",
    price: 480,
    quality: "Premium",
    rating: 4.7,
    description:
      "Supports memory, focus, and cognitive function in a convenient tablet form.",
    category: "Processed",
    reviews: ["Effective tablets.", "High quality.", "Good results."],
  },
  {
    id: "PROC5",
    name: "Shatavari Powder",
    image: "/shop/ShatavariPowder.jpg",
    price: 400,
    quality: "Premium",
    rating: 4.7,
    description:
      "Shatavari powder supports female reproductive health and overall vitality.",
    category: "Processed",
    reviews: ["Authentic product.", "Effective and natural.", "Well packaged."],
  },
  {
    id: "PROC6",
    name: "Neem Face Pack",
    image: "/shop/NeemFacePack.jpg",
    price: 300,
    quality: "Standard",
    rating: 4.5,
    description: "Neem face pack promotes clear skin and natural cleansing.",
    category: "Processed",
    reviews: ["Nice texture.", "Good for skin.", "Affordable quality."],
  },
  {
    id: "PROC7",
    name: "Amalaki Juice",
    image: "/shop/AmalakiJuice.jpg",
    price: 350,
    quality: "Premium",
    rating: 4.7,
    description:
      "Refreshing Amalaki juice rich in vitamin C and antioxidants for daily wellness.",
    category: "Processed",
    reviews: ["Tasty and healthy.", "High quality juice.", "Very refreshing."],
  },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "rating-desc") return b.rating - a.rating;
      return 0;
    });

  const addToCart = (product, qty) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
    // Do not open sidebar here
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  return (
    <div className="min-h-screen p-6 bg-sage-50">
      <h1 className="text-4xl font-bold mb-6 text-sage-800">Shop</h1>

      {/* Filters and Sort */}
      <div className="flex flex-wrap justify-between mb-6 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Products</option>
          <option value="Raw Herb">Raw Herbs</option>
          <option value="Processed">Processed Products</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              setExpandedProduct(product);
              setQuantity(1);
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="font-bold mt-2 text-lg">{product.name}</h2>
          </div>
        ))}
      </div>

      {/* Expanded Product Modal */}
      {expandedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start overflow-auto py-12 px-4">
          <div className="bg-white rounded-xl max-w-3xl w-full shadow-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-black"
              onClick={() => setExpandedProduct(null)}
            >
              <X />
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={expandedProduct.image}
                alt={expandedProduct.name}
                className="w-full md:w-1/2 h-60 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {expandedProduct.name}
                </h2>
                <p className="text-lg font-semibold mb-1 text-green-700">
                  Rs {expandedProduct.price}
                </p>
                <p className="mb-1">Quality: {expandedProduct.quality}</p>
                <p className="mb-2">Rating: {expandedProduct.rating} ⭐</p>
                <p className="mb-4">{expandedProduct.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-16 p-1 border rounded"
                  />
                </div>
                <button
                  onClick={() => {
                    addToCart(expandedProduct, quantity);
                    setExpandedProduct(null);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Customer Reviews:</h3>
                  <ul className="list-disc pl-5">
                    {expandedProduct.reviews.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-6 left-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 z-[1100]"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full px-2">
            {cart.length}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setIsCartOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 border rounded shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-700">
                  Rs {item.price} x {item.quantity}
                </p>
              </div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => removeFromCart(item.id)}
              >
                <X />
              </button>
            </div>
          ))}
        </div>

        {/* Total Section */}
        {cart.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="font-bold text-lg">
              Total: Rs{" "}
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </p>
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default Shop;
