import React from "react";
import NavBar from "../components/NavBar";

const HeroSection = () => (
  <div className="flex items-center justify-between bg-gray-50 p-8">
    <div>
      <h1 className="text-5xl font-bold">McMaster GSA</h1>
      <p className="mt-4 text-lg text-gray-700">
        McMaster GSA is dedicated to providing a social and supportive community... lorem ipsum dolor sit amet.
      </p>
    </div>
    <div className="w-1/3">
      <img
        src="placeholder-image.jpg"
        alt="Placeholder"
        className="rounded-lg shadow-lg"
      />
    </div>
  </div>
);

const PhotoGallery = () => (
  <div className="py-8 bg-white">
    <div className="flex items-center">
      <div className="w-1/3">
        <img
          src="placeholder-image.jpg"
          alt="Gallery Placeholder"
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="ml-8">
        <h2 className="text-3xl font-bold">Photo Gallery</h2>
        <p className="mt-4 text-gray-700">
          GSA page has an acknowledgments tab that can be highlighted here so everyone can see and acknowledge.
        </p>
      </div>
    </div>
  </div>
);

const Announcements = () => (
  <div className="bg-gray-100 py-8">
    <h2 className="text-3xl font-bold text-center">Announcements</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 px-4">
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
  <div>
    <NavBar />
    <HeroSection />
    <PhotoGallery />
    <Announcements />
  </div>
);

export default GsaHomePage;
