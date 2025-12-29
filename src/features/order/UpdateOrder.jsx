import { updateOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useFetcher } from 'react-router-dom';

function UpdateOrder({ order }) {
  // using useFetcher to submit data without navigating
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

// eslint-disable-next-line
export async function action({ request, params }) {
  await updateOrder(params.orderId, { priority: true });
  return null;
}
