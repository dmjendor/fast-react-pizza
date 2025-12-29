/**
 * CreateOrder Component
 *
 * A form component for creating a new pizza order with customer details,
 * phone number validation, address input with geolocation support, and
 * optional priority order upgrade.
 *
 * @component
 * @returns {React.ReactElement} The order creation form or empty cart message
 *
 * @requires react
 * @requires react-router-dom
 * @requires redux
 *
 * @example
 * // Usage in router
 * {
 *   path: '/order/new',
 *   element: <CreateOrder />,
 *   action: CreateOrder.action
 * }
 */

/**
 * Validates phone number format using regex pattern
 *
 * @function isValidPhone
 * @param {string} str - The phone number string to validate
 * @returns {boolean} True if phone number format is valid
 *
 * @description
 * Accepts various international phone formats with optional:
 * - Country code prefix (+1-4 digits)
 * - Area code in parentheses
 * - Separators (hyphen, dot, space)
 *
 * @example
 * isValidPhone('+1-234-567-8900') // true
 * isValidPhone('234567890') // true
 */

/**
 * Action handler for form submission (React Router)
 *
 * @async
 * @function action
 * @param {Object} param - The action parameters
 * @param {Request} param.request - The form submission request
 * @returns {Promise<Object|RedirectResponse>} Error object if validation fails, otherwise redirects to order details page
 *
 * @description
 * Processes the order form submission, validates phone number,
 * parses form data, creates the order via API, clears cart, and
 * redirects to the new order page.
 *
 * @throws {Object} Returns validation errors if phone format is invalid
 */
import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from '../../utilities/helpers';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

function CreateOrder() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const formErrors = useActionData();
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);

  const isSubmitting = navigation.state === 'submitting';
  const isLoadingAddress = addressStatus === 'loading';
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  function handleFetchAddress(e) {
    e.preventDefault();
    dispatch(fetchAddress());
  }

  if (cart.length === 0) return <EmptyCart />;
  return (
    // <Form method="POST" action="/order/new"></Form>
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let&apos;s go!</h2>
      <Form method="POST">
        <div className="mb-5 flex grow flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            className="input grow"
            defaultValue={username}
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" className="input w-full" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              className="input w-full"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">{errorAddress}</p>
            )}
          </div>
          {!position.latitude && !position.logituded && (
            <span className="med:top-[5px] absolute right-[3px] z-10 sm:top-[3px]">
              <Button type="small" onClick={handleFetchAddress} disabled={isLoadingAddress}>
                Get Address
              </Button>
            </span>
          )}
        </div>

        <div className="mb-10 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring-yellow-500 focus:ring-opacity-50 focus:ring-offset-2"
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input
          type="hidden"
          name="position"
          value={
            position.longitude && position.latitude
              ? `${position.latitude},${position.longitude}`
              : ''
          }
        />
        <div>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting ? 'Placing Order' : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// eslint-disable-next-line
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Fix the order object by spreading the original and then updating values
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = 'Please enter your correct phone number.';
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  // if order status is without error, then redirect to new order page
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
