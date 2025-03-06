const CollectionCard = ({ title, description, image, size , customSize , reverse}) => {
  return (
    <div className={`bg-gray-100 px-4 pt-4 flex ${reverse ? "flex-row-reverse" : "flex-row"} font-poppins shadow-md ${size}`}>
      <div className="flex flex-col flex-1 justify-evenly">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <button className="mt-3 border-4 border-customBrown pb-1 text-gray-800 hover:text-gray-600 text-xs w-52">
          S H O P N O W!
        </button>
      </div>
      <img src={image} alt={title} className={`mr-3 self-center mb-10 ${customSize}`} />
    </div>
  );
}
  export default CollectionCard;