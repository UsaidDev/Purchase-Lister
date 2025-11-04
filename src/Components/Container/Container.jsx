import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaUpload, FaTimes } from "react-icons/fa";
import { db } from "../../Firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import "./Container.css";

const Container = () => {
  const [itemName, SetItemName] = useState("");
  const [itemImage, SetItemImage] = useState("");
  const [itemPrice, SetItemPrice] = useState("");
  const [items, SetItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const auth = getAuth();

  // 🔹 Auth + Fetch user's items + purchased items
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch items (not purchased yet)
        const q1 = query(
          collection(db, "items"),
          where("email", "==", currentUser.email)
        );
        const unsubscribeItems = onSnapshot(q1, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          SetItems(data);
        });

        // ✅ Fetch purchased items
        const q2 = query(
          collection(db, "purchased"),
          where("email", "==", currentUser.email)
        );
        const unsubscribePurchased = onSnapshot(q2, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPurchasedItems(data);
        });

        return () => {
          unsubscribeItems();
          unsubscribePurchased();
        };
      } else {
        SetItems([]);
        setPurchasedItems([]);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  // 🔹 Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => SetItemImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Add or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !itemImage || !itemPrice || !user) return;

    const newItem = {
      name: itemName,
      image: itemImage,
      price: itemPrice,
      email: user.email,
    };

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

  // 🔹 Move to purchased
  const handleDelete = async (id) => {
    try {
      const itemRef = doc(db, "items", id);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        const itemData = itemSnap.data();
        await setDoc(doc(db, "purchased", id), itemData);
        await deleteDoc(itemRef);

        if (editId === id) {
          setEditId(null);
          SetItemName("");
          SetItemImage("");
          SetItemPrice("");
        }
        console.log("Item moved to purchased successfully");
      } else {
        console.log("Item not found");
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

  // 🔹 Show login/signup prompt if not logged in
  if (!user) {
    return (
      <div className="container text-center py-5">
        <h4 className="fw-semibold mb-3">Please Login or Signup</h4>
        <p className="text-muted">
          You need to sign in to add and view your purchase items.
        </p>
      </div>
    );
  }

  return (
    <div className="container mb-5">
      <>
        <div className="row g-4">
          {/* Left: Form */}
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

          {/* Right: Items List */}
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
                    No items added yet. Start by adding one!
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
                        <i className="bi bi-pencil-square me-1 bg-transparent"></i>
                        Update
                      </button>

                      <button
                        className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-check2-circle me-2 bg-transparent"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* ✅ Purchased Items Section */}
              <h5 className="fw-semibold mt-5 mb-3">Purchased Items</h5>
              {purchasedItems.length === 0 ? (
                <p className="text-muted">No items purchased yet.</p>
              ) : (
                purchasedItems.map((item) => (
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
                        <p className="mb-0 text-success fw-semibold">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <span className="badge bg-success">Purchased</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ✅ Single Clean Image Modal */}
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
                style={{ cursor: "pointer", color: "black", zIndex: 10 }}
                onClick={() => setSelectedImage(null)}
              />
              <img
                src={selectedImage}
                alt="Enlarged"
                className="modal-image rounded"
                style={{
                  maxHeight: "90vh",
                  maxWidth: "90vw",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Container;