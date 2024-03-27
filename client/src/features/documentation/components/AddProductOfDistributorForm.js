import TitleCard from "../../../components/Cards/TitleCard";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";

function DistributorProductForm() {
  const [distributorProfiles, setDistributorProfiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDistributorProfile, setSelectedDistributorProfile] =
    useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    fetchDistributorProfiles();
    fetchProducts();
  }, []);

  const fetchDistributorProfiles = async () => {
    try {
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributorProfiles/all"
      );
      setDistributorProfiles(response.data);
      console.log(distributorProfiles);
    } catch (error) {
      console.error("Error fetching distributor profiles:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/all"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, null]);
  };

  const handleProductChange = (index, productId) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = productId;
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/${selectedDistributorProfile}/add-products`,

        selectedProducts

      );
      console.log("Products added to distributor:", response.data);
      dispatch(showNotification({ message: 'Products added successfully 😁', status: 1 })); 
      // Optionally, you can reset the form fields after successful submission
      setSelectedDistributorProfile();
      // console.log(selectedProducts, selectedDistributorProfile, 'successfully')
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error adding products:", error);
      dispatch(showNotification({ message: 'Error adding products! 😵', status: 0 })); 
    }
  };

  console.log(selectedDistributorProfile);
  console.log(selectedProducts);

  return (
    <>
      <TitleCard title="Add Products to Distributor" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-white rounded-lg shadow-lg ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="distributorProfile">
                Select Distributor Profile:
              </label>
              <select
                id="distributorProfile"
                className="w-full input input-bordered input-primary"
                value={selectedDistributorProfile}
                onChange={(e) => setSelectedDistributorProfile(parseInt(e.target.value))}
                required
              >
                <option value="">Select Distributor Profile</option>
                {distributorProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.agencyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedProducts.map((productId, index) => (
              <div key={index} >
                <label htmlFor={`product${index}`}>Select Product:</label>
                <select
                  id={`product${index}`}
                  className="w-full input input-bordered input-primary"
                  value={productId} // Ensure productId is treated as a number
                  onChange={(e) =>
                    handleProductChange(index, parseInt(e.target.value))
                  }
                >
                  <option value={null}>Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                </div>
            ))}
            </div>

            <div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="btn btn-neutral btn-sm"
              >
                Add Product
              </button>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Products to Distributor
            </button>
          </form>
        </div>
      </TitleCard>
    </>
  );
}

export default DistributorProductForm;
