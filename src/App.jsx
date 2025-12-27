import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./ui/Home";
import Menu from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order from "./features/order/Order";
import CreateOrder from "./features/order/CreateOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  { path: "/menu", elements: <Menu /> },
  { path: "/cart", elements: <Cart /> },
  { path: "/order/new", elements: <CreateOrder /> },
  { path: "/order/:orderId", elements: <Order /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
