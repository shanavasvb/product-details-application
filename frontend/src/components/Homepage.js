import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    padding: '40px',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    maxWidth: '1800px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.5rem',
    background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    fontWeight: '400',
    maxWidth: '600px',
    margin: '0 auto'
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px',
    justifyContent: 'center',
    padding: '25px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
  },
  searchBar: {
    flex: '1 1 350px',
    padding: '14px 24px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    color: '#2d3748',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s ease',
    outline: 'none',
    ':focus': {
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
      backgroundColor: 'white'
    }
  },
  dropdown: {
    flex: '0 1 220px',
    padding: '14px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    color: '#2d3748',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234f46e5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px top 50%',
    backgroundSize: '12px auto',
    ':hover': {
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    },
    ':focus': {
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
      backgroundColor: 'white'
    }
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '28px',
    marginBottom: '50px'
  },
  card: {
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 24px rgba(79, 70, 229, 0.15)',
      '::before': {
        opacity: 1
      }
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
      opacity: 0.7,
      transition: 'opacity 0.3s ease'
    }
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '20px',
    backgroundColor: '#f1f5f9',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  name: {
    fontSize: '1.00rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1e293b'
  },
  quantity: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500',
    padding: '6px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '20px',
    display: 'inline-block'
  },
  loader: {
    textAlign: 'center',
    margin: '80px 0',
    color: '#4f46e5',
    fontSize: '1.2rem',
    fontWeight: '500'
  },
  noResults: {
    textAlign: 'center',
    margin: '60px 0',
    color: '#64748b',
    fontSize: '1.2rem',
    fontWeight: '500',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '50px'
  },
  pageButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'white',
    color: '#4f46e5',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    ':hover:not(:disabled)': {
      backgroundColor: '#4f46e5',
      color: 'white',
      boxShadow: '0 6px 16px rgba(79, 70, 229, 0.3)'
    },
    ':focus': {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.3)'
    }
  },
  pageButtonDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    boxShadow: 'none',
    ':hover': {
      backgroundColor: '#f1f5f9',
      color: '#94a3b8'
    }
  },
  pageText: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500',
    margin: '0 16px'
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
      <div style={styles.header}>
        <h1 style={styles.title}>Product Collection</h1>
      </div>
      
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />

        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)} 
          style={styles.dropdown}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.Category_id} value={c.Category_id}>{c.Category_name}</option>)}
        </select>

        <select 
          value={filterProductLine} 
          onChange={(e) => setFilterProductLine(e.target.value)} 
          style={styles.dropdown}
        >
          <option value="">All Product Lines</option>
          {productLines.map(p => <option key={p.ProductLine_id} value={p.ProductLine_id}>{p.ProductLine_name}</option>)}
        </select>

        <select 
          value={filterBrand} 
          onChange={(e) => setFilterBrand(e.target.value)} 
          style={styles.dropdown}
        >
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.Brand_id} value={b.Brand_id}>{b.Brand_name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={styles.loader}>
          <p>Loading Products...</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {products.map(product => (
              <div 
                key={product.id} 
                style={styles.card} 
                onClick={() => handleCardClick(product.id)}
              >
                {/* <div style={styles.image}></div> */}
                <h4 style={styles.name}>{product.name}</h4>
                <p style={styles.quantity}>{product.quantity} {product.unit}</p>
              </div>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div style={styles.noResults}>
              No products match your search criteria. Try adjusting your filters.
            </div>
          )}

          {products.length > 0 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{
                  ...styles.pageButton,
                  ...(page === 1 ? styles.pageButtonDisabled : {})
                }}
              >
                Previous
              </button>

              <span style={styles.pageText}>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                style={{
                  ...styles.pageButton,
                  ...(page === totalPages ? styles.pageButtonDisabled : {})
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Homepage;