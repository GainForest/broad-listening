import { Mars, Venus } from "lucide-react";

interface GenderBarChartProps {
  male: number;
  female: number;
  className?: string;
}

export const GenderBarChart = ({ male, female, className = "" }: GenderBarChartProps) => {
  const total = male + female;
  
  // Calculate percentages, defaulting to 0 if total is 0
  const malePercentage = total > 0 ? (male / total) * 100 : 0;
  const femalePercentage = total > 0 ? (female / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Bar Chart */}
      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
        {/* Male bar */}
        <div 
          className="bg-blue-500/50 h-full flex items-center justify-center transition-all duration-300"
          style={{ width: `${malePercentage}%` }}
        >
          {malePercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {malePercentage.toFixed(1)}%
            </span>
          )}
        </div>
        
        {/* Female bar */}
        <div 
          className="bg-pink-500/50 h-full flex items-center justify-center transition-all duration-300"
          style={{ width: `${femalePercentage}%` }}
        >
          {femalePercentage > 10 && (
            <span className="text-white text-xs font-medium">
              {femalePercentage.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Mars className="size-3 text-blue-500" />
          <span>Male: {male} ({malePercentage.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <Venus className="size-3 text-pink-500" />
          <span>Female: {female} ({femalePercentage.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}; 