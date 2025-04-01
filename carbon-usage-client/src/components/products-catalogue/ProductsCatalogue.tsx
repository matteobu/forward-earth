import { productsService } from '@/services/productsService';
import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  primary_material: string;
  dimensions: string;
  weight: string;
  sustainability_rating: string;
  intended_use: string;
  emissions_per_unit: number;
  emissions_step1: number;
  emissions_step2: number;
  emissions_step3: number;
  emissions_step4: number;
  emissions_step5: number;
  carbonFootprint: number;
  recycledContent: number;
  specs: Record<string, string | number>;
  description: string;
  icon: string;
}

const ProductCatalogue: React.FC = () => {
  const [productsData, setProductsData] = useState<Product[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const data = await productsService.fetchAllProducts();
        console.log(data);
        setProductsData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching company data';

        setError(errorMessage);
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
        {error}
      </div>
    );
  }

  const parseSpecs = (
    specs: string | Record<string, string | number>
  ): Record<string, string | number> => {
    if (typeof specs === 'string') {
      return specs.split(',').reduce((acc, item) => {
        const [key, value] = item.split(':').map((s) => s.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string | number>);
    }
    return specs;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Products Catalog
        </h1>

        <div className="space-y-6">
          {productsData?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex"
            >
              <div className="w-1/6 bg-gray-100 flex items-center justify-center text-6xl p-6">
                {product.icon}
              </div>

              <div className="w-5/6 p-6 grid grid-cols-3 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Intended Use
                    </h3>
                    <p className="text-gray-600">{product.intended_use}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Specifications
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material</span>
                      <span className="font-medium">
                        {product.primary_material}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions</span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">{product.weight}</span>
                    </div>

                    {Object.entries(parseSpecs(product?.specs)).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Sustainability
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">
                          Sustainability Rating
                        </span>
                        <span className="font-bold text-green-600">
                          {parseFloat(product.sustainability_rating)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: `${parseFloat(
                              product.sustainability_rating
                            )}%`,
                            transition: 'width 0.5s ease-in-out',
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-md">
                      <h4 className="text-lg font-bold text-blue-800 mb-3 border-b pb-2">
                        Step Contribution Analysis
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                              1
                            </div>
                            <span className="text-gray-700">
                              CO2 for your step
                            </span>
                          </div>
                          <span className="font-bold text-blue-600">
                            {
                              productService.calculateStepContribution(
                                product,
                                1
                              ).stepEmissions
                            }{' '}
                            kg
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                              %
                            </div>
                            <span className="text-gray-700">
                              Percentage of total
                            </span>
                          </div>
                          <span className="font-bold text-green-600">
                            {
                              productService.calculateStepContribution(
                                product,
                                1
                              ).stepPercentage
                            }
                            %
                          </span>
                        </div>

                        <div className="w-full bg-blue-200 rounded-full h-2.5 mt-3">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                productService.calculateStepContribution(
                                  product,
                                  1
                                ).stepPercentage
                              }%`,
                              transition: 'width 0.5s ease-in-out',
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-blue-700 mb-1">
                          Carbon Footprint
                        </span>
                        <span className="text-lg font-bold text-blue-800">
                          {product.carbonFootprint} kg
                        </span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-green-700 mb-1">
                          Recycled Content
                        </span>
                        <span className="text-lg font-bold text-green-800">
                          {product.recycledContent}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Emissions Breakdown
                      </h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{
                            width: `${product.emissions_per_unit * 100}%`,
                            transition: 'width 0.5s ease-in-out',
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 text-center">
                        Emissions per Unit:{' '}
                        {product.emissions_per_unit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogue;
export const productService = {
  calculateStepContribution: (product: Product, companyStepNumber: number) => {
    const steps = [
      product.emissions_step1,
      product.emissions_step2,
      product.emissions_step3,
      product.emissions_step4,
      product.emissions_step5,
    ];

    const totalEmissions = steps.reduce((sum, step) => sum + step, 0);
    const stepEmissions = steps[companyStepNumber - 1] || 0;

    const stepPercentage =
      totalEmissions > 0
        ? ((stepEmissions / totalEmissions) * 100).toFixed(2)
        : '0';

    return {
      stepEmissions,
      totalEmissions,
      stepPercentage,
    };
  },
};
