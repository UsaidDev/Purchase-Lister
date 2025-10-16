import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaUpload } from "react-icons/fa";
import "./Container.css";

const Container = () => {
  const [itemName, SetItemName] = useState("");
  const [itemImage, SetItemImage] = useState("");
  const [itemPrice, SetItemPrice] = useState("");
  const [items, Setitems] = useState([]);

  // Convert uploaded image to base64 for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        SetItemImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!itemName || !itemImage || !itemPrice) return;

    const newItem = {
      name: itemName,
      image: itemImage,
      price: itemPrice,
    };

    Setitems([...items, newItem]);

    SetItemName("");
    SetItemImage("");
    SetItemPrice("");
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    Setitems(updatedItems);
  };

  const handleUpdate = () => {
    console.log("Updated");
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Left Side - Add Item */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-semibold mb-4">Add Purchase Item</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => SetItemName(e.target.value)}
                  className="form-control shadow-none"
                  placeholder="Enter item name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Item Image</label>
                <div className="input-group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control shadow-none"
                  />
                  <span className="input-group-text">
                    <FaUpload />
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Budget</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => SetItemPrice(e.target.value)}
                  className="form-control shadow-none"
                  placeholder="Enter budget amount"
                />
              </div>
              
              <button type="submit" className="btn btn-dark mt-2 w-100">
                Add Item
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Items List */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-semibold mb-3">Added Items List</h5>
            <p className="text-muted">
              {items.length} item{items.length !== 1 ? "s" : ""} added
            </p>

            {items.length === 0 ? (
              <div className="text-center text-muted p-5">
                <div style={{ fontSize: "3rem" }}>🛒</div>
                <p className="mt-3">
                  No items added yet. Start by adding your first purchase item!
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between border rounded-3 p-3 mb-3"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      width="70"
                      height="70"
                      className="rounded me-3"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="mb-0 text-muted">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center"
                      onClick={(e) => handleUpdate(e.target.value)}
                    >
                      <i
                        className="bi bi-pencil-square me-1"
                        style={{ background: "none", color: "white" }}
                      ></i>
                      Update
                    </button>

                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                      onClick={() => handleDelete(index)}
                    >
                      <i
                        className="bi bi-trash me-1 tarsh"
                        style={{ background: "none", color: "white" }}
                      ></i>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
