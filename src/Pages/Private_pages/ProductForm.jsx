import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addproduct } from '../../ReduxToolkit/Slice/Product.slice';

const ProductForm = () => {
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addproduct({ endpoint: '/product/create', payload: formData }));
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6 border-2 border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full rounded-md p-2 px-3 border border-black shadow-sm"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows="3"
                        className="mt-1 block w-full rounded-md p-2 px-3 border border-black shadow-sm"
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        className="mt-1 block w-full rounded-md p-2 px-3 border border-black shadow-sm"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        id="category"
                        className="mt-1 block w-full rounded-md p-2 px-3 border border-black shadow-sm"
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home-appliances">Home Appliances</option>
                        <option value="books">Books</option>
                        <option value="toys">Toys</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        className="mt-1 block w-full rounded-md p-2 px-3 border border-black shadow-sm"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
