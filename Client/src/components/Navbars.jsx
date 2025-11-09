import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import logo from "../assets/img/MalayaAdventuresLogo.png";
import ukFlag from "../assets/img/flag.png";
import idFlag from "../assets/img/indonesia-flag.png";
import arrow from "../assets/img/arrow.png";
import hotline from "../assets/img/hotline.png";
import "../components/Navbars.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function Navbars() {
  const location = useLocation();
  const isTailorMade = location.pathname.startsWith("/tailor-made");
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
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setColorChange(window.scrollY >= 30);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set state awal
    return () => window.removeEventListener("scroll", onScroll);
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

  useEffect(() => {
    if (location.pathname.startsWith("/join-de-trip"))
      setActiveItem("Join De Trip");
    else if (location.pathname.startsWith("/about-us"))
      setActiveItem("About Us");
    else if (location.pathname.startsWith("/tailor-made"))
      setActiveItem("Tailormade Trip");
    else if (location.pathname.startsWith("/news")) setActiveItem("News");
    else setActiveItem("Home");
  }, [location.pathname]);

  const navItems = [
    "Home",
    "Liveaboard",
    "Tailormade Trip",
    "Join De Trip",
    "De Service",
    "About Us",
    "News",
  ];

  const languageOptions = [
    { code: "ID", name: "Indonesia", flag: idFlag },
    { code: "EN", name: "English", flag: ukFlag },
  ];

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
        navigate("/tailor-made");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "Join De Trip":
        navigate("/join-de-trip");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "News":
        navigate("/news", { state: { mode: "compact" } });
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      default:
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Navbar
      fixed="top"
      className={`nav ${
        colorChange || location.pathname.startsWith("/news")
          ? "colorChange"
          : ""
      }`}
    >
      <Container fluid className="px-5">
        <Navbar.Brand>
          <img src={logo} alt="Demalaya Logo" width={80} className="logo" />
        </Navbar.Brand>
        <div className={`nav-title`}>
          Malaya <br /> Adventures
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="nav-div">
            <div className="blur-bg" />
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
            {/* Language selector temporarily disabled
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
            */}

            <img
              src={hotline}
              alt="Demalaya Hotline"
              width={150}
              className="hotline-img"
            />
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default Navbars;
