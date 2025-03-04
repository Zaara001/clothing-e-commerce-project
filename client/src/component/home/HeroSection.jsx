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
    <section >
      <div>
        <img className="absolute top-0 -z-10 brightness-[0.9] "
          src={HeroSectionImg} alt="" />
        <div className="flex flex-col items-center justify-center h-screen text-white absolute top-0 left-0 right-0 -z-10">
        <h1 className="font-bold text-5xl whitespace-pre-line text-center ">
          {typeEffect}
          <Cursor cursorColor="white" />
        </h1>
        </div>
      </div>




    </section>
  )
}

export default HeroSection;
