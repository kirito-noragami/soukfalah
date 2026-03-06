import './ShippingForm.css';
const ShippingForm = () => {
  return <div className="shipping-form">
      <div className="shipping-form__header">
        <h2>Shipping Information</h2>
      </div>
      <form className="shipping-form__body">
        <label className="shipping-form__field">
          <span>Full Name</span>
          <input type="text" placeholder="Enter your full name" />
        </label>
        <label className="shipping-form__field">
          <span>Email Address</span>
          <input type="email" placeholder="Enter your email address" />
        </label>
        <label className="shipping-form__field">
          <span>Shipping Address</span>
          <input type="text" placeholder="Enter your shipping address" />
        </label>
        <label className="shipping-form__field">
          <span>Phone Number</span>
          <input type="tel" placeholder="Enter your phone number" />
        </label>
      </form>
    </div>;
};
export default ShippingForm;