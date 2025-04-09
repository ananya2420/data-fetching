import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/dummy-backend.json')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);  // Fix typo: data.poducts -> data.products
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);  // Empty dependency array ensures the fetch only happens once

  return (
    <ul>
      {products.length > 0 ? (
        products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))
      ) : (
        <p>No products found!</p>
      )}
    </ul>
  );
}

export default App;
