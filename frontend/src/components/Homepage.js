import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9fbff',
    minHeight: '100vh',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px'
  },
  searchBar: {
    flex: '1 1 250px',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #b3c7f9',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333'
  },
  dropdown: {
    flex: '0 0 180px',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #b3c7f9',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #dbeafe',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 84, 209, 0.05)'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '12px'
  },
  name: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#1d4ed8'
  },
  price: {
    fontSize: '14px',
    color: '#555'
  },
  loader: {
    textAlign: 'center',
    marginTop: '50px',
    color: '#1d4ed8'
  },
  pagination: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'Segoe UI, sans-serif'
  },
  pageButton: {
    padding: '8px 16px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '30px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out'
  },
  pageButtonHover: {
    backgroundColor: '#e0e0e0'
  },
  pageButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
    color: '#aaa',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  pageText: {
    fontSize: '14px',
    color: '#555',
    fontWeight: '500'
  }

};


function Homepage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProductLine, setFilterProductLine] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [categories, setCategories] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchFilters = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/v1/product/filters');
        console.log('Filter response:', res.data); // Add this

        setCategories(res.data.categories || []);
        setProductLines(res.data.productLines || []);
        setBrands(res.data.brands || []);
      } catch (err) {
      console.error('Error loading filters:', err);
      }
    };
    fetchFilters();
  }, []);


  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterCategory, filterProductLine, filterBrand]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/v1/product', {
          params: {
            search: searchTerm,
            category: filterCategory,
            productLine: filterProductLine,
            brand: filterBrand,
            page,
            limit: 20
          }
        });
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, filterCategory, filterProductLine, filterBrand, page]);

  const handleCardClick = (id) => {
    navigate(`/homepage/${id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.dropdown}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.Category_id} value={c.Category_id}>{c.Category_name}</option>)}
        </select>

        <select value={filterProductLine} onChange={(e) => setFilterProductLine(e.target.value)} style={styles.dropdown}>
          <option value="">All Product Lines</option>
          {productLines.map(p => <option key={p.ProductLine_id} value={p.ProductLine_id}>{p.ProductLine_name}</option>)}
        </select>

        <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} style={styles.dropdown}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.Brand_id} value={b.Brand_id}>{b.Brand_name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={styles.loader}>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {products.map(product => (
              <div key={product.id} style={styles.card} onClick={() => handleCardClick(product.id)}>
                {/* <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={styles.image} /> */}
                <h4 style={styles.name}>{product.name}</h4>
                <p style={styles.price}>{product.quantity} {product.unit}</p>
              </div>
            ))}
          </div>

          {products.length === 0 && <p style={{ marginTop: '20px', color: '#555' }}>No products found.</p>}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{
                  ...styles.pageButton,
                  ...(page === 1 ? styles.pageButtonDisabled : {})
                }}
              >Previous</button>

              <span style={styles.pageText}>Page {page} of {totalPages}</span>

              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                style={{
                  ...styles.pageButton,
                  ...(page === totalPages ? styles.pageButtonDisabled : {})
                }}
              >Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;