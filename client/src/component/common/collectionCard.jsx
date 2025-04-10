const CollectionCard = ({ title, description, image, size , customSize , reverse}) => {
  return (
    <div className={`bg-gray-100 px-4 pt-4 flex ${reverse ? "flex-row-reverse" : "flex-row"} font-poppins shadow-md ${size}`}>
      <div className="flex flex-col flex-1 justify-evenly">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <button className="relative w-64 py-2 font-bold text-[#805C47]  uppercase border-2 border-[#805C47] transition-all duration-300 hover:text-black hover:border-[#805C47] hover:shadow-[0_0_10px_#805C47]">
  S H O P N O W!
</button>

      </div>
      <img src={image} alt={title} className={`mr-3 self-center mb-10 ${customSize}`} />
    </div>
  );
}
  export default CollectionCard;