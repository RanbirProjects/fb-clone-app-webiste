import React, { useState } from 'react';
import { images } from '../assets/images';
import './Marketplace.css';

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Vehicles', 'Property', 'Electronics', 'Furniture', 'Clothing'];

  const products = [
    {
      id: 1,
      title: 'iPhone 13 Pro Max',
      price: 999,
      location: 'San Francisco, CA',
      image: 'https://source.unsplash.com/random/400x300?iphone',
      category: 'Electronics',
      condition: 'Like New',
      posted: '2 hours ago'
    },
    {
      id: 2,
      title: 'Modern Sofa Set',
      price: 1200,
      location: 'Los Angeles, CA',
      image: 'https://source.unsplash.com/random/400x300?sofa',
      category: 'Furniture',
      condition: 'New',
      posted: '1 day ago'
    },
    {
      id: 3,
      title: '2019 Toyota Camry',
      price: 25000,
      location: 'Seattle, WA',
      image: 'https://source.unsplash.com/random/400x300?toyota',
      category: 'Vehicles',
      condition: 'Used',
      posted: '3 days ago'
    },
    {
      id: 4,
      title: 'Designer Watch',
      price: 299,
      location: 'New York, NY',
      image: 'https://source.unsplash.com/random/400x300?watch',
      category: 'Clothing',
      condition: 'Like New',
      posted: '5 hours ago'
    },
    {
      id: 5,
      title: '2 Bedroom Apartment',
      price: 2500,
      location: 'Chicago, IL',
      image: 'https://source.unsplash.com/random/400x300?apartment',
      category: 'Property',
      condition: 'New',
      posted: '1 week ago'
    },
    {
      id: 6,
      title: 'Gaming Laptop',
      price: 1499,
      location: 'Austin, TX',
      image: 'https://source.unsplash.com/random/400x300?laptop',
      category: 'Electronics',
      condition: 'New',
      posted: '2 days ago'
    }
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <h1>Marketplace</h1>
        <div className="marketplace-actions">
          <button className="create-listing">
            <i className="fas fa-plus"></i>
            Create New Listing
          </button>
          <button className="browse-categories">
            <i className="fas fa-th-large"></i>
            Browse Categories
          </button>
        </div>
      </div>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="price">${product.price.toLocaleString()}</p>
              <div className="product-details">
                <span className="location">
                  <i className="fas fa-map-marker-alt"></i>
                  {product.location}
                </span>
                <span className="condition">{product.condition}</span>
              </div>
              <p className="posted">{product.posted}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace; 