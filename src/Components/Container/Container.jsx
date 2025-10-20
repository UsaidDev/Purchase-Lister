import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaUpload, FaTimes } from "react-icons/fa";
import { db } from "../../Firebase/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import "./Container.css";

const Container = () => {
  const [itemName, SetItemName] = useState("");
  const [itemImage, SetItemImage] = useState("");
  const [itemPrice, SetItemPrice] = useState("");
  const [items, SetItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For modal preview
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      SetItems(data);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => SetItemImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !itemImage || !itemPrice) return;

    const newItem = { name: itemName, image: itemImage, price: itemPrice };

    try {
      if (editId) {
        const itemRef = doc(db, "items", editId);
        await updateDoc(itemRef, newItem);
        setEditId(null);
      } else {
        await addDoc(collection(db, "items"), newItem);
      }
      SetItemName("");
      SetItemImage("");
      SetItemPrice("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error saving item: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      if (editId === id) {
        setEditId(null);
        SetItemName("");
        SetItemImage("");
        SetItemPrice("");
      }
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleUpdate = (item) => {
    SetItemName(item.name);
    SetItemImage(item.image);
    SetItemPrice(item.price);
    setEditId(item.id);
  };

  return (
    <div className="container mb-5">
      <div className="row g-4">
        {/* Left Side - Add / Update Item */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-semibold mb-4">
              {editId ? "Update Item" : "Add Purchase Item"}
            </h5>
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
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="form-control shadow-none"
                  />
                  <span className="input-group-text bg-light">
                    <FaUpload className="text-dark" />
                  </span>
                </div>
                {itemImage && (
                  <img
                    src={itemImage}
                    alt="Preview"
                    className="mt-3 rounded"
                    width="100"
                    height="100"
                    style={{ objectFit: "cover", cursor: "pointer" }}
                    onClick={() => setSelectedImage(itemImage)}
                  />
                )}
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
                {editId ? "Update Item" : "Add Item"}
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
              items.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center justify-content-between border rounded-3 p-3 mb-3"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      width="70"
                      height="70"
                      className="rounded me-3"
                      style={{ objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setSelectedImage(item.image)}
                    />
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="mb-0 text-muted">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center"
                      onClick={() => handleUpdate(item)}
                    >
                      <i
                        className="bi bi-pencil-square me-1"
                        style={{ color: "white", background: "transparent" }}
                      ></i>
                      Update
                    </button>

                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                      onClick={() => handleDelete(item.id)}
                    >
                      <i
                        className="bi bi-trash me-1"
                        style={{ color: "white", background: "transparent" }}
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

      {/* Modal for enlarged image */}
      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="modal-overlay d-flex justify-content-center align-items-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="modal-content position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimes
              className="position-absolute top-0 end-0 m-2"
              size={30}
              style={{
                cursor: "pointer",
                color: "black", // changed from white to black
                textShadow: "0 0 5px white", // adds contrast on bright backgrounds
                zIndex: 10,
              }}
              onClick={() => setSelectedImage(null)}
            />
            <img
              src={selectedImage}
              alt="Enlarged"
              className="modal-image rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Container;