import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";

function AddProductsForm({ invoiceId, discountPercentage, discountAmount, onSubmitSuccess }) {
  const [products, setProducts] = useState([]);
  const [submitProductData, setSubmitProductData] = useState({});
  //   const [totalWithTax, setTotalWithTax] = useState(0);
  //   const [ totalWoutTaxAndWithDiscount ,setTotalWoutTaxAndWithDiscount] = useState(0)
  const [productForms, setProductForms] = useState([
    {
      productId: "",
      quantity: "",
      taxType: "",
      taxValue: 0,
      discountType: "",
      discountValue: 0,
      hsnSac: "",
    },
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  //   console.log(discountAmount, discountPercentage);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
      `${BASE_URL}/api/v1/products/all`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductChange = (index, value) => {
    // Find the price of the selected product
    const selectedProduct = products.find(
      (product) => product.id.toString() === value
    );
    console.log(selectedProduct);
    const updatedForms = [...productForms];
    updatedForms[index].productId = value;
    updatedForms[index].price = selectedProduct.price;
    setProductForms(updatedForms);
    console.log(updatedForms);
  };

  const handleQuantityChange = (index, value) => {
    const updatedForms = [...productForms];
    updatedForms[index].quantity = value;
    setProductForms(updatedForms);
  };

  const handleHsnSacChange = (index, value, id) => {
    const updatedForms = [...productForms];
    updatedForms[index].hsnSac = isNaN(value)  ? (products.find(
        (product) => product.id.toString() === id
      )?.hsnsac) : value ;
    setProductForms(updatedForms);
  };

  const handleTaxTypeChange = (index, value) => {
    const updatedForms = [...productForms];
    updatedForms[index].taxType = value;
    // Set the tax value to 0 for the other tax type
    updatedForms[index].taxValue =
      value === "cgst_sgst" ? 0 : updatedForms[index].taxValue;
    setProductForms(updatedForms);
  };

  const handleDiscountTypeChange = (index, value) => {
    const updatedForms = [...productForms];
    updatedForms[index].discountType = value;
    // Set the discount value to 0 for the other discount type
    updatedForms[index].discountValue =
      value === "percentage" ? 0 : updatedForms[index].discountValue;
    setProductForms(updatedForms);
  };

  const handleTaxValueChange = (index, value) => {
    const updatedForms = [...productForms];
    updatedForms[index].taxValue = value;
    setProductForms(updatedForms);
  };

  const handleDiscountValueChange = (index, value) => {
    const updatedForms = [...productForms];
    updatedForms[index].discountValue = value;
    setProductForms(updatedForms);
  };

  const calculateTotalAmount = (price, quantity, taxValue, discountAmount) => {
    const subtotal = price * quantity;
    // Apply discount amount
    const discountedSubtotal = subtotal - discountAmount;
    // Calculate tax on discounted subtotal
    const tax = taxValue ? (discountedSubtotal * taxValue) / 100 : 0;
    // Total amount with tax
    return discountedSubtotal + tax;
  };

  // const calculateTotalAmount = (price, quantity, taxValue, discountPercentage, discountAmount) => {
  //     let subtotal = price * quantity;
  //     let discount = 0;

  //     if (discountPercentage > 0) {
  //         discount = (subtotal * discountPercentage) / 100;
  //     } else if (discountAmount > 0) {
  //         discount = discountAmount;
  //     }

  //     subtotal -= discount;

  //     const tax = taxValue ? (subtotal * taxValue) / 100 : 0;
  //     return subtotal + tax;
  // };

  const addProductForm = () => {
    setProductForms([
      ...productForms,
      {
        productId: "",
        quantity: "",
        taxType: "",
        taxValue: 0,
        discountType: "",
        discountValue: 0,
        hsnSac: "",
      },
    ]);
  };

  console.log(productForms)

  const removeProductForm = (indexToRemove) => {
    setProductForms((prevForms) =>
      prevForms.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    // e.preventDefault();


    try {
      const productsData = {};
      productForms.forEach((form) => {
        if (form.productId && form.quantity) {
          const amountWithoutTaxAndDiscount = form.price * form.quantity;
          let totalAmountWithoutTaxDiscount = 0;
          let discountedAmount = 0;

          // Check if discountAmount or discountPercentage is greater than 0
          if (discountAmount > 0 || discountPercentage > 0) {
            const discount =
              discountPercentage > 0
                ? (amountWithoutTaxAndDiscount * discountPercentage) / 100
                : discountAmount;
            discountedAmount = discount;
            totalAmountWithoutTaxDiscount =
              amountWithoutTaxAndDiscount - discount;
          } else if (form.discountValue > 0) {
            const discount =
              form.discountType === "percentage"
                ? (amountWithoutTaxAndDiscount * form.discountValue) / 100
                : form.discountValue;
            discountedAmount = discount;
            totalAmountWithoutTaxDiscount =
              amountWithoutTaxAndDiscount - discount;
          }

          // Calculate tax based on the totalAmountWithoutTaxDiscount if it's greater than 0,
          // otherwise calculate tax based on amountWithoutTaxAndDiscount
          const totalAmountWithTax = calculateTotalAmount(
            form.price,
            form.quantity,
            form.taxValue,
            discountedAmount > 0 ? discountedAmount : 0
          );

          productsData[form.productId] = {
            quantity: parseInt(form.quantity),
            cgstSgst: form.taxType === "cgst_sgst" ? form.taxValue : 0,
            igst: form.taxType === "igst" ? form.taxValue : 0,
            discountInPercent:
              form.discountType === "percentage" ? form.discountValue : 0,
            discountInPrice:
              form.discountType === "cashback" ? form.discountValue : 0,
            cgstAmount:
              form.taxType === "cgst_sgst"
                ? (totalAmountWithTax - totalAmountWithoutTaxDiscount) / 2
                : 0,
            sgstAmount:
              form.taxType === "cgst_sgst"
                ? (totalAmountWithTax - totalAmountWithoutTaxDiscount) / 2
                : 0,
            igstAmount:
              form.taxType === "igst"
                ? totalAmountWithTax - totalAmountWithoutTaxDiscount
                : 0,
            discountAmount: discountedAmount,
            totalAmountWithoutTax: amountWithoutTaxAndDiscount,
            totalAmountWithoutTaxDiscount: totalAmountWithoutTaxDiscount,
            totalAmountWithTax: totalAmountWithTax,
            hsnSac: form.hsnSac === "" ? parseInt(products.find(
                (product) => product.id.toString() === form.productId
              )?.hsnsac) : parseInt(form.hsnSac),
          };
        }
      });

      console.log(productsData);

      const response = await axios.post(
        `${BASE_URL}/api/v1/invoices/${invoiceId}/add-products`,
        productsData,
       
      );

      console.log("Products added to invoice:", response.data);
      dispatch(
        showNotification({
          message: "Products added to invoice successfully 😁",
          status: 1,
        })
      );
      setSubmitProductData(productForms);
      document.getElementById("confirm2_modal").close();
      onSubmitSuccess();

      // setProductForms([
      //   { productId: "", quantity: "", taxType: "", taxValue: 0, discountType: "", discountValue: 0, hsnSac: "", },
      // ]);
    } catch (error) {
      console.error("Error adding products to invoice:", error);
      dispatch(
        showNotification({
          message: "Error adding products to invoice! 😵",
          status: 0,
        })
      );
    }
  };

  const productsData = {};
  productForms.forEach((form) => {
    if (form.productId && form.quantity) {
      const amountWithoutTaxAndDiscount = form.price * form.quantity;
      let totalAmountWithoutTaxDiscount = 0;
      let discountedAmount = 0;

      // Check if discountAmount or discountPercentage is greater than 0
      if (discountAmount > 0 || discountPercentage > 0) {
        const discount =
          discountPercentage > 0
            ? (amountWithoutTaxAndDiscount * discountPercentage) / 100
            : discountAmount;
        discountedAmount = discount;
        totalAmountWithoutTaxDiscount =
          amountWithoutTaxAndDiscount - discount;
      } else if (form.discountValue > 0) {
        const discount =
          form.discountType === "percentage"
            ? (amountWithoutTaxAndDiscount * form.discountValue) / 100
            : form.discountValue;
        discountedAmount = discount;
        totalAmountWithoutTaxDiscount =
          amountWithoutTaxAndDiscount - discount;
      }

      // Calculate tax based on the totalAmountWithoutTaxDiscount if it's greater than 0,
      // otherwise calculate tax based on amountWithoutTaxAndDiscount
      const totalAmountWithTax = calculateTotalAmount(
        form.price,
        form.quantity,
        form.taxValue,
        discountedAmount > 0 ? discountedAmount : 0
      );

      productsData[form.productId] = {
        quantity: parseInt(form.quantity),
        cgstSgst: form.taxType === "cgst_sgst" ? form.taxValue : 0,
        igst: form.taxType === "igst" ? form.taxValue : 0,
        discountInPercent:
          form.discountType === "percentage" ? form.discountValue : 0,
        discountInPrice:
          form.discountType === "cashback" ? form.discountValue : 0,
        cgstAmount:
          form.taxType === "cgst_sgst"
            ? (totalAmountWithTax - totalAmountWithoutTaxDiscount) / 2
            : 0,
        sgstAmount:
          form.taxType === "cgst_sgst"
            ? (totalAmountWithTax - totalAmountWithoutTaxDiscount) / 2
            : 0,
        igstAmount:
          form.taxType === "igst"
            ? totalAmountWithTax - totalAmountWithoutTaxDiscount
            : 0,
        discountAmount: discountedAmount,
        totalAmountWithoutTax: amountWithoutTaxAndDiscount,
        totalAmountWithoutTaxDiscount: totalAmountWithoutTaxDiscount,
        totalAmountWithTax: totalAmountWithTax,
        hsnSac: form.hsnSac === "" ? parseInt(products.find(
            (product) => product.id.toString() === form.productId
          )?.hsnsac) : parseInt(form.hsnSac),
      };
    }
  });

  console.log(productsData)





  const calculateTotalAmountWithDiscount = (form) => {
    const { price, quantity, taxValue, discountType, discountValue } = form;

    if (discountPercentage + discountAmount !== 0) {
      if (discountPercentage > 0) {
        const discountedPrice = price * quantity * (discountPercentage / 100);
        return (
          calculateTotalAmount(price, quantity, taxValue, discountedPrice) -
          (price * quantity - discountedPrice)
        );
      } else {
        return (
          calculateTotalAmount(price, quantity, taxValue, discountAmount) -
          (price * quantity - discountAmount)
        );
      }
    } else {
      if (discountType === "percentage") {
        const discountedPrice = price * quantity * (discountValue / 100);
        return (
          calculateTotalAmount(price, quantity, taxValue, discountedPrice) -
          (price * quantity - discountedPrice)
        );
      } else {
        return (
          calculateTotalAmount(price, quantity, taxValue, discountValue) -
          (price * quantity - discountValue)
        );
      }
    }
  };

  const calculateTotalAmountWithTax = (form) => {
    const { price, quantity, taxValue, discountType, discountValue } = form;

    return discountPercentage + discountAmount !== 0
      ? isNaN(
          discountPercentage > 0
            ? calculateTotalAmount(
                price,
                quantity,
                taxValue,
                price * quantity * (discountPercentage / 100)
              )
            : calculateTotalAmount(price, quantity, taxValue, discountAmount)
        )
        ? 0
        : discountPercentage > 0
        ? calculateTotalAmount(
            price,
            quantity,
            taxValue,
            price * quantity * (discountPercentage / 100)
          )
        : calculateTotalAmount(price, quantity, taxValue, discountAmount)
      : isNaN(
          discountType === "percentage"
            ? calculateTotalAmount(
                price,
                quantity,
                taxValue,
                price * quantity * (discountValue / 100)
              )
            : calculateTotalAmount(price, quantity, taxValue, discountValue)
        )
      ? 0
      : discountType === "percentage"
      ? calculateTotalAmount(
          price,
          quantity,
          taxValue,
          price * quantity * (discountValue / 100)
        )
      : calculateTotalAmount(price, quantity, taxValue, discountValue);
  };

  const calculateTotalAmountWithoutTaxWithDiscount = (form) => {
    const { price, quantity, discountType, discountValue } = form;

    return discountPercentage + discountAmount !== 0
      ? isNaN(
          discountPercentage > 0
            ? price * quantity * (1 - discountPercentage / 100)
            : price * quantity - discountAmount
        )
        ? 0
        : discountPercentage > 0
        ? price * quantity * (1 - discountPercentage / 100)
        : price * quantity - discountAmount
      : isNaN(
          discountType === "percentage"
            ? price * quantity * (1 - discountValue / 100)
            : price * quantity - discountValue
        )
      ? 0
      : discountType === "percentage"
      ? price * quantity * (1 - discountValue / 100)
      : price * quantity - discountValue;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    document.getElementById('confirm2_modal').showModal();
  };

  console.log(Object.keys(submitProductData).length)

  return (
    <>
    {Object.keys(submitProductData).length === 0 ? (
      <>
      <TitleCard title="Add Products to Invoice" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
          <form onSubmit={handleConfirm} className="space-y-4">
            {productForms.map((form, index) => (
              <>
                <div key={index} >
                  <button
                    type="button"
                    onClick={() => removeProductForm(index)}
                    className="btn btn-error btn-sm float-right mb-2 btn-circle"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="grid grid-cols-2 gap-4 w-full p-6 m-auto bg-base-200 rounded-lg shadow-lg ">
                  <div>
                    <label
                      htmlFor={`product-${index}`}
                      className="label label-text text-base"
                    >
                      Product:
                    </label>
                    <select
                      id={`product-${index}`}
                      className="w-full input input-bordered input-primary"
                      value={form.productId}
                      onChange={(e) =>
                        handleProductChange(index, e.target.value)
                      }
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                    <p className="label label-text text-base">
                      Single Unit Price:{" "}
                      {products.find(
                        (product) => product.id.toString() === form.productId
                      )?.price || ""}
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor={`quantity-${index}`}
                      className="label label-text text-base"
                    >
                      Quantity:
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Quantity"
                      className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      id={`quantity-${index}`}
                      value={form.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`tax-type-${index}`}
                      className="label label-text text-base"
                    >
                      Tax Type:
                    </label>
                    <select
                      id={`tax-type-${index}`}
                      className="w-full input input-bordered input-primary"
                      value={form.taxType}
                      onChange={(e) =>
                        handleTaxTypeChange(index, e.target.value)
                      }
                      required
                    >
                      <option value="">Select Tax Type</option>
                      <option value="cgst_sgst">CGST + SGST</option>
                      <option value="igst">IGST</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`tax-value-${index}`}
                      className="label label-text text-base"
                    >
                      Tax Percentage:
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Tax Value"
                      className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      id={`tax-value-${index}`}
                      value={form.taxValue}
                      onChange={(e) =>
                        handleTaxValueChange(index, parseFloat(e.target.value))
                      }
                      required
                    />
                  </div>
                  {discountAmount <= 0 && discountPercentage <= 0 ? (
                    <>
                      <div>
                        <label className="label label-text text-base">
                          Discount Type
                        </label>
                        <select
                          id={`discount-type-${index}`}
                          className="w-full input input-bordered input-primary"
                          value={form.discountType}
                          onChange={(e) =>
                            handleDiscountTypeChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Discount Type</option>
                          <option value="percentage">
                            Discount in Percentage
                          </option>
                          <option value="amount">Cashback</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor={`discount-value-${index}`}
                          className="label label-text text-base"
                        >
                          Discount Value:
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Discount Value"
                          className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          id={`discount-value-${index}`}
                          value={form.discountValue}
                          onChange={(e) =>
                            handleDiscountValueChange(
                              index,
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  <div>
                    <label
                      htmlFor={`hsnsac-${index}`}
                      className="label label-text text-base"
                    >
                      HSN/SAC:
                    </label>
                    <input
                      type="text"
                      pattern="[0-9]{6-8}"
                      placeholder="HSN/SAC"
                      className="w-full input input-bordered input-primary"
                      id={`hsnsac-${index}`}
                      value={form.hsnSac}
                      onChange={(e) =>
                        handleHsnSacChange(index, e.target.value, form.productId)
                      }
                    //   required
                    />
                    <p className="label label-text text-base">Existing HSN/SAC: 
                    {products.find(
                        (product) => product.id.toString() === form.productId
                      )?.hsnsac}
                        </p>
                  </div>

                  <div>
                    <label className="label label-text text-base">
                      Invoice Discount:
                    </label>
                    {discountPercentage > 0 ? (
                      <p className="label label-text text-base">{discountPercentage}%</p>
                    ) : discountAmount > 0 ? (
                      <p className="label label-text text-base">INR {discountAmount}/-</p>
                    ) : (
                      <p className="label label-text text-base">0</p>
                    )}
                  </div>
                  <div>
                    <label className="label label-text text-base">
                      Total Amount Without Tax (Without Discount Applied):
                    </label>
                    <p className="label label-text text-base">
                      INR {parseFloat(isNaN(form.price * form.quantity)
                        ? 0
                        : form.price * form.quantity).toFixed(2)}
                      /-
                    </p>
                  </div>
                  <div>
                    <label className="label label-text text-base">
                      Total Amount With Tax:
                    </label>
                    <p className="label label-text text-base">INR {parseFloat(calculateTotalAmountWithTax(form)).toFixed(2)}/-</p>
                  </div>

                  <div>
                    <label className="label label-text text-base">
                      Total Amount Without Tax And With Discount:
                    </label>
                    <p className="label label-text text-base">
                      INR {parseFloat(calculateTotalAmountWithoutTaxWithDiscount(form)).toFixed(2)}/-
                    </p>
                  </div>
                  <div>
                    <label className="label label-text text-base">
                      Tax Amount:
                    </label>
                    <p className="label label-text text-base">
                      INR {" "}
                      {parseFloat(isNaN(calculateTotalAmountWithDiscount(form))
                        ? 0
                        : calculateTotalAmountWithDiscount(form)).toFixed(2)}
                      /-
                    </p>
                    </div>
                  </div>
                </div>
              </>
            ))}
            <button
              type="button"
              onClick={addProductForm}
              className="btn btn-outline btn-sm"
            >
              Add More Products
            </button>
            <br />
            <br />
            <button type="submit" className="btn btn-primary">
              Submit Products
            </button>
          </form>
        </div>
      </TitleCard>

      <dialog id="confirm2_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl">
          <h3 className="font-bold text-2xl text-center">Confirmation!!</h3>
          <p className="py-4 text-center">Are you sure you want to add these products to invoice?</p>
          <div className="grid grid-cols-1 gap-4">
          {productForms.map((form, index) => (
              <>
                <div key={index} className=" relative w-full p-6 m-auto bg-base-200 rounded-lg shadow-lg">
                  <button
                    type="button"
                    onClick={() => removeProductForm(index)}
                    className="btn btn-error btn-sm float-right mb-2 btn-circle absolute top-0 right-0 m-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <table className="table table-compact w-full">
                  <tr><th>Product Name:</th><td>{products.find((product) => parseInt(product.id) === parseInt(form.productId))?.productName}</td></tr>
                  <tr><th>Quantity:</th><td>{form.quantity}</td></tr>
                  <tr><th>Tax Type:</th><td>{form.taxType}</td></tr>
                  <tr><th>Tax Percentage:</th><td>{form.taxPercentage}</td></tr>
                  {discountAmount <= 0 && discountPercentage <= 0 ? (
                    <>
                  <tr><th>Discount Type:</th><td>{form.discountType}</td></tr>
                  <tr><th>Discount Percentage:</th><td>{form.discountValue}</td></tr>
                  </>
                  ) : null}
                  <tr><th>HSN/SAC:</th><td>{form.hsnSac}</td></tr>
                  <tr><th>Invoice Discount:</th><td>{discountPercentage > 0 ? (
                      <p className="label label-text text-base">{discountPercentage}%</p>
                    ) : discountAmount > 0 ? (
                      <p className="label label-text text-base">INR {discountAmount}/-</p>
                    ) : (
                      <p className="label label-text text-base">0</p>
                    )}</td></tr>
                    <tr><th>Total Amount Without Tax (Without Discount Applied):</th><td> {`INR ${parseFloat(isNaN(form.price * form.quantity)
                        ? 0
                        : form.price * form.quantity).toFixed(2)}
                      /-`}</td></tr>
                      <tr><th>Total Amount With Tax:</th><td>{`INR ${parseFloat(calculateTotalAmountWithTax(form)).toFixed(2)}/-`}</td></tr>
                      <tr><th>Total Amount Without Tax And With Discount:</th><td>{`INR ${parseFloat(calculateTotalAmountWithoutTaxWithDiscount(form)).toFixed(2)}/-`}</td></tr>
                      <tr><th>Tax Amount:</th><td>{`INR ${parseFloat(isNaN(calculateTotalAmountWithDiscount(form))
                        ? 0
                        : calculateTotalAmountWithDiscount(form)).toFixed(2)}/-`}</td></tr>


                    </table>
                </div>
              </>
            ))}
            </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
            <button className="btn" onClick={() => document.getElementById("confirm2_modal").close()}>No</button>
          </div>
        </div>
      </dialog>
      
      </>
    ) : (
      <> 
      <div className={`grid ${Object.keys(submitProductData).length > 1 ? "grid-cols-2" : "grid-cols-1"}  gap-4`}>
      {submitProductData.map((form, index) => (
        <div key={index} className=" relative w-full bg-base-200 rounded-lg shadow-lg">
           <table className="table table-zebra w-full p-6 bg-base-100 rounded-lg shadow-lg">
                  <tr><th>Product Name:</th><td>{products.find((product) => parseInt(product.id) === parseInt(form.productId))?.productName}</td></tr>
                  <tr><th>Quantity:</th><td>{form.quantity}</td></tr>
                  <tr><th>Tax Type:</th><td>{form.taxType}</td></tr>
                  <tr><th>Tax Percentage:</th><td>{form.taxPercentage}</td></tr>
                  {discountAmount <= 0 && discountPercentage <= 0 ? (
                    <>
                  <tr><th>Discount Type:</th><td>{form.discountType}</td></tr>
                  <tr><th>Discount Percentage:</th><td>{form.discountValue}</td></tr>
                  </>
                  ) : null}
                  <tr><th>HSN/SAC:</th><td>{form.hsnSac}</td></tr>
                  <tr><th>Invoice Discount:</th><td>{discountPercentage > 0 ? (
                      <p className="label label-text text-base">{discountPercentage}%</p>
                    ) : discountAmount > 0 ? (
                      <p className="label label-text text-base">INR {discountAmount}/-</p>
                    ) : (
                      <p className="label label-text text-base">0</p>
                    )}</td></tr>
                    <tr><th>Total Amount Without Tax (Without Discount Applied):</th><td> {`INR ${parseFloat(isNaN(form.price * form.quantity)
                        ? 0
                        : form.price * form.quantity).toFixed(2)}
                      /-`}</td></tr>
                      <tr><th>Total Amount With Tax:</th><td>{`INR ${parseFloat(calculateTotalAmountWithTax(form)).toFixed(2)}/-`}</td></tr>
                      <tr><th>Total Amount Without Tax And With Discount:</th><td>{`INR ${parseFloat(calculateTotalAmountWithoutTaxWithDiscount(form)).toFixed(2)}/-`}</td></tr>
                      <tr><th>Tax Amount:</th><td>{`INR ${parseFloat(isNaN(calculateTotalAmountWithDiscount(form))
                        ? 0
                        : calculateTotalAmountWithDiscount(form)).toFixed(2)}/-`}</td></tr>


                    </table>
        </div>
      ))}
      </div>
      </>
    )}

    </>
  );
}

export default AddProductsForm;
