const express = require("express");
const db = require("../Config/dbConfig");

const router = express.Router();

// Orders List fetch
router.get("/", (req, res) => {
  const query = `
    SELECT
      Orders.id AS order_id,
      Orders.customer_email,
      Orders.order_date,
      GROUP_CONCAT(OrderItems.name SEPARATOR ', ') AS item_names,
      GROUP_CONCAT(OrderItems.quantity SEPARATOR ', ') AS item_quantity,
      SUM(OrderItems.quantity) AS total_quantity,
      SUM(OrderItems.price) AS total_price,
      Orders.shipping_status
    FROM Orders
    JOIN OrderItems ON Orders.id = OrderItems.order_id
    GROUP BY Orders.id
    ORDER BY Orders.order_date DESC;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const orders = results.map((row) => ({
      order_id: row.order_id,
      customer_email: row.customer_email,
      order_date: row.order_date,
      item_names: row.item_names.split(", "),
      item_quantity: row.item_quantity.split(", "),
      total_quantity: row.total_quantity,
      total_price: row.total_price,
      shipping_status: row.shipping_status,
    }));

    res.json(orders);
  });
});

// Single order
router.get("/:id", (req, res) => {
  const orderId = req.params.id;

  const query = `
    SELECT
      Orders.id AS order_id,
      Orders.customer_email,
      Orders.order_date,
      Orders.address,
      GROUP_CONCAT(OrderItems.img1 SEPARATOR ', ') AS item_images,
      GROUP_CONCAT(OrderItems.price SEPARATOR ', ') AS item_prices,
      GROUP_CONCAT(OrderItems.name SEPARATOR ', ') AS item_names,
      GROUP_CONCAT(OrderItems.quantity SEPARATOR ', ') AS item_quantity,
      SUM(OrderItems.quantity) AS total_quantity,
      SUM(OrderItems.price) AS total_price,
      Orders.shipping_status
    FROM Orders
    JOIN OrderItems ON Orders.id = OrderItems.order_id
    WHERE Orders.id = ?
    GROUP BY Orders.id;
  `;

  db.query(query, [orderId], (error, results) => {
    if (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const row = results[0];
    const order = {
      order_id: row.order_id,
      customer_email: row.customer_email,
      address: row.address,
      order_date: row.order_date,
      item_images: row.item_images.split(", "),
      item_prices: row.item_prices.split(", "),
      item_names: row.item_names.split(", "),
      item_quantity: row.item_quantity.split(", "),
      total_quantity: row.total_quantity,
      total_price: row.total_price,
      shipping_status: row.shipping_status,
    };

    res.json(order);
  });
});

// Update shipping status
router.put("/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const { shippingStatus } = req.body;

  const query = "UPDATE Orders SET shipping_status = ? WHERE id = ?";
  db.query(query, [shippingStatus, orderId], (error) => {
    if (error) {
      console.error("Error updating shipping status:", error);
      res.status(500).json({ error: "Failed to update shipping status" });
    } else {
      res.status(200).json({ message: "Shipping status updated successfully" });
    }
  });
});

module.exports = router;
