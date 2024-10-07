interface ProgressBarProps {
    progress: number;
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };
  
  export default ProgressBar;
  