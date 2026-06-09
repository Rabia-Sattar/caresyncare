// src/data/doctors.js
const doctors = [
{
  id: 1,
  name: "Prof. Dr. Tariq Mahmood Malik",
  specialty: "Cardiologist",
  qualifications: [
    "MBBS",
    "ECFMG",
    "FLEX",
    "Diplomate American Board of Internal Medicine",
    "Diplomate American Board of Cardiovascular Disease",
    "Certification Board of Nuclear Cardiology",
    "FCCP",
    "FACP",
    "FACC"
  ],
  verified: true,
  experienceYears: 39,
  hospital: "Punjab Medical Centre (Jail Road, Lahore)",
  contact: "",            // not publicly listed
  clinics: [
    {
      hospital: "Punjab Medical Centre (Jail Road)",
      address: "5‑ Main Jail Road, Near Khana Farang Iran, Lahore",
      fee: 5000,
      timings: [
        "Monday 03:00 PM - 08:00 PM",
        "Tuesday 03:00 PM - 08:00 PM",
        "Wednesday 03:00 PM - 08:00 PM",
        "Thursday 03:00 PM - 08:00 PM",
        "Friday 03:00 PM - 08:00 PM",
        "Saturday 03:00 PM - 08:00 PM"
      ]
    }
  ],
  consultationModes: {
    inClinic: { 
      fee: 5000, 
      address: "Punjab Medical Centre (Jail Road)", 
      timings: [
        "Mon–Sat: 03:00 PM - 08:00 PM"
      ]
    },
    online: { 
      fee: 3000,          // as per “online video consultation” fee on the site :contentReference[oaicite:2]{index=2} 
      available: true 
    }
  },
  services: [
    "Echocardiography",
    "Angioplasty / Angiography",
    "Stress Test / ETT",
    "Holter Monitoring",
    "Cardiac MRI",
    "Hypertension Specialist",
    "Coronary Artery Disease Management",
    "Valvular Heart Disease Treatment",
    "Heart Disease Diagnosis & Treatment"
    // (You can expand based on “Services” list on site) :contentReference[oaicite:3]{index=3}
  ],
  rating: 4.7,
  reviewsCount: 433,
  image: "https://media.licdn.com/dms/image/v2/C4E03AQEaqWNfueyIug/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1516860354021?e=2147483647&v=beta&t=zR2Vk6em7gsmpoTlEmOWK0SJg3JVDfjMD2OtDuAiEiI"
}
,

  {
  id: 2,
  name: "Dr. M. Akbar Chaudhry",
  specialty: "Cardiologist",
  qualifications: ["MBBS", "MRCP (UK)", "FRCP (London)", "FRCP (Edin.)", "FACC (USA)"],
  verified: true,
  experienceYears: 47,
  hospital: "CardioMed, Allama Iqbal Town, Lahore",
  contact: "04238900939",  // public helpline from profile page :contentReference[oaicite:2]{index=2}
  consultationModes: {
    inClinic: {
      fee: 4000,
      address: "CardioMed, 16‑College Block, Allama Iqbal Town, Lahore",
      timings: ["Mon 07:00 PM‑09:00 PM", "Tue 07:00 PM‑09:00 PM", "Wed 07:00 PM‑09:00 PM", "Thu 07:00 PM‑09:00 PM", "Fri 07:00 PM‑09:00 PM"]
    },
    online: {
      fee: 4000,
      available: true,
      timings: ["Mon 08:30 PM‑09:30 PM", "Tue 08:30 PM‑09:30 PM", "Wed 08:30 PM‑09:30 PM", "Thu 08:30 PM‑09:30 PM", "Fri 08:30 PM‑09:30 PM"]
    }
  },
  services: [
    "Cardiac Patient Management",
    "General Cardiology",
    "Echocardiography (ECHO)",
    "Exercise Tolerance Test (ETT)",
    "Heart Attack Management"
  ],
  rating: 4.8,
  reviewsCount: 301,
  image: "https://lh3.googleusercontent.com/p/AF1QipNRvC2DYM1w4gZl1deyFcISBqPM-53loegz0wLQ=s680-w680-h510-rw"
}
,

  {
  id: 3,
  name: "Dr. Mutiullah",
  specialty: "Cardiologist",
  qualifications: ["M.B.B.S", "F.C.P.S (Cardiology)"],
  verified: true,
  experienceYears: 10,
  hospital: "Iqra Medical Complex, Johar Town, Lahore",
  contact: "",  // not publicly listed on profile
  clinics: [
    {
      hospital: "Iqra Medical Complex, Johar Town",
      address: "24‑26 Maulana Shaukat Ali Rd, Block A, Johar Town, Lahore",
      fee: 2500,
      timings: [
        "Monday 07:00 PM - 09:30 PM",
        "Tuesday 07:00 PM - 09:30 PM",
        "Wednesday 07:00 PM - 09:30 PM",
        "Thursday 07:00 PM - 09:30 PM"
      ]
    },
    {
      hospital: "Anjum Polyclinic & Diagnostic Center (Wapda Town)",  // alternate clinic listed
      address: "",  // address not shown on listing
      fee: 2500,
      timings: [
        "Monday 02:00 PM - 05:30 PM",
        "Tuesday 02:00 PM - 05:30 PM",
        "Thursday 02:00 PM - 05:30 PM",
        "Friday 02:00 PM - 05:30 PM"
      ]
    }
  ],
  consultationModes: {
    inClinic: {
      fee: 2500,
      address: "Iqra Medical Complex, Johar Town, Lahore",
      timings: ["Mon–Thu 07:00 PM‑09:30 PM"]
    },
    online: null
  },
  services: [
    "Chest Pain",
    "Coronary Angiography / Angioplasty",
    "Dizziness",
    "Echocardiography (ECHO)",
    "ETT (Stress Test)",
    "Pacemakers",
    "Palpitations",
    "Shortness of Breath"
  ],
  rating: 4.7,
  reviewsCount: 29,
  image: "https://apdc.pk/wp-content/uploads/2020/10/Matiullah.jpg"  
  // Note: On the listed profile the image path may be similar — ensure you get correct URL
}
,

 {
  id: 4,
  name: "Dr. Tayyab Mohyuddin",
  specialty: "Cardiologist",
  qualifications: ["MBBS", "MD", "FACC", "FSCAI (USA)"],
  verified: true,
  experienceYears: 19,
  hospital: "National Hospital & Medical Centre (DHA, Lahore)",
  contact: "",  // not publicly listed in full
  consultationModes: {
    inClinic: {
      fee: 2500,
      address: "National Hospital & Medical Centre, L‑Block DHA, Lahore",
      timings: [
        "Monday 12:00 PM - 02:00 PM",
        "Monday 06:00 PM - 08:00 PM",
        "Tuesday 12:00 PM - 02:00 PM",
        "Tuesday 06:00 PM - 08:00 PM",
        "Wednesday 12:00 PM - 02:00 PM",
        "Wednesday 06:00 PM - 08:00 PM",
        "Thursday 12:00 PM - 02:00 PM",
        "Thursday 06:00 PM - 08:00 PM",
        "Friday 12:00 PM - 02:00 PM",
        "Friday 06:00 PM - 08:00 PM",
        "Saturday 12:00 PM - 02:00 PM"
      ]
    },
    online: {
      fee: 2500,
      available: true,
      timings: [
        "Monday 12:00 PM - 03:00 PM",
        "Monday 06:00 PM - 09:00 PM",
        "Tuesday 12:00 PM - 03:00 PM",
        "Tuesday 06:00 PM - 09:00 PM",
        "Wednesday 12:00 PM - 03:00 PM",
        "Wednesday 06:00 PM - 09:00 PM",
        "Thursday 12:00 PM - 03:00 PM",
        "Thursday 06:00 PM - 09:00 PM",
        "Friday 12:00 PM - 03:00 PM",
        "Friday 06:00 PM - 09:00 PM",
        "Saturday 12:00 PM - 03:00 PM",
        "Saturday 06:00 PM - 09:00 PM"
      ]
    }
  },
  services: [
    "Interventional Cardiology",
    "Pacemaker",
    "Peripheral Intervention",
    "Vascular Diseases"
  ],
  rating: 4.8,
  reviewsCount: 65,
  image: "https://nhmcstorage.blob.core.windows.net/uploads/doctor-profiles/0dac35f8-a89b-4f41-8d59-5707eb520519_43.jpg" // note: ensure correct image URL from site
}
,

 {
  id: 5,                              // or any ID scheme you use
  name: "Dr. Ahmad Nawaz",
  specialty: "Neurologist",
  qualifications: ["MBBS", "FCPS (Neurology)"],
  verified: true,
  experienceYears: 6,
  rating: 4.6,
  reviewsCount: 88,
  // Clinics / consultation modes
  consultationModes: {
    inClinic: [
      {
        hospital: "Central Park Teaching Hospital",
        address: "31‑Km, Ferozepur Road, Central Park Housing Scheme, Lahore",
        fee: 2000,
        timings: ["Mon 09:00 AM - 02:00 PM", "Tue 09:00 AM - 02:00 PM", "Wed 09:00 AM - 02:00 PM", "Thu 09:00 AM - 02:00 PM", "Fri 09:00 AM - 02:00 PM", "Sat 09:00 AM - 02:00 PM"]
      },
      {
        hospital: "Chughtai Medical Center (Jail Road)",
        address: "10 Jail Road, Adjacent to Ammar Medical Complex, Main Gulberg V, Lahore",
        fee: 2000,
        timings: ["Mon 06:00 PM - 08:00 PM", "Tue 06:00 PM - 08:00 PM", "Wed 06:00 PM - 08:00 PM", "Fri 06:00 PM - 08:00 PM"]
      }
    ],
    online: {
      available: true,
      fee: 2000,
      timings: ["Mon–Sat 09:30 AM - 04:30 PM"]
    }
  },
  services: [
    "ALS Treatment",
    "Epilepsy Treatment",
    "Evoked Potentials",
    "Migraine Treatment",
    "Sciatica",
    "Sleep Studies"
  ],
  image: "https://d1t78adged64l7.cloudfront.net/images/profile-pics/doctors/1750332009-whatsappimage2025-06-10at104352pm-removebg-preview.webp", // or fallback if needed
}
,

  {
  id: 6,  
  name: "Dr. Sana Farooq",
  specialty: "Neurologist",
  qualifications: ["MBBS", "FCPS"],
  verified: true,
  experienceYears: 10,
  rating: 4.9,
  reviewsCount: 1902,
  clinics: [
    {
      hospital: "Fatima Memorial Hospital, Shadman, Lahore",
      address: "Shadman, Lahore",
      fee: 3000,
      timings: [
        "Mon 06:00 PM - 08:00 PM",
        "Tue 06:00 PM - 08:00 PM",
        "Wed 06:00 PM - 08:00 PM",
        "Thu 06:00 PM - 08:00 PM",
        "Fri 06:00 PM - 08:00 PM",
        "Sat 06:00 PM - 08:00 PM"
      ]
    }
  ],
  consultationModes: {
    inClinic: {
      fee: 3000,
      address: "Fatima Memorial Hospital, Shadman, Lahore",
      timings: ["Mon–Sat 06:00 PM - 08:00 PM"]
    },
    online: {
      available: true,
      fee: 3000,
      timings: [
        "Mon 11:00 AM - 01:00 PM",
        "Tue 11:00 AM - 12:00 PM",
        "Tue 09:00 PM - 10:00 PM",
        "Wed 09:00 PM - 10:00 PM",
        "Thu 09:00 PM - 10:00 PM",
        "Fri 09:00 PM - 10:00 PM",
        "Sun 06:00 PM - 08:00 PM"
      ]
    }
  },
  services: [
    "Epilepsy Treatment",
    "Headache / Migraine Treatment",
    "Muscle Pain",
    "Neuromuscular Disorder",
    "Sciatica",
    "Stroke",
    "Tremor Analysis"
  ],
  image: "https://ipro.blob.core.windows.net/sf20231102013148/SF20231102013148.jpg"
}
,

  {
  id: 7,
  name: "Assoc. Prof. Dr. Shahid Mukhtar",
  specialty: "Neurologist",
  qualifications: ["M.B.B.S.", "F.C.P.S. (Neurology)"],
  verified: true,
  experienceYears: 15,
  rating: 4.8,
  reviewsCount: 3761,
  clinics: [
    {
      hospital: "Farooq Hospital (Allama Iqbal Town)",
      address: "Asif Block, Allama Iqbal Town, Lahore",
      fee: 2500,
      timings: [
        "Monday 08:30 PM - 10:30 PM",
        "Tuesday 08:30 PM - 10:30 PM",
        "Wednesday 08:30 PM - 10:30 PM",
        "Thursday 08:30 PM - 10:30 PM",
        "Friday 08:30 PM - 10:30 PM"
      ]
    },
    {
      hospital: "Farooq Hospital (DHA)",
      address: "Avenue Mall, Main Ghazi Road, DHA, Lahore",
      fee: 3000,
      timings: [
        "Monday 04:00 PM - 06:00 PM",
        "Tuesday 04:00 PM - 06:00 PM",
        "Wednesday 04:00 PM - 06:00 PM",
        "Thursday 04:00 PM - 06:00 PM",
        "Friday 04:00 PM - 06:00 PM"
      ]
    },
    {
      hospital: "Sadiq Hospital (Sargodha)",  // note: different city
      address: "Main Satellite Town Road, Satellite Town, Sargodha",
      fee: 2000,
      timings: [
        "Saturday 08:00 PM - 10:00 PM",
        "Sunday 08:00 PM - 10:00 PM"
      ]
    }
  ],
  services: [
    "ALS Treatment",
    "Electroencephalography (EEG)",
    "Epilepsy Treatment",
    "Migraine Treatment",
    "Tremor Analysis"
  ],
  contact: "04238900939",
  image: "data:image/jpeg;base64,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",  // use actual image URL from profile
}
,

  {
  id: 8,
  name: "Dr. Waqas Arshad",
  specialty: "Neurologist",
  qualifications: ["MBBS (K.E)", "FCPS (Neurology)", "Certified in Movement Disorder & EEG (USA)"],
  verified: true,
  experienceYears: 11,
  rating: 4.9,
  reviewsCount: 8665,
  consultationModes: {
    inClinic: [
      {
        hospital: "Central Park Teaching Hospital, Lahore",
        fee: 2000,
        address: "Ferozepur Road, Lahore",
        timings: ["Mon–Sun: 02:00 PM‑04:00 PM", "Mon–Sun: 08:00 PM‑11:00 PM"]
      },
      {
        hospital: "Chughtai Medical Center (Jail Road), Lahore",
        fee: 3000,
        address: "Jail Road, Lahore",
        // exact timings vary / not always displayed
        timings: ["Check hospital schedule"]
      }
    ],
    online: {
      available: true,
      fee: 4000,
      timings: ["Mon‑Sat: 02:00 PM‑04:00 PM", "Mon‑Sat: 08:00 PM‑11:00 PM", "Saturday‑Sunday: 02:00 PM‑10:00 PM"]
    }
  },
  services: [
    "Backache",
    "CVA",
    "Dementia",
    "Epilepsy",
    "Headache",
    "Migraine Treatment",
    "Movement Disorders",
    "Muscle Disorders",
    "NCS/EMG",
    "Neck Pain",
    "Nerve Disorder",
    "Neuromuscular Disorders",
    "Neuropathy",
    "Radiculopathy",
    "Stroke"
  ],
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy1HuYa83022O4t3DyySS4TmfXB3ky5ZjTLw&s"  // (Note: ensure correct image URL from profile page)
}
,
{
    id: 9,
    name: "Dr. Kamran Shafiq",
    specialty: "Hepatologist, Gastroenterologist",
    qualifications: ["MBBS", "FRCP", "MRCP", "CCST"],
    verified: true,
    experienceYears: 25,
    clinics: [
      {
        hospital: "Chughtai Medical Center (Lalik Chowk - DHA, Lahore)",
        address: "Lalik Chowk, Plaza #09, CCA Sector, T‑Phase II, DHA, Lahore",
        fee: 4000,
        timings: ["Tue 04:00 PM - 06:00 PM", "Thu 04:00 PM - 06:00 PM", "Fri 04:00 PM - 06:00 PM"]
      },
      {
        hospital: "National Hospital & Medical Centre (DHA, Lahore)",
        address: "L‑Block, Near Sports Stadium, DHA, Lahore",
        fee: 3500,
        timings: ["Mon–Sat 10:00 AM - 12:30 PM"]
      }
    ],
    consultationModes: {
      inClinic: true,
      online: false
    },
    rating: 5.0,
    reviewsCount: 31,
    image: "https://media.licdn.com/dms/image/v2/C5603AQF626E5hvhjSQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1532511067732?e=2147483647&v=beta&t=ODVzYzGVLL62bJrQ3NX6M0mf-ep9kgdnrys21C1MDhg" // you may need to fetch actual image URL from profile page :contentReference[oaicite:0]{index=0}
  },

  {
    id: 10,
    name: "Prof. Dr. Talat Naheed",
    specialty: "Hepatologist, Gastroenterologist, Physician",
    qualifications: ["MBBS", "MCPS", "M.D. (I.M)", "F.R.C.P. (London)", "F.R.C.P. (Edin.)", "F.C.C.P. (USA)"],
    verified: true,
    experienceYears: 40,
    clinics: [
      {
        hospital: "CardioMed (Allama Iqbal Town, Lahore)",
        address: "CardioMed, Allama Iqbal Town, Lahore",
        fee: 4000,
        timings: ["Mon–Sat 07:30 PM - 09:30 PM"]
      }
    ],
    consultationModes: {
      inClinic: true,
      online: true  // site lists video consultation option :contentReference[oaicite:1]{index=1}
    },
    rating: 4.8,
    reviewsCount: 1245,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Bp0hrUrW44UwMBbcLdq8zC8Tb8xkLrs8AQ&s" // need actual image URL from profile page
  },
 ];

export default doctors;
//rabiaabdulsattar99@gmail.com
//amannadeemcentral766@gmail.com