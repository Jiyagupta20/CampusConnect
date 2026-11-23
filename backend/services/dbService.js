import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db as firestoreDb, isFirebaseConnected } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/db.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Initial realistic seed data
const initialSeedData = {
  users: [
    {
      id: "usr_admin_001",
      uid: "usr_admin_001",
      fullName: "Dr. Arvind Sharma",
      email: "admin@campusconnect.edu",
      role: "admin",
      department: "Administration",
      studentId: "FAC-901",
      createdAt: "2026-09-01T09:00:00.000Z"
    },
    {
      id: "usr_stu_001",
      uid: "usr_stu_001",
      fullName: "Aarav Patel",
      email: "aarav.patel@campusconnect.edu",
      role: "student",
      department: "Computer Science & Engineering",
      studentId: "CSE-2023-042",
      yearSemester: "3rd Year / 6th Sem",
      phone: "+91 98765 43210",
      createdAt: "2026-09-10T11:20:00.000Z"
    },
    {
      id: "usr_stu_002",
      uid: "usr_stu_002",
      fullName: "Priya Sundaram",
      email: "priya.sundaram@campusconnect.edu",
      role: "student",
      department: "Information Technology",
      studentId: "IT-2024-019",
      yearSemester: "2nd Year / 4th Sem",
      phone: "+91 98123 45678",
      createdAt: "2026-09-12T14:15:00.000Z"
    },
    {
      id: "usr_stu_003",
      uid: "usr_stu_003",
      fullName: "Rohan Deshmukh",
      email: "rohan.d@campusconnect.edu",
      role: "student",
      department: "Electronics & Communication",
      studentId: "ECE-2023-088",
      yearSemester: "3rd Year / 6th Sem",
      phone: "+91 97654 32109",
      createdAt: "2026-09-15T10:00:00.000Z"
    }
  ],
  complaints: [
    {
      id: "CMP-2026-1001",
      studentId: "usr_stu_001",
      studentName: "Aarav Patel",
      studentEmail: "aarav.patel@campusconnect.edu",
      studentRoll: "CSE-2023-042",
      department: "Computer Science & Engineering",
      title: "Projector flickering in Lab 304",
      category: "Laboratory Issues",
      description: "The ceiling projector in Lab 304 (CS Block) constantly flickers and loses HDMI connection during AI/ML lectures.",
      location: "Academic Block A",
      roomNumber: "Lab 304",
      priority: "High",
      status: "In Progress",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-11-18T10:30:00.000Z",
      updatedAt: "2026-11-20T14:20:00.000Z",
      adminRemarks: "Hardware technician dispatched. HDMI cable and power module under inspection.",
      timeline: [
        { status: "Submitted", timestamp: "2026-11-18T10:30:00.000Z", note: "Complaint logged by student." },
        { status: "Under Review", timestamp: "2026-11-19T09:15:00.000Z", note: "Assigned to Audio-Visual Department." },
        { status: "In Progress", timestamp: "2026-11-20T14:20:00.000Z", note: "Technician assigned for replacement parts." }
      ]
    },
    {
      id: "CMP-2026-1002",
      studentId: "usr_stu_001",
      studentName: "Aarav Patel",
      studentEmail: "aarav.patel@campusconnect.edu",
      studentRoll: "CSE-2023-042",
      department: "Computer Science & Engineering",
      title: "Wi-Fi Access Point unreachable on 2nd Floor",
      category: "Internet / Wi-Fi",
      description: "Students cannot connect to 'Campus_5G_Student' Wi-Fi near the 2nd floor study pods in Central Library.",
      location: "Central Library",
      roomNumber: "2nd Floor Study Wing",
      priority: "Medium",
      status: "Under Review",
      imageUrl: "",
      createdAt: "2026-11-21T11:45:00.000Z",
      updatedAt: "2026-11-22T09:00:00.000Z",
      adminRemarks: "IT network team checking router subnet DNS configuration.",
      timeline: [
        { status: "Submitted", timestamp: "2026-11-21T11:45:00.000Z", note: "Complaint logged by student." },
        { status: "Under Review", timestamp: "2026-11-22T09:00:00.000Z", note: "Forwarded to Network Admin team." }
      ]
    },
    {
      id: "CMP-2026-1003",
      studentId: "usr_stu_002",
      studentName: "Priya Sundaram",
      studentEmail: "priya.sundaram@campusconnect.edu",
      studentRoll: "IT-2024-019",
      department: "Information Technology",
      title: "Water Cooler leaking in Block B Ground Floor",
      category: "Water Supply",
      description: "Continuous water pooling near water cooler next to Classroom 102. Risk of slipping.",
      location: "Academic Block B",
      roomNumber: "Corridor G-102",
      priority: "Urgent",
      status: "Resolved",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-11-15T08:20:00.000Z",
      updatedAt: "2026-11-16T16:00:00.000Z",
      adminRemarks: "Plumbing washer replaced and drainage cleared. No further leakage observed.",
      timeline: [
        { status: "Submitted", timestamp: "2026-11-15T08:20:00.000Z", note: "Complaint logged by student." },
        { status: "In Progress", timestamp: "2026-11-15T11:00:00.000Z", note: "Plumber team mobilized." },
        { status: "Resolved", timestamp: "2026-11-16T16:00:00.000Z", note: "Pipe seal repaired and verified dry." }
      ]
    },
    {
      id: "CMP-2026-1004",
      studentId: "usr_stu_003",
      studentName: "Rohan Deshmukh",
      studentEmail: "rohan.d@campusconnect.edu",
      studentRoll: "ECE-2023-088",
      department: "Electronics & Communication",
      title: "Broken armchairs in Lecture Hall 2",
      category: "Furniture Damage",
      description: "Three chairs in row 4 have snapped wooden arm rests with exposed screws.",
      location: "Academic Block C",
      roomNumber: "LH-02",
      priority: "Low",
      status: "Submitted",
      imageUrl: "",
      createdAt: "2026-11-23T09:10:00.000Z",
      updatedAt: "2026-11-23T09:10:00.000Z",
      adminRemarks: "",
      timeline: [
        { status: "Submitted", timestamp: "2026-11-23T09:10:00.000Z", note: "Complaint logged by student." }
      ]
    },
    {
      id: "CMP-2026-1005",
      studentId: "usr_stu_002",
      studentName: "Priya Sundaram",
      studentEmail: "priya.sundaram@campusconnect.edu",
      studentRoll: "IT-2024-019",
      department: "Information Technology",
      title: "Fluorescent tube flickering repeatedly in Seminar Hall",
      category: "Electricity Problems",
      description: "Main seminar hall row 2 lights buzz loudly and flicker constantly during presentations.",
      location: "Main Auditorium Block",
      roomNumber: "Seminar Room 1",
      priority: "Medium",
      status: "Resolved",
      imageUrl: "",
      createdAt: "2026-11-10T12:00:00.000Z",
      updatedAt: "2026-11-12T15:30:00.000Z",
      adminRemarks: "Ballast and LED driver tube replaced.",
      timeline: [
        { status: "Submitted", timestamp: "2026-11-10T12:00:00.000Z", note: "Complaint logged." },
        { status: "In Progress", timestamp: "2026-11-11T10:00:00.000Z", note: "Electrical maintenance team assigned." },
        { status: "Resolved", timestamp: "2026-11-12T15:30:00.000Z", note: "Light fixture repaired." }
      ]
    }
  ],
  announcements: [
    {
      id: "ANN-2026-001",
      title: "Mid-Semester Examination Schedule & Seating Allotment Released",
      content: "The mid-semester examinations for all B.Tech and M.Tech departments will commence from December 8, 2026. Hall tickets can be downloaded from the academic portal. Strict adherence to exam guidelines is mandatory.",
      category: "Academic",
      priority: "Urgent",
      isImportant: true,
      publishedBy: "Dean of Academic Affairs",
      createdAt: "2026-11-22T08:00:00.000Z"
    },
    {
      id: "ANN-2026-002",
      title: "Campus Wi-Fi Infrastructure Upgrade Maintenance Window",
      content: "Core networking switches will undergo firmware upgrades this Saturday between 11:00 PM and 04:00 AM. Internet access across residential hostels and academic blocks will experience intermittent disruption.",
      category: "Facility",
      priority: "Normal",
      isImportant: false,
      publishedBy: "IT Services Center",
      createdAt: "2026-11-20T10:30:00.000Z"
    },
    {
      id: "ANN-2026-003",
      title: "Annual Technovation Hackathon 2026 Registrations Open",
      content: "Calling all innovators! Registrations are now live for the 36-hour National Hackathon 'Technovation 2026'. Cash prizes worth INR 3,00,000, industry mentorship, and incubation grants await the top teams.",
      category: "Events",
      priority: "Important",
      isImportant: true,
      publishedBy: "Innovation & Incubation Cell",
      createdAt: "2026-11-19T14:00:00.000Z"
    },
    {
      id: "ANN-2026-004",
      title: "Library Operating Hours Extended for Exam Preparation",
      content: "Starting next Monday, the Central Library reading halls will remain open 24x7 with overnight cafeteria services. Please maintain silence and carry your college RFID ID card.",
      category: "General",
      priority: "Normal",
      isImportant: false,
      publishedBy: "Chief Librarian",
      createdAt: "2026-11-16T11:15:00.000Z"
    }
  ],
  events: [
    {
      id: "EVT-2026-001",
      name: "Technovation Hackathon 2026",
      description: "A 36-hour national hackathon focused on Smart Cities, AI in Healthcare, and Sustainability. Featuring keynote speakers from Google and DeepMind.",
      eventDate: "2026-12-12",
      eventTime: "09:00 AM - 09:00 PM",
      venue: "Main Campus Auditorium & Tech Hub",
      category: "Hackathon",
      registrationLink: "https://technovation.campusconnect.edu/register",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      attendeesCount: 248,
      createdAt: "2026-11-15T09:00:00.000Z"
    },
    {
      id: "EVT-2026-002",
      name: "Industry Expert Talk: The Future of Agentic AI",
      description: "Interactive session exploring generative multi-agent systems, autonomous workflows, and career paths in cutting-edge AI research.",
      eventDate: "2026-12-05",
      eventTime: "03:30 PM - 05:30 PM",
      venue: "Seminar Hall 1, Academic Block A",
      category: "Workshop",
      registrationLink: "https://campusconnect.edu/events/ai-talk",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      attendeesCount: 115,
      createdAt: "2026-11-18T10:00:00.000Z"
    },
    {
      id: "EVT-2026-003",
      name: "Inter-College Sports Tournament 2026",
      description: "Annual university athletics meet featuring Cricket, Football, Badminton, and Basketball championships between regional engineering colleges.",
      eventDate: "2026-12-18",
      eventTime: "08:00 AM - 06:00 PM",
      venue: "University Sports Complex & Ground",
      category: "Sports",
      registrationLink: "https://campusconnect.edu/sports/register",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
      attendeesCount: 380,
      createdAt: "2026-11-14T12:00:00.000Z"
    }
  ],
  lostFound: [
    {
      id: "LF-2026-001",
      type: "lost",
      itemName: "Silver Dell XPS 15 Laptop Charger (Type-C)",
      category: "Electronics",
      description: "Left near desk 14 on 2nd floor silent study room. Has a small blue sticker on the power brick.",
      location: "Central Library, 2nd Floor",
      reportedBy: "usr_stu_001",
      reportedByName: "Aarav Patel",
      contactInfo: "aarav.patel@campusconnect.edu / +91 98765 43210",
      status: "open",
      imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-11-22T14:30:00.000Z"
    },
    {
      id: "LF-2026-002",
      type: "found",
      itemName: "Blue Leather Fastrack Wallet",
      category: "Personal Items",
      description: "Found on the bench outside Cafeteria. Contains a college ID card for IT dept and metro transit card.",
      location: "Main Cafeteria Lawn",
      reportedBy: "usr_stu_002",
      reportedByName: "Priya Sundaram",
      contactInfo: "Submitted to Admin Security Desk (Room 101)",
      status: "open",
      imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-11-21T16:00:00.000Z"
    },
    {
      id: "LF-2026-003",
      type: "found",
      itemName: "Casio Scientific Calculator FX-991EX",
      category: "Stationery",
      description: "Found under seat 32 in LH-01 after Calculus test.",
      location: "Academic Block B, Lecture Hall 1",
      reportedBy: "usr_stu_003",
      reportedByName: "Rohan Deshmukh",
      contactInfo: "Handed over to Dept Coordinator",
      status: "claimed",
      imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-11-19T13:20:00.000Z"
    }
  ],
  notifications: [
    {
      id: "NOTIF-001",
      userId: "usr_stu_001",
      title: "Technician Dispatched",
      message: "Your complaint CMP-2026-1001 ('Projector flickering in Lab 304') status updated to 'In Progress'.",
      type: "complaint",
      link: "/student/complaints",
      read: false,
      createdAt: "2026-11-20T14:20:00.000Z"
    },
    {
      id: "NOTIF-002",
      userId: "usr_stu_001",
      title: "Urgent Announcement",
      message: "Mid-Semester Examination Schedule & Seating Allotment Released.",
      type: "announcement",
      link: "/student/announcements",
      read: false,
      createdAt: "2026-11-22T08:00:00.000Z"
    },
    {
      id: "NOTIF-003",
      userId: "usr_admin_001",
      title: "New Urgent Complaint Logged",
      message: "Aarav Patel reported high-priority issue in Academic Block A.",
      type: "admin_alert",
      link: "/admin/complaints",
      read: true,
      createdAt: "2026-11-18T10:30:00.000Z"
    }
  ],
  activityLogs: [
    {
      id: "LOG-001",
      action: "STATUS_UPDATE",
      performedBy: "Dr. Arvind Sharma (Admin)",
      target: "Complaint CMP-2026-1001",
      details: "Changed status from 'Under Review' to 'In Progress'. Added technician notes.",
      timestamp: "2026-11-20T14:20:00.000Z"
    },
    {
      id: "LOG-002",
      action: "ANNOUNCEMENT_PUBLISHED",
      performedBy: "Dean of Academic Affairs",
      target: "Mid-Semester Examination Schedule",
      details: "Priority set to Urgent with campus-wide notification flag.",
      timestamp: "2026-11-22T08:00:00.000Z"
    },
    {
      id: "LOG-003",
      action: "COMPLAINT_RESOLVED",
      performedBy: "Dr. Arvind Sharma (Admin)",
      target: "Complaint CMP-2026-1003",
      details: "Water Cooler pipe repaired in Block B corridor.",
      timestamp: "2026-11-16T16:00:00.000Z"
    }
  ]
};

