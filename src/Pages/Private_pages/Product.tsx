import React, {
  Fragment,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchProduct,
  updateProduct,
} from "../../ReduxToolkit/Slice/Product.slice";
import { Edit, ShoppingCart, Trash2, X } from "lucide-react";
import "./Product.css";
import axios from "axios";
import { AppDispatch } from "../../ReduxToolkit/Store/Store";
import { RootState } from "../../ReduxToolkit/Store/Store"; // Ensure RootState is defined
import apiRequest from "../../Services/Api.service";

interface FormData {
  id?: string; // Add 'id' to FormData to handle editing
  name: string;
  price: number;
  description: string;
  quantity: number;
  category: string;
}

interface CartItem extends FormData {
  cartQuantity: number;
}
const ProductList: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FormData>({
    name: "",
    price: 0,
    description: "",
    quantity: 1,
    category: "",
  });
  const [quantityCount, setQuantityCount] = useState<{ [key: string]: number }>(
    {}
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector((state: RootState) => state.productData.product);

  useEffect(() => {
    dispatch(fetchProduct({ endpoint: "/product/getAll" }));
  }, [dispatch]);

  const openEditModal = (product: FormData) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        endpoint: "/product/update",
        productId: editingProduct.id as string,
        payload: editingProduct,
      })
    );
    setEditModalOpen(false);
  };

  const handleDelete = (productId: string) => {
    dispatch(deleteProduct({ endpoint: "/product/delete", productId }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantityCount((prev) => ({
      ...prev,
      [productId]: Math.max(
        1,
        Math.min(
          quantity,
          product?.find((item) => item.id === productId)?.quantity || 1
        )
      ),
    }));
  };

  const handleAddtoCart = (item: FormData) => {
    const quantity = quantityCount[item.id!] || 1;
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, cartQuantity: cartItem.cartQuantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, cartQuantity: quantity }];
    });
    setCartOpen(true);
    const payload = {
      productId: item.id,
      quantity: quantityCount[item.id!] || 1,
    };
    axios.post("http://localhost:8001/v1/cart/add", payload, {
      headers: {
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhkMDgyY2UzLTRmMTAtNDVlNi04ZDZkLTZmOGVhZDI3MjhmOCIsImlhdCI6MTczMDA5MDY4MywiZXhwIjoxNzMwMDk0MjgzfQ.rivIlaHdAPmeeH-pnmT5EB6e8I1U659JB7anuUO81ME",
        "x-custom-access-id": "8d082ce3-4f10-45e6-8d6d-6f8ead2728f8",
      },
    });
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== productId));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center mb-6 gap-6">
        <h1 className="text-3xl font-bold ">Product List</h1>
        <button className="flex" onClick={() => setCartOpen(true)}>
          <ShoppingCart className="w-6 h-6" />
          <span className=" bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cart.reduce((sum, item) => sum + item.cartQuantity, 0)}
          </span>
        </button>
      </div>
      {product?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product?.map((item, ind) => (
            <Fragment key={ind}>
              <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <div className="relative mb-4">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className="text-gray-600 hover:text-blue-500"
                      aria-label="Edit Product"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-gray-600 hover:text-red-500"
                      aria-label="Delete Product"
                      onClick={() => handleDelete(item.id!)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-sm text-gray-500">
                    Category: {item.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    Available Quantity: {item.quantity}
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id!,
                          (quantityCount[item.id!] || 1) - 1
                        )
                      }
                      disabled={(quantityCount[item.id!] || 1) <= 1}
                      className="px-3 py-1 bg-gray-200 rounded-full"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={quantityCount[item.id!] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id!,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 text-center border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id!,
                          (quantityCount[item.id!] || 1) + 1
                        )
                      }
                      disabled={(quantityCount[item.id!] || 1) >= item.quantity}
                      className="px-3 py-1 bg-gray-200 rounded-full"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-2xl font-bold mt-4">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    className="text-white bg-gray-700 hover:bg-green-600 rounded-lg text-sm px-4 py-2 mt-3"
                    onClick={() => handleAddtoCart(item)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No products added yet.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-transform duration-300 scale-95 opacity-0 animate-modalIn border-2">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 p-3 text-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="edit-description"
                    rows={3}
                    value={editingProduct.description}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 p-3 text-lg"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="edit-price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="edit-price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 p-3 text-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="edit-category"
                    value={editingProduct.category}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 p-3 text-lg"
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
                  <label
                    htmlFor="edit-quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="edit-quantity"
                    value={editingProduct.quantity}
                    onChange={handleEditChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 p-3 text-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-600"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-4 border-b"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.cartQuantity}
                    </p>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.cartQuantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-4 border-t">
              <p className="text-xl font-bold mb-4">
                Total: $
                {cart
                  .reduce(
                    (sum, item) => sum + item.price * item.cartQuantity,
                    0
                  )
                  .toFixed(2)}
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
