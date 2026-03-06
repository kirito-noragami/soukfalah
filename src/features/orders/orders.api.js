import { supabase } from '../../services/supabase';

export const ordersApi = {
  // Buyer: list my orders
  list: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, order_items(*, products(name, unit))`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Create a new order from cart
  create: async ({ cartItems, shippingAddress, paymentMethod, priority, note }) => {
    const { data: { session } } = await supabase.auth.getSession();
    const buyerId = session?.user?.id;

    const totalDh = cartItems.reduce((sum, item) => sum + item.price_dh * item.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: buyerId,
        total_dh: totalDh,
        payment_method: paymentMethod,
        priority,
        note,
        shipping_address: shippingAddress,
        eta: priority === 'express' ? 'Today 20:00' : 'Tomorrow',
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const items = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      farmer_id: item.farmer_id,
      quantity: item.quantity,
      price_per_unit: item.price_dh,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) throw itemsError;

    // Clear cart after order
    await supabase.from('cart_items').delete().eq('user_id', buyerId);

    return order;
  },

  updateStatus: async (orderId, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};