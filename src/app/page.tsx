"use client";
import Link from 'next/link';
import Image from 'next/image';
import useRedirectToHome from '../hooks/useRedirectToHome';
import Navbar from './(components)/Navbar';
import PageWrapper from "./(components)/PageWrapper";

export default function Home() {
  useRedirectToHome();
  return (
    <PageWrapper>
      <Navbar/>
      {/* Main Container */}
      <div className="
      flex flex-col min-[800px]:flex-row items-start gap-10 m-10">
        {/* Left Image */}
        <div className="
        max-[920px]:w-[350px] max-[350px]:w-[250px]">
          <Image
            className="
          rounded-4xl border border-pink-300 shadow-pink-500/20 shadow-xl
          hover:scale-105 hover:shadow-pink-500/40 transition-all duration-500"
            src={'/art/art8.jpg'}
            loading='lazy'
            width={400}
            height={500}
            alt="Hero Section Image"
          />
        </div>

        {/* Left Container */}
        <div className="
        flex flex-col justify-center  items-center gap-2 ">
          {/* Banner */}
          <div className="
          max-[920px]:w-[350px] max-[350px]:w-[250px]">
            <Image
              className="
            rounded-lg border border-pink-300 shadow-pink-500/20 shadow-xl
            hover:scale-105 hover:shadow-pink-500/40 transition-all duration-500"
              src={'/art/banner/banner1-text.png'}
              loading='lazy'
              width={400}
              height={200}
              alt="Logo"
            />
          </div>
          {/* Text */}
          <div  
            className="
          -tracking-tighter max-[920px]:leading-5 max-[800px]:leading-7 leading-7
          max-[350px]:w-[250px] max-[400px]:text-center max-[920px]:w-[350px]
          max-[920px]:text-center w-[400px] text-sm p-2 text-pink-950 ">

            ShareAway is a safe, open space where anyone can express their thoughts, feelings, and stories without fear of judgment.

            <br /><br /> Whether you&apos;re going through something tough, celebrating a small win, or just need to get something off your chest, just&nbsp;

            <Link
              href="/login"
              className="
              inline-block bg-pink-600/20 rounded-md px-2 text-pink-600
              border border-pink-300 hover:border-pink-400 shadow-xl
              shadow-pink-500/20 hover:scale-105 hover:shadow-pink-500/40
              transition-all duration-500 animate-pulse hover:animate-none">
              Share Away 🩷...
            </Link>

            <div className="
            inline-block animate-[slide-left-bounce_1s_ease-in-out_infinite]
            text-xl text-pink-600">
              &nbsp;&nbsp;&nbsp;←
            </div>

            <br /><br />

            It&apos;s a community built on empathy, understanding, and support — because everyone deserves to be heard.
          </div>

        </div>


      </div>

    </PageWrapper>
  );
}
