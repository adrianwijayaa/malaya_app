import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import LazyImage from "../components/LazyImage";
import "./ServicesDetail.css";

// Helper function untuk image URL
function imageSrc(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = BASE_URL?.replace(/\/+$/, "") || "";
  const path = String(url).startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

const formatUSD = (raw) => {
  if (!raw) return "USD $0";
  const text = String(raw);
  const hasFrom = /from/i.test(text);
  const label = hasFrom ? "From " : "";
  const cleaned = text.replace(/from/i, "");
  const numericMatch = cleaned.match(/[\d.,]+/);
  let amount = numericMatch ? Number(numericMatch[0].replace(/,/g, "")) : 0;
  if (/idr/i.test(text)) {
    amount = amount / 16000;
  }
  if (!amount || Number.isNaN(amount)) amount = 0;
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${label}USD $${formatted}`;
};

const ServicesDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [error, setError] = useState(null);
  const [allServices, setAllServices] = useState([]);

  // Fetch service data from API
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        window.scrollTo(0, 0);
        setIsLoading(true);

        // Fetch current service by slug
        const serviceResponse = await api.get(`/services/slug/${serviceId}`);

        setServiceData({
          title: serviceResponse.data.data.name,
          rating: parseFloat(serviceResponse.data.data.rating),
          reviews: serviceResponse.data.data.reviews,
          description:
            serviceResponse.data.data.detailDescription ||
            serviceResponse.data.data.description,
          imageUrl: serviceResponse.data.data.imageUrl,
          packages: serviceResponse.data.data.packages || [],
          valueProps: serviceResponse.data.data.valueProps || [],
          testimonials: serviceResponse.data.data.testimonials || [],
        });

        // Fetch all services for related section
        const allServicesResponse = await api.get("/services?status=active");
        setAllServices(allServicesResponse.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message);
        navigate("/services", { replace: true });
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchServiceData();
  }, [serviceId, navigate]);

  // Get related services (random 3, exclude current) from API data
  const relatedServices = useMemo(() => {
    // Filter out current service
    const filtered = allServices.filter((s) => s.slug !== serviceId);

    // Shuffle and take 3
    return filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((s) => ({
        slug: s.slug,
        name: s.name,
        price: s.price,
        imageUrl: s.imageUrl,
      }));
  }, [allServices, serviceId]);

  // Guard: jika data tidak ada, return null sementara redirect
  if (!serviceData) {
    return null;
  }

  return (
    <div className={`msd-detail ${isLoading ? "msd-loading" : ""}`}>
      {/* Header */}
      <div className="msd-header">
        <div className="msd-container">
          <Link to="/services" className="msd-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Services
          </Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="msd-breadcrumb">
        <div className="msd-container">
          <nav className="msd-breadcrumb-nav">
            <Link to="/" className="msd-breadcrumb-item">
              Home
            </Link>
            <span className="msd-breadcrumb-separator">›</span>
            <Link to="/services" className="msd-breadcrumb-item">
              Services
            </Link>
            <span className="msd-breadcrumb-separator">›</span>
            <span className="msd-breadcrumb-current">{serviceData.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero with Background Image */}
      <div className="msd-hero">
        <div className="msd-hero-bg">
          {serviceData.imageUrl ? (
            <LazyImage
              src={imageSrc(serviceData.imageUrl)}
              alt={serviceData.title}
              className="msd-hero-real-image"
            />
          ) : (
            <svg
              viewBox="0 0 800 400"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "#7dd3fc", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#38bdf8", stopOpacity: 1 }}
                  />
                </linearGradient>
                <linearGradient
                  id="oceanGrad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#0ea5e9", stopOpacity: 0.8 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#0284c7", stopOpacity: 1 }}
                  />
                </linearGradient>
                <linearGradient
                  id="maskGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#f472b6", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>

              {/* Sky */}
              <rect width="800" height="250" fill="url(#skyGrad)" />

              {/* Sun */}
              <circle cx="120" cy="80" r="45" fill="#fbbf24" opacity="0.9">
                <animate
                  attributeName="opacity"
                  values="0.8;1;0.8"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="120" cy="80" r="55" fill="#fbbf24" opacity="0.3" />

              {/* Clouds */}
              <ellipse
                cx="300"
                cy="80"
                rx="60"
                ry="20"
                fill="white"
                opacity="0.7"
              />
              <ellipse
                cx="330"
                cy="80"
                rx="50"
                ry="18"
                fill="white"
                opacity="0.7"
              />
              <ellipse
                cx="315"
                cy="70"
                rx="40"
                ry="15"
                fill="white"
                opacity="0.7"
              />

              <ellipse
                cx="600"
                cy="120"
                rx="70"
                ry="22"
                fill="white"
                opacity="0.6"
              />
              <ellipse
                cx="635"
                cy="120"
                rx="55"
                ry="20"
                fill="white"
                opacity="0.6"
              />
              <ellipse
                cx="618"
                cy="108"
                rx="45"
                ry="16"
                fill="white"
                opacity="0.6"
              />

              {/* Ocean */}
              <rect y="250" width="800" height="150" fill="url(#oceanGrad)" />

              {/* Waves */}
              <path
                d="M 0 280 Q 100 270, 200 280 T 400 280 T 600 280 T 800 280 L 800 400 L 0 400 Z"
                fill="#06b6d4"
                opacity="0.4"
              >
                <animate
                  attributeName="d"
                  values="M 0 280 Q 100 270, 200 280 T 400 280 T 600 280 T 800 280 L 800 400 L 0 400 Z;
                        M 0 280 Q 100 290, 200 280 T 400 280 T 600 280 T 800 280 L 800 400 L 0 400 Z;
                        M 0 280 Q 100 270, 200 280 T 400 280 T 600 280 T 800 280 L 800 400 L 0 400 Z"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>

              <path
                d="M 0 300 Q 100 290, 200 300 T 400 300 T 600 300 T 800 300 L 800 400 L 0 400 Z"
                fill="#0891b2"
                opacity="0.3"
              >
                <animate
                  attributeName="d"
                  values="M 0 300 Q 100 290, 200 300 T 400 300 T 600 300 T 800 300 L 800 400 L 0 400 Z;
                        M 0 300 Q 100 310, 200 300 T 400 300 T 600 300 T 800 300 L 800 400 L 0 400 Z;
                        M 0 300 Q 100 290, 200 300 T 400 300 T 600 300 T 800 300 L 800 400 L 0 400 Z"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Diving Mask - Centered */}
              <g transform="translate(350, 180)">
                {/* Mask Glass */}
                <ellipse
                  cx="50"
                  cy="40"
                  rx="55"
                  ry="45"
                  fill="url(#maskGradient)"
                  opacity="0.9"
                />
                <ellipse
                  cx="50"
                  cy="40"
                  rx="45"
                  ry="35"
                  fill="#60a5fa"
                  opacity="0.5"
                />
                <ellipse
                  cx="50"
                  cy="40"
                  rx="35"
                  ry="25"
                  fill="#38bdf8"
                  opacity="0.3"
                />

                {/* Mask Strap */}
                <rect
                  x="0"
                  y="35"
                  width="100"
                  height="10"
                  rx="5"
                  fill="#1e293b"
                  opacity="0.8"
                />

                {/* Snorkel */}
                <path
                  d="M 110 45 Q 120 40, 125 30 L 125 5 Q 125 0, 120 0 L 115 0 Q 110 0, 110 5 L 110 25"
                  stroke="#ec4899"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="122" cy="3" r="5" fill="#1e293b" />
                <circle cx="122" cy="3" r="3" fill="#60a5fa" opacity="0.6" />
                <ellipse cx="110" cy="45" rx="10" ry="7" fill="#f472b6" />
              </g>
            </svg>
          )}
        </div>

        <div className="msd-hero-overlay">
          <div className="msd-container">
            <div className="msd-hero-content">
              <div className="msd-hero-main">
                <div className="msd-hero-text">
                  <h1 className="msd-hero-title">{serviceData.title}</h1>
                  <div className="msd-hero-rating">
                    <span className="msd-rating-num">
                      ★ {serviceData.rating}
                    </span>
                    <span className="msd-rating-text">
                      ({serviceData.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="msd-container">
        {/* Description */}
        <div className="msd-section">
          <h2 className="msd-section-title">Description</h2>
          <p className="msd-description">{serviceData.description}</p>
        </div>

        {/* Packages */}
        <div className="msd-section">
          <h2 className="msd-section-title">Detail Service</h2>
          <div className="msd-packages">
            {serviceData.packages.map((pkg, idx) => (
              <div key={pkg.id} className="msd-package-card">
                <div className="msd-package-image">
                  {pkg.imageUrl ? (
                    <LazyImage
                      src={imageSrc(pkg.imageUrl)}
                      alt={pkg.name}
                      className="msd-package-real-image"
                    />
                  ) : (
                    <>
                      <div className="msd-img-sky">
                        <div className="msd-cloud msd-cloud-1"></div>
                        <div className="msd-cloud msd-cloud-2"></div>
                      </div>
                      <div className="msd-img-hills">
                        <div className="msd-hill msd-hill-1"></div>
                        <div className="msd-hill msd-hill-2"></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="msd-package-content">
                  <div className="msd-package-header">
                    <div className="msd-package-number">{idx + 1}.</div>
                    <h3 className="msd-package-name">{pkg.name}</h3>
                  </div>
                  <p className="msd-package-desc">{pkg.description}</p>
                  <div className="msd-package-meta">
                    <div className="msd-package-price">
                      {formatUSD(pkg.price)}
                    </div>
                    <div className="msd-package-duration">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {pkg.duration}
                    </div>
                  </div>
                  <ul className="msd-package-features">
                    {pkg.features.map((feature, index) => (
                      <li key={index}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="msd-section">
          <h2 className="msd-section-title">Value Proposition</h2>
          <div className="msd-value-props">
            {serviceData.valueProps.map((prop, idx) => (
              <div key={idx} className="msd-value-card">
                <div className="msd-value-image">
                  {prop.imageUrl ? (
                    <LazyImage
                      src={imageSrc(prop.imageUrl)}
                      alt={prop.title}
                      className="msd-value-real-image"
                    />
                  ) : (
                    <>
                      <div className="msd-img-sky">
                        <div className="msd-cloud msd-cloud-1"></div>
                        <div className="msd-cloud msd-cloud-2"></div>
                      </div>
                      <div className="msd-img-hills">
                        <div className="msd-hill msd-hill-1"></div>
                        <div className="msd-hill msd-hill-2"></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="msd-value-content">
                  {prop.icon && (
                    <div className="msd-value-icon">{prop.icon}</div>
                  )}
                  <div className="msd-value-number">{idx + 1}.</div>
                  <h4 className="msd-value-title">{prop.title}</h4>
                  <p className="msd-value-desc">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="msd-section">
          <h2 className="msd-section-title">Testimoni</h2>
          <div className="msd-testimonials">
            {serviceData.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="msd-testimonial-card">
                <div className="msd-testimonial-rating">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="msd-testimonial-text">{testimonial.text}</p>
                <p className="msd-testimonial-name">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Services */}
        <div className="msd-section">
          <h2 className="msd-section-title">You Might Also Like</h2>
          <div className="msd-related-services">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="msd-related-card"
              >
                <div className="msd-related-image">
                  {service.imageUrl ? (
                    <LazyImage
                      src={imageSrc(service.imageUrl)}
                      alt={service.name}
                      className="msd-related-real-image"
                    />
                  ) : (
                    <>
                      <div className="msd-img-sky">
                        <div className="msd-cloud msd-cloud-1"></div>
                        <div className="msd-cloud msd-cloud-2"></div>
                      </div>
                      <div className="msd-img-hills">
                        <div className="msd-hill msd-hill-1"></div>
                        <div className="msd-hill msd-hill-2"></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="msd-related-content">
                  <h3 className="msd-related-name">{service.name}</h3>
                  <p className="msd-related-price">
                    {formatUSD(service.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="msd-cta">
          <h2 className="msd-cta-title">Ready to Start Your Adventure?</h2>
          <p className="msd-cta-desc">Contact us now to book your experience</p>
          <a
            href="https://wa.me/62818520525"
            className="msd-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServicesDetail;
