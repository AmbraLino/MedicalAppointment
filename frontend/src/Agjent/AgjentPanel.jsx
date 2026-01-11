import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AgjentPanel.css";

const AgjentPanel = () => {
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refuseMsg, setRefuseMsg] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/agent/orders", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/agent/orders/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefuseClick = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const sendRefusal = async () => {
    try {
      await axios.put(
        `http://localhost:5000/agent/orders/${selectedOrder._id}/status`,
        { status: "Refuzuar", message: refuseMsg },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: "Refuzuar", message: refuseMsg }
            : order
        )
      );

      setRefuseMsg("");
      setShowPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="agjent-page">
      <h2>Paneli i Agjentit</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Klienti</th>
            <th>Prona</th>
            <th>Data</th>
            <th>Ora</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order?.user?.username}</td>
              <td>{order?.product?.name}</td>
              <td>{order.date}</td>
              <td>{order.time}</td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option>Në pritje</option>
                  <option>Pranuar</option>
                  <option>Refuzuar</option>
                  <option>Përfunduar</option>
                </select>
              </td>

              <td>
                <button
                  onClick={() => handleStatusChange(order._id, "Pranuar")}
                  className="btn accept"
                >
                  Prano
                </button>

                <button
                  onClick={() => handleRefuseClick(order)}
                  className="btn refuse"
                >
                  Refuzo & Mesazh
                </button>

                <button
                  onClick={() => handleStatusChange(order._id, "Në pritje")}
                  className="btn pending"
                >
                  Në pritje
                </button>

                <button
                  onClick={() => handleStatusChange(order._id, "Përfunduar")}
                  className="btn done"
                >
                  Përfunduar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Shkruaj mesazhin e refuzimit</h3>
            <textarea
              value={refuseMsg}
              onChange={(e) => setRefuseMsg(e.target.value)}
              placeholder="Shkruaj arsyen e refuzimit..."
            />
            <div className="popup-buttons">
              <button onClick={sendRefusal} className="btn confirm">
                Dërgo
              </button>
              <button onClick={() => setShowPopup(false)} className="btn cancel">
                Anulo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgjentPanel;