// In-memory / file cache
let memoryDb = null;

function loadDb() {
  if (memoryDb) return memoryDb;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      memoryDb = JSON.parse(data);
    } else {
      memoryDb = initialSeedData;
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeedData, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error loading db.json, falling back to initial data:', err.message);
    memoryDb = initialSeedData;
  }
  return memoryDb;
}

function saveDb() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write db.json:', err.message);
  }
}

// Universal database service interface
export const dbService = {
  // Check if live firestore is active
  isLiveFirestore() {
    return isFirebaseConnected && firestoreDb !== null;
  },

  // GET ALL documents from collection
  async getAll(collectionName, queryFn = null) {
    if (this.isLiveFirestore()) {
      try {
        let ref = firestoreDb.collection(collectionName);
        if (queryFn) {
          ref = queryFn(ref);
        }
        const snapshot = await ref.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn(`Firestore getAll failed for ${collectionName}, falling back:`, e.message);
      }
    }
    const store = loadDb();
    let items = store[collectionName] || [];
    return [...items];
  },

  // GET SINGLE document by ID
  async getById(collectionName, id) {
    if (this.isLiveFirestore()) {
      try {
        const doc = await firestoreDb.collection(collectionName).doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
      } catch (e) {
        console.warn(`Firestore getById failed for ${collectionName}/${id}:`, e.message);
      }
    }
    const store = loadDb();
    const items = store[collectionName] || [];
    return items.find(item => item.id === id || item.uid === id) || null;
  },

  // CREATE document
  async create(collectionName, data) {
    if (this.isLiveFirestore()) {
      try {
        const docRef = data.id 
          ? firestoreDb.collection(collectionName).doc(data.id)
          : firestoreDb.collection(collectionName).doc();
        const finalData = { ...data, id: docRef.id };
        await docRef.set(finalData);
        return finalData;
      } catch (e) {
        console.warn(`Firestore create failed for ${collectionName}:`, e.message);
      }
    }
    const store = loadDb();
    if (!store[collectionName]) store[collectionName] = [];
    const id = data.id || `${collectionName.slice(0, 3).toUpperCase()}-${Date.now()}`;
    const newDoc = { ...data, id };
    store[collectionName].unshift(newDoc);
    saveDb();
    return newDoc;
  },

  // UPDATE document
  async update(collectionName, id, updates) {
    if (this.isLiveFirestore()) {
      try {
        await firestoreDb.collection(collectionName).doc(id).update(updates);
        const updated = await this.getById(collectionName, id);
        return updated;
      } catch (e) {
        console.warn(`Firestore update failed for ${collectionName}/${id}:`, e.message);
      }
    }
    const store = loadDb();
    const items = store[collectionName] || [];
    const index = items.findIndex(item => item.id === id || item.uid === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      saveDb();
      return items[index];
    }
    return null;
  },

  // DELETE document
  async delete(collectionName, id) {
    if (this.isLiveFirestore()) {
      try {
        await firestoreDb.collection(collectionName).doc(id).delete();
        return true;
      } catch (e) {
        console.warn(`Firestore delete failed for ${collectionName}/${id}:`, e.message);
      }
    }
    const store = loadDb();
    if (!store[collectionName]) return false;
    const initialLen = store[collectionName].length;
    store[collectionName] = store[collectionName].filter(item => item.id !== id && item.uid !== id);
    saveDb();
    return store[collectionName].length < initialLen;
  },

  // Log activity
  async logActivity(action, performedBy, target, details) {
    const log = {
      id: `LOG-${Date.now()}`,
      action,
      performedBy,
      target,
      details,
      timestamp: new Date().toISOString()
    };
    await this.create('activityLogs', log);
    return log;
  },

  // Send notification
  async createNotification(userId, title, message, type = 'general', link = '') {
    const notif = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    await this.create('notifications', notif);
    return notif;
  }
};

