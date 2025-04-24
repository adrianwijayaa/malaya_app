import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import logo from "../assets/img/MalayaAdventures.png";
import ukFlag from "../assets/img/flag.png";
import idFlag from "../assets/img/indonesia-flag.png";
import arrow from "../assets/img/arrow.png";
import hotline from "../assets/img/hotline.png";
import "../components/Navbars.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function Navbars() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({
    code: "EN",
    name: "English",
    flag: ukFlag,
  });
  const [activeItem, setActiveItem] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const changeNavbarColor = () => {
      if (window.scrollY >= 80) {
        setColorChange(true);
      } else {
        setColorChange(false);
      }
    };

    window.addEventListener("scroll", changeNavbarColor);
    return () => window.removeEventListener("scroll", changeNavbarColor);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    "Home",
    "Liveaboard",
    "Tailormade Trip",
    "Join De Trip",
    "De Service",
    "About Us",
  ];

  const languageOptions = [
    { code: "ID", name: "Indonesia", flag: idFlag },
    { code: "EN", name: "English", flag: ukFlag },
  ];

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/about-us") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleNavItemClick = (item) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false);

    switch (item) {
      case "Home":
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "About Us":
        navigate("/about-us");
        break;
      case "Liveaboard":
        window.location.href = "http://www.bookingliveaboard.com/";
        break;
      case "Tailormade Trip":
        if (window.location.pathname !== "/") {
          navigate("/");
          setTimeout(() => {
            const tailormadeSection = Array.from(
              document.getElementsByClassName("content-container")
            )[0]?.children[1];
            if (tailormadeSection) {
              const yOffset = -80; // Adjust this value to control how much lower it scrolls
              const y =
                tailormadeSection.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }, 200);
        } else {
          const tailormadeSection = Array.from(
            document.getElementsByClassName("content-container")
          )[0]?.children[1];
          if (tailormadeSection) {
            const yOffset = -80; // Adjust this value to control how much lower it scrolls
            const y =
              tailormadeSection.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
        break;
      case "Join De Trip":
        if (window.location.pathname !== "/") {
          navigate("/");
          setTimeout(() => {
            const joinSection = Array.from(
              document.getElementsByClassName("content-container")
            )[0]?.children[2]; // Hero4 is at index 2
            if (joinSection) {
              const yOffset = -80;
              const y =
                joinSection.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }, 200);
        } else {
          const joinSection = Array.from(
            document.getElementsByClassName("content-container")
          )[0]?.children[2]; // Hero4 is at index 2
          if (joinSection) {
            const yOffset = -80;
            const y =
              joinSection.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
        break;
      // Add other cases for different nav items as needed
      default:
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Navbar fixed="top" className={`nav ${colorChange ? "colorChange" : ""}`}>
      <Container fluid className="px-4">
        <Navbar.Brand>
          <img src={logo} alt="Demalaya Logo" width={100} className="logo" />
        </Navbar.Brand>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="blur-bg" />

        <div className={`nav-div ${isMobileMenuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <h5
              key={item}
              className={`nav-text ${activeItem === item ? "active" : ""}`}
              onClick={() => handleNavItemClick(item)}
            >
              {item}
            </h5>
          ))}
        </div>

        <div className="nav-img">
          <div className="language-selector" onClick={() => setOpen(!open)}>
            <div className="language-selector-flag">
              <img
                src={currentLanguage.flag}
                alt={`${currentLanguage.name} Flag`}
                className="flag"
              />
            </div>
            <div className="language-selector-code">
              <span>{currentLanguage.code}</span>
            </div>
            <div className="language-selector-arrow">
              <img
                src={arrow}
                alt="Toggle Language"
                className={`arrow ${open ? "rotate" : ""}`}
              />
            </div>
          </div>

          {open && (
            <div className="language-dropdown">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  className={`dropdown-item ${
                    currentLanguage.code === lang.code ? "active" : ""
                  }`}
                  onClick={() => {
                    setCurrentLanguage(lang);
                    setOpen(false);
                  }}
                >
                  <img
                    src={lang.flag}
                    alt={`${lang.name} Flag`}
                    className="flag-small"
                  />
                  <span>
                    {lang.code} - {lang.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <img
            src={hotline}
            alt="Demalaya Hotline"
            width={150}
            className="hotline-img"
          />
        </div>
      </Container>
    </Navbar>
  );
}

export default Navbars;
