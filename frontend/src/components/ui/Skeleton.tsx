import React from "react";

const Skeleton = ({className = ""}: {className?: string}) => {
      return (
            <div className={`animate-pulse bg-gray-800 rounded-xl ${className}`}></div>
      );
};

export default Skeleton;
