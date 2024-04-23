import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';
import TitleCard from "../../../components/Cards/TitleCard";
import InvoiceUpdateEway from './InvoiceUpdateEway';

const InvoiceUpdateProducts = ({ invoiceId }) => {


    const [products, setProducts] = useState([]);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [productDiscountPercentage, setProductDiscountPercentage] = useState(0);
    const [productDiscountAmount, setProductDiscountAmount] = useState(0);
    const [productForms, setProductForms] = useState([]);
    const dispatch = useDispatch();

    console.log(invoiceId[0]);

    useEffect(() => {
        fetchProducts();
        fetchInvoices();
        fetchInvoiceProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/all');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Handle error, show error message to the user, etc.
        }
    };

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/all');
            
            const foundInvoice = response.data.find(invoice => invoice.id === invoiceId[0]);
            
            setDiscountAmount(foundInvoice.discountPrice);
            setDiscountPercentage(foundInvoice.discountPercentage);
            

            console.log(foundInvoice);

        } catch (error) {
            console.error('Error fetching invoices:', error);
            // Handle error, show error message to the user, etc.
        }
    };

    const fetchInvoiceProducts = async () => {
        try {
            const response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/get-invoice-products-by-id/${invoiceId[0]}`);
            const fetchedProducts = response.data;
    
            // Preprocess fetchedProducts to match the structure of productForms
            const preprocessedProducts = fetchedProducts.map(item => {
                const productInfo = item[0];
                const invoiceInfo = item[2];
    
                console.log(productInfo.price)
                console.log(invoiceInfo)
                console.log(fetchProducts)

                return {
                    productId: productInfo.id,
                    quantity: invoiceInfo.quantity.toString(), // Convert quantity to string since it seems to be stored as a string in productForms
                    taxType: invoiceInfo.cgstSgst > 0 ? 'cgst_sgst' : 'igst', // Assuming tax type can be deduced from cgstSgst and igst
                    taxValue: invoiceInfo.cgstSgst > 0 ? invoiceInfo.cgstSgst : invoiceInfo.igst, // Assuming tax value can be deduced from cgstSgst and igst
                    price: productInfo.price, // Price directly obtained from productInfo
                    discountType: invoiceInfo.discountInPercent > 0 ? 'percentage' : 'cashback',
                    discountValue: invoiceInfo.discountInPercent > 0 ? invoiceInfo.discountInPercent : invoiceInfo.discountInPrice,
                    hsnSac: invoiceInfo.hsnsac

                };
            });
    
            setProductForms(preprocessedProducts);
        } catch (error) {
            console.error('Error fetching invoice products:', error);
        }
    };
    

    const handleProductChange = (index, value) => {
        // Find the price of the selected product
        const selectedProduct = products.find(product => product.id.toString() === value);
        console.log(selectedProduct);
        const updatedForms = [...productForms];
        updatedForms[index].productId = value;
        updatedForms[index].price = selectedProduct.price
        setProductForms(updatedForms);
        console.log(updatedForms);
    };

    const handleQuantityChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].quantity = value;
        setProductForms(updatedForms);
    };

    const handleHsnSacChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].hsnSac = value;
        setProductForms(updatedForms);
    };

    const handleTaxTypeChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].taxType = value;
        // Set the tax value to 0 for the other tax type
        updatedForms[index].taxValue = value === 'cgst_sgst' ? 0 : updatedForms[index].taxValue;
        setProductForms(updatedForms);
    };

    const handleTaxValueChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].taxValue = value;
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

    // const addProductForm = () => {
    //     setProductForms([...productForms, { productId: '', quantity: '', taxType: '', taxValue: 0 }]);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            

            const response = await axios.put(
                `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/${invoiceId}/update-products`,
                productsData
                
            );

            dispatch(showNotification({ message: 'Products updated to invoice successfully 😁', status: 1 }));
            console.log('Products updated to invoice:', response.data);
            document.getElementById("update_modal_2").close();
            document.getElementById("update_modal_3").showModal();


            // setProductForms([{ productId: '', quantity: '', taxType: '', taxValue: 0 }]);
        } catch (error) {
            console.error('Error adding products to invoice:', error);
            dispatch(showNotification({ message: 'Error updating products to invoice! 😵', status: 0 }));
        }
    };


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



  return (
    <>
        <form onSubmit={handleSubmit} id='invoice-form' className="space-y-4">
        <label onClick={() => document.getElementById("update_modal_2").close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
            {productForms.map((form, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`product-${index}`} className="label label-text text-base">Product:</label>
                        <select
                            id={`product-${index}`}
                            className="w-full input input-bordered input-primary"
                            title={`${(products.find(
                                (product) => product.id.toString() !== form.productId
                              )) ? 'This Product is deactivated' : ''}`}
                            value={(form.productId)}
                            onChange={(e) => handleProductChange(index, e.target.value)}
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.productName}</option>
                            ))}
                        </select>
                        <p className="label label-text text-base">{`${(products.find(
                                (product) => product.id.toString() !== form.productId
                              )) ? 'This product is deactivated!' : ''}`}</p>
                        <p className="label label-text text-base">Single Unit Price: {form.price}</p>
                    </div>
                    <div>
                        <label htmlFor={`quantity-${index}`} className="label label-text text-base">Quantity:</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Quantity"
                            className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            id={`quantity-${index}`}
                            value={form.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor={`tax-type-${index}`} className="label label-text text-base">Tax Type:</label>
                        <select
                            id={`tax-type-${index}`}
                            className="w-full input input-bordered input-primary"
                            value={form.taxType}
                            onChange={(e) => handleTaxTypeChange(index, e.target.value)}
                            required
                        >
                            <option value="">Select Tax Type</option>
                            <option value="cgst_sgst">CGST + SGST</option>
                            <option value="igst">IGST</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`tax-value-${index}`} className="label label-text text-base">Tax Value:</label>
                        <input
                            type="number"
                            disabled={ form.taxType === "" ? true : false}
                            placeholder="Tax Value"
                            className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            id={`tax-value-${index}`}
                            value={form.taxValue}
                            onChange={(e) => handleTaxValueChange(index, parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    {discountAmount <= 0 && discountPercentage <= 0 ? (
                    <>
                     {/* Discount type */}
                <div>
                    <label htmlFor="discountType" className="label label-text text-base">Discount Type:</label>
                    <select
                        id="discountType"
                        className="w-full input input-bordered input-primary"
                        value={form.discountType}
                        onChange={handleDiscountTypeChange}
                    >
                        <option value="">Select Discount Type</option>
                        <option value="percentage">Percentage</option>
                        <option value="cashback">Cashback</option>
                    </select>
                </div>
                {/* Discount value */}
                <div>
                    <label htmlFor="discountValue" className="label label-text text-base">Discount Value:</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="Discount Value"
                        className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        id="discountValue"
                        value={form.discountValue}
                        onChange={handleDiscountValueChange}
                    />
                </div>
                    </>
                    ) : (
                        <></>
                      )}

                    <div>
                        <label htmlFor="hsnsac" className="label label-text text-base">HSN/SAC:</label>
                        <input
                            type="text"
                            placeholder="HSN/SAC"
                            pattern="[0-9]{6-8}"
                            className="w-full input input-bordered input-primary"
                            id="hsnsac"
                            value={form.hsnSac}
                            onChange={(e) => handleHsnSacChange(index, e.target.value)}
                            required
                        />
                        <p className="label label-text text-base"> HSN/SAC : {" "}
                        {products.find(
                        (product) => product.id.toString() === form.productId
                      )?.hsnsac || "This product is deactivated!"}
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
            ))}
            <br/>
            <br/>
            <div className='modal-action'>
            <button type="submit" className="btn btn-primary">Update Products</button>
            </div>
        </form>
            
        <dialog id='update_modal_3' className="modal">
            <div className="modal-box w-11/12 max-w-7xl">
            <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
            <InvoiceUpdateEway invoiceID={invoiceId}/>
            </div>
               </div>
        </dialog> 
        </>
  )
}

export default InvoiceUpdateProducts