import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import "./Services.css";

// Helper function untuk image URL
function imageSrc(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = BASE_URL?.replace(/\/+$/, "") || "";
  const path = String(url).startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

const Services = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services?status=active");
        setServices(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
        setServices([]);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className={`ms-services ${isLoading ? "ms-loading" : ""}`}>
      <div className="ms-container">
        {/* Hero */}
        <div className="ms-hero">
          <h1 className="ms-hero-title">MALAYA SERVICES</h1>
          <p className="ms-hero-desc">Choose your perfect ocean adventure</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="ms-error">
            <p>Unable to load services. Please try again later.</p>
          </div>
        )}

        {/* Services Grid */}
        {!error && services.length > 0 && (
          <div className="ms-grid">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="ms-card"
              >
                <div className="ms-card-bg">
                  {service.imageUrl ? (
                    <img
                      src={imageSrc(service.imageUrl)}
                      alt={service.name}
                      className="ms-card-image"
                    />
                  ) : (
                    <>
                      <div className="ms-bg-sky">
                        <div className="ms-bg-cloud ms-bg-cloud-1"></div>
                        <div className="ms-bg-cloud ms-bg-cloud-2"></div>
                        <div className="ms-bg-sun"></div>
                      </div>
                      <div className="ms-bg-ocean">
                        <div className="ms-bg-wave ms-bg-wave-1"></div>
                        <div className="ms-bg-wave ms-bg-wave-2"></div>
                        <div className="ms-bg-wave ms-bg-wave-3"></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="ms-card-content">
                  <h3 className="ms-card-title">{service.name}</h3>
                  <p className="ms-card-desc">{service.description}</p>
                  <div className="ms-card-price">{service.price}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Services */}
        {!error && !isLoading && services.length === 0 && (
          <div className="ms-empty">
            <p>No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
