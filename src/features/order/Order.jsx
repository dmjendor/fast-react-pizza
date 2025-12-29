// Test ID: IIDSAT

import { useFetcher, useLoaderData } from 'react-router-dom';
import { getOrder } from '../../services/apiRestaurant';
import { calcMinutesLeft, formatCurrency, formatDate } from '../../utilities/helpers';
import OrderItem from '../order/OrderItem';
import { useEffect } from 'react';
import UpdateOrder from './UpdateOrder';
/**
 * Order component displays detailed information about a pizza order.
 *
 * This component retrieves order data using the loader and displays:
 * - Order ID and status
 * - Priority badge (if applicable)
 * - Estimated delivery time and countdown
 * - List of items in the order cart
 * - Price breakdown including order total and priority surcharge
 *
 * @component
 * @returns {JSX.Element} A detailed order status page with order information and cart items
 *
 * @requires useLoaderData - Hook to access order data from the router loader
 * @requires OrderItem - Component to render individual cart items
 * @requires calcMinutesLeft - Utility function to calculate minutes until delivery
 * @requires formatDate - Utility function to format dates
 * @requires formatCurrency - Utility function to format currency values
 */

function Order() {
  const order = useLoaderData();
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const { id, status, priority, priorityPrice, orderPrice, estimatedDelivery, cart } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
  }, [fetcher]);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-md bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-md bg-green-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="text-md">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : 'Order should have arrived'}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-500 border-b border-t border-stone-500">
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.id}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher?.data?.find((el) => {
                return item.pizzaId === el.id;
              })?.ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

// eslint-disable-next-line
export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
