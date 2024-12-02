import React from 'react';

const hotels = [
  {
    name: 'Best Western Hotel Arabellapark München',
    description:
      'We are pleased to offer reserved rooms for your stay from 20.07.2025 to 22.07.2025. The rate is EUR 100.00 per double room for single use per night, excluding breakfast. Rooms can be booked using the code XXX until 20.06.2025. Cancellations are free until 30.06.2025. After this date, cancellations will incur a charge of 90% of the reservation cost, and non-arrivals will be charged 100%',
    distance: '2 min walk',
    amenities: ['Restaurant'],
    imageUrl: 'https://hotel-arabellapark.de/wp-content/uploads/2021/09/bw-muc-7-scaled.jpg',
    websiteUrl: 'https://hotel-arabellapark.de/',
  },
  {
    name: 'Four Points by Sheraton Munich Arabellapark',
    amenities: ['Fitnessraum', 'WLAN', 'Frühstück'],
    websiteUrl: 'https://www.marriott.com/en-us/hotels/mucwi-the-westin-grand-munich/overview/',
  },
  {
    name: 'The Westin Grand Munich',
    websiteUrl:
      'https://www.marriott.com/en-us/hotels/mucap-four-points-munich-arabellapark/overview/',
  },
];

export default function HotelList() {
  const [highlightedHotel, ...otherHotels] = hotels;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        Nearby hotels
      </h1>

      {/* Highlighted Hotel */}
      <div
        style={{
          marginBottom: '32px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={highlightedHotel.imageUrl}
          alt={highlightedHotel.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            {highlightedHotel.name}
          </h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.6' }}>
            We are pleased to offer reserved rooms for your stay from{' '}
            <strong>20.07.2025 to 22.07.2025</strong>. The rate is <strong>EUR 100.00</strong> per
            double room for single use per night, excluding breakfast.
          </p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.6' }}>
            Rooms can be booked using the code <strong>XXX</strong> until{' '}
            <strong>20.06.2025</strong>. Cancellations are free until <strong>30.06.2025</strong>.
            After this date, cancellations will incur a charge of <strong>90%</strong> of the
            reservation cost, and non-arrivals will be charged <strong>100%</strong>.
          </p>
          <p style={{ fontSize: '14px', color: '#777' }}>
            📍 {highlightedHotel.distance}
            {highlightedHotel.amenities.map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '12px',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  marginLeft: '1rem',
                }}
              >
                {amenity}
              </span>
            ))}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <a
              href="mailto:info@hotel-arabellapark.de"
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#004257',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
                minWidth: '22vw',
              }}
            >
              Booking
            </a>
          </div>
        </div>
      </div>

      {/* Other Hotels */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          More hotels nearby
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {otherHotels.map((hotel, index) => (
            <li
              key={index}
              style={{
                marginBottom: '16px',
                padding: '8px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                {hotel.name}
              </h4>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>
                {hotel.description}
              </p>
              <p style={{ fontSize: '14px', color: '#777', marginBottom: '8px' }} />
              <a
                href="mailto:info@hotel-arabellapark.de"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#004257',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
