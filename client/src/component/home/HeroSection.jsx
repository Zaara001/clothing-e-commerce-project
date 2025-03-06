import HeroSectionImg from "../../assets/images/HeroSectionImg.png";
import { useTypewriter, Cursor } from "react-simple-typewriter";



const HeroSection = () => {

  const [typeEffect] = useTypewriter({
    words: ['Welcome to Aurora\nThe Fashion Begins Here'],
    loop: {},
    typeSpeed: 100,
    deleteSpeed: 40
  })

  return (
    <section className="relative  h-screen">
      <div>
        <img className="absolute top-0 -z-10 brightness-[0.9] "
          src={HeroSectionImg} alt="" />
        <div className="flex flex-col items-center justify-center h-screen text-white absolute top-0 left-0 right-0 -z-10">
        <h1 className="font-normal text-[43px] whitespace-pre-line text-center font-poppins ">
          {typeEffect}
        </h1>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
