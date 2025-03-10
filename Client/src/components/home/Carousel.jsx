import { React } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import cr1 from "../../assets/img/carousel1.png";
import cr2 from "../../assets/img/cr2.png";
import cr3 from "../../assets/img/cr3.png";
import "../home/Carousel.css";
const Carousel = () => {
  const handleInquireClick = (title) => (e) => {
    e.preventDefault();
    const phoneNumber = "6285814470914";
    const message = `Hi, I would like to inquire about ${title}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  const slides = [
    {
      image: cr1,
      title: "Tailor-Made Itineraries",
      description:
        "From luxury escapes and family vacations to adventurous expeditions, we cater to all types of travelers. Every itinerary is uniquely designed to reflect your needs and aspirations.",
    },
    {
      image: cr2,
      title: "Local Expertise",
      description:
        "From luxury escapes and family vacations to adventurous expeditions, we cater to all types of travelers. Every itinerary is uniquely designed to reflect your needs and aspirations.",
    },
    {
      image: cr3,
      title: "Seamless Planning",
      description:
        "From luxury escapes and family vacations to adventurous expeditions, we cater to all types of travelers. Every itinerary is uniquely designed to reflect your needs and aspirations.",
    },
    {
      image: cr1,
      title: "Commitment to Sustainability",
      description:
        "From luxury escapes and family vacations to adventurous expeditions, we cater to all types of travelers. Every itinerary is uniquely designed to reflect your needs and aspirations.",
    },
    {
      image: cr2,
      title: "A Variety of Travel Styles",
      description:
        "From luxury escapes and family vacations to adventurous expeditions, we cater to all types of travelers. Every itinerary is uniquely designed to reflect your needs and aspirations.",
    },
    {
      image: cr3,
      title: "Exceptional Service",
      description:
        "From luxury escapes and family vacations to adventurous expeditions, we cater to all types of travelers. Every itinerary is uniquely designed to reflect your needs and aspirations.",
    },
  ];
  return (
    <div className="carousel-container1">
      <div className="carousel-wrapper1">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1.2} // Adjusted for better visibility
          spaceBetween={20}
          loop={true}
          speed={1000}
          navigation={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          className="modern-swiper1"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="modern-card1">
                <div className="card-media1">
                  <img src={slide.image} alt={slide.title} />
                  <div className="media-overlay1"></div>
                </div>
                <div className="card-content1">
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>
                  <div className="feature-list1">
                    {slide.features &&
                      slide.features.map((feature, idx) => (
                        <span key={idx} className="feature-item1">
                          <i className="feature-icon1">✦</i>
                          {feature}
                        </span>
                      ))}
                  </div>
                  <button
                    className="explore-button1"
                    onClick={handleInquireClick(slide.title)}
                  >
                    Inquire
                    <svg className="button-icon1" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
export default Carousel;
