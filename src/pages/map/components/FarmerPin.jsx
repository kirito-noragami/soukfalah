import './FarmerPin.css';
const FarmerPin = ({
  farm,
  isActive,
  onClick
}) => {
  const pinStyle = {
    left: `${farm.position.x}%`,
    top: `${farm.position.y}%`,
    '--pin-accent': farm.accent
  };
  const handleClick = event => {
    event.stopPropagation();
    onClick(farm.id);
  };
  return <button className={`farmer-pin${isActive ? ' is-active' : ''}`} type="button" style={pinStyle} onClick={handleClick} aria-label={`Open ${farm.name}`}>
      <span className="farmer-pin__core" aria-hidden="true" />
    </button>;
};
export default FarmerPin;