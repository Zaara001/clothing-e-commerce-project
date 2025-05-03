const CollectionCard = ({ title, description, image, customSize , reverse ,  bgColor}) => {
  return (
    <div className={`bg-gray-100 px-4 h-[450px] w-[560px] pt-4 flex ${reverse ? "flex-row-reverse" : "flex-row"} font-poppins shadow-md `}
    style={{ backgroundColor: bgColor }}>
      <div className="flex flex-col flex-1 justify-evenly">
        <h2 className="font-bold font-poppins mt-6 pl-8 text-[19px]">{title}</h2>
        <p className="w-[240px] ml-10 text-[13px] font-poppins  font-medium">{description}</p>
        <button className="relative w-56 py-2 ml-9 bg-white font-bold text-black  uppercase border-2 border-[#805C47] transition-all duration-300 hover:text-black hover:border-[#805C47] hover:shadow-[0_0_10px_#805C47]">
  S H O P&nbsp;&nbsp;N O W!
</button>

      </div>
      <img src={image} alt={title} className={`mr-3 self-center mt-8 ${customSize}`} />
    </div>
  );
}
  export default CollectionCard;