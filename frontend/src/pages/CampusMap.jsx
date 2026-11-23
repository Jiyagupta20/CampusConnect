import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { 
  MapPin, 
  Building2, 
  BookOpen, 
  Coffee, 
  Trophy, 
  HeartPulse, 
  Car, 
  AlertCircle, 
  Search, 
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';

const campusFacilities = [
  {
    id: 'fac-1',
    name: 'Academic Block A (CS & IT)',
    category: 'Academics',
    x: 220,
    y: 160,
    color: '#3b82f6',
    departments: ['Computer Science & Engg', 'Information Technology', 'AI & Data Science Labs'],
    facilities: ['Smart Classrooms 101-310', 'AI/ML GPU Lab 304', 'Faculty Lounge'],
    hours: '08:00 AM - 08:00 PM',
    description: 'Main academic hub for computing departments, software engineering labs, and lecture halls.'
  },
  {
    id: 'fac-2',
    name: 'Central University Library',
    category: 'Library',
    x: 480,
    y: 150,
    color: '#10b981',
    departments: ['Central Library', 'Digital Resource Center', 'Quiet Study Pods'],
    facilities: ['Over 65,000 volumes', 'High-Speed Wi-Fi Pods', 'Research Reference Wing'],
    hours: 'Open 24/7 during exam weeks',
    description: 'Three-story library facility equipped with RFID automated kiosks and discussion pods.'
  },
  {
    id: 'fac-3',
    name: 'Academic Block B (Electronics & Mech)',
    category: 'Academics',
    x: 220,
    y: 330,
    color: '#3b82f6',
    departments: ['Electronics & Comm', 'Mechanical Engg', 'Robotics Center'],
    facilities: ['Classrooms 101-208', 'Robotics Workshop', 'Plumbing & Water Coolers G-Floor'],
    hours: '08:00 AM - 07:00 PM',
    description: 'Housing microelectronics labs, fabrication workshops, and thermodynamics centers.'
  },
  {
    id: 'fac-4',
    name: 'Central Engineering Labs Block',
    category: 'Academics',
    x: 370,
    y: 280,
    color: '#8b5cf6',
    departments: ['Hardware Lab', 'CAD/CAM Design Studio', 'IoT Sandbox'],
    facilities: ['Lab 201-206', 'High-voltage Test Bench', 'Rapid Prototyping 3D Printers'],
    hours: '09:00 AM - 06:00 PM',
    description: 'Hands-on practical engineering block with modern testing and fabrication apparatus.'
  },
  {
    id: 'fac-5',
    name: 'Main Auditorium & Cultural Center',
    category: 'Events',
    x: 520,
    y: 320,
    color: '#f59e0b',
    departments: ['Cultural Affairs', 'Seminar Halls', 'Incubation Center'],
    facilities: ['1,200 Seating Capacity', 'State-of-the-Art Sound Stage', 'Green Rooms'],
    hours: '09:00 AM - 09:00 PM',
    description: 'Host venue for Technovation Hackathons, university convocation, and national conferences.'
  },
  {
    id: 'fac-6',
    name: 'Student Cafeteria & Food Court',
    category: 'Dining',
    x: 650,
    y: 220,
    color: '#ec4899',
    departments: ['Campus Food Court', 'Bakery & Coffee Pods', 'Student Lounge'],
    facilities: ['Multi-cuisine stalls', 'Outdoor lawn seating', 'Lost & Found Drop Desk'],
    hours: '07:30 AM - 10:30 PM',
    description: 'Central social and culinary dining hub for campus students and faculty.'
  },
  {
    id: 'fac-7',
    name: 'University Sports Complex',
    category: 'Sports',
    x: 680,
    y: 380,
    color: '#06b6d4',
    departments: ['Athletics Dept', 'Gymnasium', 'Indoor Badminton Arena'],
    facilities: ['Cricket Ground', 'Basketball Courts', 'Olympic Swimming Pool'],
    hours: '06:00 AM - 08:30 PM',
    description: 'Outdoor and indoor sports grounds with fitness equipment and changing facilities.'
  },
  {
    id: 'fac-8',
    name: 'Campus Health Center & Clinic',
    category: 'Medical',
    x: 360,
    y: 430,
    color: '#ef4444',
    departments: ['Emergency Clinic', 'Pharmacy', 'Counseling Center'],
    facilities: ['Resident Doctor', '24/7 Ambulance Service', 'First Aid Station'],
    hours: '24/7 Emergency Care',
    description: 'Primary health clinic offering free consultation, first-aid, and mental wellness counseling.'
  },
  {
    id: 'fac-9',
    name: 'Student Hostels & Residential Block',
    category: 'Living',
    x: 150,
    y: 450,
    color: '#14b8a6',
    departments: ['Boys Hostel Blocks A & B', 'Girls Hostel Blocks C & D'],
    facilities: ['Dining Mess', 'High-Speed Wi-Fi', 'Study Lounges'],
    hours: 'Resident biometric access 24/7',
    description: 'Modern campus residential housing with laundry, recreation rooms, and round-the-clock security.'
  }
];

const CampusMap = () => {
  const [selectedFacility, setSelectedFacility] = useState(campusFacilities[0]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [mapMode, setMapMode] = useState('vector'); // 'vector' or 'google'

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchComplaintsForOverlay = async () => {
      try {
        const res = await api.complaints.getAll();
        if (res.success) {
          setActiveComplaints(res.complaints || []);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    fetchComplaintsForOverlay();
  }, []);

  const categories = ['All', 'Academics', 'Library', 'Dining', 'Sports', 'Medical', 'Living'];

  const filteredFacilities = campusFacilities.filter(f => {
    const matchCat = filterCategory === 'All' || f.category === filterCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                        f.departments.some(d => d.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Calculate complaints count for the selected facility
  const facilityComplaints = activeComplaints.filter(c => 
    c.location && selectedFacility && c.location.toLowerCase().includes(selectedFacility.name.split(' ')[0].toLowerCase())
  );

  return (
    <div className="map-page-wrapper">
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Interactive Campus Map & Navigation</h1>
          <p className="welcome-subtitle">
            Explore academic departments, library facilities, sports complex, and view active maintenance tickets by building.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${mapMode === 'vector' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMapMode('vector')}
          >
            <Compass size={15} /> Campus Vector Map
          </button>
          <button
            className={`btn btn-sm ${mapMode === 'google' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMapMode('google')}
          >
            <MapPin size={15} /> Google Satellite Map
          </button>
        </div>
      </div>

      {/* Control and Filter Bar */}
      <div className="map-controls-bar">
        <div className="map-filter-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`map-chip ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search building or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="map-container-layout">
        {/* Left Map View */}
        <div className="map-canvas-card">
          {mapMode === 'google' ? (
            googleMapsKey ? (
              <iframe
                title="Google Maps Campus View"
                width="100%"
                height="500px"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=Stanford+University+Campus,CA`}
              />
            ) : (
              <div style={{ width: '100%', height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <MapPin size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Google Maps Live Mode (Key Configuration)</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', fontSize: '0.9rem', marginBottom: '18px' }}>
                  To enable live satellite view, provide your <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code>. The application automatically falls back to the high-fidelity interactive vector canvas below!
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setMapMode('vector')}>
                  Switch to Interactive Campus Vector Map
                </button>
              </div>
            )
          ) : (
            <div style={{ width: '100%', position: 'relative' }}>
              {/* High-Fidelity SVG Campus Vector Canvas */}
              <svg 
                viewBox="0 0 900 580" 
                className="campus-svg-map"
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)' }}
              >
                {/* Campus Background Ground & Green Lawns */}
                <rect width="900" height="580" fill="var(--bg-secondary)" rx="16" />
                
                {/* Roads and Paths */}
                <path d="M 50 250 L 850 250" stroke="var(--border-color)" strokeWidth="18" fill="none" />
                <path d="M 450 50 L 450 530" stroke="var(--border-color)" strokeWidth="18" fill="none" />
                <circle cx="450" cy="250" r="45" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="8" />

                {/* Central Campus Fountain */}
                <circle cx="450" cy="250" r="18" fill="var(--primary)" opacity="0.3" />
                <circle cx="450" cy="250" r="8" fill="var(--primary)" />
                <text x="450" y="275" fontSize="10" fontWeight="700" textAnchor="middle" fill="var(--text-muted)">
                  Central Plaza
                </text>

                {/* Landscaping / Tree clusters */}
                <circle cx="340" cy="180" r="22" fill="#10b981" opacity="0.15" />
                <circle cx="580" cy="190" r="26" fill="#10b981" opacity="0.15" />
                <circle cx="580" cy="460" r="32" fill="#10b981" opacity="0.15" />

                {/* Render Facilities */}
                {filteredFacilities.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  const compCount = activeComplaints.filter(c => 
                    c.location && c.location.toLowerCase().includes(fac.name.split(' ')[0].toLowerCase())
                  ).length;

                  return (
                    <g 
                      key={fac.id} 
                      className={`building-poly ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedFacility(fac)}
                    >
                      {/* Building footprint box */}
                      <rect
                        x={fac.x - 70}
                        y={fac.y - 45}
                        width="140"
                        height="85"
                        rx="10"
                        fill={isSelected ? 'var(--primary-light)' : 'var(--bg-card)'}
                        stroke={isSelected ? 'var(--primary)' : 'var(--border-color)'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                      />

                      {/* Accent Header line */}
                      <rect
                        x={fac.x - 70}
                        y={fac.y - 45}
                        width="140"
                        height="6"
                        rx="3"
                        fill={fac.color}
                      />

                      {/* Icon & Pin */}
                      <circle cx={fac.x} cy={fac.y - 12} r="14" fill={fac.color} />
                      <text x={fac.x} y={fac.y - 8} fontSize="11" fontWeight="800" textAnchor="middle" fill="#ffffff">
                        📍
                      </text>

                      {/* Building Name */}
                      <text
                        x={fac.x}
                        y={fac.y + 16}
                        fontSize="11"
                        fontWeight="700"
                        textAnchor="middle"
                        fill="var(--text-primary)"
                      >
                        {fac.name.split('(')[0]}
                      </text>

                      <text
                        x={fac.x}
                        y={fac.y + 30}
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        fill="var(--text-muted)"
                      >
                        {fac.category}
                      </text>

                      {/* Active Complaint Badge if any */}
                      {compCount > 0 && (
                        <g>
                          <circle cx={fac.x + 58} cy={fac.y - 36} r="10" fill="var(--status-rejected)" />
                          <text x={fac.x + 58} y={fac.y - 32} fontSize="9" fontWeight="800" textAnchor="middle" fill="#fff">
                            {compCount}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Right Building Details Card */}
        <div className="building-sidebar-card">
          {selectedFacility ? (
            <div>
              <span className="building-badge">{selectedFacility.category}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                {selectedFacility.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '18px', lineHeight: 1.5 }}>
                {selectedFacility.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Departments & Wings
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedFacility.departments.map((d, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--bg-tertiary)', fontSize: '0.75rem' }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Key Facilities Inside
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {selectedFacility.facilities.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', fontSize: '0.8rem' }}>
                  <strong>Operational Hours:</strong> {selectedFacility.hours}
                </div>
              </div>

              {/* Active Complaints in this Building */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <AlertCircle size={15} color="var(--primary)" />
                  Active Tickets in this Building ({facilityComplaints.length})
                </h4>

                {facilityComplaints.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    No open complaints reported for this facility. All systems operational!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {facilityComplaints.map(c => (
                      <div 
                        key={c.id} 
                        style={{ 
                          padding: '8px 12px', 
                          borderRadius: 'var(--radius-sm)', 
                          background: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-color)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          <span>{c.roomNumber || 'Room N/A'}</span>
                          <span style={{ fontWeight: 700, color: 'var(--status-progress)' }}>{c.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              Select a facility pin on the map to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampusMap;

