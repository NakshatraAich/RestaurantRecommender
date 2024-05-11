/* eslint-disable react/prop-types */
const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="border border-neutral rounded-3xl p-6 mb-4">
      <h2 className="text-xl font-semibold">{restaurant["Restaurant Name"]}</h2>
      <p className="text-secondary">{restaurant["Cuisines"]}</p>
      <p className="text-secondary">Average Cost for two: Rs. {restaurant["Average Cost for two"]}</p>
      <p className="text-secondary">Rating: {restaurant["Aggregate rating"]} ({restaurant["Rating text"]})</p>
      <p className="text-secondary">Votes: {restaurant["Votes"]}</p>
      <h2 className="text-xs text-slate-400 font-medium pt-4">{restaurant["Address"]}</h2>
      {/* Add more details if needed */}
    </div>
  );
};

export default RestaurantCard;