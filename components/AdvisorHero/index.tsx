
const Hero: React.FC = () => (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-[80vh] text-white overflow-hidden">
    <div className="absolute inset-0">
      <img src="https://img.freepik.com/free-vector/isometric-business-concept-man-thinking-crm-system-artificial-intelligence-robot-ai_39422-771.jpg?t=st=1727170161~exp=1727173761~hmac=cdab18d37b774ba07b7c040908832d393af2385f86825fbe3554305fc24d9231&w=1060" alt="Background Image" className="object-cover object-center w-full h-full" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
    
    <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
      <h1 className="text-5xl font-bold leading-tight mb-4">Your Personalized Career Advisor</h1>
      <p className="text-lg text-gray-300 mb-8 lg:w-1/2">Welcome to your virtual career guide. I’m here to assist you in finding the right career path, preparing for opportunities, and offering tailored advice to help you succeed in your professional journey.</p>
      <a href="#" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Lets chat</a>
    </div>
  </div>
  
  );
  
  export default Hero;
  