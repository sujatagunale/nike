import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  category: string;
  price: string;
  colors?: string;
  badge?: string;
  image?: string;
  onClick?: () => void;
}

export default function Card({
  title,
  category,
  price,
  colors,
  badge,
  image,
  onClick
}: CardProps) {
  return (
    <div 
      className="bg-light-100 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {badge && (
        <div className="mb-4">
          <span className="text-caption font-caption text-red uppercase tracking-wide">
            {badge}
          </span>
        </div>
      )}
      
      <div className="aspect-square bg-light-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
        {image ? (
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-center">
            <div className="text-heading-3 font-jost font-bold text-dark-500 mb-2">
              NIKE
            </div>
            <div className="text-body text-dark-700">{title}</div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-body-medium font-body-medium text-dark-900">
          {title}
        </h3>
        <p className="text-body text-dark-700">
          {category}
        </p>
        {colors && (
          <p className="text-body text-dark-700">
            {colors}
          </p>
        )}
        <p className="text-body-medium font-body-medium text-dark-900">
          {price}
        </p>
      </div>
    </div>
  );
}
