import React, { useState, useEffect } from 'react';
import './Carousel.css';
import image1 from '../../../../assets/BA1.jpg';
import image2 from '../../../../assets/BA2.jpg';
import image4 from '../../../../assets/B1.jpg';
import image5 from '../../../../assets/B2.jpg';
import ReservationForm from "../ReservationForm/ReservationForm";

const Carousel = ({ items, autoPlayInterval = 1000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [reservationId, setReservationId] = useState(null); // State for reservation ID

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-play feature using useEffect
  useEffect(() => {
    const autoPlay = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(autoPlay); // Cleanup the interval on component unmount
  }, [currentIndex, autoPlayInterval]);

  const handleReserveNow = () => {
    const uniqueId = `${Math.floor(10000 + Math.random() * 90000)}`;
 // Combine timestamp and random number
    setReservationId(uniqueId);
    setModalOpen(true);
  };


  return (
    <div className="carousel-container" id="reservation">
      <button className="carousel-button prev" onClick={prevSlide}>
        &#10094;
      </button>

      <div
        className="carousel-slide"
        style={{
          width: `${items.length * 100}%`, // Dynamic width based on number of items
          transform: `translateX(${-currentIndex * (100 / items.length)}%)`, // Move based on index
        }}
      >
        {items.map((item, index) => (
          <img key={index} src={item.image} alt={item.title} />
        ))}
      </div>

      <button className="carousel-button next" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Reserve Now Button */}
      <div className="reserve-button-container">
        <button className="reserve-now-button" onClick={handleReserveNow}>
          Reserve Event Now!
        </button>
      </div>

      {/* Modal for Reservation Form */}
      {isModalOpen && (
        <ReservationForm
          reservationId={reservationId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

// Usage example
const items = [
  {
    image: image1,
    title: "Slide 1",
    description: "This is the first slide"
  },
  {
    image: image2,
    title: "Slide 2",
    description: "This is the second slide"
  },
  {
    image: image4,
    title: "Slide 4",
    description: "This is the third slide"
  },
  {
    image: image5,
    title: "Slide 5",
    description: "This is the fourth slide"
  },
];

const App = () => {
  return (
    <div className='branch-name'>
      <hr />
      <h1>Batangas Branch</h1>
      <hr />
      <Carousel items={items} autoPlayInterval={2000} />
    </div>
  );
};

export default App;