import React from 'react';

const MOCK_PRODUCTS = [
  {
    id: 'WB001',
    name: 'Aluminum Water Bottle',
    description: 'Reusable bottle with eco-friendly coating',
    icon: '🍶',
    specs: {
      Capacity: '500 ml',
      Material: 'Recycled Aluminum',
    },
    sustainability: {
      carbonFootprint: 2.5,
      recycledContent: 75,
    },
  },
  {
    id: 'TB001',
    name: 'Eco-Friendly Toothbrush',
    description: 'Ergonomic toothbrush with biodegradable materials',
    icon: '🪥',
    specs: {
      Length: '18 cm',
      Material: 'Bamboo Composite',
    },
    sustainability: {
      carbonFootprint: 1.2,
      recycledContent: 60,
    },
  },
  {
    id: 'SG001',
    name: 'Sustainable Sunglasses',
    description: 'Sunglasses made from recycled materials',
    icon: '🕶️',
    specs: {
      Material: 'Recycled Plastic',
      Protection: 'UV 100%',
    },
    sustainability: {
      carbonFootprint: 3.8,
      recycledContent: 85,
    },
  },
  {
    id: 'RS001',
    name: 'Eco-Friendly Running Shoes',
    description: 'Running shoes with sustainable materials',
    icon: '👟',
    specs: {
      Material: 'Recycled Rubber',
      Size: '42',
    },
    sustainability: {
      carbonFootprint: 4.5,
      recycledContent: 65,
    },
  },
  {
    id: 'TB002',
    name: 'Thermal Bottle',
    description: 'Advanced insulation bottle',
    icon: '🍶',
    specs: {
      Capacity: '750 ml',
      Material: 'Recycled Steel',
    },
    sustainability: {
      carbonFootprint: 3.2,
      recycledContent: 70,
    },
  },
];

const ProductCatalogue: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        Products Catalog
      </h1>

      {MOCK_PRODUCTS.map((product) => (
        <div
          key={product.id}
          style={{
            display: 'flex',
            border: '1px solid #e0e0e0',
            marginBottom: '15px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              padding: '20px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {product.icon}
          </div>

          <div
            style={{
              flexGrow: 1,
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: '40%' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                }}
              >
                {product.name}
              </h2>
              <p style={{ color: '#666' }}>{product.description}</p>
            </div>

            <div style={{ width: '25%' }}>
              <h3
                style={{
                  fontSize: '16px',
                  marginBottom: '10px',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                Specifications
              </h3>
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}
                >
                  <span style={{ color: '#666' }}>{key}</span>
                  <span style={{ fontWeight: 'bold' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ width: '25%' }}>
              <h3
                style={{
                  fontSize: '16px',
                  marginBottom: '10px',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                Sustainability
              </h3>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                }}
              >
                <span style={{ color: '#666' }}>CO₂</span>
                <span style={{ fontWeight: 'bold', color: 'green' }}>
                  {product.sustainability.carbonFootprint} kg
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ color: '#666' }}>Recycled</span>
                <span style={{ fontWeight: 'bold', color: 'blue' }}>
                  {product.sustainability.recycledContent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCatalogue;
