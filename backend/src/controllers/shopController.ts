import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import Order from "../models/Order";
import { AuthRequest } from "../middleware/auth";

export async function listProducts(_req: Request, res: Response): Promise<void> {
  res.json(await Product.find({ active: true, stock: { $gte: 0 } }).sort({ category: 1, name: 1 }));
}
export async function listAdminProducts(_req: AuthRequest, res: Response): Promise<void> {
  res.json(await Product.find().sort({ createdAt: -1 }));
}
export async function createProduct(req: AuthRequest, res: Response): Promise<void> {
  const { name, description, category, price, stock, imageUrl } = req.body;
  if (!String(name || "").trim() || !String(description || "").trim() ||
      !Number.isFinite(Number(price)) || Number(price) < 0 ||
      !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    res.status(400).json({ message: "Name, description, a valid price and a whole-number stock quantity are required" }); return;
  }
  res.status(201).json(await Product.create({ name, description, category, price: Number(price), stock: Number(stock), imageUrl }));
}
export async function updateProduct(req: AuthRequest, res: Response): Promise<void> {
  const updates: Record<string, unknown> = {};
  for (const key of ["name", "description", "category", "price", "stock", "imageUrl", "active"]) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!product) { res.status(404).json({ message: "Product not found" }); return; }
  res.json(product);
}
export async function deleteProduct(req: AuthRequest, res: Response): Promise<void> {
  const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!product) { res.status(404).json({ message: "Product not found" }); return; }
  res.json({ message: "Product removed from the shop" });
}

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  const items = req.body.items as Array<{ productId?: string; quantity?: number }>;
  const shippingAddress = String(req.body.shippingAddress || "").trim();
  const phone = String(req.body.phone || "").trim();
  if (!Array.isArray(items) || items.length === 0 || !shippingAddress || !phone) {
    res.status(400).json({ message: "Cart items, delivery address and contact number are required" }); return;
  }
  const quantities = new Map<string, number>();
  for (const item of items) {
    if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId) ||
        !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 50) {
      res.status(400).json({ message: "Each cart item must have a valid product id and quantity from 1 to 50" }); return;
    }
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + Number(item.quantity));
  }
  const productIds = [...quantities.keys()];
  const products = await Product.find({ _id: { $in: productIds }, active: true });
  if (products.length !== productIds.length) { res.status(400).json({ message: "One or more products are no longer available" }); return; }

  const reserved: Array<{ id: string; quantity: number }> = [];
  try {
    const orderItems = [];
    let total = 0;
    for (const product of products) {
      const quantity = quantities.get(product.id) || 0;
      const updated = await Product.findOneAndUpdate(
        { _id: product.id, active: true, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!updated) {
        const stockError = new Error(`Not enough stock for ${product.name}`) as Error & { status?: number };
        stockError.status = 409;
        throw stockError;
      }
      reserved.push({ id: product.id, quantity });
      orderItems.push({ product: product._id, name: product.name, quantity, unitPrice: product.price });
      total += product.price * quantity;
    }
    const order = await Order.create({
      customer: req.user?.id, items: orderItems, total,
      shippingAddress, phone, status: "Pending"
    });
    res.status(201).json(await order.populate("items.product"));
  } catch (error) {
    await Promise.all(reserved.map((item) => Product.updateOne({ _id: item.id }, { $inc: { stock: item.quantity } })));
    throw error;
  }
}

export async function listOrders(req: AuthRequest, res: Response): Promise<void> {
  const filter = req.user?.role === "admin" ? {} : { customer: req.user?.id };
  const orders = await Order.find(filter).populate("customer", "name email").populate("items.product", "name category").sort({ createdAt: -1 });
  res.json(orders);
}
export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404).json({ message: "Order not found" }); return; }
  const nextStatus = String(req.body.status || "");
  const allowed = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];
  if (!allowed.includes(nextStatus)) { res.status(400).json({ message: "Invalid order status" }); return; }
  if (req.user?.role !== "admin") {
    if (order.customer.toString() !== req.user?.id) { res.status(403).json({ message: "Not allowed" }); return; }
    if (order.status !== "Pending" || nextStatus !== "Cancelled") {
      res.status(403).json({ message: "Customers can only cancel pending orders" }); return;
    }
  }
  if (order.status === "Cancelled" && nextStatus !== "Cancelled") {
    res.status(400).json({ message: "Cancelled orders cannot be reopened" }); return;
  }
  if (nextStatus === "Cancelled" && order.status !== "Cancelled") {
    await Promise.all(order.items.map((item) =>
      Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
    ));
  }
  order.status = nextStatus as typeof order.status;
  await order.save();
  res.json(await order.populate("items.product"));
}
