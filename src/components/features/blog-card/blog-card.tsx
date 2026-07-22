import React from 'react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

export const BlogCard = ({ title, excerpt, category, date, image }: BlogCardProps) => {
  return (
    <article className="group cursor-pointer">
      <div className="overflow-hidden rounded-2xl mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-800">
          {category}
        </span>
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2">
          {excerpt}
        </p>
        <p className="text-slate-600 text-xs font-medium pt-2">
          {date}
        </p>
      </div>
    </article>
  );
};
