// src/data/pharmacies.js
import DawaaiLogo from "../assets/dawaailogo.png";
import TownPharmacy from "../assets/townpharmacy.webp";
import DwatsonLogo from "../assets/dwatsonlogo.png";
import SehatLogo from "../assets/sehattmlogo.png";
import DwagoLogo from "../assets/Dwagologo.jpg";
import HealthWireLogo from "../assets/healthwirelogo.png";
import ServaidLogo from "../assets/servaidlogo.png"
import ClinixLogo from "../assets/clinixlogo.png";


const pharmacies = [
{
  id: 1,
  name: "Clinix Pharmacy",
  category: "Retail Pharmacy",
  contact: "042 111 254 649",
  website: "https://clinix.com.pk/",
  image: ClinixLogo,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "EasyPaisa", "JazzCash"],
  services: ["Prescription Medicines", "OTC Medicines", "Health Supplements", "Lab Tests"],
  rating: 4.4,
  reviews: 150,
  highlights: ["Online Pharmacy", "Home Delivery", "24/7 Service (selected branches)"],
  timings: "24/7",
},
{
  id: 2,
  name: "Servaid Pharmacy",
  category: "Retail Pharmacy",
  contact: "042 111 123 123",
  website: "https://www.servaid.com.pk/",
  image: ServaidLogo,
  delivery: true,
  paymentMethods: ["Cash", "Debit Card", "Credit Card", "JazzCash", "EasyPaisa"],
  services: ["Medicines", "OTC", "Health Products", "Personal Care"],
  rating: 4.2,
  reviews: 1200,
  highlights: ["Authentic Medicines", "Nationwide Chain", "Online Delivery"],
   timings: "24/7",
},
{
  id: 3,
  name: "National Pharmacy",
  category: "Retail Pharmacy",
  contact: "+92 300 4401122",
  website: "https://nationalpharmacy.pk/",
  image: "https://nationalpharmacy.pk/wp-content/uploads/2025/08/National-Pharmacy-Logo-png.png",
  delivery: true,
  paymentMethods: ["Cash", "Online Payment"],
  services: ["Medicines", "Baby Care Products", "Personal Care", "Home Delivery"],
  rating: 4.1,
  reviews: 85,
  highlights: ["Home delivery across Lahore", "Online ordering available"],
   timings: "24/7",
},
{
  id: 4,
  name: "CSH Pharmacy",
  category: "Retail Pharmacy",
  contact: "0305 4441162",
  website: "https://cshpharmacy.com.pk/",
  image: "https://cshpharmagroup.com/wp-content/uploads/2025/07/csh-pharma-logo-mark-white-outline-trans-500x-cerostech.png",
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "Online Payment"],
  services: ["Medicines", "Vitamins & Supplements", "Medical Devices", "Home Delivery"],
  rating: 4.3,
  reviews: 95,
  highlights: ["24/7 delivery", "Fast delivery in Lahore"]
},
{
  id: 5,
  name: "Dvago Pharmacy",
  category: "Retail Pharmacy",
  contact: "021 111 382 460",
  website: "https://dvago.pk/",
  image: DwagoLogo,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "Debit Card", "EasyPaisa", "JazzCash"],
  services: ["Medicines", "OTC", "Health Products", "Personal Care"],
  rating: 4.3,
  reviews: 500,
  highlights: ["Nationwide delivery", "Online pharmacy", "Authentic medicines"]
},
{
  id: 6,
  name: "Healthwire Pharmacy",
  category: "Online Pharmacy",
  contact: "042 32500988",
  website: "https://healthwire.pk/",
  image: HealthWireLogo,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "Online Payment"],
  services: ["Medicines", "Over‑the‑Counter (OTC)", "Lab Test Booking", "Health Products"],
  rating: 4.5,
  reviews: 1500,
  highlights: ["Fast delivery across Pakistan", "Wide range of medicines", "Book lab tests online"],
   timings: "24/7",
},
{
  id: 7,
  name: "Sehat Pharmacy",
  category: "Online Pharmacy",
  contact: "042 111 734 248",
  website: "https://sehat.com.pk/",
  image: SehatLogo,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "EasyPaisa", "JazzCash"],
  services: ["Medicines", "Health Products", "Lab Tests", "Doctor Consultation"],
  rating: 4.4,
  reviews: 650,
  highlights: ["Online consultation", "Nationwide delivery", "Health services"]
},
{
  id: 8,
  name: "D Watson Chemist",
  category: "Retail Pharmacy",
  contact: "051 111 932 876",
  website: "https://dwatson.com.pk/",
  image: DwatsonLogo,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "Online Payment"],
  services: ["Medicines", "OTC", "Cosmetics", "Health Products"],
  rating: 4.3,
  reviews: 300,
  highlights: ["24/7 branches", "Premium pharmacy", "Wide range"]
},
{
  id: 9,
  name: "Dawaai",
  category: "Online Pharmacy",
  contact: "+92 (021) 111‑329‑224",
  website: "https://dawaai.pk/",
  image: DawaaiLogo,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "EasyPaisa", "JazzCash"],
  services: ["Medicines", "OTC Products", "Online Doctor Consultation", "Lab Tests"],
  rating: 4.5,
  reviews: 2000,
  highlights: ["Fast delivery across Pakistan", "Doctor consultations online", "Lab tests booking"]
},
{
  id: 10,
  name: "Town Pharmacy",
  category: "Retail & Online Pharmacy",
  contact: "+92 333 5323322",
  website: "https://townpharmacy.pk/",
  image: TownPharmacy,
  delivery: true,
  paymentMethods: ["Cash", "Credit Card", "EasyPaisa", "JazzCash"],
  services: ["Medicines", "OTC Products", "Health Supplements", "Home Delivery"],
  rating: 4.4,
  reviews: 1200,
  highlights: ["Nationwide delivery", "Online ordering available", "Authentic medicines"]
}


];

export default pharmacies;
