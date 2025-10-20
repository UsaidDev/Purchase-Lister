import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaUpload, FaTimes } from "react-icons/fa";
import { db, auth } from "../../Firebase/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Container.css";

const Container = () => {
  const [itemName, SetItemName] = useState("");
  const [itemImage, SetItemImage] = useState("");
  const [itemPrice, SetItemPrice] = useState("");
  const [items, SetItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null if logged out
      // Clear edit state if user logs out
      if (!currentUser) {
        setEditId(null);
        SetItemName("");
        SetItemImage("");
        SetItemPrice("");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch items:
  // - If user is null (not logged in) -> show ALL items (read-only)
  // - If user is logged in -> show ONLY items where userId === user.uid
  useEffect(() => {
    let unsub = () => {};
    if (user) {
      // Logged in: show only this user's items
      const q = query(collection(db, "items"), where("userId", "==", user.uid));
      unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        SetItems(data);
      });
    } else {
      // Not logged in: show all items (read-only)
      unsub = onSnapshot(collection(db, "items"), (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        SetItems(data);
      });
    }

    return () => unsub();
  }, [user]);

  // Image selection -> base64 preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => SetItemImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Add or update item (only allowed when logged in)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add items.");
      return;
    }
    if (!itemName || !itemImage || !itemPrice) return;

    const payload = {
      name: itemName,
      image: itemImage,
      price: itemPrice,
      userId: user.uid,
      userEmail: user.email || null,
      createdAt: new Date().toISOString(),
    };

    try {
      if (editId) {
        const ref = doc(db, "items", editId);
        await updateDoc(ref, payload);
        setEditId(null);
      } else {
        await addDoc(collection(db, "items"), payload);
      }
      // reset
      SetItemName("");
      SetItemImage("");
      SetItemPrice("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  // Delete item (only allowed when logged in AND owner)
  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "items", id));
      if (editId === id) {
        setEditId(null);
        SetItemName("");
        SetItemImage("");
        SetItemPrice("");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Put item values into form for editing (only owner should call this)
  const handleUpdate = (item) => {
    if (!user || item.userId !== user.uid) return;
    SetItemName(item.name);
    SetItemImage(item.image);
    SetItemPrice(item.price);
    setEditId(item.id);
    // ensure file input cleared so user can re-upload if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="container mb-5">
      <div className="row g-4">
        {/* Left Side - Add / Update Item (form disabled if not logged in) */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-semibold mb-4">
              {editId ? "Update Item" : "Add Purchase Item"}
            </h5>

            {/* If user not logged in, we still show the form but disable inputs and show message */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => SetItemName(e.target.value)}
                  className="form-control shadow-none"
                  placeholder="Enter item name"
                  disabled={!user}
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
                    disabled={!user}
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
                    style={{ objectFit: "cover", cursor: user ? "pointer" : "default" }}
                    onClick={() => user && setSelectedImage(itemImage)}
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
                  disabled={!user}
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark mt-2 w-100"
                disabled={!user}
              >
                {user ? (editId ? "Update Item" : "Add Item") : "Login to Add"}
              </button>

              {!user && (
                <p className="text-muted small mt-2">
                  You can view items but must log in to add, edit, or delete.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Side - Items List */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-semibold mb-3">
              {user ? "Your Items" : "All Items"}
            </h5>
            <p className="text-muted">
              {items.length} item{items.length !== 1 ? "s" : ""} found
            </p>

            {items.length === 0 ? (
              <div className="text-center text-muted p-5">
                <div style={{ fontSize: "3rem" }}>🛒</div>
                <p className="mt-3">
                  {user ? "You haven't added any items yet." : "No items available yet."}
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
                      {item.userEmail && (
                        <small className="text-muted d-block">By: {item.userEmail}</small>
                      )}
                    </div>
                  </div>

                  {/* Edit/Delete buttons are shown ONLY when logged in AND item belongs to the user */}
                  {user && item.userId === user.uid ? (
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <button
                        className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center"
                        onClick={() => handleUpdate(item)}
                      >
                        <i className="bi bi-pencil-square me-1 text-white"></i>
                        Update
                      </button>

                      <button
                        className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-trash me-1 text-white"></i>
                        Delete
                      </button>
                    </div>
                  ) : (
                    // when not owner or not logged in, no edit/delete buttons shown
                    <div style={{ minWidth: 0 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
              className="modal-close-icon"
              size={30}
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
