import React from "react";
import NavBar from "../components/NavBar";

const HeroSection = () => (
  <div className="flex items-center justify-center bg-gray-50 p-12 min-h-screen pt-24"> {/* Adjusted for navbar space */}
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-gray-900">McMaster GSA</h1>
      <p className="mt-4 text-lg text-gray-700">
        McMaster GSA is dedicated to providing a social and supportive community... lorem ipsum dolor sit amet.
      </p>
    </div>
    <div className="w-1/3 hidden md:block">
      <img
        src="../assets/GSALogo.png"
        alt="GSA Logo"
        className="rounded-lg shadow-lg"
      />
    </div>
  </div>
);

const Acknowledgments = () => (
  <div className="py-8 bg-white">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/3 mb-8 md:mb-0">
      </div>
      <div className="text-center md:text-left md:ml-8">
        <h2 className="text-3xl font-bold">Acknowledgments</h2>
        <p className="mt-4 text-gray-700">
          GSA page has an acknowledgments tab that can be highlighted here so everyone can see and acknowledge.
        </p>
      </div>
    </div>
  </div>
);

const Announcements = () => (
  <div className="bg-gray-100 py-8">
    <h2 className="text-3xl font-bold text-center text-gray-900">Announcements</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 px-4 max-w-7xl mx-auto">
      {[1, 2, 3].map((announcement, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <img
            src="placeholder-image.jpg"
            alt="Announcement Placeholder"
            className="w-full"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">Naeque voluptat morbi.</h3>
            <p className="mt-2 text-gray-600">
              Et laborum nisi ex quae signifer et alias.
            </p>
            <button className="mt-4 bg-maroon-500 text-white py-1 px-4 rounded-lg">
              Read
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GsaHomePage = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <NavBar />
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-5xl text-center">
        <HeroSection />
        <Acknowledgments />
        <Announcements />
      </div>
    </div>
  </div>
);


export default GsaHomePage;
