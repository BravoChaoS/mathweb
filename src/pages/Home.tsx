import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 'triangle-perimeter',
    title: '阴影部分的周长',
    grade: '六年级上册',
    category: '圆与扇形',
    description: '通过动态演示，理解三角形内扇形围成阴影部分的周长计算原理。',
    color: 'bg-indigo-500',
    path: '/triangle-perimeter'
  },
  {
    id: 'circle-area',
    title: '圆的面积推导',
    grade: '六年级上册',
    category: '圆的面积',
    description: '经典的"化曲为直"思想，演示如何将圆形转化为近似长方形来推导面积公式。',
    color: 'bg-emerald-500',
    path: '/circle-area'
  }
];

const Home: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">小学数学几何实验室</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          专为六年级学生设计的互动教学工具。通过直观的动画演示，让抽象的几何概念变得触手可及。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <Link 
            to={course.path} 
            key={course.id}
            className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
          >
            <div className={`h-32 ${course.color} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <span className="text-white text-6xl opacity-50 font-serif font-bold select-none group-hover:scale-110 transition-transform">
                {course.title[0]}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">
                  {course.grade}
                </span>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-slate-600">
                {course.description}
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                开始学习 
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Placeholder for future content */}
        <div className="block bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center opacity-75">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-4 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-500 mb-1">更多课程开发中</h3>
          <p className="text-slate-400 text-sm">圆柱与圆锥、立体图形等即将上线...</p>
        </div>
      </div>
    </div>
  );
};

export default Home;